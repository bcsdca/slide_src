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
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that extracts specific numbered church announcements from bulletin text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
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
The following is the full text of a church bulletin:

"""${pdfText}"""

Please extract only announcement number ${announcementNumber}. 
The format should match the original, beginning with:

${announcementNumber}. <title><punctuation> <content>

Make sure the announcement starts with "${announcementNumber}." followed by the title and body on the **same line** unless the original had line breaks.

Do not add any line breaks unless they are already present in the original.
Do not include any other announcements.
`.trim();
}

