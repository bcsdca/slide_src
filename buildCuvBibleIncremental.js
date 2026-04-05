/*******************************************************
 * CONFIG
 *******************************************************/
//const CUV_OUTPUT_FILE_NAME = "cuvBible_v4.json";
const CUV_OUTPUT_FILE_NAME = "cuvBible.json";


/*******************************************************
 * MAIN ENTRY (RUN BY TRIGGER)
 *******************************************************/
function buildCuvBibleIncremental() {

  clearLogSheet();

  const startTime = Date.now();
  const CUV_MAX_RUNTIME = 25 * 60 * 1000; // 25 min

  const scriptProps = PropertiesService.getScriptProperties();

  let bookIndex = parseInt(scriptProps.getProperty("bookIndex") || "0");
  let chapterIndex = parseInt(scriptProps.getProperty("chapterIndex") || "0");
  logMessage(`${getCallStackTrace()}:📖 Retriving the saved script property bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`);

  const chineseBookNames = Object.keys(ChineseBibleEachChapterLength);

  let bible = loadBuildCuvBibleJson();

  for (; bookIndex < chineseBookNames.length; bookIndex++) {

    scriptProps.setProperty("bookIndex", bookIndex.toString());
    const chineseBook = chineseBookNames[bookIndex];

    const chapterLengths = ChineseBibleEachChapterLength[chineseBook];

    if (!chapterLengths) {
      logMessageError(`${getCallStackTrace()}:❌ Missing chapter length for ${chineseBook}`);
      return;
    }

    for (; chapterIndex < chapterLengths.length; chapterIndex++) {

      const chapterNumber = (chapterIndex + 1).toString();
      const expectedVerseCount = chapterLengths[chapterIndex];

      logMessage(`${getCallStackTrace()}:📖 Processing ${chineseBook} ${chapterNumber}, bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`);

      // ⏱ timeout guard
      const elapsed = Date.now() - startTime;
      const remaining = CUV_MAX_RUNTIME - elapsed;

      if (remaining <= 0) {
        logMessage(`${getCallStackTrace()}: ⏱ Timeout reached, saving progress...`);
        scriptProps.setProperty("bookIndex", bookIndex.toString());
        scriptProps.setProperty("chapterIndex", chapterIndex.toString());
        logMessage(`${getCallStackTrace()}: ⏱ Timeout reached, Saving bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`);
        flushLogsToSheet();
        return;
      } else {
        const remainingMinutes = (remaining / 60000).toFixed(2);
        logMessage(`${getCallStackTrace()}: ⏳ Time remaining: ${remainingMinutes} minutes`);
      }

      let verseMap = fetchChapterFromBibleGateway(chineseBook, chapterNumber, expectedVerseCount);

      // 🔁 Retry once if invalid
      if (!validateCuvChapter(verseMap, expectedVerseCount, chineseBook, chapterNumber)) {

        logMessage(`${getCallStackTrace()}:🔁 Retrying ${chineseBook} ${chapterNumber}...`);

        verseMap = fetchChapterFromBibleGateway(chineseBook, chapterNumber, expectedVerseCount);

        if (!validateCuvChapter(verseMap, expectedVerseCount, chineseBook, chapterNumber)) {
          logMessageError(`${getCallStackTrace()}:🛑 FAILED after retry: ${chineseBook} ${chapterNumber}, bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`);

          const errorMsg = `${getCallStackTrace()}:🛑 FAILED after retry: ${chineseBook} ${chapterNumber}, bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex}`;

          // 📧 Send email alert
          sendCuvFailureEmail(errorMsg);

          stopCuvTrigger();
          flushLogsToSheet();
          return; // STOP everything
        }
      }

      // ✅ SAVE ONLY AFTER VALIDATION
      if (!bible[chineseBook]) {
        bible[chineseBook] = {};
      }

      bible[chineseBook][chapterNumber] = verseMap;

      try {
        saveCuvBibleJson(bible);

        logMessage(`✅ Saved ${chineseBook} ${chapterNumber} to json file`);

        // move forward ONLY if save succeeded
        scriptProps.setProperty("bookIndex", bookIndex.toString());
        scriptProps.setProperty("chapterIndex", (chapterIndex + 1).toString());
        logMessage(`${getCallStackTrace()}: Moving on to next chapter, Saving bookIndex = ${bookIndex} and chapterIndex = ${chapterIndex + 1}`);

      } catch (err) {
        const errorMsg = `❌ Drive save failed: ${chineseBook} ${chapterNumber}\n${err.message}`;

        logMessageError(errorMsg);
        sendCuvFailureEmail(errorMsg);
        stopCuvTrigger();
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
  stopCuvTrigger();
  flushLogsToSheet();
}

function fetchChapterFromBibleGateway(book, chapter, expectedVerseCount) {

  const verses = {};

  for (let v = 1; v <= expectedVerseCount; v++) {

    try {

      const result = bibleGatewaySingleVerseCapture(book, chapter, v);

      let verseText = "";

      if (result) {
        verseText = result.replace(/^\d+\s+/, '').trim();
      } else {
        logMessageError(`${getCallStackTrace()}: ⚠️ Missing verse: ${book} ${chapter}:${v}`);
      }

      verses[v.toString()] = verseText;

    } catch (err) {

      verses[v.toString()] = "";
      logMessageError(`${getCallStackTrace()}: ❌ Error fetching ${book} ${chapter}:${v} → ${err.message}`);
    }

    //Utilities.sleep(300); // ⛔ IMPORTANT (rate limit protection)
  }

  return verses;
}

/*******************************************************
 * VALIDATE CHAPTER
 *******************************************************/
function validateCuvChapter(verses, expectedCount, book, chapter) {

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
 * LOAD / SAVE JSON
 *******************************************************/
function loadBuildCuvBibleJson() {

  const files = DriveApp.getFilesByName(CUV_OUTPUT_FILE_NAME);

  if (files.hasNext()) {
    return JSON.parse(files.next().getBlob().getDataAsString());
  }

  return {};
}

function saveCuvBibleJson(bible) {

  const json = JSON.stringify(bible, null, 2);

  const files = DriveApp.getFilesByName(CUV_OUTPUT_FILE_NAME);

  if (files.hasNext()) {
    files.next().setContent(json);
  } else {
    DriveApp.createFile(CUV_OUTPUT_FILE_NAME, json);
  }
}


/*******************************************************
 * TRIGGER CONTROL
 *******************************************************/
function startCuvTrigger() {

  ScriptApp.newTrigger("buildCuvBibleIncremental")
    .timeBased()
    .everyMinutes(30)
    .create();

  logMessage(`${getCallStackTrace()}:🚀 Trigger started`);
}

function stopCuvTrigger() {

  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === "buildCuvBibleIncremental") {
      ScriptApp.deleteTrigger(t);
    }
  });

  logMessage(`${getCallStackTrace()}:🛑 Trigger stopped`);
}

function clearCuvAllScriptProperties() {
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

function sendCuvFailureEmail(message) {
  try {
    GmailApp.sendEmail(
      "shui.bill.chu@gmail.com",
      "🚨 Cuv Bible Build Failed",
      message
    );

    logMessage(`${getCallStackTrace()}: 📧 Failure email sent.`);
  } catch (err) {
    logMessage(`${getCallStackTrace()}: ❌ Failed to send email: ` + err.message);
  }
}

function setCuvProgress(bookIndex, chapterIndex) {
  const props = PropertiesService.getScriptProperties();

  props.setProperty("bookIndex", bookIndex.toString());
  props.setProperty("chapterIndex", chapterIndex.toString());

  logMessage(`${getCallStackTrace()}: ✅ Progress set to bookIndex=${bookIndex}, chapterIndex=${chapterIndex}`);
}

function validateCuvBibleJson() {

  logMessage(`${getCallStackTrace()}: Validating the \"${CUV_OUTPUT_FILE_NAME}\" file`);

  const bible = loadBuildCuvBibleJson();
  const issues = [];

  const chineseBookNames = Object.keys(ChineseBibleEachChapterLength);

  for (const chineseBookName of chineseBookNames) {

    const expectedChapters = ChineseBibleEachChapterLength[chineseBookName];

    if (!expectedChapters) {
      issues.push(`❌ Missing chapter metadata: ${chineseBookName}`);
      continue;
    }

    if (!bible[chineseBookName]) {
      issues.push(`❌ Missing book: ${chineseBookName}`);
      continue;
    }

    const book = bible[chineseBookName];

    // Check chapters
    for (let c = 0; c < expectedChapters.length; c++) {

      const chapterNum = (c + 1).toString();
      const expectedVerseCount = expectedChapters[c];

      if (!book[chapterNum]) {
        issues.push(`❌ Missing chapter: ${chineseBookName} ${chapterNum}`);
        continue;
      }

      const chapter = book[chapterNum];
      const verseKeys = Object.keys(chapter);

      if (verseKeys.length === 0) {
        issues.push(`⚠️ Empty chapter: ${chineseBookName} ${chapterNum}`);
        continue;
      }

      const numericVerses = verseKeys
        .map(v => parseInt(v, 10))
        .filter(v => !isNaN(v))
        .sort((a, b) => a - b);

      // Verse 0 check
      if (verseKeys.includes("0")) {
        issues.push(`⚠️ Verse 0 detected: ${chineseBookName} ${chapterNum}`);
      }

      // Non-numeric keys
      verseKeys.forEach(v => {
        if (!/^\d+$/.test(v)) {
          issues.push(`⚠️ Non-numeric verse key: ${chineseBookName} ${chapterNum} → "${v}"`);
        }
      });

      // Missing verses
      for (let i = 1; i <= expectedVerseCount; i++) {
        if (!chapter[i.toString()]) {
          issues.push(`❌ Missing verse: ${chineseBookName} ${chapterNum}:${i}`);
        }
      }

      // Extra verses
      numericVerses.forEach(v => {
        if (v > expectedVerseCount) {
          issues.push(`⚠️ Extra verse: ${chineseBookName} ${chapterNum}:${v}`);
        }
      });

      // Empty verse text
      verseKeys.forEach(v => {
        const text = chapter[v];
        if (!text || text.trim() === "") {
          issues.push(`⚠️ Empty verse text: ${chineseBookName} ${chapterNum}:${v}`);
        }
      });
    }
  }

  // OUTPUT
  if (issues.length === 0) {
    logMessage(`${getCallStackTrace()}: ✅ No issues found. Bible JSON looks clean.`);
  } else {
    logMessage(`${getCallStackTrace()}: ❌ Found ${issues.length} issues:\n`);
    issues.forEach(issue => logMessage(`${getCallStackTrace()}: ${issue}`));
  }
}

