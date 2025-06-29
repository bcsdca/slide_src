function find_title_slide(slide_id, title_input) {
  var title = title_input;
  //var title_str = new RegExp(title);
  deck = SlidesApp.openById(slide_id);

  let slides = deck.getSlides();
  //var slideee = slides[16];
  //var elems = slideee.getPageElements();
  var txt = "";
  find_it = 0;
  var slidesLength = deck.getSlides().length;
  for (var i = 0; ((i < slidesLength && find_it == 0)); i++) {
    var elems = slides[i].getPageElements();
    elems.forEach(
      ((el, index) => {
        if (el.getPageElementType() == "SHAPE") {
          txt = el.asShape().getText().asString().replace("\n", "");
          //txt = el.asShape().getText().asString();
          //next line is for debug for not find the slides
          //Logger.log("slide" + i + ": txt = " + txt + ", Looking for title_str " + title + " at index = " + index);
          //if (txt.match(title_str)) {
          if (txt === title) {
            find_it = 1;
            logMessage(getCallStackTrace() + ": Found it!!! slide=" + i + ": title_str = " + txt + " at index = " + index);
            //return slides[i];
          }

        }

      })
    )
    if (find_it == 1) {
      return slides[i];
    }
  }
  if (find_it == 0) {
    logMessageError(getCallStackTrace() + ": Sorry, can't find title_str \"%s\" on all slides !!! ", title);
  }

}
