function parse_invocation(i) {

  var array_str = [];
  var a0 = [];
  var a2 = [];

  //var str1 = "Call to worship*: * 以弗所書 Ephesians 1: 2-9";
  //var str2 = ",>  Call to worship: 詩篇 Psalm 33:8-12";
  //var str3 = ",>  Call to worship: 詩篇 Psalm 98";
  //var str4 = ",>  Call to worship: 彼得前書 1 Peter 2:4-10";

  //array_str.push(str1, str2, str3, str4, str5, str6, str7, str8, str9, str10);
  //array_str.push(str1, str2, str3, str4);
  //array_str.push(str3);
  //array_str.push(str1,str2,str3,str4);
  //Logger.log(array_str)

  a0 = i.split(":");
  //normal pattern and there are 2 ":"s in the string
  //Call to worship: 詩篇 Psalm 33:8-12
  if (a0.length == 3) {
    verse = a0[2].trim()
    var a1 = a0[1].replace("*", "").trim()
    //a2 = a1.split(" ");
    //take care sometimes may not be " ", but some white spaces
    //sarah's invocation on 3/22/2023
    a2 = a1.split(/\s+/);
    //Logger.log("a0 is %s and the length of a0 is %d", a0, a0.length)
    //Logger.log("a1 is %s and the length of a1 is %d", a1, a1.length)
    //Logger.log("a2 is %s and the length of a2 is %d", a2, a2.length)

    if (a2.length == 4) {
      //彼得前書 1 Peter 2:4-10
      book = a2[0];
      chapter = a2[3];
      //詩篇 Psalm 33
    } else if (a2.length == 3) {
      book = a2[0];
      chapter = a2[2];
      //詩篇 33, someone forgot the specify english name, but it is still ok, supported
    } else if (a2.length == 2) {
      book = a2[0];
      chapter = a2[1];
      // a2.length of 1 or 0 length is not supported
    } else {
      Logger.log("This invocation passage format1 is not supported %s", i)
      Logger.log(a2)
    }

    //removing all the ascii character from the book, so only chinese name remain
    //詩篇Psalm 34:1-3 returning 詩篇 34:1-3
    book = book.replace(/[\x00-\x7F]/g, "");
    var chapter_verse = chapter + ":" + verse
    var return1 = book + " " + chapter_verse
    Logger.log("Invocation passage return = %s", return1)

    //there is only 1 ":" in the string, no verse number info
    //"Call to worship: 詩篇 Psalm 98"
  } else if (a0.length == 2) {

    a2 = a0[1].trim().split(" ");
    book = a2[0];
    chapter = a2[2];
    var return1 = book + " " + chapter
    Logger.log("Invocation passage return = %s", return1)
  } else {
    Logger.log("This invocation passage format2 is not supported %s", i)
  }

  return return1;

}
