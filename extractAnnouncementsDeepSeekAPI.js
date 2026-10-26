function extractAnnouncementsDeepSeekAPI(pdfBlob, annoArray) {
  const pdfText = extractTextFromPDFViaGoogleDoc(pdfBlob);
  const announcements = [];

  for (const number of annoArray) {
    const prompt = buildSingleAnnouncementPrompt(pdfText, number);

    const response = UrlFetchApp.fetch(deepSeekAPIUrl, {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${deepSeekAPIKey}`
      },

      payload: JSON.stringify({
        model: deepSeekModel,
        messages: [
          {
            role: "system",
            content: "You are a deterministic text extraction engine."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        thinking: {
          type: "disabled"
        },
        max_tokens: 1024
      })
    });

    const result = JSON.parse(response.getContentText());
    var raw = result.choices[0].message.content.trim();
    //looking for cec sd,org, this is caused by there is a newline after cec in pdf text
    raw = raw.replace(/cec\s+sd\.org/gi, 'cec-sd.org');
    announcements.push(raw);

    logMessage(`${getCallStackTrace()}: Extracted announcement #${number} = ${raw}`);
  }

  return announcements;
}

function extractTextFromPDFViaGoogleDoc(blob) {
  const resource = {
    title: blob.getName(),
    mimeType: MimeType.GOOGLE_DOCS
  };
  const file = Drive.Files.insert(resource, blob, {
    convert: true
  });

  const doc = DocumentApp.openById(file.id);
  const text = doc.getBody().getText();
  DriveApp.getFileById(file.id).setTrashed(true); // Clean up
  logMessage(`${getCallStackTrace()}: Attachement BLOB converted to Google Doc to text = ${JSON.stringify(text, null, 2)}`);
  return text;
}

function buildSingleAnnouncementPrompt(pdfText, announcementNumber) {
  return `
  You are a precise text extractor.

  Task:
  Extract ONLY announcement number ${announcementNumber} from the following church bulletin text.

  STRICT RULES:
  1. Ignore all asterisks (*) and decorative symbols.
  2. The announcement ALWAYS begins with:
     "${announcementNumber}. " followed by its title and content.
  3. The output MUST start with "${announcementNumber}." as the very first characters — no text, spaces, or punctuation before it.
  4. Stop extraction immediately before the next announcement number (like "${announcementNumber + 1}."), or before the end of the bulletin.
  5. Preserve exact original line breaks and spacing.
  6. Do NOT include any explanations, notes, or markdown.
  7. If the announcement number ${announcementNumber} does not exist, return an empty string ("").

  Output requirement:
  Return ONLY the raw text of announcement ${announcementNumber}, starting with "${announcementNumber}. ".

  BULLETIN TEXT:
  """${pdfText.substring(0, 15000)}"""
`.trim();
}

