function file_duplicate(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
  } catch (err) {
    console.error('file_duplicate() yielded an error: ' + err);
  }
  var fileName = file.getName();
  console.log ('current time ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss'))
  file.makeCopy(fileName + '.COPY_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss'));
}
