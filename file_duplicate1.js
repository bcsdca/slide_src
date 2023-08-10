function file_duplicate1(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
  } catch (err) {
    console.error('file_duplicate() yielded an error: ' + err);
  }
  var fileName = file.getName().replace("_template", "");
  console.log ('current time ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss'))
  duplicate_file = file.makeCopy(fileName + '.COPY_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss'));
  duplicate_file_name = duplicate_file.getName();
  duplicate_file_Id = duplicate_file.getId();
  console.log ('The duplicate file name is ' + duplicate_file_name + ", with file ID of " + duplicate_file_Id);
  return duplicate_file_Id;
}
