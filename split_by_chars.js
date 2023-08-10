//split by number of chars per page, like c(70, for calibri 55 fonts) passing in
//p_in is the invo/scripture array to scan
//mostly used for invo/scripture reading section
//each page on allowed c(70?) characters of verses, doesn't matter how many verses

function split_by_chars(p_in, c) {
  //for each page
  var temp_array = [];
  //for all pages return
  var temp1_array = [];

  var passage_in = p_in
  var m_c_per_page = c;
  var rt_c_per_page = 0;
  for (var i = 0; (i < passage_in.length); i++) {
    rt_c_per_page = rt_c_per_page + passage_in[i].length;
    console.log("This verse " + i + "'s length is " + passage_in[i].length + ", with the content of " + passage_in[i]);
    if (rt_c_per_page < m_c_per_page) {
      temp_array.push(passage_in[i])
      console.log("Putting this verse " + i + ", to the temp array: " + temp_array + ", with the running total chars of " + rt_c_per_page);
    }
    else {
      //this is starting of a new page, after finishing up the last page
      console.log("Passage per page = " + temp_array.join("\n") + ", Number of chars for this page is " + (rt_c_per_page - passage_in[i].length));
      temp1_array.push(temp_array.join("\n"))

      //reset per page info for the next page
      rt_c_per_page = passage_in[i].length;
      temp_array = [];
      temp_array.push(passage_in[i])
      console.log("Starting a new page!!! Accumulating this verse " + i + ", to the array: " + temp_array + ", with the running total chars of " + rt_c_per_page);
    }


  }
  //this is the last page
  temp1_array.push(temp_array.join("\n"))
  console.log("This is passage array return, after splitting all up by chars " + temp1_array );
  return temp1_array
}
