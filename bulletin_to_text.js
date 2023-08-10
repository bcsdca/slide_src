function bulletin_to_text() {
  var pdfFile = DriveApp.getFilesByName("Cantonese bulletin-120422.pdf").next();
  console.log("pdfFile " +  pdfFile)
  var blob = pdfFile.getBlob();

  // Get the text from pdf
  var filetext = pdfToText( blob, {keepTextfile: false} );

  console.log(filetext)
}
