function test_splitByRegexp3() {
  str = "um id=&amp;quot;16&amp;quot; /&amp;gt;你們卻說：「不然，我們要騎馬奔走。」所以你們必然奔走。又說：「我們要騎飛快的牲口。」所以追趕你們的也必飛快。";
  
  //var a = str.split(/-(.*)/s);
  //split by 1st "-"
  //var a = str.split(/-(.+)/)
  
  //split by "-", but only takes 2 element
  //var a = str.split('-',2)
  
  var a2 = str.replace(/[^\x00-\x7F]/g, "").trim()
  var a1 = str.replace(/[\x00-\x7F]/g, "").trim()
  
  //1st "-"
  //var a = str.substring(str.indexOf('-')+1)
  //2nd "-"
  //var a = str.substring(str.indexOf('-', str.indexOf('-') + 1) + 1 )
  //myString = myString.substring(myString.indexOf('_')+1)
  console.log(a1)
  //console.log(a1)
  //console.log(a2)
  //console.log(a1)
}
