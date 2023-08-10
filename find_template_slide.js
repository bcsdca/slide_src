function find_template_slide(masterID, template_slide_input, position) {

  // Replace <INSERT_SLIDE_DECK_ID> wih the ID of your 
  // Google Slides presentation.
  //let masterDeckID = "148hLdiJtmuO30zOHEZBkck65fZjrRFIsqxqWEE7wePY";

  //template_slide_input is the targeted search slide
  //my_position is which my_position within the target slide to be search for
  var my_position = position
  var template_slide = template_slide_input;
  //Logger.log("template_slide = " + template_slide);
  template_slide_str = new RegExp(template_slide);
  Logger.log("template_slide_str = " + template_slide_str + "my_position = " + my_position);
  const masterDeckID = masterID

  //my_position is which my_position in the target slide to be search for

  // Open the presentation and get the slides in it.
  try {
    deck = SlidesApp.openById(masterDeckID);
  } catch (err) {
    console.error('create_slide() yielded an error: ' + err);
  }
  let slides = deck.getSlides();

  // The 4th slide is the invocation template that will be duplicated
  // once per row in the spreadsheet.

  var slidesLength = deck.getSlides().length;
  var slidesTitles = deck.getSlides().map(function (slide) { return slide.getPageElements()[0].asShape().getText().asString() });
  //var slidesTitles = deck.getSlides().map(function (slide) { return slide.getPageElements()[my_position].getText().asString() });
  //var slidesTitles = deck.getSlides().map(function (slide) { return slide.getPageElements()[0].getText().asString() });
  //var slidesTitles = deck.getSlides().map(function(slide){return slide.getPageElements().asShape()});
  var slidesIds = deck.getSlides().map(function (slide) { return slide.getObjectId() });
  //Logger.log("slidesTitles: " + slidesTitles + "slidesIds: " + slidesIds + " at my_position = " + my_position);
  Logger.log("slidesTitles: " + slidesTitles);

  //try to find the template slide
  find_it = 0;
  for (var i = 0; (i < slidesLength && find_it == 0); i++) {
    //if (slides[i].getPageElements()[my_position] == null) {
    if (slides[i].getPageElements()[my_position].asShape() == null) {
      continue;
    }
    else if (slides[i].getPageElements()[my_position].asShape().getText().asString().match(template_slide_str)) {
      Logger.log("Find template slide !!! title: " + slides[i].getPageElements()[my_position].asShape().getText().asString() + " page = " + i + ", at the my_position = " + my_position);
      //invo_masterSlide = slides[i];
      find_it = 1;
      return slides[i];
    }
          
  }
  if (find_it == 0) {
    Logger.log("Could not find the template slide = " + template_slide + " at the my_position = " + my_position + " of all the slides");
  }

}

