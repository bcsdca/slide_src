//this function can run by itself to test if the image can be generated
//from the "sermon info" email, writing to the weeklyShare sheet and send email to Bill Chu for verification

function test_createWeeklySermonImage() {

  clearLogSheet();

  const comingSundayStr = getComingSunday();

  // 1. Get latest email
  const body = getLatestSermonEmail();
  if (!body) {
    logMessage(getCallStackTrace() + `: No sermon email found.`);
    return;
  }

  const cleanedBody = cleanEmail(body);
  logMessage(getCallStackTrace() + `: Clean Email body:\n ${cleanedBody}`);

  // 2. Extract title + text using AI
  const data = extractWithRetry(cleanedBody);

  logMessage(getCallStackTrace() + `: Extracted data:`);
  Logger.log(JSON.stringify(data, null, 2));

  // 3. Build image prompt
  const prompt = buildChurchSlidePrompt(data.title, data.text);

  logMessage(getCallStackTrace() + `: Generated prompt:\n ${prompt}`);

  // 4. Generate image, save to google drive and save to weeklyShare sheet
  const imageBlob = generateImageFromPromptAndSave(prompt);

  // 5. Send email
  MailApp.sendEmail({
    to: "shui.bill.chu@gmail.com",
    subject: `Preview sermon image for this week: ${comingSundayStr}`,
    body: `Title: ${data.title}\nText: ${data.text}`,
    attachments: [imageBlob]
  });

  logMessage(getCallStackTrace() + `: Weekly sermon image send sucessfully for review.`);
  flushLogsToSheet();
}


