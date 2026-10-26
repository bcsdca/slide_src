function setupWeeklySermonInitialTrigger() {
  ScriptApp.newTrigger("weeklySermonStarter")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(10)
    .create();
}

function weeklySermonStarter() {
  logMessage(getCallStackTrace() + `: Running the Initial Weekly Sermon Worker for the 1st time`);
  weeklySermonWorker(); // reuse same logic
}

function weeklySermonWorker() {
  clearLogSheet();
  logMessage(getCallStackTrace() + `: Weekly Sermon Worker started...`);

  const comingSundayStr = getComingSunday();

  // 🚫 Hard stop condition FIRST
  if (!isBeforeTuesday11pm()) {
    logMessage(getCallStackTrace() + `: Past Tuesday 11pm → exiting.`);

    // --- Write to shared sheet with an empty entry except the date and updated data column---
    appendRowToHandOff(comingSundayStr, "", "", "", "","","")

    deleteRetryTriggers();
    return;
  }

  const body = getLatestSermonEmail();

  if (!body) {
    logMessage(getCallStackTrace() + `: No email found → retry later`);
    scheduleRetryTrigger();
    return;
  }

  const cleanedBody = cleanEmail(body);

  let data;
  try {
    data = extractWithRetry(cleanedBody);
  } catch (e) {
    logMessage(getCallStackTrace() + `: Extraction failed → retry later`);
    scheduleRetryTrigger();
    return;
  }

  if (!data.title || !data.text) {
    logMessage(getCallStackTrace() + `: Incomplete data → retry later`);
    scheduleRetryTrigger();
    return;
  }

  // ✅ SUCCESS
  logMessage(getCallStackTrace() + `: Data found → generating image`);

  const prompt = buildChurchSlidePrompt(data.title, data.text);
  const imageBlob = generateImageFromPromptAndSave(prompt);

  deleteRetryTriggers();


  //Send email
  MailApp.sendEmail({
    to: "shui.bill.chu@gmail.com",
    subject: `Preview sermon image for this week: ${comingSundayStr}`,
    body: `Title: ${data.title}\nText: ${data.text}`,
    attachments: [imageBlob]
  });

  logMessage(getCallStackTrace() + `: Weekly sermon image send sucessfully for review.`);
  
  flushLogsToSheet();
}

function deleteRetryTriggers() {
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === "weeklySermonWorker") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  logMessage(getCallStackTrace() + `: All retry "weeklySermonWorker" triggers are deleted.`);
}

function scheduleRetryTrigger() {

  const triggers = ScriptApp.getProjectTriggers();

  const exists = triggers.some(
    t => t.getHandlerFunction() === "weeklySermonWorker"
  );

  if (exists) {
    logMessage(getCallStackTrace() + `: Retry "weeklySermonWorker" trigger already exists.`);
    return;
  }

  ScriptApp.newTrigger("weeklySermonWorker")
    .timeBased()
    .everyMinutes(15)
    .create();

  logMessage(getCallStackTrace() + `: Retry "weeklySermonWorker" trigger scheduled in 15 minutes.`);
}

function isBeforeTuesday11pm() {
  const now = new Date();
  const day = now.getDay();   // 0–6
  const hour = now.getHours(); // 0–23

  logMessage(getCallStackTrace() + `: now=${now}, day=${day}, hour=${hour}, result=${(day < 2 || (day === 2 && hour < 11))}`
  );
  
  // Before Tuesday → OK
  if (day < 2) return true;

  // Tuesday before noon → OK
  if (day === 2 && hour < 11) return true;

  // Otherwise → NOT OK
  return false;
}

function generateImageFromPromptAndSave(promptText) {

  const url = "https://api.openai.com/v1/images/generations";

  const payload = {
    model: "gpt-image-1",
    prompt: promptText,
    //size: "1024x1536" // good for slides/posters
    size: "auto"
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + openaiAPIKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);

  const status = response.getResponseCode();

  if (status !== 200) {
    throw new Error(`HTTP Error ${status}:\n${response.getContentText()}`);
  }

  const responseText = response.getContentText();

  let json;
  try {
    json = JSON.parse(responseText);
  } catch (e) {
    throw new Error("Image generation failed (non-JSON response):\n" + responseText);
  }

  if (!json.data || !json.data[0].b64_json) {
    throw new Error("Image generation failed: " + response.getContentText());
  }

  //const blob = Utilities.newBlob(imageBytes, "image/png", "weekly_sermon_image.png");

  // ✅ Convert to blob
  const imageBytes = Utilities.base64Decode(json.data[0].b64_json);

  // ✅ Normalize date string (VERY important for matching later)
  const comingSundayStr = getComingSunday();

  // --- Convert to Blob ---
  const imageFileName = `weekly_sermon_image_${comingSundayStr}.png`;
  const blob = Utilities.newBlob(imageBytes, "image/png", imageFileName);

  // --- Get folder ---
  const folder = DriveApp.getFolderById(weeklySermonImageFolderID);

  // --- Wipe folder (your chosen strategy) ---
  const files = folder.getFiles();
  let deletedCount = 0;

  while (files.hasNext()) {
    const f = files.next();
    f.setTrashed(true);
    deletedCount++;
  }

  logMessage(`${getCallStackTrace()}: Cleared folder, deleted ${deletedCount} file(s)`);

  // --- Save new file ---
  const file = folder.createFile(blob);
  logMessage(getCallStackTrace() + `: Saved file:  ${file.getUrl()}`);

  const fileId = file.getId();
  logMessage(`${getCallStackTrace()}: Saved image ${imageFileName}, FileId=${fileId}`);

  appendRowToHandOff(comingSundayStr,"","",fileId,imageFileName,"","")

  return blob;
}

function getLatestSermonEmail() {
  //sermonInfoQuery is a global variable
  const threads = GmailApp.search(sermonInfoQuery, 0, 1);
  if (threads.length === 0) {
     logMessage(getCallStackTrace()
    + `: This week's "Sermon Info" email is not in my inbox yet!!!`)
    return null;
  }


  const messages = threads[0].getMessages();
  logMessage(getCallStackTrace()
    + `: This week's "Sermon Info" email found in my inbox with the email subject is "${threads[0].getMessages()[0].getSubject()}"`)
  return messages[messages.length - 1].getPlainBody();

}

function extractWithRetry(body, maxRetries = 2) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const data = extractWithAI(body);

      if (data.title && data.text) {
        return data;
      }

    } catch (e) {
      logMessage(getCallStackTrace() + `: Parse failed, retrying...`);
    }

    Utilities.sleep(1000);
  }

  throw new Error("AI extraction failed after retries");
}

function buildChurchSlidePrompt(title, text) {
  return `
Create a high-quality church sermon slide poster.

IMPORTANT TYPOGRAPHY RULES:

- Render ALL text clearly and completely.
- Preserve ALL Chinese characters exactly.
- Preserve ALL English words exactly.
- Do NOT omit, shorten, truncate, or rewrite any text.
- Do NOT split Chinese words incorrectly.
- Do NOT merge Chinese and English characters together incorrectly.
- Ensure every character is fully visible and readable.
- Use elegant professional typography suitable for church presentation slides.
- Keep text centered and balanced.
- Avoid overlapping text with bright background areas.

TEXT TO DISPLAY EXACTLY AS WRITTEN:

This week's sermon title:

${title}

${text}

TEXT LAYOUT:

- "This week's sermon title:" should be small at the top.
- "${title}" should be the largest and most prominent text.
- Keep bilingual title readable and properly spaced.
- "${text}" should appear below the title in smaller text.
- All text should remain centered.
- Use line breaks naturally if needed.
- Do NOT crop or cut off any words.

VISUAL DESIGN:

- Analyze the spiritual meaning and emotional tone of:
  "${title} ${text}"

- Create a cinematic and reverent church background image.

- If the sermon theme suggests a Christian occasion, reflect it visually:

  * Christmas → warm golden light, peaceful night, hope
  * Easter → sunrise, resurrection, radiant victory
  * Palm Sunday → palm branches, pathway, soft sunlight
  * Crucifixion → solemn atmosphere, dramatic sky
  * Thanksgiving → harvest warmth, gratitude
  * New Year → sunrise, renewal, fresh beginning
  * Mother's Day → flowers, gentle warm light
  * Father's Day → mountains, strength, guidance

- Otherwise match the sermon mood naturally:
  * glory → radiant heavenly light
  * forgiveness → warm welcoming light
  * humility → peaceful soft scenery
  * hope → sunrise and open sky
  * worship → majestic atmosphere
  * repentance → reflective subdued lighting

STYLE:

- cinematic
- uplifting
- reverent
- inspirational
- elegant
- realistic lighting
- clean composition
- high readability
- professional church slide design

BACKGROUND RULES:

- Background must support text readability.
- Avoid cluttered center areas.
- Keep moderate contrast behind text.
- Avoid placing bright sun directly behind the words.
- Use darker gradients behind text if necessary.

OUTPUT:

- portrait orientation
- polished church sermon slide
- readable bilingual typography
- visually beautiful and professional
`;
}

function cleanEmail(body) {
  return body
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\*/g, "")   // remove markdown stars
    .trim();
}

function extractWithAI(body) {

  const prompt = `
Extract sermon information from the email below.

Find the FIRST occurrence of:
- a line containing "Title:" (or similar like "Ttile")
- a line containing "Text:" (or similar like "Txt", "Scripture", "Passage")

From those lines:
- Extract EVERYTHING after "Title:" as the title
- Extract EVERYTHING after "Text:" as the scripture

Clean up:
- Remove leading/trailing *, **, or extra spaces
- Keep Chinese and English together if both exist
- Preserve original wording (do NOT translate)

Return ONLY valid JSON (no markdown, no explanation):

{
  "title": "...",
  "text": "..."
}

Email:
${body}
`;

  const response = UrlFetchApp.fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "post",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + openaiAPIKey
      },
      payload: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }),
      muteHttpExceptions: true
    }
  );

  const text = response.getContentText();

  logMessage(
    getCallStackTrace() +
    `: RAW AI RESPONSE:\n${text}`
  );

  const json = JSON.parse(text);

  let content = json.choices[0].message.content.trim();

  logMessage(
    getCallStackTrace() +
    `: AI CONTENT:\n${content}`
  );

  content = content
    .replace(/```json|```/g, "")
    .trim();

  return JSON.parse(content);
}



