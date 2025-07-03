//used in populateWorshipTab function
//max # of characters per announcement page for calibri 50 fonts, effective # based on ascii count as 3/4 of the chinese char
//changed it to 130 from 132 on 9/21/2024
//changed it to 124 on 9/28/2024
//changed it to 129 on 10/4/2024
//changed it to 124 on 10/18/2024 for max characters if 99% are chinese chars
var max_c_per_anno_page = 124; //max # of characters per announcement page for calibri 50 fonts, effective # based on ascii count as 3/4 of the chinese char

//used by splitByLine function
//assuming 18 chars/line for calibri 55 fonts
//for each page
var chars_per_line = 18; //"1 當烏西雅王崩的那年，我見主坐在高高的寶座上，他的衣裳垂下，遮滿聖殿。" will actually take up 3 lines in google slide, even though the estimate is 2 lines, but this 3 lines after download as ppt, it will become 2 lines, same size 52 fonts
//var chars_per_line = 17;
const maxLinePerSlide = 7; //max # of line per sldie for calibri 50 fonts, mainly for scripture reading slide, used in splitByLine function

var logBuffer = []; //used by logMessage, logMessageError, flushLogSheet

//used by createFellowshipSlide
const fellowshipSrcId = "1lyFUIehcL3SdlagvWfXulTYu7FEZ5nN7hNYA5Yq1T0w"; 

//used by createPassageSlide
const passage_srcid = "1mPDpbvcSzDRXZ_GY7RW-28NjOrMEiuWw3LMMZuzu7WU";

//used by createWorshipSlide
const worshipSrcId = "1DtopxwBKXJL-TwCIjYsB6EsgcYi6ULKh7oMIfZjp7kE"; //2025

