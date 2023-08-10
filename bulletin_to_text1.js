function bulletin_to_text1() {
  
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
  //var pdffile = DriveApp.createFile(attachment.copyBlob());
  var blob = DriveApp.createFile(attachment.copyBlob());
  var file_name = blob.getName();
  var pdfFile = DriveApp.getFilesByName(file_name).next();
  var blob = pdfFile.getBlob();
  console.log("pdf_file_name is " +  file_name)
  console.log("pdfFile " +  pdfFile)

  //file.setName(renameFile(attachment, message_body))
  //createFile(attachment.copyBlob()).setName(fileName);
  //parentFolder.addFile(file);
  //folder.addFile(pdffile);

  //var pdfFile = DriveApp.getFilesByName("Cantonese bulletin-120422.pdf").next();
  //var blob = pdfFile.getBlob();

  // Get the text from pdf
  var filetext = pdfToText( blob, {keepTextfile: false} );

  console.log(filetext)
}
