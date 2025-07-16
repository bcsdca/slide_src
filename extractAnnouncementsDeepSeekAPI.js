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
    const raw = result.choices[0].message.content.trim();
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
  return text;
}

function buildSingleAnnouncementPrompt(pdfText, announcementNumber) {
  return `
The following is the full text of a church bulletin:

"""${pdfText}"""

Please extract the full content of announcement number ${announcementNumber}. 
Return only that announcement in this format:

${announcementNumber}. Title
Content...

Preserve line breaks and original formatting. Do not include any other announcements.
`.trim();
}
