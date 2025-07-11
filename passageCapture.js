//fixing extra space in invocation passages 以弗所書 Ephesians 1: 2-9 (1/15/2023)
//passing in chinese book name instead of english 以弗所書 1: 2-9 (1/21/2023)
//passing in chinese book name instead of english 創世記 24:1 (1/21/2023)
//passing in no space between "Matthew18"  馬太福音  Matthew18:15-20(2/17/2023)
// 傳道書 Ecclesiastes 3:11
// no for loop from_verse to to_verse
// 傳道書 Ecclesiastes 3:1,3,5-8,11

function passageCapture(p) {
  var my_passage = p
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
  //var my_passage = "雅各書 4:1-10"
  //var my_passage = "詩篇 92:1-5,8"


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
    const verseStr = verse.toString().toLowerCase();
    let one_verse_return = bibleGatewaySingleVerseCapture(book, chapter, verse);

    if (one_verse_return !== undefined) {
      if (verseStr.includes("a") || verseStr.includes("b")) {
        // Match: part1 (with optional trailing punctuation), part2 (rest)
        const match = one_verse_return.match(/^(.+?[,.;:!?。，])(.*)$/); //lazy match, 1st occurence of the punctuation mark
        //const match = one_verse_return.match(/^([^,.;:!?。，]+[,.!?;:，。]?)(.*)$/);

        if (match) {
          if (verseStr.includes("a")) {
            one_verse_return = match[1].trim();  // First part + punctuation
            logMessage(`${getCallStackTrace()}: one verse return (1st part) = ${one_verse_return}, book = ${book}, chapter = ${chapter}, verse = ${verse}`);
          } else if (verseStr.includes("b")) {
            one_verse_return = match[2].trim();  // Second part
            logMessage(`${getCallStackTrace()}: one verse return (2nd part) = ${one_verse_return}, book = ${book}, chapter = ${chapter}, verse = ${verse}`);
          }
        } else {
          // Fallback if no punctuation match — use full string
          one_verse_return = one_verse_return.trim();
        }
      }

      logMessage(`${getCallStackTrace()}: one verse return = ${one_verse_return}, book = ${book}, chapter = ${chapter}, verse = ${verse}`);
      array_out_passage.push(one_verse_return);

    } else {
      logMessageError(`${getCallStackTrace()}: NO verse return!!! one verse return = ${one_verse_return}, for book = ${book}, chapter = ${chapter}, verse = ${verse}`);
    }
  }

  logMessage(`${getCallStackTrace()}: Returning array_out_passage = ${array_out_passage}`)
  return array_out_passage;

}

