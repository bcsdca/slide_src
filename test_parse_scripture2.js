function test_parse_scripture2() {

  var array_str = [];
  var a0 = [];
  var a1 = [];
  var a2 = [];
  var a3 = [];
  var a4 = [];
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
  var str12 = ",讀經              Scripture  Reading   *創世記** Genesis 24:1; 25:7-8*"
  var str13 = ",讀經              Scripture  Reading   *馬太福音**Matthew18:15-20*"
  //var str14 = ",讀經               Scripture  Reading *使徒行傳** Acts 8:26-40*"
  var str14 = ",讀經               Scripture  Reading *使徒行傳** Acts 8:26*"
  var str15 = ",讀經               Scripture  Reading *使徒行傳** Acts 8:26*; *雅各書** James 1:1-4**"
  var str16 = ",讀經              Scripture  Reading   *腓利門書**Philemon 8-20**節*"
  var str17 = ",讀經               Scripture  Reading *提摩太前書**1 Tim 3:1-7*"
  var str18 = ",讀經              Scripture  Reading   *歌羅西書** Col 1:24-29; *歌羅西書** Col 2:1-5*"
  var str19 = ",讀經              Scripture  Reading   *歌羅西書** Col 1:24-2:5*"
  var str20 = ",讀經              Scripture Reading   *雅各書**4**:1-10 (James 4:1-10)*,"

  //array_str.push(str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, str13, str14, str15);
  array_str.push(str20);
  //Logger.log(array_str)


  for (var i = 0; i < array_str.length; i++) {
    //replace "**" with a space for a condition like this
    //Scripture  Reading   *馬太福音**Matthew18:15-20*"
    var a_temp = array_str[i].replace(/[(].*[)]/, "").replace(/[**]/g, " ").replace(/[*]/g, "").split("Reading")
    //for multiple passages split by "；"
    var a_temp1 = a_temp[1].replace(",", "").trim().split(/；|;/);
    //below dont working because of these special char "；"
    //var a_temp1 = a_temp[1].split(/\s*[;]\s*/);
    for (var j = 0; j < a_temp1.length; j++) {

      a0 = a_temp1[j].split(":");
      //normally and there should be only one ":"s or none in the scripture reading string
      //only invocation has two ":" in invocation, Call to worship: 詩篇 Psalm 33:8-12
      //invocation is not using this routine, it has its own routine
      if ((a0.length == 2) || (a0.length == 1)) {
        if (a0.length == 2) {
          //replacing any training period with nothing 4/13/2023
          var verse = a0[1].trim().replace(/[.]+/, "")
          //var verse = a0[1].trim()
        } else {
          var verse = "";
        }
        //remove any ascii
        var a1 = a0[0].replace(/[a-z,A-Z]/g, "").trim()
        //var a2 = a1.split(" ");
        a2 = a1.split(/\s+/);
        //Logger.log("a0 is %s", a0)
        //Logger.log("a1 is %s", a1)
        //Logger.log("a2 is %s and the length of a2 is %d", a2, a2.length)

        //take care of this single chapter book situation 
        //讀經              Scripture  Reading   腓利門書Philemon 8-20節
        if (a2[0].match(/腓利門書|約翰二書|約翰三書|猶大書|俄巴底亞書/) && (a0.length == 1)) {
          var book = a2[0];
          var chapter = 1;
          var verse = a2[1]
        } else if (a2.length == 4) {
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
          console.log(arguments.callee.name + " This scripture reading passage format1 is not supported %s", a_temp1[j])
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
        console.log(arguments.callee.name + " Scripture reading passage return1 = %s", return1)
        array_return.push(return1)
      } else if (a0.length == 3) {
        // 2 ":" in this special case, scripture span across 2 chapter like below
        //",讀經              Scripture  Reading   *歌羅西書** Col 1:24-2:5*"
        a3 = a_temp1[j].split("-");
        var frm = a3[0].split(":");
        a4 = frm[0].trim().split(/\s+/);
        var book = a4[0].replace(/[\x00-\x7F]/g, "");
        var chapter = a4[a4.length - 1]
        var frm_start_verse = frm[1];
        var book_chapter = book + " " + chapter;
        var frm_end_verse = end_verse(book_chapter);
        var verse = frm_start_verse + "-" + frm_end_verse;
        var chapter_verse = chapter + ":" + verse
        var return1 = book + " " + chapter_verse
        console.log(arguments.callee.name + " Scripture reading passage return1 = %s", return1)
        array_return.push(return1)

        var to = a3[1].trim().split(":");
        var chapter = to[0]
        var to_start_verse = 1;
        var to_end_verse = to[1];
        var verse = to_start_verse + "-" + to_end_verse;
        var chapter_verse = chapter + ":" + verse
        var return1 = book + " " + chapter_verse
        console.log(arguments.callee.name + " Scripture reading passage return1 = %s", return1)
        array_return.push(return1)
      } else {
        //more than two ":" in the scripture reading
        console.log(arguments.callee.name + " This scripture passage with more than 2 \":\" is not supported %s", a_temp1[j])
        break;
      }


    }

  }

  console.log(arguments.callee.name + " Scripture reading passage array_return from parse_scripture function = %s", array_return)
  return array_return;
}
