//fixing extra space in invocation passages 以弗所書 Ephesians 1: 2-9 (1/15/2023)
//passing in chinese book name instead of english 以弗所書 1: 2-9 (1/21/2023)
//passing in chinese book name instead of english 創世記 24:1 (1/21/2023)
//passing in no space between "Matthew18"  馬太福音  Matthew18:15-20(2/17/2023)
// 傳道書 Ecclesiastes 3:11
// no for loop from_verse to to_verse
// 傳道書 Ecclesiastes 3:1,3,5-8,11

function test_passage_capture3() {
  //var my_passage = p
  //var my_passage = "以弗所書 1:2-9"
  //var my_passage = "以弗所書 1"
  //var my_passage = "Psalm 98"
  //var my_passage = "馬太福音  Matthew18:15-20"
  //var my_passage = "傳道書 Ecclesiastes 3:11,13"
  //var my_passage = "歷代志上 29:10b,11-13"
  //var my_passage = "詩篇 66:1-4."
  //var my_passage = "詩篇 Psalm,86:5,8-12"
  //var my_passage = "提摩太後書 2Timothy 2:21"
  //var my_passage = "歌羅西書 1:24-199"
  //var my_passage = "歌羅西書 2:1-5"
  var my_passage = "雅各書 4:1-10"


  //taking care of situation "2tim 1: 1-7"
  const [first, ...rest] = my_passage.split(" ");
  const remainder = rest.join("");

  var array_out_passage = [];
  var ran_out = false;

  var book = first;
  var array_my_passage2 = remainder.split(":");
  //var chapter = array_my_passage2[0].toString().replace("\n", "");
  //var chapter = array_my_passage2[0];
  //no space between "Matthew18"  馬太福音  Matthew18:15-20(2/17/2023)
  //var chapter = array_my_passage2[0].replace(/[a-z,A-Z]*/, "");
  //get rid of any non-digit, the chapter should not have any non-digit, like "," or "."
  //var chapter = array_my_passage2[0].replace(/\D*/, "");
  //\d* fixing the "2Timothy 2"
  var chapter = array_my_passage2[0].replace(/\d*\D+/, "");
  //there is verse # info
  if (array_my_passage2[1] != undefined) {
    var array_verses = breakDownVerses(array_my_passage2[1]);
  }
  //there is no verse # info, so it is the whole chapter, find the last verse #
  else {
    console.log(arguments.callee.name + ": No verse info found !!!")
    var book_chapter = book + " " + chapter;
    var last_verse = end_verse(book_chapter);
    var verse = "1" + "-" + last_verse
    var array_verses = breakDownVerses(verse);
  }

  console.log(arguments.callee.name + ": Reading from the book of " + book + ", of chapter of " + chapter + ", verses of " + array_verses)

  for (i = 0; ((i < array_verses.length) && (!ran_out)); i++) {
    var one_verse_return = bible_gateway_1v_capture2(book, chapter, array_verses[i])
    if (one_verse_return != undefined) {
      console.log(arguments.callee.name + ": one verse return: %s, verse length is %s, for book %s, chapter %s, and verse # ", one_verse_return, one_verse_return.length, book, chapter, array_verses[i])
      array_out_passage.push(one_verse_return);
    } else {
      //exception, return whatever we have because we just started to run out of stuff to return
      console.log(arguments.callee.name + ": STOP, NO verse return!!! %s, for book %s, chapter %s, and verse # ", one_verse_return, book, chapter, array_verses[i]);
      ran_out = true

    }

  }

  console.log(arguments.callee.name + ": array_out_passage = " + array_out_passage)
  return array_out_passage;

}

