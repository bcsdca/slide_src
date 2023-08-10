function get_mail_attachment() {

  var threads = GmailApp.search('worship info C-', 0, 1);

  //var threads = GmailApp.search('in:inbox from:"system@Report.com"');
  var folderId = '1b3BSz6JMgeUwDPEjgTsQrciRECJMvEl5'
  folder = DriveApp.getFolderById(folderId);
  Logger.log('Folder name: ' + folder.getName());
  var message = threads[0].getMessages()[0];
  var attachment = message.getAttachments()[0];
  console.log(attachment.getContentType())

  //var attachmentBlob = attachment.copyBlob();
  //var file = DriveApp.createFile(attachment.copyBlob().setName("test"));
  var pdffile = DriveApp.createFile(attachment.copyBlob());
  var file_name = pdffile.getName();
  console.log("pdf_file_name is " +  file_name)

  //file.setName(renameFile(attachment, message_body))
  //createFile(attachment.copyBlob()).setName(fileName);
  //parentFolder.addFile(file);
  folder.addFile(pdffile);

}
