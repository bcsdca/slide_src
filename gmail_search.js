
function gmail_search() {

  var max_c_per_anno_page = 160;
  var today = new Date();
  var today_temp = new Date();
  var coming_sunday_offset_from_today = 7 - today.getDay()

  //var coming_sunday_emily = fix_d(coming_sunday);
  var coming_sunday_emily = Utilities.formatDate(new Date(today_temp.setDate(today.getDate() + coming_sunday_offset_from_today)), Session.getScriptTimeZone(), 'M/d/yyyy');
  var query_month = new Date(coming_sunday_emily).getMonth();
  query_month++;
  var query_date = new Date(coming_sunday_emily).getDate();
  var query_year = new Date(coming_sunday_emily).getFullYear();
  console.log(arguments.callee.name + ": This coming sunday emily email is %s, query_month = %s, query_day = %s, query_year = %s", coming_sunday_emily, query_month, query_date, query_year)
  //emily's c-worship email
  //query = "is:inbox subject:\"worship info C-" + coming_sunday_emily + "\"";
  //console.log(query);
  query = "is:inbox subject:worship info C- AROUND 1 " + query_month + query_date + query_year + "";
  console.log(query);
  //query = "is:inbox subject:\"Cantonese Sunday Service + query_month ";
  //query = "is:inbox subject:\'worship info C-" + query_month +"\'";
  //Worship info - Cantonese -7/23/2023 from Jim Yee
  //query = "is:inbox subject:\"Fwd: Worship info - Cantonese -" + coming_sunday_emily + "\"";
  //query = "is:inbox subject:\"Worship info - Cantonese -" + coming_sunday_emily + "\"";


  //console.log(arguments.callee.name + ": This coming sunday is %s, query for emily's email is %s, and query for cantonese worship email is %s", coming_sunday, query, cant_query);

  var success = true;
  try {
    //Emily's worship info email C-07/18/25
    //var threads = GmailApp.search('Fwd: Worship info - Cantonese -7/23/2023', 0, 1);
    //var threads = GmailApp.search('is:starred subject:"IMPORTANT"');
    //var threads = GmailApp.search('is:inbox subject:"worship info c-"', 0, 8);
    //var threads = GmailApp.search('is:inbox subject:"worship info cantonese 7/23/2023"', 0, 10);
    //var threads = GmailApp.search('is:inbox subject:"worship info cantonese 7/23/2023"', 0, 10);
    //var threads = GmailApp.search('is:inbox subject:"Worship info - Cantonese - 7/23/2023"', 0, 10);
    //var threads = GmailApp.search("Worship info - Cantonese - 7/23/2023", 0, 10);
    //var threads = GmailApp.search('worship info cantonese 7/23/2023', 0, 10);
    //var threads = GmailApp.search('Cantonese', 0, 1);
    //var threads = GmailApp.search('worship info C-7/23/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-7/16/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-4/23/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-3/12/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-3/5/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-2/26/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-2/19/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-2/12/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-1/15/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-1/8/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-1/1/2023', 0, 1);
    //var threads = GmailApp.search('worship info C-12/18/2022', 0, 1);
    //var threads = GmailApp.search('worship info C-12/11/2022', 0, 1);
    //var threads = GmailApp.search('worship info C-11/27/2022', 0, 1);
    //var threads = GmailApp.search('worship info C-10/23/2022', 0, 1);
    //var threads = GmailApp.search('worship info C-8/7/2022', 0, 1);
    //var threads = GmailApp.search('worship info C-7/24/2022', 0, 1);
    //the 1st message from the thread0 is what Emily send out 1st and needed to be parse
    var threads = GmailApp.search(query, 0, 8);
    console.log("The total thread length for this search is %d ", threads.length)
    for (var i = 0; (i < threads.length); i++) {
      //console.log(threads.length)
      //var message_length = threads[0].getMessages().length;
      //console.log(arguments.callee.name + ": The Emily's worship email message length is " + message_length)
      //last meesage for the message body
      //var message = threads[0].getMessages()[message_length - 1];
      var message = "";
      var message_length = threads[i].getMessages().length;
      for (var j = 0; j < message_length; j++) {
        var message = message.concat(threads[i].getMessages()[j].getPlainBody());
        //console.log(message)
      }
      //console.log(arguments.callee.name + ": thread%d\'s subject is \"%s\", the total messages are %d, and all the messages within this thread are:\n%s", i, threads[i].getMessages()[0].getSubject(), message_length, message);
      console.log(arguments.callee.name + ": thread%d\'s subject is \"%s\", the total messages are %d", i, threads[i].getMessages()[0].getSubject(), message_length);
    }

    //always getting the attachment from the Emily's initial messages, despite there might be reply message after that
    //find the 1st message in the threads[0] that has the pdf file as the 1st attachment
    var find_pdf = false;
    for (var i = 0; (i < threads.length); i++) {
      var message_length = threads[i].getMessages().length;
      for (var j = 0; (j < message_length); j++) {
        var msg = threads[i].getMessages()[j]
        if (msg.getAttachments()[0] != undefined) {
          if (msg.getAttachments()[0].getContentType().match("pdf")) {
            find_pdf = true;
            var attachment = threads[i].getMessages()[j].getAttachments()[0];
            console.log(arguments.callee.name
              + ": Finding attachement on thread%d, message%d, subject of \"%s\" with email attachment content type is %s, and the attachment file name is %s", i, j, threads[i].getMessages()[0].getSubject(), attachment.getContentType(), attachment.getName())
          }
        }
      }
    }

    if (!find_pdf) {
      console.log(arguments.callee.name + ": Can't find the Cantonese bulletin pdf attachment for this query!!!")
      success = false;
    }

  } catch (err) {
    console.error(arguments.callee.name + ': GmailApp.search thread error for worship info C- : ' + err);
    success = false;
  }

  //var msg = message.getPlainBody();
  //console.log(msg)

  //return;
}
