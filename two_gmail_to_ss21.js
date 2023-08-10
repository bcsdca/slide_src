//elastic chunk base on line # or char # for invo/scripture reading (12/22/2022)
//elastic chunk base total # of chars per slide for announcement (12/24/2022)
//support multiple scripture reading passages James 1:1-4**；**5:7-8* (12/25/2022)
//using passage_2_ss1 for invocation passages just like scripture reading section (12/29/2022)
//parsing the cantonese sunday service reminder thread, the whole thread0
//all the messages within the thread, not just the latest response from worship person (12/30/2022)
//supporting format "1 cor 15:1-11", adding fix_p (12/30/2022)
//adding fix_d to support emily's worship info email date format of (1/1/2023) on 12/30/2022)
//removing it, instead of using 'M/d/yyyy format (1/2/2023)
//fixing 2 lines sermon topic ss6 (1/15/2023)
//using passage_capture1 to fix extra space in invocation passages 以弗所書 Ephesians 1: 2-9 (1/15/2023)
//fixing 2 lines sermon topic differently ss7 (1/15/2023)
//using chinese name only for scripture reading on ss8 by using parse_scripture function (1/20/2023)
//ss9 using parse_sermon_topic function (1/21/2023)
//ss10 using parse_invocaion function (1/21/2023)
//ss10 using parse_scripture1 function (1/27/2023)
//ss10 fixing 詩篇Psalm 34:1-3 returning 詩篇 34:1-3 in parse_invocation function (2/2/2023)
//reverting back to "; " for splitting passages after talking to Emily (2/9/2023)
//peggy has done this on "Call to Worship: 希伯來書 Hebrews 4:12-16" on 2/10/2023
//so change it to case insensitive match
//passing in no space between "Matthew18"  馬太福音  Matthew18:15-20(2/17/2023)
// no for loop from_verse to to_verse
//using the breakDownVerses function to take care of 傳道書 Ecclesiastes 3:1,3,5-8,11 (2/18/2023)
//using the parse_sermon_topic1 function to take care of Sermon  『*你的馬其頓在哪裏？』** “Where Is Your Macedonia?”*" (2/26/2023)
//using function in test_parse_announcement because there is no carrage return between different announcements (3/3/2023)
//using steven wu additional response to the reminder email causing the example invocation to be used, 
//fixed by making the example invocation passage as "Psalm 151"(3/4/2023)
//taking care of extra title "-" in 使徒行傳 8:26,36 (3/6/2023)
//change Psalm 151 tp psalm 1xx because Wellington was confused with Psalm 151 on 3/18/2023
//replace (cont.) with (續) for extending announcment page (3/20/2023)
//replace("cec sd.org", "cec-sd.org") (3/20/2023)
//Sarah's [Callto worship,   歷代志上 1Chronicles 29, 10b,11-13 (3/22/2023)
//], 
//somehow causing a lot of issues. 
//1. no space between call to, 
//2, verse 10b, 
//3, no space between "歷代志上 1Chronicles 29" 
//"*1. # 1 **粵語部牧師聘**牧**委員會**Cantonese Pastor Search Committee*" (3/24/2023)
//missing "." after "# 1"  
//implement multiple passages(from different books) for invocation, using "parse_invocation1" (4/2/2023)
//for consistency using the "parse_scripture1" for scripture reading (4/2/2023)
//announcement robost split up by both "." and "," and also combine the split char and last sentence before doing the chunk space accounting (4/14/2023)
//taking care of 2 lines sermon topic (4/13/2023)
//fixing addnoucement splitting (1. 財務報告: 截至第一季為止，華人傳道會的經費出現淨赤字：經 常費 (-7.9 萬)、建堂費 (-2.1 萬)、差傳費 (-4.5 萬美元) 和慈惠基金 (-6 千)。(4/23/2023)
//Taking care if there are multiple messages for Emily's email using (Chinese Evangelical Church of San Diego) 
//and used only the 1st attachment from the initial(1st message)。(4/33/2023)
//taking care of the 歌羅西書   Col 1:24-2:5 format (7/19/2023)
//incorporating the caller function name in console log (7/20/2023)
//new search gmail (7/21/2023)

function two_gmail_to_ss21() {
  //max # of characters per announcement page is 160(7 lines) for calibri 50 fonts
  //and using "。" as a splitter
  var max_c_per_anno_page = 135;
  var today = new Date();
  var today_temp = new Date();
  var coming_sunday_offset_from_today = 7 - today.getDay()

  //var coming_sunday_emily = fix_d(coming_sunday);
  var coming_sunday_emily = Utilities.formatDate(new Date(today_temp.setDate(today.getDate() + coming_sunday_offset_from_today)), Session.getScriptTimeZone(), 'M/d/yyyy');

  var today_temp = new Date();
  var coming_sunday = Utilities.formatDate(new Date(today_temp.setDate(today.getDate() + coming_sunday_offset_from_today)), Session.getScriptTimeZone(), 'MM/dd/yyyy');

  console.log(arguments.callee.name + ": This coming sunday emily email is %s", coming_sunday_emily)
  //emily's c-worship email
  //query = "is:inbox subject:\"worship info C-" + coming_sunday_emily + "\"";
  //Worship info - Cantonese -7/23/2023 from Jim Yee
  //query = "is:inbox subject:\"Fwd: Worship info - Cantonese -" + coming_sunday_emily + "\"";
  //query = "is:inbox subject:\"Worship info - Cantonese -" + coming_sunday_emily + "\"";


  //console.log(arguments.callee.name + ": This coming sunday is %s, query for emily's email is %s, and query for cantonese worship email is %s", coming_sunday, query, cant_query);

  var success = true;
  try {
    //Emily's worship info email C-07/18/25
    //var threads = GmailApp.search('Fwd: Worship info - Cantonese -7/23/2023', 0, 1);
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
    query = "is:inbox subject:\"worship info C-\"";
    //query = "is:inbox subject:\"worship info C-" + coming_sunday_emily + "\"";
    var threads = GmailApp.search(query, 0, 1);
    //var threads = GmailApp.search("worship info C-07302023", 0, 1);
    var message_length = threads[0].getMessages().length;
    //message will have all the message in the thread
    var message = "";
    for (var j = 0; j < message_length; j++) {
      var message = message.concat(threads[0].getMessages()[j].getPlainBody());
    }

    var find_pdf = false;
    for (var i = 0; (i < message_length && !find_pdf); i++) {
      var msg = threads[0].getMessages()[i]
      if (msg.getAttachments()[0] != undefined) {
        if (msg.getAttachments()[0].getContentType().match("pdf")) {
          find_pdf = true;
          var attachment = threads[0].getMessages()[i].getAttachments()[0];
        }
      }
    }

    if (find_pdf) {
      console.log(arguments.callee.name
        + ": Emily's email subject is \"%s\", and it's email message length is %d, and the attachment file name is \"%s\"", threads[0].getMessages()[0].getSubject(), message_length, attachment.getName())
    } else {
      console.log(arguments.callee.name + ": Can't find the Cantonese bulletin pdf attachment!!!")
      success = false;
    }

  } catch (err) {
    console.error(arguments.callee.name + ': GmailApp.search thread error for worship info C- : ' + err);
    success = false;
  }

  try {
    //cantonese worship email
    //cant_query = 'is:inbox subject:"Cantonese Sunday Service(04/02/2023) Reminder"';
    //var cant_threads = GmailApp.search('is:inbox subject:"Cantonese Sunday Service(07/16/2023) Reminder"', 0, 1);
    //var cant_threads = GmailApp.search('subject:"Cantonese Sunday Service(07/16/2023) Reminder"', 0, 1);
    //cant_query = "is:inbox subject:\"Cantonese Sunday Service(" + coming_sunday + ") Reminder!!!\"";
    cant_query = "is:inbox subject:\"Cantonese Sunday Service\"";
    //var cant_threads = GmailApp.search('subject:"Cantonese Sunday Service(07/23/2023) Reminder"', 0, 1);
    var cant_threads = GmailApp.search(cant_query, 0, 1);
    var cant_message = "";
    var cant_message_length = cant_threads[0].getMessages().length;
    for (var j = 0; j < cant_message_length; j++) {
      var cant_message = cant_message.concat(cant_threads[0].getMessages()[j].getPlainBody());
    }

    console.log(arguments.callee.name
      + ": The Cantonese worship reminder email subject is \"%s\", and it's email message length is %d", cant_threads[0].getMessages()[0].getSubject(), cant_message_length)

  } catch (err) {
    console.error(arguments.callee.name + ': GmailApp.search thread error : Cantonese Sunday Service Reminder' + err);
    success = false;
  }

  if (success) {
    // Load data from the spreadsheet.
    let dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
    let sheet = SpreadsheetApp.getActive().getSheetByName("sermon");
    let sheetContents = dataRange.getValues();
    var lastRow = dataRange.getLastRow();
    var row_TITLE_INVOCATION = 0;
    var row_TITLE_SCRIPTURE_READING = 0;
    var row_TITLE_SERMON_TOPIC = 0;
    var row_TITLE_ANNOUNCEMENT = 0;

    for (var i = 0; (i < sheetContents.length); i++) {

      if (sheetContents[i].toString().match(/TITLE_INVOCATION/)) {
        row_TITLE_INVOCATION = i + 1;
        console.log(arguments.callee.name + ": row_TITLE_INVOCATION = " + row_TITLE_INVOCATION);
      }
      else if (sheetContents[i].toString().match(/TITLE_SCRIPTURE_READING/)) {
        row_TITLE_SCRIPTURE_READING = i + 1;
        console.log(arguments.callee.name + ": row_TITLE_SCRIPTURE_READING = " + row_TITLE_SCRIPTURE_READING);
      }
      else if (sheetContents[i].toString().match(/TITLE_SERMON_TOPIC/)) {
        row_TITLE_SERMON_TOPIC = i + 1;
        console.log(arguments.callee.name + ": row_TITLE_SERMON_TOPIC = " + row_TITLE_SERMON_TOPIC);
      }
      else if (sheetContents[i].toString().match(/TITLE_ANNOUNCEMENT/)) {
        row_TITLE_ANNOUNCEMENT = i + 1;
        console.log(arguments.callee.name + ": row_TITLE_ANNOUNCEMENT = " + row_TITLE_ANNOUNCEMENT);
      }

    }

    console.log(arguments.callee.name + ": Last Row at the start of the program = " + lastRow);

    //only deleting all the announcement in a backward manner
    for (var i = 0; i < (lastRow - row_TITLE_ANNOUNCEMENT); i++) {
      row_toDelete = row_TITLE_ANNOUNCEMENT + 1;
      sheet.deleteRow(row_toDelete);
      console.log(arguments.callee.name + ": deleting one row from row_TITLE_ANNOUNCEMENT of " + row_toDelete);
    }

    //only deleting all sermon topic rows in a backward manner
    for (var i = 0; i < (row_TITLE_ANNOUNCEMENT - row_TITLE_SERMON_TOPIC - 1); i++) {
      row_toDelete = row_TITLE_SERMON_TOPIC + 1;
      sheet.deleteRow(row_toDelete);
      console.log(arguments.callee.name + ": deleting one row from row_TITLE_SERMON_TOPIC of " + row_toDelete);
    }

    //only deleting all the scripture reading rows in a backward manner
    for (var i = 0; i < (row_TITLE_SERMON_TOPIC - row_TITLE_SCRIPTURE_READING - 1); i++) {
      row_toDelete = row_TITLE_SCRIPTURE_READING + 1;
      sheet.deleteRow(row_toDelete);
      console.log(arguments.callee.name + ": deleting one row from row_TITLE_SCRIPTURE_READING of " + row_toDelete);
    }
    //only deleting all the invocation messages in a backward manner
    for (var i = 0; i < (row_TITLE_SCRIPTURE_READING - row_TITLE_INVOCATION - 1); i++) {
      row_toDelete = row_TITLE_INVOCATION + 1;
      sheet.deleteRow(row_toDelete);
      console.log(arguments.callee.name + ": deleting one row from row_TITLE_INVOCATION of " + row_toDelete);
    }

    dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
    sheetContents = dataRange.getValues();
    lastRow = dataRange.getLastRow();
    console.log(arguments.callee.name + ": Last Row after all clean up spreadsheet = " + lastRow);

    var anno_array = [];
    var passage_array = [];
    var invo_array = [];

    //determine which row  to insert after for the invocation passages in ss
    sheet = SpreadsheetApp.getActive().getSheetByName("sermon");
    dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
    sheetContents = dataRange.getValues();
    for (var i = 0; (i < sheetContents.length); i++) {
      if (sheetContents[i].toString().match(/TITLE_INVOCATION/)) {
        var invo_row_to_insert = i + 1;
      }
    }

    //working on the invocation messages from cantonese worship email
    //insert it to ss if found..
    //var cant_msg = [];
    //var cant_message_array = [];
    //for (var j = 0; j < cant_threads[0].getMessages().length; j++) {
    //the 1st message on thread0 always has the example psalm 108 invocation passage
    //and that is what we are trying not to parse
    //except this dont work, because other messages like 1-thru whatever has also the example invocation passage too
    //so just has to rely on finding the 1st one, and stop

    //  var cant_message = cant_threads[0].getMessages()[j];
    //var cant_message_bef_split = cant_message.getPlainBody();
    //  cant_message_array = cant_message.getPlainBody().split("\n");
    //  cant_message_array.reverse();
    //  cant_msg = cant_msg.concat(cant_message_array);

    //}

    var cant_msg = cant_message.split("\r");
    console.log(arguments.callee.name + ": The cantonese worship gmail thread, with all messages is: %s ", cant_msg)

    var find_it = false;
    for (var j = 0; ((j < cant_msg.length) && (!find_it)); j++) {
      //peggy has done this on "Call to Worship: 希伯來書 Hebrews 4:12-16" on 2/10/2023
      //so change it to case insensitive match
      //psalm 1xx is used by example invocation format will be eliminated here
      if ((cant_msg[j].match(/Call\s*to\s*worship/i)) && (!cant_msg[j].match("1xx"))) {
        var array_invo_passage = parse_invocation1(cant_msg[j]);
        console.log(arguments.callee.name + ": The passage to read are %s, and the number of passage to read is %d ", array_invo_passage, array_invo_passage.length)

        var invo_r_used_up = 0;
        var invo_cur_row_to_insert = 0;

        for (var k = 0; k < array_invo_passage.length; k++) {
          var invo_passage_array = [];
          var invo_cur_row_to_insert = invo_row_to_insert + invo_r_used_up;
          console.log(arguments.callee.name + ": Invocation bible gateway search passage is " + array_invo_passage[k])

          invo_passage_array = passage_capture3(array_invo_passage[k]);
          console.log(arguments.callee.name + ": Invocation passage array returning from the reading subroutine is " + invo_passage_array + ", for the passage " + array_invo_passage[k])
          //saving it to the spreadsheet
          invo_r_used_up = passage_2_ss1(array_invo_passage[k], invo_passage_array, invo_cur_row_to_insert);

        }

        //all method below works for removing chinese characters
        //var invo_search_passage = invo_passage.replace(/[\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/g, "")
        //var invo_search_passage = invo_passage.replace(/[\u4E00-\u9FFF\u3000-\u303F]/g, "").trim()
        //var invo_search_passage = invo_passage.replace(/[^\x00-\x7F]/g, "").trim()
        //var invo_search_passage = parse_invocation(cant_msg[j])

        find_it = true;

      }

    }

    if (find_it) {
      console.log(arguments.callee.name + ": Done with the inserting invocation passage to ss !!!")
    } else (
      console.log(arguments.callee.name + ": Can't find any invocation passage in Cantonese worship reminder email !!!")
    )

    //determine which row  to insert after for scripture reading passages in ss
    sheet = SpreadsheetApp.getActive().getSheetByName("sermon");
    dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
    sheetContents = dataRange.getValues();
    for (var i = 0; (i < sheetContents.length); i++) {
      if (sheetContents[i].toString().match(/TITLE_SCRIPTURE_READING/)) {
        var sr_row_to_insert = i + 1;
      }
    }


    //Working on Emily's C-worship info email;
    var msg = message.split("\r");
    console.log(arguments.callee.name + ": Emily's worship info msg " + msg)

    var invocation_reached = 0;
    for (var j = 0; j < msg.length; j++) {
      //console.log(arguments.callee.name + ": Each Line is " + msg[j])
      if (msg[j].match("Invocation")) {
        invocation_reached = 1;
        //console.log(arguments.callee.name + ": Emily's worship info's Invocation Line is found!!!")
      }
      else if (msg[j].match("Reading") && (invocation_reached == 1)) {

        console.log(arguments.callee.name + ": Scripture Reading entry is " + msg[j])

        var array_scripture_reading_msg = msg[j].replaceAll("*", " ").split('Reading');
        var scripture_reading_title_all = array_scripture_reading_msg[1].trim();
        //scripture_reading_title is 雅各書   James 1:1-4  ；  5:7-8
        //this is for the sermon topic section

        console.log(arguments.callee.name + ": Scripture Reading is " + scripture_reading_title_all)

        var array_passage = parse_scripture2(msg[j]);
        console.log(arguments.callee.name + ": The passage to read are %s, and the number of passage to read is %d ", array_passage, array_passage.length)

        var r_used_up = 0;
        var cur_row_to_insert = 0;

        for (var k = 0; k < array_passage.length; k++) {
          var passage_array = [];
          var cur_row_to_insert = sr_row_to_insert + r_used_up;
          console.log(arguments.callee.name + ": Scripture Reading bible gateway search passage is " + array_passage[k])

          passage_array = passage_capture3(array_passage[k]);
          console.log(arguments.callee.name + ": Scripture Reading passage array returning from the reading subroutine is " + passage_array + ", for the passage " + array_passage[k])
          //saving it to the spreadsheet
          r_used_up = passage_2_ss1(array_passage[k], passage_array, cur_row_to_insert);

        }

        console.log(arguments.callee.name + ": Done with the inserting scripture reading passages to ss !!!")

      }
      else if (msg[j].match("Sermon") && (invocation_reached == 1)) {

        //check the current sermon is spill over to the next line (4/14/2023)
        //also the next line is not the "Speaker" line
        if ((msg[j + 1].match(/\w/)) && !(msg[j + 1].match("Speaker"))) {
          var sermon_msg1 = msg[j + 1].replace(",", "");
          var sermon_title_msg = parse_sermon_topic1(msg[j].concat(sermon_msg1));
          console.log(arguments.callee.name + ": Sermon title 2nd line is " + msg[j + 1])
        } else {
          var sermon_title_msg = parse_sermon_topic1(msg[j]);
        }
        //still dont know why "\n" didn't work (4/14/2023)
        sermon_title_msg = sermon_title_msg.replace("\r", " ")
        console.log(arguments.callee.name + ": Sermon title is " + sermon_title_msg)
      }
      else if (msg[j].match("Speaker") && (invocation_reached == 1)) {
        var array_speaker_msg = [];
        array_speaker_msg = msg[j].replaceAll("*", " ").split('Speaker');
        console.log(arguments.callee.name + ": Speaker is " + array_speaker_msg[1])
      }
      else if (msg[j].match(/[#]\s*\d+/) && (invocation_reached == 1)) {
        console.log(arguments.callee.name + ": The announcement Line is " + msg[j])
        //"*1. # 1 **粵語部牧師聘**牧**委員會**Cantonese Pastor Search Committee*"
        //missing "." after "# 1"
        var a = msg[j].split("#")
        //getting the 2nd digit as the announcement #
        var a1 = a[1].split(/(\d+)/)
        //anno_array.push(array_a2[0].replaceAll(" ", "").replaceAll("*", "") + "\\.");
        //anno_array.push(a1[1] + "\\.");
        anno_array.push(a1[1]);
        //console.log(arguments.callee.name + ": Announcement is " + anno_array)
      }
      //this is the end of this email thread
      else if (msg[j].match(/Chinese Evangelical Church of San Diego/i)) {
        console.log(arguments.callee.name + ": Yea, Done with parsing Emily's worship info C-xxxxxx email !!!")
        break;
      }

    }
    //anno_array.reverse();
    console.log(arguments.callee.name + ": announcement array = " + anno_array);


    //working on the sermon topic section of the spreadsheet
    dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
    sheetContents = dataRange.getValues();
    for (var i = 0; (i < sheetContents.length); i++) {
      if (sheetContents[i].toString().match(/TITLE_SERMON_TOPIC/)) {
        row_TITLE_SERMON_TOPIC = i + 1;
        var data = [];
        console.log(arguments.callee.name + ": row_TITLE_SERMON_TOPIC = " + row_TITLE_SERMON_TOPIC);
        data = [sermon_title_msg + "\n" + scripture_reading_title_all, array_speaker_msg[1].trim(), Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss')];
        console.log(arguments.callee.name + ": sermon data = " + data);
        sheet.insertRowAfter(row_TITLE_SERMON_TOPIC);
        //Utilities.sleep(2000);
        outerArray = [];//Assign empty array to variable name
        outerArray.push(data);
        sheet.getRange(row_TITLE_SERMON_TOPIC + 1, 1, 1, 3).setBackground('white').setFontColor("black").setValues(outerArray);

      }
    }

    var pdfFile = attachment.getName();
    console.log(arguments.callee.name + ": pdfFile name to be parse is " + pdfFile)
    var blob = attachment.copyBlob();

    // Get the text from pdf
    var filetext = pdfToText(blob, { keepTextfile: false });

    console.log(arguments.callee.name + ": Emily's email attach PDF messages is " + filetext)

    //looking for announcements only after "cprograms" in pdf file
    var tmp_pdf = filetext.split("cprograms");
    console.log(arguments.callee.name + ": All temporary announcements are %s", tmp_pdf[1])
    //then splitting it based on the announcment #
    var msg_pdf = tmp_pdf[1].split(/\s+\d+\.\s+/);
    //console.log(arguments.callee.name + ": msg_pdf)
    //return

    //i=0 is just the newline
    for (var i = 1; i < msg_pdf.length; i++) {
      //last announcement getting rid of the rest of stuff using split by "\n"
      if (i == (msg_pdf.length - 1)) {
        var ar_temp_msg_pdf = msg_pdf[i].split("\n")
        msg_pdf[i] = ar_temp_msg_pdf[0]
        //console.log(arguments.callee.name + ": last announcement %d: %s", i, ar_temp_msg_pdf[0])
      }
      //msg_pdf[i] = i + "." + msg_pdf[i]
      //getting rid of any white space before \n
      msg_pdf[i] = i + "." + msg_pdf[i].replace(/\n/g, "")
      console.log(arguments.callee.name + ": announcement %d: %s", i, msg_pdf[i])
    }

    //working on the announcement section of the spreadsheet based on the pdf file
    anno_message_array = []
    dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
    sheetContents = dataRange.getValues();
    for (var i = 0; (i < sheetContents.length); i++) {
      if (sheetContents[i].toString().match(/TITLE_ANNOUNCEMENT/)) {
        row_TITLE_ANNOUNCEMENT = i + 1;
        console.log(arguments.callee.name + ": row_TITLE_ANNOUNCEMENT = " + row_TITLE_ANNOUNCEMENT);
        var curr_row = row_TITLE_ANNOUNCEMENT;

        for (var k = 0; k < anno_array.length; k++) {
          var find_it = 0;
          //j=0 is just a empty line
          for (var j = 1; ((j < msg_pdf.length) && (find_it == 0)); j++) {
            //if (msg_pdf[j].match(anno_array[k])) {
            if (j == anno_array[k]) {
              console.log(arguments.callee.name + ": Finding announcement: %s, and the size is %d chars, and matching %s ", msg_pdf[j].trim(), msg_pdf[j].trim().length, anno_array[k])
              find_it = 1;
              //let [start, ...end] = msg_pdf[j].trim().split(': ');
              //let [start, ...end] = msg_pdf[j].replace("cec sd.org", "cec-sd.org").trim().split(': ');
              let [start, ...end] = msg_pdf[j].replace(/cec\s+sd.org/, "cec-sd.org").trim().split(': ');
              //anno_message_array = end.join(": ").split(/奉獻/);
              //anno_message_array = end.join(": ").split(/。|，|；/);
              //anno_message_array = end.join(": ").split(/。/);
              anno_message_array = end.join(": ");


              console.log(arguments.callee.name + ": Working on this announcement passage = " + anno_message_array + ", The size = " + anno_message_array.length);

              //allowing 190 chars per page for each announcement page
              //otherwise it will be 1b page
              //temp_anno_message_array = split_by_period_etc1(anno_message_array, 190);
              temp_anno_message_array = split_by_period_etc(anno_message_array, max_c_per_anno_page);
              for (j = 0; j < temp_anno_message_array.length; j++) {
                console.log(arguments.callee.name + ": Saving this announcement page to slide_src ss: " + temp_anno_message_array[j]);
                if (j > 0) {
                  //var anno_title = start.trim().replace(".", ".(cont.)");
                  var anno_title = start.trim().replace(/$/, " (續):");
                }
                else {
                  var anno_title = start.trim() + ":";
                }
                data = [anno_title, temp_anno_message_array[j], Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss')];
                console.log(arguments.callee.name + ": Done with saving this announcement page to the slide_src ss  = " + data);
                sheet.insertRowAfter(curr_row);
                outerArray = [];//Assign empty array to variable name
                outerArray.push(data);
                sheet.getRange(curr_row + 1, 1, 1, 3).setBackground('white').setFontColor("black").setValues(outerArray);
                curr_row++;
              }
            }

          }
        }
      }

    }

    dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
    sheetContents = dataRange.getValues();
    lastRow = dataRange.getLastRow();
    console.log(arguments.callee.name + ": Last Row after inserting all the new rows = " + lastRow);
    SpreadsheetApp.getActive().toast("Yea, Done with populating the sermon info on the slide_src !!!", "👍");
    console.log(arguments.callee.name + ": Yea, Done with populating the sermon info on the slide_src !!!");
  } else {
    SpreadsheetApp.getActive().toast("Sorry, Can't find one or both of the email to populate the sermon info on the slide_src !!!", "👎");
    console.log(arguments.callee.name + ": Sorry, Can't find one or both of the email to populate the sermon info on the slide_src !!!");
  }

}

