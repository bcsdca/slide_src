function populateWorshipTab(isTesting = false) {
  SpreadsheetApp.getActive().toast("Start populating the worship tab with the worship info from 2 gmails... Please wait.", "Processing...", -1); // Show a persistent toast
  clearLogSheet();

  // If isTesting is not a boolean (e.g., it's an event object because of the time trigger), force it to false
  if (typeof isTesting !== 'boolean') {
    isTesting = false;
    logMessage(`${getCallStackTrace()}: This function was called by a time trigger, so force isTesting = ${isTesting}`)
  }

  var today = new Date();
  var today_temp = new Date();
  var coming_sunday_offset_from_today = 7 - today.getDay()

  //var coming_sunday_emily = fix_d(coming_sunday);
  var coming_sunday_emily = Utilities.formatDate(new Date(today_temp.setDate(today.getDate() + coming_sunday_offset_from_today)), Session.getScriptTimeZone(), 'M/d/yyyy');

  var today_temp = new Date();
  var coming_sunday = Utilities.formatDate(new Date(today_temp.setDate(today.getDate() + coming_sunday_offset_from_today)), Session.getScriptTimeZone(), 'MM/dd/yyyy');

  logMessage(`${getCallStackTrace()}: This coming sunday emily email is ${coming_sunday_emily}`)

  var successFinding2Emails = true;
  const { worshipQuery, cantQuery } = getQueries(isTesting); // pass false for normal

  try {

    logMessage(`${getCallStackTrace()}: worshipQuery = ${worshipQuery}, with isTesting = ${isTesting} `);

    var threads = GmailApp.search(worshipQuery);
    logMessage(getCallStackTrace() + `: Total # of threads = ${threads.length}, for Emilys's \"worship info c\" email`)
    //var threads = GmailApp.search("worship info C-07302023", 0, 1);
    var message_length = threads[0].getMessages().length;
    //message will have all the message in the thread
    var message = "";
    for (var j = 0; j < message_length; j++) {
      //var message = message.concat(threads[0].getMessages()[j].getPlainBody());
      var message = threads[0].getMessages()[j].getPlainBody().concat(message);
    }

    var find_pdf = false;
    for (var i = 0; (i < message_length && !find_pdf); i++) {
      var msg = threads[0].getMessages()[i]
      if (msg.getAttachments()[0] != undefined) {
        if (msg.getAttachments()[0].getContentType().match("pdf")) {
          find_pdf = true;
          var attachment = threads[0].getMessages()[i].getAttachments()[0];
        }
      }
    }

    if (find_pdf) {
      logMessage(getCallStackTrace()
        + `: Emily's email subject is \"${threads[0].getMessages()[0].getSubject()}\", and it's email message length is ${threads[0].getMessages()[0].getSubject()}, and the attachment file name is \"${attachment.getName()}\"`)
    } else {
      logMessageError(getCallStackTrace() + ": Can't find the Cantonese bulletin pdf attachment!!!")
      successFinding2Emails = false;
    }

  } catch (err) {
    logMessageError(getCallStackTrace() + ': GmailApp.search thread error for Emily\'s worship info C: ' + err);
    successFinding2Emails = false;
  }

  try {
    //cantonese worship email

    logMessage(`${getCallStackTrace()}: cantQuery = ${cantQuery}, with isTesting = ${isTesting} `);

    var cant_threads = GmailApp.search(cantQuery);
    logMessage(getCallStackTrace() + `: Total # of threads = ${cant_threads.length} for cantonese worship reminder email`)

    // Get the most recent cant_threads
    var latestThread = cant_threads[0];

    // Loop through the cant_threads to find the latest one
    for (var i = 1; i < cant_threads.length; i++) {
      if (cant_threads[i].getLastMessageDate() > latestThread.getLastMessageDate()) {
        latestThread = cant_threads[i];
      }
    }

    // Get the latest cantonese worship reminder email message in the thread
    var latestMessage = latestThread.getMessages().pop();

    // Log the subject and date of the latest cantonese worship reminder email
    logMessage(getCallStackTrace() + ": Latest cantonese worship email reminder subject: " + latestMessage.getSubject());
    logMessage(getCallStackTrace() + ": Received on: " + latestMessage.getDate());

    var cant_message = "";
    var cant_message_length = latestThread.getMessages().length;
    for (var j = 0; j < cant_message_length; j++) {
      //var cant_message = cant_message.concat(latestThread.getMessages()[j].getPlainBody());
      //logMessage(getCallStackTrace() + ": The Cantonese worship reminder email message" + j + ": " + latestThread.getMessages()[j].getPlainBody());
      var cant_message = latestThread.getMessages()[j].getPlainBody().concat(cant_message);
      //logMessage(getCallStackTrace() + ": The %d message of this thread is \"%s\"", j, latestThread.getMessages()[j].getPlainBody() );
    }

    logMessage(getCallStackTrace() + `: The Cantonese worship reminder email subject is ${latestThread.getMessages()[0].getSubject()}", and it's email message length is ${cant_message_length}`);

    //logMessage(getCallStackTrace() + ": The Cantonese worship reminder email message is \"%s\"", cant_message);


  } catch (err) {
    logMessageError(getCallStackTrace() + ': GmailApp.search thread error : Cantonese Sunday Service Reminder' + err);
    successFinding2Emails = false;
  }

  if (!successFinding2Emails) {
    handleMissingEmails();
    return;
  }

  logMessage(`${getCallStackTrace()}: Found both emails! Processing worship info...`);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("worship");
  if (!sheet) {
    logMessageError(`${getCallStackTrace()}: Error - 'worship' sheet not found!`);
    return;
  }

  let sheetContents = sheet.getDataRange().getValues();
  let lastRow = sheetContents.length;

  // Locate key sections
  const titleRows = findTitleRows(sheetContents);

  logMessage(`${getCallStackTrace()}: Last Row before cleanup: ${lastRow}`);
  Object.entries(titleRows).forEach(([key, value]) => logMessage(`${getCallStackTrace()}: ${key}: ${value}`));

  // Delete old data while avoiding shifting issues
  cleanupOldData(sheet, titleRows, lastRow);

  // Refresh data after cleanup
  sheetContents = sheet.getDataRange().getValues();
  lastRow = sheetContents.length;

  logMessage(`${getCallStackTrace()}: Last Row after cleanup: ${lastRow}`);

  // Process Invocation Passages
  let invoRowToInsert = findInvocationInsertRow(sheetContents);
  let cantMsg = splitGmailMsg(cant_message);
  let invocationPassages = extractInvocationPassages(cantMsg);

  if (invocationPassages.length) {
    invoRowToInsert = saveInvocationPassages(invocationPassages, invoRowToInsert);
    logMessage(`${getCallStackTrace()}: Invocation passages inserted successfully!`);
  } else {
    logMessageError(`${getCallStackTrace()}: No invocation passage found in Cantonese worship email.`);
  }

  // Process Scripture Reading, Sermon, Speaker, and Announcements
  // findScriptureReadingRow will re-read the whole sheet to make sure the invocation row get updated
  let srRowToInsert = findScriptureReadingRow();
  var msg = splitGmailMsg(message);
  //dumpArray(msg);
  var annoArray = processWorshipEmail(msg, srRowToInsert);
  
  // Process Announcements
  //processAnnouncements(attachment, annoArray);
  processAnnouncementsDeepSeekAPI(attachment, annoArray);

  // Final Spreadsheet Update
  sheetContents = sheet.getDataRange().getValues();
  lastRow = sheetContents.length;
  logMessage(`${getCallStackTrace()}: Last Row after inserting new data: ${lastRow}`);

  if (isTesting === false) {
    notifyCompletion(invocationPassages.length > 0);
  }

  flushLogsToSheet();
}

//all the helper functions below
function processScriptureReading(msg, index, sr_row_to_insert) {
  var readingLine = msg[index].replace("Reading:", "Reading").replaceAll("*", " ");
  var combinedLine = readingLine;
  //check the next line and see if it should be the continuation of the current line
  //if the next line contain "Speaker" or "Sermon", then dont combine, else combine
  if (msg[index + 1].trim() !== "" && !msg[index + 1].includes("Speaker") && !msg[index + 1].includes("Sermon")) {
    combinedLine += " " + msg[index + 1].replaceAll("*", " ");
  }
  logMessage(getCallStackTrace() + `: Combined line for Scripture Reading = ${combinedLine}`);
  var arrayScriptureReading = parseScripture(combinedLine);
  logMessage(getCallStackTrace() + `: Scripture Reading = ${arrayScriptureReading}`);

  var rowToInsert = sr_row_to_insert;
  for (var k = 0; k < arrayScriptureReading.length; k++) {
    var passageArray = passageCapture(arrayScriptureReading[k]);
    var rows_used_up = passageToSS(arrayScriptureReading[k], passageArray, rowToInsert, "worship");
    rowToInsert = rowToInsert + rows_used_up;
  }

  return combinedLine.split('Reading')[1].trim();
}

function processSermon(msg, index) {
  var sermonLine = msg[index].replace("Sermon:", "Sermon").trim();
  var sermonTitle = sermonLine;
  var nextIndex = index + 1;

  while (nextIndex < msg.length && msg[nextIndex].match(/\w/) && !msg[nextIndex].includes("Speaker")) {
    logMessage(getCallStackTrace() + `: The next sermon line is NOT empty, and is = ${msg[nextIndex]}`);
    sermonTitle += " " + msg[nextIndex].replace(",", "").trim();
    nextIndex++;
  }

  return parseSermonTopic(sermonTitle);
}

function processSpeaker(msg, index) {
  var speakerLine = msg[index].replace("Speaker:", "Speaker").replaceAll("*", " ").trim();
  return speakerLine.split('Speaker')[1].trim();
}

function extractLastNumber(inputString) {
  //this function is assuming all the annnouncement # are single digit
  //if not then it needed to be fix in this function
  if (typeof inputString !== 'string') {
    return null;
  }

  // Match standalone single-digit numbers that are preceded or followed by non-word characters, spaces, or punctuation.
  var matches = inputString.match(/(?:^|\W)\d(?:\W|$)/g);  // Match digits preceded or followed by non-word characters

  // If there are exactly two matches, return the second match (index 1)
  if (matches && matches.length === 2) {
    return matches[1].replace(/\W/g, '');  // Return the second match
  }

  // If there are at least 3 matches or more, return the second-to-last one
  if (matches && matches.length > 2) {
    return matches[matches.length - 2].replace(/\W/g, '');  // Return the second-to-last match
  }

  // If there's only one match, return that digit
  return matches ? matches[0].replace(/\W/g, '') : null;
}

function sermonSpeakerToSS(sermonTitle, scriptureReadingTitle, speakerName) {
  var sheet = SpreadsheetApp.getActive().getSheetByName("worship");
  var dataRange = sheet.getDataRange();
  var sheetContents = dataRange.getValues();

  for (var i = 0; i < sheetContents.length; i++) {
    if (sheetContents[i].toString().includes("TITLE_SERMON_TOPIC")) {
      var row = i + 1;
      var data = [sermonTitle + "\n" + scriptureReadingTitle, speakerName, Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss')];
      sheet.insertRowAfter(row);
      sheet.getRange(row + 1, 1, 1, 3).setBackground('white').setFontColor("black").setValues([data]);
      break;
    }
  }
}

// Helper function to determine if the end of announcements has been reached
function isEndOfAnnouncements(currentLine, msg, index) {
  // Check if currentLine indicates the end of announcements (e.g., next section's keyword)
  // Add your own conditions based on what typically follows the announcements
  if (currentLine.includes("Emily Ip")) { // Example condition
    logMessage(getCallStackTrace() + `: End of the anouncement condition found here on this line \"${currentLine}\" !!!`)
    return true;
  }
}

function parseAnnouncements(text) {
  // Split announcements by their numbered bullets
  var announcements = text.split(/\s*\d+\.\s*/).filter(Boolean);
  logMessage(getCallStackTrace() + `: Parsed announcements: ${announcements}`);

  //announcements[0] is disregard because it is like this "主後二零二四年八月十一日"
  //only starting announcements[1] is the real one
  for (var i = 1; i < announcements.length; i++) {
    // Process last announcement to remove anything after its main content
    if (i === announcements.length - 1) {
      announcements[i] = announcements[i].split("\n")[0];
    }
    announcements[i] = i + ". " + announcements[i].replace(/\n/g, "").replace(/cec\s+sd\.org/g, 'cec-sd.org').trim();
    logMessage(getCallStackTrace() + `: Announcement ${i} : ${announcements[i]}`);
  }

  return announcements;
}

function saveAnnouncementsToSS(announcementMessages) {
  var sheet = SpreadsheetApp.getActive().getSheetByName("worship");
  var sheetContents = sheet.getDataRange().getValues();

  var announcementRowIndex = findRowIndex(sheetContents, /TITLE_ANNOUNCEMENT/);
  if (announcementRowIndex === -1) {
    logMessageError(`${getCallStackTrace()}: TITLE_ANNOUNCEMENT not found in the sheet.`);
    return;
  }

  logMessage(`${getCallStackTrace()}: Found TITLE_ANNOUNCEMENT at row: ${announcementRowIndex + 1}`);
  var currentRow = announcementRowIndex + 1;

  for (var i = 0; i < announcementMessages.length; i++) {
    //since announcementMessages array start with index 0, so 1st element is pointing to 1st announcement to work on
    logMessage(`${getCallStackTrace()}: Working on this announcement = ${JSON.stringify(announcementMessages[i])}`);

    var parsedAnnouncement = parseAnnouncementMessage(announcementMessages[i]);
    logMessage(`${getCallStackTrace()}: Parsed announcement : ${JSON.stringify(parsedAnnouncement)}`);

    // Save each part of the announcement to the spreadsheet
    saveAnnouncementToSS(sheet, currentRow, parsedAnnouncement);
    currentRow += parsedAnnouncement.pages.length;

  }
}


function parseAnnouncementMessage(message) {
  let [title, ...bodyParts] = message.split(/(:|：|！|!)/);
  title += bodyParts.shift(); // Append the separator back to the title
  let body = bodyParts.join("").trim();

  // Split body into pages based on a maximum character limit
  //let pages = splitByPeriodEtc(body, max_c_per_anno_page);
  
  //using the improved splitByPeriodEtc version as below
  let pages = splitAnnouncementIntoSlides(body)

  return { title: title.trim(), pages: pages };
}

function saveAnnouncementToSS(sheet, row, announcement) {
  announcement.pages.forEach((page, index) => {
    let pageTitle = index === 0 ? announcement.title : announcement.title + " (續)";
    let data = [pageTitle, page, Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss')];

    logMessage(getCallStackTrace() + `: Saving announcement page to sheet: ${data}`);
    sheet.insertRowAfter(row);
    sheet.getRange(row + 1, 1, 1, 3).setBackground('white').setFontColor('black').setValues([data]);
    row++;
  });
}

function findRowIndex(contents, regex) {
  for (var i = 0; i < contents.length; i++) {
    if (contents[i].toString().match(regex)) {
      return i;
    }
  }
  return -1;
}


function splitByPeriodEtc(p, c) {
  const temp1_array = [];
  const split_char = "";
  const passage_in = [];

  // Split the input passage by specific punctuation marks and include the delimiters
  const a = p.split(/([。]|[，]|[,]|[、]|[?]|[；])/);

  // Combine text chunks with their delimiters
  for (let i = 0; i < a.length; i += 2) {
    passage_in.push(a[i + 1] !== undefined ? a[i] + a[i + 1] : a[i]);
  }

  let rt_c_per_page = 0;
  let temp_array = [];

  // Loop through the passage chunks and accumulate them into pages
  for (let i = 0; i < passage_in.length; i++) {
    if (passage_in[i].length === 0) continue;

    const asciiCount = countAsciiCharacters(passage_in[i]);
    //const effectiveCharCount = passage_in[i].length - asciiCount + (asciiCount * 3) / 4;
    //change it to 5/8 when 1/3 of chars are ascii
    const effectiveCharCount = passage_in[i].length - asciiCount + (asciiCount * 5) / 8;
    rt_c_per_page += effectiveCharCount;

    logMessage(getCallStackTrace() + `: This announement chunk ${i}'s length = ${passage_in[i].length}, with ascii char = ${asciiCount}, and the effective char = ${effectiveCharCount}, with the content of \"${passage_in[i]}\"`);

    if (rt_c_per_page <= c) {
      //if the running total chars per page is less than or equal to max char allowed per page, then we fit it in the current page
      temp_array.push(passage_in[i]);
      logMessage(getCallStackTrace() + `: Putting this announement chunk ${i}, to the temp array: ${JSON.stringify(temp_array)}, with the running total chars of ${rt_c_per_page}`);
    } else {
      //this is starting of a new page, after finishing up the last page
      logMessage(getCallStackTrace() + `: If we putting this announement chunk ${i}, to the temp array: ${JSON.stringify(temp_array)}, with the running total chars of ${rt_c_per_page}`);
      logMessage(getCallStackTrace() + `: This will be exceeding the max chars for this page = ${c}, if we add this chunk ${i}`);
      logMessage(getCallStackTrace() + `: So, this is the announcment for this page = ${temp_array.join(split_char)}, Number of chars for this page is ${(rt_c_per_page - effectiveCharCount)}`);

      temp1_array.push(temp_array.join(split_char));

      // Start a new page
      rt_c_per_page = effectiveCharCount;
      temp_array = [passage_in[i].trim()];
      logMessage(getCallStackTrace() + `: Starting a new page!!! Putting this chunk ${i}, to the array: ${temp_array}, with the running total chars of ${rt_c_per_page}`);
    }
  }

  // Add the last page
  if (temp_array.length > 0) {
    temp1_array.push(temp_array.join(split_char));
  }
  logMessage(getCallStackTrace() + `: This are announcment pages return, after splitting all up by the special chars and gather up by the chunks ${JSON.stringify(temp1_array)}`);
  return temp1_array;
}

function findInvocationInsertRow(sheetContents) {
  for (let i = 0; i < sheetContents.length; i++) {
    if (sheetContents[i].toString().includes("TITLE_INVOCATION")) {
      return i + 1;
    }
  }
  return sheetContents.length + 1; // Default to the end of the sheet if not found
}

function isValidInvocation(line) {
  return (
    /Call\s*to\s*worship\s*[:]/i.test(line) && // Matches "Call to worship:"
    !/1xx|similar format|modify the content|\*\*\*/i.test(line)   // Avoids "1xx", "similar format", "modify the content" and "***"
  );
}

function saveInvocationPassages(array_invo_passage, invo_row_to_insert) {
  let total_rows_used = 0;

  for (let k = 0; k < array_invo_passage.length; k++) {
    const passage = array_invo_passage[k];
    logMessage(getCallStackTrace() + `: Invocation Bible passage is ${passage}`);

    const invo_passage_array = passageCapture(passage);
    logMessage(getCallStackTrace() + `: Invocation passage array returning from the reading subroutine is ${invo_passage_array}, for the passage ${passage}`);

    const rows_used = passageToSS(passage, invo_passage_array, invo_row_to_insert + total_rows_used, "worship");
    total_rows_used += rows_used;
  }

  return invo_row_to_insert + total_rows_used;
}

// Function to delete rows between two titles
function deleteRowsBetween(sheet, startRow, endRow, isLastTitle) {
  var rowsToDelete = endRow - startRow - 1;
  //there is one extra row to delete if it is TITLE_ANNOUNCEMENT
  if (isLastTitle) {
    rowsToDelete = endRow - startRow
  }

  for (let i = 0; i < rowsToDelete; i++) {
    sheet.deleteRow(startRow + 1);
    logMessage(getCallStackTrace() + `Deleted row ${startRow + 1}` + `, Starting from row ${startRow}` + ` To row ${endRow}`);
  }
}

function splitGmailMsg(message) {
  let msg = message
    .replace(/[*]/g, "")           // Remove asterisks
    .replace(/[>]/g, "")           // Remove '>'
    //.replace(/\r\n/g, "\n#")        // Replace CR+LF with LF
    //.replace(/\r/g, "")          // Replace CR with LF
    .split("\n")                   // Split on LF
    .map(line => line.trim())      // Trim each line
    .filter(line => line !== "");  // remove empty line, including line with \n only
  dumpArray(msg);
  return msg
}

// Utility Functions
function findTitleRows(sheetContents) {
  let titles = {
    "TITLE_INVOCATION": 0,
    "TITLE_SCRIPTURE_READING": 0,
    "TITLE_SERMON_TOPIC": 0,
    "TITLE_ANNOUNCEMENT": 0
  };

  sheetContents.forEach((row, i) => {
    const rowString = row.toString();
    Object.keys(titles).forEach(title => {
      if (rowString.includes(title)) {
        titles[title] = i + 1;
      }
    });
  });

  return titles;
}

function cleanupOldData(sheet, titleRows, lastRow) {
  deleteRowsBetween(sheet, titleRows.TITLE_ANNOUNCEMENT, lastRow, true);
  deleteRowsBetween(sheet, titleRows.TITLE_SERMON_TOPIC, titleRows.TITLE_ANNOUNCEMENT, false);
  deleteRowsBetween(sheet, titleRows.TITLE_SCRIPTURE_READING, titleRows.TITLE_SERMON_TOPIC, false);
  deleteRowsBetween(sheet, titleRows.TITLE_INVOCATION, titleRows.TITLE_SCRIPTURE_READING, false);
}

function extractInvocationPassages(cantMsg) {
  for (let line of cantMsg) {
    if (isValidInvocation(line)) {
      logMessage(`${getCallStackTrace()}: Found invocation line: ${line}`);
      return parseInvocation(line) || [];
    }
  }
  return [];
}

function findScriptureReadingRow() {
  dataRange = SpreadsheetApp.getActive().getSheetByName("worship").getDataRange();
  sheetContents = dataRange.getValues();
  for (let i = 0; i < sheetContents.length; i++) {
    if (sheetContents[i].toString().includes("TITLE_SCRIPTURE_READING")) {
      logMessage(`${getCallStackTrace()}: Found \"TITLE_SCRIPTURE_READING\" at row ${i + 1}`);
      return i + 1;
    }
  }
  return 0;
}

function processWorshipEmail(msg, srRowToInsert) {
  let parsingStarted = false;
  let announcementStarted = false;
  let annoArray = [];
  let scriptureReadingTitle = "", sermonTitle = "", speakerName = "";

  for (let index = 0; index < msg.length; index++) {
    let currentLine = msg[index].trim();

    if (!parsingStarted) {
      if (/We\s*will\s*have\s*an\s*in-person\s*worship/i.test(currentLine)) {
        logMessage(`${getCallStackTrace()}: We found Emily's email starting line to start regexp parsing: ${currentLine}`);
        parsingStarted = true;
      }
      continue;
    }

    if (currentLine.includes("Reading")) {
      scriptureReadingTitle = processScriptureReading(msg, index, srRowToInsert);
    } else if (currentLine.includes("Sermon")) {
      sermonTitle = processSermon(msg, index);
    } else if (currentLine.includes("Speaker")) {
      speakerName = processSpeaker(msg, index);
      sermonSpeakerToSS(sermonTitle, scriptureReadingTitle, speakerName);
    } else if (currentLine.match(/^\s*\d+\s*#\D*\d+/) || currentLine.match(/^\s*\d+[.]\s*/)) {
      annoArray.push(extractLastNumber(currentLine));
      announcementStarted = true;
    } else if (announcementStarted && isEndOfAnnouncements(currentLine, msg, index)) {
      break; // Stop processing and return when the 1st section of announcements end in 1st message, if there are multiple messages
    }
  }

  if (!parsingStarted) {
    logMessageError(`${getCallStackTrace()}: Bad news, can't find Emily's email starting line to start regexp parsing !!!`);
  } else {
    logMessage(`${getCallStackTrace()}: Captured announcement numbers: ${JSON.stringify(annoArray)}`);
  }

  return annoArray;
}

function processAnnouncements(attachment, annoArray) {
  let pdfFile = attachment.getName();
  logMessage(`${getCallStackTrace()}: Parsing PDF file: ${pdfFile}`);

  let fileText = pdfToText(attachment.copyBlob(), { keepTextfile: false });
  logMessage(`${getCallStackTrace()}: Converted PDF to text: ${fileText}`);

  let announcementsSection = fileText.split("報告事項")[1] || "";
  let announcementMessages = parseAnnouncements(announcementsSection);

  logMessage(`${getCallStackTrace()}: Extracted announcements: ${JSON.stringify(announcementMessages)}`);
  saveAnnouncementsToSS(announcementMessages, annoArray);
}

function processAnnouncementsDeepSeekAPI(attachment, annoArray) {
  //announcementMessages is just the messages needed to go to the ppt, whatever is in the annoArray
  let announcementMessages = extractAnnouncementsDeepSeekAPI(attachment, annoArray);

  logMessage(`${getCallStackTrace()}: Extracted announcements using Deep Seek API: ${JSON.stringify(announcementMessages)}`);
  saveAnnouncementsToSS(announcementMessages);
}

function notifyCompletion(foundInvocation) {
  if (foundInvocation) {
    SpreadsheetApp.getActive().toast("Done populating worship info on slide_src!", "👍");
    delete_trigger_5m();
  } else {
    handleMissingInvocation();
  }
}

function handleMissingInvocation() {
  let today = new Date();
  let dayOfWeek = today.getDay();

  SpreadsheetApp.getActive().toast("Invocation passage missing! Checking again...", "👎");

  if (dayOfWeek !== 0) {
    logMessage(`${getCallStackTrace()}: Today is ${dayOfWeek}. Will keep looking for invocation passage.`);
    create_trigger_5m();
  } else {
    logMessage(`${getCallStackTrace()}: Today is Sunday, stopping search for invocation passage.`);
    delete_trigger_5m();
  }
}

function handleMissingEmails() {
  SpreadsheetApp.getActive().toast("Missing one or both emails!", "👎");
  logMessageError(`${getCallStackTrace()}: Missing one or both emails!`);

  let today = new Date();
  let dayOfWeek = today.getDay();

  if (dayOfWeek !== 0) {
    logMessage(`${getCallStackTrace()}: Today is ${dayOfWeek}. Will keep looking for emails.`);
    create_trigger_5m();
  } else {
    logMessage(`${getCallStackTrace()}: Today is Sunday, stopping search for emails.`);
    delete_trigger_5m();
  }
  flushLogsToSheet();
}


