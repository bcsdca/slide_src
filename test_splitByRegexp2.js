function test_splitByRegexp2() {
  //str = "1aaa-2bbb-3ccc-4ddd 5eee 6fff";
  str = "為了安全起見，我們將於 5/2/23 更新教會 的 Wi-Fi 無線網路密碼。請所有教會領袖和因事奉需要使用 Wi-Fi 無 線網路的志願同工在 5/1/23 下午 5:00 前填寫以下 Google 表格(cec sd.org/wifirequest)。Wi-Fi無線網路密碼將在 5/2發送給所有已批准的 用戶。如有問題，請聯繫唐澤銘 Jason (technology@cec-sd.org)"


  //var a = str.split(/(.+[，])(.+[。])(.+[。])(.+[。])(.+[，])/s);
  a1 = [];
  var a = str.split(/([。]|[，])/);
  for (i = 0; i < a.length; i = i + 2) {
    if (a[i + 1] != undefined) {
      var a_temp = a[i].concat(a[i + 1])
    } else {
      var a_temp = a[i];
    }
    a1.push(a_temp)
  }
  console.log(a1)
  //var a = str.split(/(.*[，])/s);
  //var a = str.split(/(.+[，]|[。])(.+[，]|[。])(.+[，]|[。])(.+[，]|[。])(.+[，]|[。])/s);
  //split by 1st "-"
  //var a = str.split(/-(.+)/)

  //split by "-", but only takes 2 element
  //var a = str.split('-',2)

  //var a2 = a1[0].replace(/[a-z,A-Z]/g, "");

  //1st "-"
  //var a = str.substring(str.indexOf('-')+1)
  //2nd "-"
  //var a = str.substring(str.indexOf('-', str.indexOf('-') + 1) + 1 )
  //myString = myString.substring(myString.indexOf('_')+1)
  //console.log(a)
  //console.log(a1)
  //console.log(a2)
  //console.log(a1)
}
