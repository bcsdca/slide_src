function passage_2_ss(p_t,p) {
      //working on the scripture reading section of the spreadsheet
      var temp_passage_array = [];
      var my_passage_array = p;
      var my_i = 0;
      var my_j = 0;
      //p_t is the passage title
      var rows_used_up = 0;
            
      let sheet = SpreadsheetApp.getActive().getSheetByName("sermon");
      let dataRange = SpreadsheetApp.getActive().getSheetByName("sermon").getDataRange();
      let sheetContents = dataRange.getValues();
      for (var my_i = 0; (my_i < sheetContents.length); my_i++) {
        if (sheetContents[my_i].toString().match(/TITLE_SCRIPTURE_READING/)) {
          row_TITLE_SCRIPTURE_READING = my_i + 1;
          Logger.log("row_TITLE_SCRIPTURE_READING = " + row_TITLE_SCRIPTURE_READING);
          var curr_row = row_TITLE_SCRIPTURE_READING;
          //my_passage_array = split_by_chars(passage_array,80)
          temp_passage_array = split_by_line(my_passage_array, 6);
          for (my_j = 0; my_j < temp_passage_array.length; my_j++) {
            console.log("scripture reading passage array to ss = " + temp_passage_array[my_j]);
            //data = [array_scripture_reading_msg[1].trim(), temp_passage_array[my_j], Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss')];
            data = [p_t, temp_passage_array[my_j], Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss')];
            Logger.log("scripture reading data to propulate the spreadsheet = " + data);
            sheet.insertRowAfter(curr_row);
            rows_used_up++;
            outerArray = [];//Assign empty array to variable name
            outerArray.push(data);
            sheet.getRange(curr_row + 1, 1, 1, 3).setBackground('white').setFontColor("black").setValues(outerArray);
            curr_row++;
          }
        }
      }
      Logger.log("The number of rows used up in ss = " + rows_used_up);
      return (rows_used_up)
    }
