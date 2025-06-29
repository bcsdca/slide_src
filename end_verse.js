function end_verse(p_c) {
  /**
   * Determines the last verse of a Bible chapter.
   * @param {string} p_c - The book and chapter (e.g., "以弗所書 1").
   * @returns {number} - The last verse number.
   */

  const [book, chapter] = p_c.split(/\s+/); // Destructure the input into book and chapter
  logMessage(`${getCallStackTrace()}: Reading from the book "${book}", chapter "${chapter}"`);

  let lastValidVerse = 0;

  // Loop through verses until an undefined verse is encountered
  for (let i = 1; i < 200; i++) {
    logMessage(`${getCallStackTrace()}: Checking verse ${i} in book "${book}", chapter "${chapter}"`);

    const verseContent = bibleGatewaySingleVerseCapture(book, chapter, i);

    if (verseContent === undefined) {
      logMessage(`${getCallStackTrace()}: Verse ${i} is undefined. Checking if it's truly the end of the chapter by checking the next verse ${i+1}.`);

      // Confirm by checking the next verse
      const nextVerseContent = bibleGatewaySingleVerseCapture(book, chapter, i + 1);

      if (nextVerseContent === undefined) {
        logMessage(`${getCallStackTrace()}: Both verse ${i} and ${i + 1} are undefined. End of chapter detected at verse ${lastValidVerse}.`);
        return lastValidVerse; // Return the last valid verse
      }
    } else {
      logMessage(`${getCallStackTrace()}: Verse ${i} content found: "${verseContent}"`);
      lastValidVerse = i; // Update the last valid verse
    }
  }

  console.error(`${getCallStackTrace()}: Exceeded maximum verse limit without finding the end of chapter.`);
  return lastValidVerse; // Fallback in case the loop completes
}


