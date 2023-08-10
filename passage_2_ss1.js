function passage_2_ss1(p_t, p, r_p) {
  //working on the scripture reading/invocation section of the spreadsheet
  var temp_passage_array = [];
  var my_passage_array = p;
 
  var my_j = 0;
  //p_t is the passage title
  var rows_used_up = 0;
  // curr_row point to exact row to start inserting passage
  var curr_row = r_p;

  let sheet = SpreadsheetApp.getActive().getSheetByName("sermon");
  
  console.log(arguments.callee.name + ": starting row to insert passage = " + curr_row);
  
  //my_passage_array = split_by_chars(passage_array,80)
  temp_passage_array = split_by_line(my_passage_array, 7);
  for (my_j = 0; my_j < temp_passage_array.length; my_j++) {
    console.log(arguments.callee.name + ": scripture reading/invocation passage array to ss = " + temp_passage_array[my_j]);
    
    data = [p_t, temp_passage_array[my_j], Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss')];
    console.log(arguments.callee.name + ": scripture reading data to populate the spreadsheet = " + data);
    sheet.insertRowAfter(curr_row);
    rows_used_up++;
    outerArray = [];//Assign empty array to variable name
    outerArray.push(data);
    sheet.getRange(curr_row + 1, 1, 1, 3).setBackground('white').setFontColor("black").setValues(outerArray);
    curr_row++;
  }
console.log(arguments.callee.name + ": The number of rows used up in ss = " + rows_used_up);
return (rows_used_up)
}
