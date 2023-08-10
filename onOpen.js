/**
 * The event handler triggered when opening the spreadsheet.
 * @param {Event} e The onOpen event.
 * @see https://developers.google.com/apps-script/guides/triggers#onopene
 */
function onOpen(e) {
  // Add a custom menu to the spreadsheet.
  SpreadsheetApp.getUi() // Or DocumentApp, SlidesApp, or FormApp.
      .createMenu('CEC Slide Automation')
      .addItem('Create Fellowship Slides', 'create_fellowship_slide3')
      .addItem('Create Sermon Slides', 'create_sermon_slide10')
      .addItem('Populate "sermon" tab of the slide_src with this week\'s worship info', 'two_gmail_to_ss21')
      .addToUi();
}
