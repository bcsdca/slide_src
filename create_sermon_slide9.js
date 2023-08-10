// version 8 fixing the weekend of the month problem for the comining week (11/25/2022)
// version 9 using find_title_slide without specifying position(12/5/2022)

//this is used on slide_remove_copy function
//srcId is the sermon_template slide to be restored from
//const sermon_srcId = "1warCrMpJQJsjBQTRitQj_tXoMEji4bqUvrZExRfSS0c";
//srcId is the current working sermon slide
//const sermon_dstId = "148hLdiJtmuO30zOHEZBkck65fZjrRFIsqxqWEE7wePY";

function create_sermon_slide9() {

  const sermon_srcId = "1warCrMpJQJsjBQTRitQj_tXoMEji4bqUvrZExRfSS0c";
  //srcId is the current working sermon slide
  const sermon_dstId = "148hLdiJtmuO30zOHEZBkck65fZjrRFIsqxqWEE7wePY";

  // do some clean up of the old slides just got created
  slide_remove_copy(sermon_srcId, sermon_dstId);

  // Load data from the spreadsheet.
  let dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
  //let dataRange = SpreadsheetApp.getActive().getDataRange();
  let sheetContents = dataRange.getValues();

  // Save the header in a variable called header
  //let header = sheetContents.shift();

  // Create arrays to save the data to be populated for invocation/scripture reading slides.
  let invo_Contents = [];
  let scripture_Contents = [];
  let sermontopic_Contents = [];
  let announcement_Contents = [];

  for (var i = 0; (i < sheetContents.length); i++) {

    if (sheetContents[i].toString().match(/TITLE/)) {
      title = sheetContents[i];
      Logger.log("ss_title = " + title);
    }
    else if (title.toString().match(/TITLE_INVOCATION/)) {
      invo_Contents.push(sheetContents[i]);
      Logger.log("ss_title = " + title + " ; ss_invo_Contents = " + invo_Contents);
    }
    else if (title.toString().match(/TITLE_SCRIPTURE_READING/)) {
      scripture_Contents.push(sheetContents[i]);
      Logger.log("ss_title = " + title + " ; ss_scripture_Contents = " + scripture_Contents);
    }
    else if (title.toString().match(/TITLE_SERMON_TOPIC/)) {
      sermontopic_Contents.push(sheetContents[i]);
      Logger.log("ss_title = " + title + " ; ss_sermontopic_Contents = " + sermontopic_Contents);
    }
    else if (title.toString().match(/TITLE_ANNOUNCEMENT/)) {
      announcement_Contents.push(sheetContents[i]);
      Logger.log("ss_title = " + title + " ; ss_announcement_Contents = " + announcement_Contents);
    }

  }

  // Reverse the order of rows because new slides will
  // be inserted at the top. Without this, the order of slides
  // will be the inverse of the ordering of rows in the sheet. 
  invo_Contents.reverse();
  Logger.log("invo_Contents = " + invo_Contents);

  scripture_Contents.reverse();
  Logger.log("scripture_Contents = " + scripture_Contents);

  sermontopic_Contents.reverse();
  Logger.log("sermontopic_Contents = " + sermontopic_Contents);

  announcement_Contents.reverse();
  Logger.log("scripture_Contents = " + announcement_Contents);

  // Working on the invocation slides
  invo_masterSlide = find_title_slide(sermon_dstId, "TITLE_INVOCATION");
  //Logger.log("invo_masterSlide = " +invo_masterSlide);

  // For every row, create a new slide by duplicating the master slide
  // and replace the template variables with data from that row.
  invo_Contents.forEach(function (row) {

    // Insert a new slide by duplicating the master slide.
    let slide = invo_masterSlide.duplicate();

    // Populate data in the slide that was created
    slide.replaceAllText("TITLE_INVOCATION", row[0]);
    slide.replaceAllText("INVOCATION_PASSAGE", row[1]);
  });

  //Remove the master slide if you no longer need it.
  invo_masterSlide.remove();
  SlidesApp.openById(sermon_dstId).saveAndClose();
  Logger.log("Done with the invocation slides !!!");

  // Working on the scripture reading slides
  scripture_masterSlide = find_title_slide(sermon_dstId, "TITLE_SCRIPTURE_READING");

  // For every row, create a new slide by duplicating the master slide
  // and replace the template variables with data from that row.
  scripture_Contents.forEach(function (row) {

    // Insert a new slide by duplicating the master slide.
    let slide = scripture_masterSlide.duplicate();

    // Populate data in the slide that was created
    slide.replaceAllText("TITLE_SCRIPTURE_READING", row[0]);
    slide.replaceAllText("SCRIPTURE_READING_PASSAGE", row[1]);

  });

  //Remove the master slide if you no longer need it.
  scripture_masterSlide.remove();
  SlidesApp.openById(sermon_dstId).saveAndClose();
  Logger.log("Done with the scripture reading slides !!!");

  // Working on the sermon topic slides
  // search for position = 1 for the "TITLE_SERMON_TOPIC"
  sermontopic_masterSlide = find_title_slide(sermon_dstId, "TITLE_SERMON_TOPIC");
  //Logger.log("invo_masterSlide = " +invo_masterSlide);

  // For every row, create a new slide by duplicating the master slide
  // and replace the template variables with data from that row.
  sermontopic_Contents.forEach(function (row) {

    // Insert a new slide by duplicating the master slide.
    let slide = sermontopic_masterSlide.duplicate();

    // Populate data in the slide that was created
    slide.replaceAllText("TITLE_SERMON_TOPIC", row[0]);
    slide.replaceAllText("SPEAKER", row[1]);

  });
  //Remove the master slide if you no longer need it.
  sermontopic_masterSlide.remove();
  SlidesApp.openById(sermon_dstId).saveAndClose();
  Logger.log("Done with the sermon topic slides !!!");

  // Working on the announcement slides
  announcement_masterSlide = find_title_slide(sermon_dstId, "TITLE_ANNOUNCEMENT");
  //Logger.log("invo_masterSlide = " +invo_masterSlide);

  // For every row, create a new slide by duplicating the master slide
  // and replace the template variables with data from that row.
  announcement_Contents.forEach(function (row) {

    // Insert a new slide by duplicating the master slide.
    let slide = announcement_masterSlide.duplicate();

    // Populate data in the slide that was created
    slide.replaceAllText("TITLE_ANNOUNCEMENT", row[0]);
    slide.replaceAllText("ANNOUNCEMENT_DETAIL", row[1]);

  });
  //Remove the master slide if you no longer need it.
  announcement_masterSlide.remove();
  SlidesApp.openById(sermon_dstId).saveAndClose();
  Logger.log("Done with the announcement slides !!!");

  //we are actually preparing ppt for the coming sunday
  var today = new Date();
  var today_temp = new Date();
  var coming_sunday_offset_from_today = 7 - today.getDay()
  var coming_sunday = new Date(today_temp.setDate(today_temp.getDate() + coming_sunday_offset_from_today));
  const date = coming_sunday.getDate();
  const day = coming_sunday.getDay();
  const coming_sunday_WeekOfMonth = Math.ceil((date - 1 - day) / 7);
  console.log("today = " + today + " coming sunday = " + coming_sunday + " date = " + date + ", day = " + day + ", coming sunday week of month = " + coming_sunday_WeekOfMonth)

  //if it is the 1st week of the month, only communion ppt, removing apostle creed and removing lords prayer
  if (coming_sunday_WeekOfMonth == 1) {
    for (i = 0; i < 2; i++) {
      lordsPrayerSlide = find_title_slide(sermon_dstId, "TITLE_LORDS_PRAYER")
      lordsPrayerSlide.remove();
      SlidesApp.openById(sermon_dstId).saveAndClose();
      Logger.log("Done with the removing Lords prayer slide" + (i + 1) + " for the week 1 !!!");
      apostleCreedSlide = find_title_slide(sermon_dstId, "TITLE_APOSTLE_CREED")
      apostleCreedSlide.remove();
      SlidesApp.openById(sermon_dstId).saveAndClose();
      Logger.log("Done with the removing Apostle creed slide" + (i + 1) + " for the week 1 !!!");
    }
  }
  //if it is the 2nd week of the month, only lords prayer, removing communion ppt, and removing apostle creed
  else if (coming_sunday_WeekOfMonth == 2) {
    for (i = 0; i < 2; i++) {
      apostleCreedSlide = find_title_slide(sermon_dstId, "TITLE_APOSTLE_CREED")
      apostleCreedSlide.remove();
      SlidesApp.openById(sermon_dstId).saveAndClose();
      Logger.log("Done with the removing Apostle creed slide" + (i + 1) + " for the week 2 !!!");
    }
    communionSlide = find_title_slide(sermon_dstId, "TITLE_COMMUNION")
    communionSlide.remove();
    SlidesApp.openById(sermon_dstId).saveAndClose();
    Logger.log("Done with the removing Communion slide" + (i + 1) + " for the week 2 !!!");
  }
  //if it is the 4th week of the month, only apostle creed, removingcommunion ppt, and removing lords prayer
  else if (coming_sunday_WeekOfMonth == 4) {
    for (i = 0; i < 2; i++) {
      lordsPrayerSlide = find_title_slide(sermon_dstId, "TITLE_LORDS_PRAYER")
      lordsPrayerSlide.remove();
      SlidesApp.openById(sermon_dstId).saveAndClose();
      Logger.log("Done with the removing Lords prayer slide" + (i + 1) + " for the week 4 !!!");
    }
    communionSlide = find_title_slide(sermon_dstId, "TITLE_COMMUNION")
    communionSlide.remove();
    SlidesApp.openById(sermon_dstId).saveAndClose();
    Logger.log("Done with the removing Communion slide" + (i + 1) + " for the week 4 !!!");
  }
  //if it is the 3rd or 5th week of the month,removing everything
  else {
    for (i = 0; i < 2; i++) {
      lordsPrayerSlide = find_title_slide(sermon_dstId, "TITLE_LORDS_PRAYER")
      lordsPrayerSlide.remove();
      SlidesApp.openById(sermon_dstId).saveAndClose();
      Logger.log("Done with the removing Lords prayer slide" + (i + 1) + " for the week 3 or week 5 !!!");
      apostleCreedSlide = find_title_slide(sermon_dstId, "TITLE_APOSTLE_CREED")
      apostleCreedSlide.remove();
      SlidesApp.openById(sermon_dstId).saveAndClose();
      Logger.log("Done with the removing Apostle creed slide" + (i + 1) + " for the week 3 or week 5 !!!");
    }
    communionSlide = find_title_slide(sermon_dstId, "TITLE_COMMUNION")
    communionSlide.remove();
    SlidesApp.openById(sermon_dstId).saveAndClose();
    Logger.log("Done with the removing Communion slide" + (i + 1) + " for the week 3 or week 5 !!!");
  }

  SlidesApp.openById(sermon_dstId).saveAndClose();

  file_duplicate(sermon_dstId);
  Logger.log("Done with the sermon slides copy version !!!");

}