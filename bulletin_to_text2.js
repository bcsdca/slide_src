function bulletin_to_text2() {
  
  var threads = GmailApp.search('worship info C-', 0, 1);

  var message = threads[0].getMessages()[0];
  var attachment = message.getAttachments()[0];
  console.log("Emily's email attachment file name is " + attachment.getName())

  var pdfFile = attachment.getName();
  console.log("pdfFile name to be parse is " +  pdfFile)
  var blob = attachment.copyBlob();
  
  // Get the text from pdf
  var filetext = pdfToText( blob, {keepTextfile: false} );

  console.log(filetext)
}
