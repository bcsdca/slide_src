function test_parse_sermon_topic() {

  var array_str = [];
  var a0 = [];
  
  var str1 = ",證道              Sermon  *「你們是活石」* *You Are Living Stones*";
  var str2 = ",證道               Sermon  *「教會與傳福音」* *“The Church and Evangelism”*";
  var str3 = ",證道               Sermon  *「**教會與福音」**“**The Church and the Gospel”*"
  var str4 = ",證道              Sermon  *「普世歡騰」*"
  var str5 = ",證道               Sermon  *「教會與真道」* *“The Church and The Truth”*"
  var str6 = ",證道              Sermon  『*恩上加恩』*"
  var str7 = ",證道              Sermon  『*人望高處』*"
  var str8 = ",證道               Sermon  *「**剛強的靈」*"
  var str9 = ",證道              Sermon  『*試煉中的喜樂』*"
  var str10 = ",證道              Sermon  『*你的馬其頓在哪裏？』** “Where Is Your Macedonia?”*"

  array_str.push(str1, str2, str3, str4, str5, str6, str7, str8, str9, str10);
  //array_str.push(str10);
  //Logger.log(array_str)


  for (var i = 0; i < array_str.length; i++) {
    //for multiple sermon top passages split by "；"
    a0 = array_str[i].replace("**", "").split("Sermon");
    //a1 = a0[1].replace("* *", "**").split("**");
    let [start, ...end] = a0[1].replace("* *", "**").split("**");
    if (end != undefined) {
      var end_combine = end.join("");
      var return1 = start.replaceAll("*", "") + "\n" + end_combine.replaceAll("*", "");
    } else {
      var return1 = start.replaceAll("*", "");
    }
    

    Logger.log("return1 = %s", return1)

  }

  return return1
  
}
