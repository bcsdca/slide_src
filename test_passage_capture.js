function test_passage_capture() {
  //var my_passage = p
  //var my_passage = "psalm 1:1-2"
  //var my_passage = "psalm 98:1-9"
  var my_passage = "Philippians 2:9-11"
  //var my_passage = "psalm 108:1-5"
  // luke 1:1-2, actually has verse 1 and 2 combine, so verse 2 will return nothing
  //var my_passage = "luke 1:1-2"

  //var book = "2tim";
  //var chapter = 1;
  //var verse = 1;
  
  var array_my_passage1 = my_passage.split(" ");
  var book = array_my_passage1[0];
  var array_my_passage2 = array_my_passage1[1].split(":");
  //var chapter = array_my_passage2[0].toString().replace("\n", "");
  var chapter = array_my_passage2[0];
  //there is version # info
  if (array_my_passage2[1] != undefined) {
    var array_my_passage3 = array_my_passage2[1].split("-");
    var from_verse = array_my_passage3[0];
    var to_verse = array_my_passage3[1];
  }
  //there is no version # info, so it is the whole chapter, assuming version 10 is the highest version #
  else {
    var from_verse = 1;
    var to_verse = 10;

  }

  var from_verse_num = Number(from_verse);
  var to_verse_num = Number(to_verse);
  //console.log(typeof from_verse_num)
  //console.log(typeof to_verse_num)
  console.log("book is " + book + ", chapter is " + chapter + ", from verse is " + from_verse_num + ", to verse is " + to_verse_num)

  var array_out_passage = [];
  for (var j = from_verse_num; (j <= to_verse_num); j++) {
    var one_verse = test_bible_gateway_1v_capture(book, chapter, j)
    console.log("one verse return = " + one_verse + " for book " + book + ", chapter " + chapter + ", verse number is " + j)
    if (one_verse != undefined) {
      array_out_passage.push(one_verse);
      //console.log("array_out_passage = " + array_out_passage)
    }

  }
  console.log("Returning raw passage = " + array_out_passage)

  //split_by_chars(array_out_passage,70) //70 characters per page
  //split_by_line(array_out_passage,6) //6 lines per page
  //console.log("Returning passage split up by lines " + split_by_line(array_out_passage,6))
}