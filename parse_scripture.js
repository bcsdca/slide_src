function parse_scripture(p) {

  var array_str = [];
  var a0 = [];
  var a1 = [];
  var a2 = [];
  var a3 = [];
  var array_return1 = [];
  var array_return = [];

  var str1 = ",讀經              Scripture Reading    *路加福音** 5:12-14*";
  var str2 = ",讀經              Scripture  Reading   *彼得前書** 1 Peter 2:4-10*";
  var str3 = ",讀經               Scripture  Reading *羅馬書**Romans 10:9-17*"
  var str4 = ",讀經               Scripture  Reading *哥林多前書** 1 Cor. 15:1-11*"
  var str5 = ",讀經              Scripture  Reading   *詩篇** Psalm 98*"
  var str6 = ",讀經               Scripture  Reading *提摩太後書**2 Tim 4:1-6*"
  var str7 = ",讀經              Scripture Reading *路加福音** Luke 17:11-19*"
  var str8 = ",讀經            Scripture Reading *腓立比書** Philippians 2:9-11*"
  var str9 = ",讀經              Scripture Reading    *雅各書** James 1:1-4**；**5:7-8*"
  var str10 = ",讀經               Scripture  Reading *提摩太後書** 1:1-7*"
  var str11 = ",讀經              Scripture  Reading   *創世記** Genesis 24:1*"
  var str12 = ",讀經              Scripture  Reading   *創世記** Genesis 24:1, 25:7-8*"
  var str13 = ",讀經              Scripture  Reading   *馬太福音**Matthew18:15-20*"
  var str14 = ",讀經              Scripture  Reading   *腓利門書**Philemon 8-20**節*"

  //array_str.push(str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, str13);
  //array_str.push(str14);
  //Logger.log(array_str)



  var a_temp = p.split("Reading")
  //for multiple passages split by "；" or ";"
  a0 = a_temp[1].split(/；|;/);
  for (var j = 0; j < a0.length; j++) {
    //1st passage
    if (j == 0) {
      a1 = a0[j].replace("** ", "**").split("*");
      book = a1[1]
      a2 = a1[3].split(":")
      //2:9-11
      verse = a2[1]
      a3 = a2[0].split(" ")
      //1 Peter 2
      if (a3.length == 1) {
        chapter = a3[0]
      } else if (a3.length == 2) {
        chapter = a3[1]
      } else if (a3.length == 3) {
        chapter = a3[2]
      }
      if (verse != undefined) {
        var chapter_verse = chapter + ":" + verse
      } else {
        var chapter_verse = chapter;
      }

      var return1 = book + " " + chapter_verse
      array_return.push(return1)
      Logger.log("1st passage = %s", return1)

      //2nd or 3rd passages
    } else {
      //some more work to do, if there is a different book
      //assuming the same book
      //**5:7-8*
      chapter_verse = a0[j].replaceAll("*", "")
      return1 = book + " " + chapter_verse
      Logger.log("2nd or 3rd and so forth passage = %s", return1)
      array_return.push(return1)
    }

  }

  Logger.log("array_return = %s", array_return)
  return array_return;
}
