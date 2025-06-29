function breakDownVerses(v) {
  //var v = "1,3,5-7,10";
  //var v = "1,3";
  //var v = "3-10";
  //var v = "10b,11-13"

  //a1 is all the individual verse separated by "," or "，"
  //var a1 = v.split(",");
  var a1 = v.split(/，|,/);
  
  var array_verses = [];
  for (var j = 0; (j < a1.length); j++) {
    //a2 is all the verses join by "-"
    var a2 = a1[j].split("-")
    //a2 just a single verse
    if (a2.length == 1) {
      //array_verses.push(Number(a1[j]))
      //verse maybe 10b, can't use Number
      array_verses.push((a1[j]))
    } else {
      //a2 has "from" and "to" verse (5-7)
      for (var i = Number(a2[0]); (i <= Number(a2[1])); i++) {
        array_verses.push(i)
      }
    }
  }
  logMessage(`${getCallStackTrace()} : array_verses =  ${JSON.stringify(array_verses)}`)
  return array_verses
}
