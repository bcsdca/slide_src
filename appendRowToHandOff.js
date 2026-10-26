function appendRowToHandOff(comingSundayStr, name, email, imageFileId, imageFileName, mcName, mcEmail) {

  // --- Write to handoff sheet ---
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("handoff");
  if (!sheet) {
    logMessageError(`${getCallStackTrace()}: Error - 'handoff' sheet not found!`);
    return;
  }

  //looking ahead before the row was actually appended to avoid race condition later..
  const lastRow = sheet.getLastRow() + 1;

  // Appending the new row
  sheet.appendRow([
    comingSundayStr,     // MUST match renderImages()
    name,          // name (optional)
    email,          // email
    imageFileId,
    imageFileName,
    mcName,
    mcEmail,
    new Date()
  ]);

  logMessage(`${getCallStackTrace()}: Updated handoff sheet for ${comingSundayStr} to row ${lastRow}`);
}
