function createPassagePPT(p) {
  //clearLogSheet();
  try {

    // Load data from the spreadsheet.
    let dataRange = SpreadsheetApp.getActive().getSheetByName("passage").getDataRange();
    let sheet = SpreadsheetApp.getActive().getSheetByName("passage");
    var lastRow = dataRange.getLastRow();

    logMessage(getCallStackTrace() + ": Last Row at the start of the program = " + lastRow);

    //only deleting all the passages in a backward manner
    //for (var i = 2; i <= lastRow; i++) {
      //always deleting the row 2, the rest will move up if there are more
    //  sheet.deleteRow(2);
    //  logMessage(getCallStackTrace() + `: deleting row ${i} `);
    //}

    //deleting all rows in one API call
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
      logMessage(getCallStackTrace() + `: Cleared all rows from 2 to ${lastRow}`);
    }

    dataRange = SpreadsheetApp.getActive().getSheetByName("passage").getDataRange();
    lastRow = dataRange.getLastRow();
    logMessage(getCallStackTrace() + ": Last Row after all clean up spreadsheet = " + lastRow);
   
    var passage_array = [];
    //ss starting row to insert
    var passage_start_row_to_insert = 1;

    //var passage = "詩篇 Psalm 119:1-6;馬可福音   Mark 4:35-41"
    var passage = p.split(/；|;/);
    logMessage(getCallStackTrace() + `: Start working on these passage : ${JSON.stringify(passage)}`)
    var array_passage = parsePassage(passage);
    logMessage(getCallStackTrace() + `: The passage to read are ${array_passage}, and the number of passage to read is ${array_passage.length}`)

    //total rows used up
    var total_row_used_up = 0;
    //each passage use up how many row
    var r_used_up = 0;
    var cur_row_to_insert = 0;

    for (var k = 0; k < array_passage.length; k++) {
      total_row_used_up = total_row_used_up + r_used_up;
      cur_row_to_insert = passage_start_row_to_insert + total_row_used_up;
      logMessage(getCallStackTrace() + `: cuv bible search passage is ${array_passage[k]}, and the current row in the spreadsheet to insert this passage = ${cur_row_to_insert}`)

      var passage_array = [];
      passage_array = passageCapture(array_passage[k]);
      logMessage(getCallStackTrace() + ": passage array returning from the cuv bible reading subroutine is " + passage_array + ", for the passage " + array_passage[k])
      //saving it to the spreadsheet
      r_used_up = passageToSS(array_passage[k], passage_array, cur_row_to_insert, "passage");

    }

    //then create the scripture passage ppt
    createPassageSlide(passage);

  } catch (err) {
    logMessageError(getCallStackTrace() + ': Sorry, encountering some error in filling the sheet \"passage\" and program stopped !!! : ' + err);
    SpreadsheetApp.getActive().toast("Sorry, encountering some error in filling the sheet \"passage\" and program stopped !!!", "👎");

  }

}

