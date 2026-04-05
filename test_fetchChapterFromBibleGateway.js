function test_fetchChapterFromBibleGateway() {
  book = "以賽亞書";
  chapter = 30;
  expectedVerse = 21;
  verseReturn = fetchChapterFromBibleGateway(book, chapter, expectedVerse)
  logMessage(`versReturn = ${JSON.stringify(verseReturn, null, 2)}`);
}
