//determine the end verse of a book
//passing in "以弗所書 1
//returning the end verse number

function end_verse(p_c) {
  var my_passage = p_c
  //var my_passage = "以弗所書 1"
  var a = [];

  a = my_passage.split(/\s+/);
  var book = a[0];
  var chapter = a[1]

  console.log(arguments.callee.name + ": Reading from the book of " + book + ", and chapter of " + chapter)
  var find_it = false
  //assuming the longest book don't have 200 verses
  for (i = 1; ((i < 200) && (!find_it)); i++) {
    var one_verse_return = bible_gateway_1v_capture2(book, chapter, i)
    if (one_verse_return == undefined) {
      console.log(arguments.callee.name + ": Done, the end verse is %d for the chapter %d of this book %s !!!", i, chapter, book,);
      find_it = true;
      return i-1;
    } else {
      console.log(arguments.callee.name + ": The verse is \"%s\" for verse # %d of the chapter %d for the book %s", one_verse_return, i, chapter, book,);
    }

  }
  
}

