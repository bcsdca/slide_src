function test_bible_gateway_1v_capture() {

  //this function only allow single verse capture
  var my_book = "詩篇";
  var my_chapter = 98;
  var my_verse = 2;
  //var my_book = "使徒行傳";
  //var my_chapter = 8;
  //var my_verse = 26;

  //var url = "https://www.biblegateway.com/passage/?search=psalms+96:6&version=CUVMPT";
  var url = "https://www.biblegateway.com/passage/?search=" + my_book + "+" + my_chapter + ":" + my_verse + "&version=CUVMPT";
  console.log("Bible gateway search url is " + url);

  var response = UrlFetchApp.fetch(url);
  var str = response.getContentText();
  var balise = '<span class="A7a">'
  var cut = str.substring(str.indexOf(balise), response.length);
  var value = cut.substring(balise.length, cut.indexOf("</span>"));
  var value_content = value.split('\"\/\>');
  //var value_content = value.split('meta property');

  console.log("Web content = " + value_content);
  find_it = 0;
  for (var j = 0; ((j < value_content.length) && (find_it == 0)); j++) {
    if (value_content[j].match("\"og:description\"")) {
      var verse_content_array1 = value_content[j].split('\=\"');
      if (my_verse == 1) {
        if (verse_content_array1[2].match('。 ')) {
          var verse_content_array2 = verse_content_array1[2].split('。 ');
          if (verse_content_array2.length == 2) {
            // only for the 1st verse, because there are 2 "。 "
            verse_content = verse_content_array2[1].trim();
            console.log("This should be 1st verse for round period format, and my actual verse is %s", my_verse)
          }
        }
        else if (verse_content_array1[2].match("-")) {
          var verse_content_array2 = verse_content_array1[2].split('- ');
          if (verse_content_array2.length == 2) {
            // only for the 1st verse, because there are 2 "-"
            verse_content = verse_content_array2[1].trim();
            console.log("This should be 1st verse for - format, and my actual verse is %s", my_verse)
          }
        }
        else {
            //for "以弗所書" 1st verse dont have anything special
            verse_content = verse_content_array1[2].trim();
            console.log("This should be 1st verse with no special format, and my actual verse is %s", my_verse)
          }
             
      }
      else {
        // only for 2nd verse or beyond, or there is no "-" or only one "。 " in the 1st verse
        verse_content = verse_content_array1[2].trim();
        console.log("This should be 2nd verse and beyond, and my actual verse is %s ", my_verse)
      }

      //console.log("Passage Found: " + passage_content + " with Passage verse number of " + passage_verse )
      console.log("Passage Found: " + my_verse + " " + verse_content)
      find_it = 1;
      return (my_verse + " " + verse_content)
    }
  }

  if (find_it == 0) {
    console.log("Passage NOT found!!! with book of " + my_book + ", chapter of " + my_chapter + ", verse number of " + my_verse)
  }
}

