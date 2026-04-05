function test_bibleGatewaySingleVerseCapture(book, chapter, verse) {
  /**
   * Captures a single verse from Bible Gateway
   * @param {string} book - The book of the Bible (e.g., "John").
   * @param {number} chapter - The chapter number.
   * @param {number} verse - The verse number.
   * @returns {string} - The verse content in Chinese or nothing is return if verse content not found.
   */

  book = "以賽亞書";
  chapter = 30;
  verse = 21;

  verseReturn = bibleGatewaySingleVerseCapture(book, chapter, verse)
  logMessage(`verse return = ${verseReturn}`);
  
}