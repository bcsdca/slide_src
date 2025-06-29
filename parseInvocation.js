function parseInvocation(p) {

  var array_str = [];
  var a0 = [];
  var a1 = [];
  var a2 = [];

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
  var str16 = "Here is the Call to Worship passage.";
  var str17 = "Call to worship: 詩篇 Psalm 86:8-12.,";
  var str18 = "The invocation passage will be:  Call to Worship: 申命記 Deuteronomy 10:12-17";
  var str19 = "*Call to worship: *約伯記* Job 42:1-5*"
  var str20 = "Call to worship: 詩篇 Psalm 100:1-5. Thank you.";
  var str21 = "Call to worship: 歷 代 志 上  I Chronicle 16:23-27";
  var str22 = "Call to worship: 歷代志上  I Chronicle 16:23-27";
  var str23 = "I will use :Call to worship: 詩篇 Psalm 63:1-5";
  var str24 = "Call to worship: 启 示 录 Revelation 15:3-4"


  //array_str.push(str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, str13, str14, str15, str17, str18, str19, str20, str21, str22, str23, str24);
  //array_str.push(str17);

  var array_return2 = [];

  var temp = p.replace(/[*]/g, "").split(/Call\s*to\s*worship\s*[*]*[:]/i)
  var passage = temp[1].split(/；|;/);
  logMessage(`${getCallStackTrace()}: Start working on these Invocation passage = ${JSON.stringify(passage)}`)
  array_return2.push(parsePassage(passage));


  // Using reduce method to convert 2 dimension array array_return2 to 1 dimension array array_return1
  var array_return1 = array_return2.reduce(function (flat, current) {
    return flat.concat(current);
  }, []);
  
  logMessage(`${getCallStackTrace()}: Invocation passage array_return1 = ${JSON.stringify(array_return1)}`)
  return array_return1;

}