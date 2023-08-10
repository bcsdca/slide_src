function test_parse_invocation1() {

  var array_str = [];
  var a0 = [];
  var a1 = [];
  var a2 = [];
  var a3 = [];
  var array_return1 = [];
  var array_return = [];

  var str1 = "Call to worship*: * 以弗所書 Ephesians 1: 2-9";
  var str2 = ",>  Call to worship: 詩篇 Psalm 33:8-12";
  var str3 = ",>  Call to worship: 詩篇 Psalm 98";
  var str4 = ",>  Call to worship: 彼得前書 1 Peter 2:4-10";
  var str5 = ",Call to worship: 詩篇Psalm 34:1-3";
  var str6 = ",>  Call to worship: 彼得前書1 Peter 2:4-10";
  var str7 = ",> Call to Worship :詩篇 Psalm : 146: 6-10";
  var str8 = ",> Call to Worship :詩篇 Psalm 146: 6-10";
  var str9 = ",> Callto worship:  歷代志上 1Chronicles 29:10b,11-13";
  var str10 = ",Callto worship:  歷代志上 1Chronicles 29:10b,11-13";
  var str11 = ",Call to worship:  以弗所書  esphesians 1:3-4; 提摩太後書 2Timothy 2:21";
  var str12 = ",Call to worship:  以弗所書  esphesians 1:3-4; 2:1-2";
  var str13 = ",Call to worship:  以弗所書  esphesians 1:3-4; 2:3";
  var str14 = ",Call to worship: 詩篇 Psalm 66:1-4.";
  var str15 = ",Call  to worship: 詩篇 Psalm,86:5,8-12";


  //array_str.push(str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, str13);
  array_str.push(str15);
  //Logger.log(array_str)


  for (var i = 0; i < array_str.length; i++) {
    var a_temp = array_str[i].split(/Call\s*to\s*worship\s*[*]*[:]/i)
    //for multiple passages split by "；"
    var a_temp1 = a_temp[1].split(/；|;/);
    for (var j = 0; j < a_temp1.length; j++) {

      a0 = a_temp1[j].split(":");
      //normal pattern and there are 2 ":"s in the string
      //Call to worship: 詩篇 Psalm 33:8-12
      if ((a0.length == 2) || (a0.length == 1)) {
        if (a0.length == 2) {
          var verse = a0[1].trim().replace(/[.]+/, "")
        } else {
          var verse = "";
        }

        var a1 = a0[0].replace("*", "").trim()
        //var a2 = a1.split(" ");
        a2 = a1.split(/\s+/);
        //Logger.log("a0 is %s", a0)
        //Logger.log("a1 is %s", a1)
        //Logger.log("a2 is %s and the length of a2 is %d", a2, a2.length)


        if (a2.length == 4) {
          //彼得前書 1 Peter 2:4-10
          var book = a2[0];
          var chapter = a2[3];
          //詩篇 Psalm 33
        } else if (a2.length == 3) {
          var book = a2[0];
          var chapter = a2[2];
          //詩篇 33, someone forgot the specify english name, but it is still ok, supported
        } else if (a2.length == 2) {
          var book = a2[0];
          var chapter = a2[1];
          // a2.length of 1 meant the 2nd passage without the book name, so used the pevious book name
        } else if (a2.length == 1) {
          var chapter = a2[0];
          // a2.length of 0 length is not supported
        } else {
          Logger.log("This invocation passage format1 is not supported %s", array_str[i])
          break;
        }

        //removing all the ascii character from the book, so only chinese name remain
        //詩篇Psalm 34:1-3 returning 詩篇 34:1-3
        var book = book.replace(/[\x00-\x7F]/g, "");
        if (verse == "") {
          var chapter_verse = chapter
        } else {
          var chapter_verse = chapter + ":" + verse
        }
        var return1 = book + " " + chapter_verse
        Logger.log("Invocation passage return1 = %s", return1)
        array_return.push(return1)

      } else {
        Logger.log("This invocation passage format2 is not supported %s", array_str[i])
        break;
      }

      
    }

  }

  Logger.log("array_return = %s", array_return)
  return array_return;
}
