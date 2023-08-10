function fix_p(p_in) {
  //p_in = "1 Cor 15:1-11"
  //p_in = "James 15:1-11"
  //p_in = "5:7-8"
  //p_in = "Psalm 98"


  if (p_in.match(":")) {
    //there is verse info
    let [b, ...verse] = p_in.split(':');
    //console.log("b = %s, and verse = %s", b, verse)
    var b1 = b.split(" ");
    //console.log("b1 = %d", b1.length)
    
    if (b1.length != 1) {
      if (b1.length == 3) {
        // fixing "1 Cor 15"
        book = b1[0] + b1[1]
        chapter = b1[2]
      }
      else {
        book = b1[0]
        chapter = b1[1]
      }
      p = book + " " + chapter + ":" + verse
      console.log("Fixed passage with book name and chapter = " + p);
      return p
    }
    else {
      //nothing to fix
      p = p_in;
      console.log("Returning the same passage info = " + p);
      return p
    }
  }
  else {
    // there is not verse info, nothing to fix
    p = p_in;
    console.log("Returning the same passage info = " + p);
    return p
  }

}
