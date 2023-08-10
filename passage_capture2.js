//fixing extra space in invocation passages 以弗所書 Ephesians 1: 2-9 (1/15/2023)
//passing in chinese book name instead of english 以弗所書 1: 2-9 (1/21/2023)
//passing in chinese book name instead of english 創世記 24:1 (1/21/2023)
//passing in no space between "Matthew18"  馬太福音  Matthew18:15-20(2/17/2023)
// 傳道書 Ecclesiastes 3:11
// no for loop from_verse to to_verse
//using the breakDownVerses function to take care of 傳道書 Ecclesiastes 3:1,3,5-8,11
//using bible_gateway_1v_capture1 to taking care of the "-" in 使徒行傳 8:26

function passage_capture2(p) {
  var my_passage = p
  //var my_passage = "以弗所書 1:2-9"
  //var my_passage = "以弗所書 1"
  //var my_passage = "Psalm 98"
  //var my_passage = "馬太福音  Matthew18:15-20"
  //var my_passage = "傳道書 Ecclesiastes 3:11,13"
  
  
  //taking care of situation "2tim 1: 1-7"
  const [first, ...rest] = my_passage.split(" ");
  const remainder = rest.join("");

  var array_out_passage = [];
  
  var book = first;
  var array_my_passage2 = remainder.split(":");
  //var chapter = array_my_passage2[0].toString().replace("\n", "");
  //var chapter = array_my_passage2[0];
  //no space between "Matthew18"  馬太福音  Matthew18:15-20(2/17/2023)
  //var chapter = array_my_passage2[0].replace(/[a-z,A-Z]*/, "");
  //get rid of any non-digit in "chapter" variable, because it should not have any non-digit, like "," or "."
  //\d* fixing the "2Timothy 2"
  var chapter = array_my_passage2[0].replace(/\d*\D+/, "");
  //var chapter = array_my_passage2[0].replace(/\D*/, "");
  console.log("Reading from the book of " + book + ", and chapter of " + chapter)
  //there is verse # info
  if (array_my_passage2[1] != undefined) {
    var array_verses = breakDownVerses(array_my_passage2[1]);
  }
  //there is no verse # info, so it is the whole chapter, assuming version 10 is the highest version #
  else {
    var array_verses = breakDownVerses("1-10");
  }

  array_verses.forEach(function (verse) {
    var one_verse_return = bible_gateway_1v_capture2(book, chapter, verse)
    if (one_verse_return != undefined) {
      console.log("one verse return: %s, verse length is %d, for book %s, chapter %s, and verse # ", one_verse_return, one_verse_return.length, book, chapter, verse)
      array_out_passage.push(one_verse_return);
      //console.log("array_out_passage = " + array_out_passage)
    } else {
      console.log("NO verse return !!! %s, for book %s, chapter %s, and verse # ", one_verse_return, book, chapter, verse)
    }

  });

  console.log("array_out_passage = " + array_out_passage)
  return array_out_passage;
}

