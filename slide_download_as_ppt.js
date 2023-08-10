function file_download_as_ppt() {
  var sermon_dstId = "148hLdiJtmuO30zOHEZBkck65fZjrRFIsqxqWEE7wePY";
  var outputFileName = "Cantonese Worship.pptx";

  var url = 'https://docs.google.com/presentation/d/' + sermon_dstId + '/export/pptx';
  var rootFolder = DriveApp.getRootFolder();
  var response = UrlFetchApp.fetch(url);
  var blobPptx = response.getBlob()
  return ContentService.blobPptx.downloadAsFile(outputFileName);
  //var blobPptx = response.getBlob().downloadAsFile(outputFileName);
  //.downloadAsFile(fileName)
  //file.getDownloadUrl()
  //var result = rootFolder.createFile(blobPptx.downloadAsFile.setName(outputFileName));
}
