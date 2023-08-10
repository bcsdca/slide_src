function gmail_test() {
  //max # of characters per announcement page is 175(8 lines) for calibri 50 fonts
  //and using "。" as a splitter
  var max_c_per_anno_page = 175;
  var today = new Date();
  var today_temp = new Date();
  var coming_sunday_offset_from_today = 7 - today.getDay()
  var coming_sunday = Utilities.formatDate(new Date(today_temp.setDate(today_temp.getDate() + coming_sunday_offset_from_today)), Session.getScriptTimeZone(), 'MM/dd/yyyy');

  //emily's c-worship email
  //query = "worship info C-" + coming_sunday;
  query = "is:inbox subject:worship info C-" + coming_sunday;

  //cantonese worship email
  //cant_query = 'is:inbox subject:"Cantonese Sunday Service(12/18/2022) Reminder"';
  cant_query = "is:inbox subject:Cantonese Sunday Service(" + coming_sunday + ") Reminder!!!";

  Logger.log("This coming sunday is %s, query for emily's email is %s, and query for cantonese worship email is %s", coming_sunday, query, cant_query);

  var success = true;
  try {

    //cantonese worship email
    var cant_threads = GmailApp.search(cant_query, 0, 1);
    //var threads = GmailApp.search('is:inbox subject:"Cantonese Sunday Service(12/18/2022) Reminder"', 0, 1);
    //var threads = GmailApp.search('Cantonese Sunday Service(12/04/2022) Reminder', 0, 1);
    //var cant_message_length = cant_threads[0].getMessages().length;

    var all_messages_body = [];
    //console.log("The cant_threads length is %d ", cant_threads.length)
    for (var j = 0; j < cant_threads[0].getMessages().length; j++) {
      var message = cant_threads[0].getMessages()[j];
      all_messages_body.push(message.getPlainBody())
      //console.log("The cantonese worship message body is: %s, and messages # is %d ", message.getPlainBody(), j)
    }
    all_messages_body.reverse();
    console.log("The cantonese worship all messages body is: %s ",all_messages_body )
    
    /*for (var i = 0; i < cant_threads[0].getMessages().length; i++) { // Loop through the threads

      var thisThread = threads[i]; // Get a speific thread

      var messages = cant_threads[0].getMessages(); // Get the messages in that thread

      var messageCount = thisThread.getMessageCount(); // Count the number of messages in that thread

      var lastMessage = messages[messageCount - 1]; // Get the last message in that thread. The first message is numbered 0.
      //console.log("The cantonese worship message is: " + messages)
    }
    console.log("The cantonese worship message is: " + messages)

    console.log("The cantonese worship message is: " + cant_message_length)*/

  } catch (err) {
    console.error('GmailApp.search thread error: ' + err);
    success = false;
  }
}
