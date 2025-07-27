/**
 * The event handler triggered when opening the spreadsheet.
 * @param {Event} e The onOpen event.
 * @see https://developers.google.com/apps-script/guides/triggers#onopene
 */
function onOpen(e) {
  // Add a custom menu to the spreadsheet.
  SpreadsheetApp.getUi() // Or DocumentApp, SlidesApp, or FormApp.
    .createMenu('💥 CEC Slide Automation 💥')
    .addItem('A. Generate Fellowship Slides', 'createFellowshipSlide')
    .addItem('B. Generate Coming Sunday\'s Worship Slides', 'createWorshipSlide')
    .addItem('C. Generate Bible Passage Google Slide ONLY', 'createPassagePPTSidebar')
    .addItem('D. Populate "worship" tab of the slide_src with this week\'s worship info from 2 gmails', 'populateWorshipTab')
    .addToUi();
}

function createPassagePPTSidebar() {
  var widget = HtmlService.createTemplateFromFile("htmlPassage").evaluate();
  widget.setTitle("Select Scripture Passage To Generate Google Slides");
  widget.setWidth(500);
  SpreadsheetApp.getUi().showSidebar(widget);
}


