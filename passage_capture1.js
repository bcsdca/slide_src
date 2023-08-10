//fixing extra space in invocation passages 以弗所書 Ephesians 1: 2-9 (1/15/2023)
//passing in chinese book name instead of english 以弗所書 1: 2-9 (1/21/2023)
//passing in chinese book name instead of english 創世記 24:1 (1/21/2023)
//passing in no space between "Matthew18"  馬太福音  Matthew18:15-20(2/17/2023)
//using bible_gateway_1v_capture1 "taking care of the "-" in 使徒行傳 8:26" (3/5/2023)

function passage_capture1(p) {
  var my_passage = p
  //var my_passage = "以弗所書 1:2-9"
  //var my_passage = "馬太福音  Matthew18:15-20"
  //var my_passage = "2tim 1:1-7"

  //var book = "2tim";
  //var chapter = 1;
  //var verse = 1;

  //taking care of situation "2tim 1: 1-7"
  const [first, ...rest] = my_passage.split(" ");
  const remainder = rest.join("");

  var book = first;
  var array_my_passage2 = remainder.split(":");
  //var chapter = array_my_passage2[0].toString().replace("\n", "");
  //var chapter = array_my_passage2[0];
  //no space between "Matthew18"  馬太福音  Matthew18:15-20(2/17/2023)
  var chapter = array_my_passage2[0].replace(/[a-z,A-Z]*/, "");
  //there is version # info
  if (array_my_passage2[1] != undefined) {
    var array_my_passage3 = array_my_passage2[1].split("-");
    var from_verse = array_my_passage3[0];
    if (array_my_passage3[1] != undefined) {
      var to_verse = array_my_passage3[1];
    } else {
      //there is no end verse, so only one verse will be read, the start verse
      to_verse = from_verse;
    }
  }
  //there is no version # info, so it is the whole chapter, assuming version 10 is the highest version #
  else {
    var from_verse = 1;
    var to_verse = 10;

  }

  var from_verse_num = Number(from_verse);
  var to_verse_num = Number(to_verse);

  console.log("book is " + book + ", chapter is " + chapter + ", from verse is " + from_verse_num + ", to verse is " + to_verse_num)

  var array_out_passage = [];
  for (var j = from_verse_num; (j <= to_verse_num); j++) {
    var one_verse = bible_gateway_1v_capture1(book, chapter, j)
    if (one_verse != undefined) {
      console.log("verse return: %s, verse length is %s, for book %s, chapter %s, and verse # ", one_verse, one_verse.length, book, chapter, j)
      array_out_passage.push(one_verse);
      console.log("array_out_passage = " + array_out_passage)
    }

  }
  return array_out_passage;
}

