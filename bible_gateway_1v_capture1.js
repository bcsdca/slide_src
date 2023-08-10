//removing "（細拉）" before return (1/5/2023)
//taking care of the "-" in 使徒行傳 8:26 (3/6/2023)

function bible_gateway_1v_capture1(b, c, v) {

  //this function only allow single verse capture
  var my_book = b;
  var my_chapter = c;
  var my_verse = v;
  //console.log("Entering the bible gateway 1v capture routine..");
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

  //console.log("Web content = " + value_content);
  find_it = 0;
  for (var j = 0; ((j < value_content.length) && (find_it == 0)); j++) {
    if (value_content[j].match("Bible Gateway</title>")) {
      var title_array = value_content[j].split("title>");
      //title_array1 = 腓利傳道於埃塞俄比亞的太監 - Bible Gateway</,
      var title_array1 = title_array[1].split(/-(.*)/s);
      //title_array2 = 腓利傳道於埃塞俄比亞的太監 -
      var title_array2 = title_array1[1].split(/Bible Gateway/s);
      var title = title_array2[0].trim();
      console.log("This verse has a title of %s, and the size is %d", title, title.length);
    }
    else if (value_content[j].match("\"og:description\"")) {
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

      // only for 2nd verse or beyond, or there is no "-" or only one "。 " in the 1st verse
      else {
        // check if there is any title of size >3 (at least 1, 3 for margin)  to remove
        if (title.length > 3) {
          //removing the title string
          verse_content = verse_content_array1[2].slice(title.length).trim()
        } else {
          verse_content = verse_content_array1[2].trim();
        }
        console.log("This should be 2nd verse and beyond, and my actual verse is %s ", my_verse)
      }

      console.log("Passage Found for verse # and verse content:", my_verse, verse_content.replace("（細拉）", ""))
      find_it = 1;
      return (my_verse + " " + verse_content.replace("（細拉）", ""))

    }
  }

  if (find_it == 0) {
    console.log("Passage NOT found!!! with book of " + my_book + ", chapter of " + my_chapter + ", verse number of " + my_verse)
  }
}

