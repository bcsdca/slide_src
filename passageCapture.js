function passageCapture(p) {
  var my_passage = p

  //taking care of situation "2tim 1: 1-7"
  const [first, ...rest] = my_passage.split(" ");
  const remainder = rest.join("");

  var array_out_passage = [];
  //var ran_out = false;

  var book = first;
  var array_my_passage2 = remainder.split(":");

  var chapter = array_my_passage2[0].replace(/\d*\D+/, "");

  if (array_my_passage2[1] != undefined) {
    var array_verses = breakDownVerses(array_my_passage2[1]);
  }
  //there is no verse # info, so it is the whole chapter, find the last verse #
  else {
    logMessage(`${getCallStackTrace()}: No verse info found !!!`)
    var book_chapter = book + " " + chapter;
    var last_verse = end_verse(book_chapter);
    var verse = "1" + "-" + last_verse
    var array_verses = breakDownVerses(verse);
  }

  logMessage(`${getCallStackTrace()}: Reading from the book = ${book}, chapter = ${chapter}, array_verses = ${JSON.stringify(array_verses)}`)

  for (let i = 0; i < array_verses.length; i++) {
    const verse = array_verses[i];
    let one_verse_return = bibleGatewaySingleVerseCapture(book, chapter, verse);
    const hasLetterAfterNumber = /^\d+[a-zA-Z]/.test(one_verse_return);

    if (one_verse_return === undefined) {
      logMessageError(`${getCallStackTrace()}: NO verse return!!! one verse return = ${one_verse_return}, for book = ${book}, chapter = ${chapter}, verse = ${verse}`);
      continue;
      //partial verse condition
    } else if (hasLetterAfterNumber) {
      //partialVerseReturn = splitVerseIntoAB(one_verse_return);
      partialVerseReturn = splitVerseIntoABDeepSeekAPI(one_verse_return);
      array_out_passage.push(partialVerseReturn);
      //full verse
    } else {
      // Fallback if no punctuation match — use full string
      array_out_passage.push(one_verse_return);
    }
  }
 
logMessage(`${getCallStackTrace()}: Returning array_out_passage = ${array_out_passage}`)
return array_out_passage;

}

