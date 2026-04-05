function passageToSS(passageTitle, versesArray, startRow, sheetName) {
  // Write scripture passage into spreadsheet
  // passageTitle: e.g. "以賽亞書45:5-6"
  // versesArray: array containing verses
  // startRow: row to begin inserting
  // sheetName: target sheet

  passageTitle = normalizePassageTitle(passageTitle);
  logMessage(`${getCallStackTrace()}: The normalize passage title is ${passageTitle}`);

  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd-HH:mm:ss"
  );

  logMessage(`${getCallStackTrace()}: start inserting passage at row ${startRow}`);

  //splitByLine is using maxLinePerSlide = 8 defined in the global variable
  const lines = splitByLine(versesArray);

  if (!lines || lines.length === 0) {
    logMessage(`${getCallStackTrace()}: no passage content to insert`);
    return 0;
  }

  // prepare rows for spreadsheet
  const rows = lines.map(line => {
    logMessage(`${getCallStackTrace()}: row data = ${passageTitle} | ${line} | ${timestamp}`);
    return [passageTitle, line, timestamp];
  });

  // insert required number of rows once
  sheet.insertRowsAfter(startRow, rows.length);

  // write all data at once
  const range = sheet.getRange(startRow + 1, 1, rows.length, 3);
  range
    .setValues(rows)
    .setBackground("white")
    .setFontColor("black");

  logMessage(`${getCallStackTrace()}: rows inserted = ${rows.length}`);

  return rows.length;
}

function normalizePassageTitle(title) {
  const match = title.match(/^(.*:\d+)-(\d+)$/);

  if (match) {
    const startPart = match[1];       // e.g. 以賽亞書45:5
    const startVerse = startPart.split(":")[1];
    const endVerse = match[2];

    if (startVerse === endVerse) {
      return startPart;
    }
  }

  return title;
}
