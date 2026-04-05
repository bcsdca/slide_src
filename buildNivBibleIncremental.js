/*******************************************************
 * CONFIG
 *******************************************************/
const NIV_OUTPUT_FILE_NAME = "nivBible.json";


/*******************************************************
 * MAIN ENTRY (RUN BY TRIGGER)
 *******************************************************/
function buildNivBibleIncremental() {

  clearLogSheet();

  const startTime = Date.now();
  const MAX_RUNTIME = 25 * 60 * 1000; // 25 min

  const scriptProps = PropertiesService.getScriptProperties();

  let bookIndex = parseInt(scriptProps.getProperty("bookIndex") || "0");
  let chapterIndex = parseInt(scriptProps.getProperty("chapterIndex") || "0");
  logMessage(`${getCallStackTrace()}:📖 Retriving the saved script property bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`);

  const englishBookNames = Object.keys(bibleBookMap);

  let bible = loadBibleJson();

  for (; bookIndex < englishBookNames.length; bookIndex++) {

    scriptProps.setProperty("bookIndex", bookIndex.toString());
    const englishBook = englishBookNames[bookIndex];
    const chineseBook = bibleBookMap[englishBook];

    const chapterLengths = ChineseBibleEachChapterLength[chineseBook];

    if (!chapterLengths) {
      logMessageError(`${getCallStackTrace()}:❌ Missing chapter length for ${englishBook}`);
      return;
    }

    for (; chapterIndex < chapterLengths.length; chapterIndex++) {

      const chapterNumber = (chapterIndex + 1).toString();
      const expectedVerseCount = chapterLengths[chapterIndex];

      logMessage(`${getCallStackTrace()}:📖 Processing ${englishBook} ${chapterNumber}, bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`);

      // ⏱ timeout guard
      if (Date.now() - startTime > MAX_RUNTIME) {
        logMessage(`${getCallStackTrace()}: ⏱ Timeout reached, saving progress...`);
        scriptProps.setProperty("bookIndex", bookIndex.toString());
        scriptProps.setProperty("chapterIndex", chapterIndex.toString());
        logMessage(`${getCallStackTrace()}: ⏱ Timeout reached, Saving bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`);
        flushLogsToSheet();
        return;
      }

      let verseMap = fetchNivChapterFromAI(englishBook, chapterNumber);

      // 🔁 Retry once if invalid
      if (!validateChapter(verseMap, expectedVerseCount, englishBook, chapterNumber)) {

        logMessage(`${getCallStackTrace()}:🔁 Retrying ${englishBook} ${chapterNumber}...`);

        verseMap = fetchNivChapterFromAI(englishBook, chapterNumber);

        if (!validateChapter(verseMap, expectedVerseCount, englishBook, chapterNumber)) {
          logMessageError(`${getCallStackTrace()}:🛑 FAILED after retry: ${englishBook} ${chapterNumber}, bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`);

          const errorMsg = `${getCallStackTrace()}:🛑 FAILED after retry: ${englishBook} ${chapterNumber}, bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`;

          // 📧 Send email alert
          sendFailureEmail(errorMsg);

          stopNivTrigger();
          flushLogsToSheet();
          return; // STOP everything
        }
      }

      // ✅ SAVE ONLY AFTER VALIDATION
      if (!bible[englishBook]) {
        bible[englishBook] = {};
      }

      bible[englishBook][chapterNumber] = verseMap;

      try {
        saveNivBibleJson(bible);

        logMessage(`✅ Saved ${englishBook} ${chapterNumber} to json file`);

        // move forward ONLY if save succeeded
        scriptProps.setProperty("bookIndex", bookIndex.toString());
        scriptProps.setProperty("chapterIndex", (chapterIndex + 1).toString());
        logMessage(`${getCallStackTrace()}: Moving on to next chapter, Saving bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex + 1}`);

      } catch (err) {
        const errorMsg = `❌ Drive save failed: ${englishBook} ${chapterNumber}\n${err.message}`;

        logMessageError(errorMsg);
        sendFailureEmail(errorMsg);
        stopNivTrigger();
        flushLogsToSheet();
        return;
      }
      
    }

    // next book
    chapterIndex = 0;
    scriptProps.setProperty("chapterIndex", "0");
    logMessage(`${getCallStackTrace()}: Moving on to next book, with the bookIndex = ${bookIndex + 1} and starting on chapterIndex = ${chapterIndex}`);
  }

  logMessage(`${getCallStackTrace()}:🎉 ALL DONE!`);
  stopNivTrigger();
  flushLogsToSheet();
}


/*******************************************************
 * FETCH FROM AI
 *******************************************************/
function fetchNivChapterFromAI(book, chapter) {

  try {

    const reference = `${book} ${chapter}`;

    const prompt = `
      Return the New International Version (NIV) Bible text for:

      ${reference}

      STRICT RULES:
      - Output ONLY the Bible verses
      - Output one verse per line
      - Each line MUST start with the verse number followed by a space (e.g., "1 In the beginning...")
      - Do NOT include book name
      - Do NOT include chapter number
      - Do NOT include headings
      - Do NOT include commentary
      - Do NOT include explanations
      - Do NOT include extra formatting
      - Do NOT skip any verses

      Start directly from verse 1.
      `.trim();

    const aiResponse = callDeepSeekAPI(prompt);

    logMessage(`${getCallStackTrace()}:RAW AI RESPONSE for ${book} ${chapter}:\n${aiResponse}`);

    if (!aiResponse) {
      return {};
    }

    const lines = aiResponse
      .split("\n")
      .map(l => l.trim())
      .filter(l => l !== ""); // keep control (still removes blank lines, but keeps "21")

    logMessage(`${getCallStackTrace()}: Total lines = ${lines.length}`);

    const verses = {};

    for (let line of lines) {

      // handles:
      // 1 text
      // Romans 13:1 text
      // 21   <-- empty verse
      //const match = line.match(/^(?:\w+\s+\d+:\s*)?(\d+)\s*(.*)$/);
      const match = line.match(/^\s*(?:[A-Za-z]+\s+\d+:\s*)?(\d+)\s*(.*)$/);

      if (!match) {
        logMessage(`${getCallStackTrace()}: ❌ No match line: ${line}`);
      }

      if (match) {
        const verseNum = match[1];
        const verseText = (match[2] || "").trim(); // 👈 allow empty string

        if (!verses[verseNum]) {
          verses[verseNum] = verseText;  // "" if empty
        } else {
          verses[verseNum] += (verseText ? " " + verseText : "");
        }

        if (verseText === "") {
          logMessageError(`${getCallStackTrace()}:⚠️ Empty verse detected: ${book} ${chapter}:${verseNum}`);
        }
      }

    }

    return verses;

  } catch (error) {

    logMessageError(`${getCallStackTrace()}:fetch error: ${error.message}`);
    return {};
  }
}


/*******************************************************
 * VALIDATE CHAPTER
 *******************************************************/
function validateChapter(verses, expectedCount, book, chapter) {

  const keys = Object.keys(verses);

  if (keys.length === 0) {
    logMessageError(`${getCallStackTrace()}:❌ Empty chapter: ${book} ${chapter}`);
    return false;
  }

  if (keys.includes("0")) {
    logMessageError(`${getCallStackTrace()}:❌ Verse 0 detected: ${book} ${chapter}`);
    return false;
  }

  const nums = keys
    .map(v => parseInt(v, 10))
    .filter(v => !isNaN(v))
    .sort((a, b) => a - b);

  // allowed missing verses (if any)
  const allowedMissing =
    allowedMissingVerses[book]?.[chapter] || [];

  const adjustedExpectedCount = expectedCount - allowedMissing.length;

  if (nums.length !== adjustedExpectedCount) {
    logMessageError(
      `${getCallStackTrace()}:❌ Verse count mismatch: ${book} ${chapter}, ` +
      `AI = ${nums.length}, expected = ${adjustedExpectedCount} (original ${expectedCount}, allowed missing = ${allowedMissing.length})`
    );
    return false;
  }

  for (let i = 1; i <= expectedCount; i++) {
    const verseStr = i.toString();

    const isAllowedMissing =
      allowedMissingVerses[book]?.[chapter]?.includes(verseStr);

    // ✅ ONLY check key existence (NOT value)
    if (!(verseStr in verses) && !isAllowedMissing) {
      logMessageError(`${getCallStackTrace()}:❌ Missing verse: ${book} ${chapter}:${i}`);
      return false;
    }
  }

  // ⚠️ Empty verse = warning, NOT failure
  for (const k of keys) {
    if (verses[k] === "" || verses[k].trim() === "") {
      logMessage(`${getCallStackTrace()}:⚠️ Empty verse: ${book} ${chapter}:${k}`);
    }
  }

  return true;
}


/*******************************************************
 * API CALL (WITH ERROR LOGGING)
 *******************************************************/
function callDeepSeekAPI(prompt) {

  const payload = {
    model: deepSeekModel,
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + deepSeekAPIKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(deepSeekAPIUrl, options);

  const status = response.getResponseCode();
  const text = response.getContentText();

  logMessage(`${getCallStackTrace()}:HTTP ${status}`);
  logMessage(`${getCallStackTrace()}:RAW RESPONSE:\n${text}`);

  if (status !== 200) {
    throw new Error(`HTTP ${status}: ${text}`);
  }

  const json = JSON.parse(text);

  return json.choices?.[0]?.message?.content || "";
}


/*******************************************************
 * LOAD / SAVE JSON
 *******************************************************/
function loadBibleJson() {

  const files = DriveApp.getFilesByName(NIV_OUTPUT_FILE_NAME);

  if (files.hasNext()) {
    return JSON.parse(files.next().getBlob().getDataAsString());
  }

  return {};
}

function saveNivBibleJson(bible) {

  const json = JSON.stringify(bible, null, 2);

  const files = DriveApp.getFilesByName(NIV_OUTPUT_FILE_NAME);

  if (files.hasNext()) {
    files.next().setContent(json);
  } else {
    DriveApp.createFile(NIV_OUTPUT_FILE_NAME, json);
  }
}


/*******************************************************
 * TRIGGER CONTROL
 *******************************************************/
function startNivTrigger() {

  ScriptApp.newTrigger("buildNivBibleIncremental")
    .timeBased()
    .everyMinutes(30)
    .create();

  logMessage(`${getCallStackTrace()}:🚀 Trigger started`);
}

function stopNivTrigger() {

  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === "buildNivBibleIncremental") {
      ScriptApp.deleteTrigger(t);
    }
  });

  logMessage(`${getCallStackTrace()}:🛑 Trigger stopped`);
}

function clearAllScriptProperties() {
  const props = PropertiesService.getScriptProperties();
  const allProps = props.getProperties();

  const keys = Object.keys(allProps);

  if (keys.length === 0) {
    logMessage(`${getCallStackTrace()}:No script properties to delete.`);
    return;
  }

  keys.forEach(key => props.deleteProperty(key));

  logMessage(`${getCallStackTrace()}:✅ Deleted ${keys.length} script properties.`);
}

function sendFailureEmail(message) {
  try {
    GmailApp.sendEmail(
      "shui.bill.chu@gmail.com",
      "🚨 NIV Bible Build Failed",
      message
    );

    logMessage(`${getCallStackTrace()}: 📧 Failure email sent.`);
  } catch (err) {
    logMessage(`${getCallStackTrace()}: ❌ Failed to send email: ` + err.message);
  }
}

function setProgress(bookIndex, chapterIndex) {
  const props = PropertiesService.getScriptProperties();

  props.setProperty("bookIndex", bookIndex.toString());
  props.setProperty("chapterIndex", chapterIndex.toString());

  Logger.log(`✅ Progress set to bookIndex=${bookIndex}, chapterIndex=${chapterIndex}`);
}

function validateNivBibleJson() {

  const bible = loadBibleJson();
  const issues = [];

  const englishBookNames = Object.keys(bibleBookMap);

  for (const englishBookName of englishBookNames) {

    const chineseName = bibleBookMap[englishBookName];
    const expectedChapters = ChineseBibleEachChapterLength[chineseName];

    if (!expectedChapters) {
      issues.push(`❌ Missing chapter metadata: ${englishBookName}`);
      continue;
    }

    if (!bible[englishBookName]) {
      issues.push(`❌ Missing book: ${englishBookName}`);
      continue;
    }

    const book = bible[englishBookName];

    // Check chapters
    for (let c = 0; c < expectedChapters.length; c++) {

      const chapterNum = (c + 1).toString();
      const expectedVerseCount = expectedChapters[c];

      if (!book[chapterNum]) {
        issues.push(`❌ Missing chapter: ${englishBookName} ${chapterNum}`);
        continue;
      }

      const chapter = book[chapterNum];
      const verseKeys = Object.keys(chapter);

      if (verseKeys.length === 0) {
        issues.push(`⚠️ Empty chapter: ${englishBookName} ${chapterNum}`);
        continue;
      }

      const numericVerses = verseKeys
        .map(v => parseInt(v, 10))
        .filter(v => !isNaN(v))
        .sort((a, b) => a - b);

      // Verse 0 check
      if (verseKeys.includes("0")) {
        issues.push(`⚠️ Verse 0 detected: ${englishBookName} ${chapterNum}`);
      }

      // Non-numeric keys
      verseKeys.forEach(v => {
        if (!/^\d+$/.test(v)) {
          issues.push(`⚠️ Non-numeric verse key: ${englishBookName} ${chapterNum} → "${v}"`);
        }
      });

      // Missing verses
      for (let i = 1; i <= expectedVerseCount; i++) {
        if (!chapter[i.toString()]) {
          issues.push(`❌ Missing verse: ${englishBookName} ${chapterNum}:${i}`);
        }
      }

      // Extra verses
      numericVerses.forEach(v => {
        if (v > expectedVerseCount) {
          issues.push(`⚠️ Extra verse: ${englishBookName} ${chapterNum}:${v}`);
        }
      });

      // Empty verse text
      verseKeys.forEach(v => {
        const text = chapter[v];
        if (!text || text.trim() === "") {
          issues.push(`⚠️ Empty verse text: ${englishBookName} ${chapterNum}:${v}`);
        }
      });
    }
  }

  // OUTPUT
  if (issues.length === 0) {
    Logger.log("✅ No issues found. Bible JSON looks clean.");
  } else {
    Logger.log(`❌ Found ${issues.length} issues:\n`);
    issues.forEach(issue => Logger.log(issue));
  }
}

