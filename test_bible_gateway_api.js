//removing "（細拉）" before return (1/5/2023)
//taking care of the "-" in 使徒行傳 8:26 (3/6/2023)

function test_bible_gateway_api() {

  //this function only allow single verse capture
  //var my_book = "詩篇";
  //var my_chapter = 98;
  //var my_verse = 2;
  var my_book = "使徒行傳";
  var my_chapter = 8;
  var my_verse = 26;
  //var my_book = b;
  //var my_chapter = c;
  //var my_verse = v;
  //console.log("Entering the bible gateway 1v capture routine..");
  //var url = "https://www.biblegateway.com/passage/?search=psalms+96:6&version=CUVMPT";
  var url = "https://www.biblegateway.com/passage/?search=" + my_book + "+" + my_chapter + ":" + my_verse + "&version=CUVMPT";
  console.log("Bible gateway search url is " + url);

  var response = UrlFetchApp.fetch(url);
  var str = response.getContentText();

  console.log("str = " + str);
  
  //<title>使徒行傳 8:26 CUVMPT - 腓利傳道於埃塞俄比亞的太監 - Bible Gateway</title>
  //look behind "?<=" and look back "?="
  //const titleRegex = /(?<=<title>.*?CUVMPT -).*?(?=Bible Gateway<\/title>)/gi;
  const titleRegex = /(?<=<title>.*CUVMPT -).*(?=Bible Gateway<\/title>)/gi;
  var title = str.match(titleRegex);
  var title1 = title[0].trim()
  console.log("title1 = " + title1);
  console.log("title1 length = " + title1.length);

  //<meta name="description" content="勸民歌頌耶和華之慈愛救恩 - 一篇詩。" />
  const descriptionContentRegex = /(?<=<meta name="twitter:description" content=").*(?=" \/>)/gi;
  var descriptionContent = str.match(descriptionContentRegex);
  var descriptionContent1 = descriptionContent[0].trim()
  console.log("descriptionContent1 = " + descriptionContent1);
  console.log("descriptionContent1 length = " + descriptionContent1.length);

  //<meta property="og:description" content="腓利傳道於埃塞俄比亞的太監 - 有主的一個使者對腓利說：「起來，向南走，往那從耶路撒冷下加沙的路上去！」那路是曠野。"/>
  //look behind "?<=" and look back "?="
  const verseRegex = /(?<=<meta property=\"og:description" content=\").*(?=\"\/>)/gi;

  var verse = str.match(verseRegex);
  var verse1 = verse[0].trim()
  //const teamNamePass1 = /<span class=\"long\">([\s\S]*?)<\/span>/gi;
  //const teamNamePass2 = /(?<=<span class=\"long\">).*?(?=<\/span>)/gi;

  console.log("verse1 = " + verse1);

  if (title1.length > 2) {
    var verse2 = verse1.split(descriptionContent1)
    var verseReturn = verse2[1].trim()
  } else {
    var verseReturn = verse1
  }
  console.log("verse return = " + verseReturn);

}

