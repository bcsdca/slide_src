function get_shape() {

  deck = SlidesApp.openById(sermon_dstId);

  let slides = deck.getSlides();
  //var slideee = slides[16];
  //var elems = slideee.getPageElements();
  var txt = "";
  var slidesLength = deck.getSlides().length;
  for (var i = 0; (i < slidesLength); i++) {
    var elems = slides[i].getPageElements();
    elems.forEach(
      ((el, index) => {
        if (el.getPageElementType() == "SHAPE") {
        //  txt = txt + el.asShape().getText().asString().replace("\n", "");
        txt = el.asShape().getText().asString();
        Logger.log("slide" + i + ": txt = " + txt + ", index = " + index);
        }
        
      })
    );
  }
}
