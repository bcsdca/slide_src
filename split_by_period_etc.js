//announcement section is passing in and was split by some chinese period etc, 
//and each chunk is added to page
//if it is below certain max characters allowed for each page(c input to this function)
//p_in is the announcement array to scan
//mostly used for announcement section
//robost split up by both "." and "," and also included the split char (4/13/2023)
//var passage_in = p.split(/([。]|[，])/);

function split_by_period_etc(p, c) {
  //for each page
  var temp_array = [];
  //for all pages return
  var temp1_array = [];
  //split the input passage with /。/
  //anno_message_array = end.join(": ").split(/奉獻/);
  //anno_message_array = end.join(": ").split(/。|，|；/);
  //anno_message_array = end.join(": ").split(/。/);
  //var split_char = "。";
  //var split_char = " ";
  
  var split_char = "";
  //var passage_in = p.split(split_char);
  //robost split up by both "." and "," and also included the split char (4/13/2023)
  passage_in = [];
  var a = p.split(/([。]|[，])/);
  for (i = 0; i < a.length; i = i + 2) {
    if (a[i + 1] != undefined) {
      var a_temp = a[i].concat(a[i + 1])
    } else {
      var a_temp = a[i];
    }
    passage_in.push(a_temp)
  }
  //var passage_in = p.split(/([。]|[，])/);
  //var passage_in = p.split(/。|，|、|；/);
  var m_c_per_page = c;
  var rt_c_per_page = 0;
  for (var i = 0; (i < passage_in.length); i++) {
    if (passage_in[i].length != 0) {
      rt_c_per_page = rt_c_per_page + passage_in[i].length;
      console.log(arguments.callee.name + ": This announement chunk " + i + "'s length is " + passage_in[i].length + ", with the content of " + passage_in[i]);
      if (rt_c_per_page < m_c_per_page) {
        temp_array.push(passage_in[i])
        console.log(arguments.callee.name + ": Putting this announement chunk " + i + ", to the temp array: " + temp_array + ", with the running total chars of " + rt_c_per_page);
      }
      else {
        //this is starting of a new page, after finishing up the last page
        console.log(arguments.callee.name + ": Exceeding the max chars for this page = " + m_c_per_page + ", if we add this chunk " + i);
        console.log(arguments.callee.name + ": This is the announcment for this page = " + temp_array.join(split_char) + ", Number of chars for this page is " + (rt_c_per_page - passage_in[i].length));
        temp1_array.push(temp_array.join(split_char))

        //reset per page info for the next page
        rt_c_per_page = passage_in[i].length;
        temp_array = [];
        temp_array.push(passage_in[i].trim())
        console.log(arguments.callee.name + ": Starting a new page!!! Putting this chunk " + i + ", to the array: " + temp_array + ", with the running total chars of " + rt_c_per_page);
      }
    }

  }
  //this is the last page
  temp1_array.push(temp_array.join(split_char))
  console.log(arguments.callee.name + ": This are announcment pages return, after splitting all up by the special chars and gather up by the chunks " + temp1_array);
  return temp1_array
}
