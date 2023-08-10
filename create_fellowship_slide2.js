//Adding fellowship title_message/title_message_body, just in case there is message to do 10/17/2022

//this are global variables used on slide_remove_copy function
//srcId is the fellowship_template slide to be restored from
//const fellowship_srcId = "1wJ3E5mlqcU2dXIR6o6bDbt06INjdZ5mRT_qpUOY6J4Q";
//srcId is the current working fellowship slide
//const fellowship_dstId = "13QmO1_mV8NFo0bfpHZyocWjkklm3HdmH8RkzykfzjEg"; 

function create_fellowship_slide2() {

  const fellowship_srcId = "1wJ3E5mlqcU2dXIR6o6bDbt06INjdZ5mRT_qpUOY6J4Q";
  const fellowship_dstId = "13QmO1_mV8NFo0bfpHZyocWjkklm3HdmH8RkzykfzjEg";

  // do some clean up of the old slides just got created
  slide_remove_copy(fellowship_srcId,fellowship_dstId);

  // Load data from the spreadsheet.
  let dataRange = SpreadsheetApp.getActive().getSheetByName("fellowship").getDataRange();
  let sheetContents = dataRange.getValues();

  // Save the header in a variable called header
  //let header = sheetContents.shift();

  // Create arrays to save the data to be populated for invocation/scripture reading slides.
  let song_Contents = [];
  let fellowship_Contents = [];
  let message_Contents = [];
  
  for (var i = 0; (i < sheetContents.length); i++) {

    if (sheetContents[i].toString().match(/TITLE/)) {
      title = sheetContents[i];
      Logger.log("ss_title = " + title);
    }
    else if (title.toString().match(/TITLE_FELLOWSHIP/)) {
      fellowship_Contents.push(sheetContents[i]);
      Logger.log("ss_title = " + title + " ; ss_fellowship_Contents = " + fellowship_Contents);
    }
    else if (title.toString().match(/TITLE_SONG/)) {
      song_Contents.push(sheetContents[i]);
      Logger.log("ss_title = " + title + " ; ss_song_Contents = " + song_Contents);
    }
    else if (title.toString().match(/TITLE_MESSAGE/)) {
      message_Contents.push(sheetContents[i]);
      Logger.log("ss_title = " + title + " ; ss_message_Contents = " + message_Contents);
    }
    
  }

  // Reverse the order of rows because new slides will
  // be inserted at the top. Without this, the order of slides
  // will be the inverse of the ordering of rows in the sheet.
  // working on the 1st fellowship slide
  fellowship_Contents.reverse();
  Logger.log("fellowship_Contents = " + fellowship_Contents);

  fellowship_masterSlide = find_title_slide(fellowship_dstId,"TITLE_FELLOWSHIP");
  //Logger.log("invo_masterSlide = " +invo_masterSlide);

  // For every row, create a new slide by duplicating the master slide
  // and replace the template variables with data from that row.
  fellowship_Contents.forEach(function (row) {

    // Insert a new slide by duplicating the master slide.
    let slide = fellowship_masterSlide.duplicate();

    // Populate data in the slide that was created
    slide.replaceAllText("TITLE_FELLOWSHIP", row[0]);
    var formattedDate = Utilities.formatDate(row[1], "GMT+0", 'E MM/dd/yyyy');
    slide.replaceAllText("TITLE_DATE", formattedDate);
   
  });

  //Remove the master slide if you no longer need it.
  fellowship_masterSlide.remove();
  Logger.log("Done with the fellowsip title slides !!!");

  // working on the songs slide
  song_Contents.reverse();
  Logger.log("song_Contents = " + song_Contents);

  song_masterSlide = find_title_slide(fellowship_dstId,"TITLE_SONG");
  //Logger.log("invo_masterSlide = " +invo_masterSlide);

  // For every row, create a new slide by duplicating the master slide
  // and replace the template variables with data from that row.
  song_Contents.forEach(function (row) {

    // Insert a new slide by duplicating the master slide.
    let slide = song_masterSlide.duplicate();

    // Populate data in the slide that was created
    slide.replaceAllText("TITLE_SONG", row[0]);
    slide.replaceAllText("TITLE_AUTHOR", row[1]);
    slide.insertVideo(row[2]);
  });

  //Remove the master slide if you no longer need it.
  song_masterSlide.remove();
  Logger.log("Done with the song slides !!!");

  // Working on the messages slides
  message_Contents.reverse();
  Logger.log("message_Contents = " + message_Contents);
  
  message_masterSlide = find_title_slide(fellowship_dstId,"TITLE_MESSAGE");
  //Logger.log("invo_masterSlide = " +invo_masterSlide);

  // For every row, create a new slide by duplicating the master slide
  // and replace the template variables with data from that row.
  message_Contents.forEach(function (row) {

    // Insert a new slide by duplicating the master slide.
    let slide = message_masterSlide.duplicate();

    // Populate data in the slide that was created
    slide.replaceAllText("TITLE_MESSAGE", row[0]);
    slide.replaceAllText("MESSAGE_BODY", row[1]);
    
  });

  //Remove the master slide if you no longer need it.
  message_masterSlide.remove();
  Logger.log("Done with the message slides !!!");

  SlidesApp.openById(fellowship_dstId).saveAndClose();
  
  file_duplicate(fellowship_dstId);
  Logger.log("Done with the duplicating of fellowship slide !!!");
}