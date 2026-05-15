function paginateVersesToSlides(versesArray, language) {

  if (!Array.isArray(versesArray) || versesArray.length === 0) {
    logMessage(`${getCallStackTrace()}: ❌ Invalid or empty input`);
    return [];
  }

  const lang = (language || "chinese").toLowerCase();
  const config = SLIDE_CONFIG[lang];

  if (!config) {
    logMessageError(`${getCallStackTrace()}: ❌ Unsupported language: ${lang}`);
    return [];
  }

  const { charsPerLine, maxLines } = config;

  const slides = [];
  let currentSlide = [];
  let currentLineCount = 0;

  for (let i = 0; i < versesArray.length; i++) {

    let verse = versesArray[i];
    let totalLines = Math.ceil(verse.length / charsPerLine);

    logMessage(
      `${getCallStackTrace()}: Verse ${i}, length=${verse.length}, totalLines=${totalLines}`
    );

    // =========================
    // CASE 1: Verse fits within one slide
    // =========================
    if (totalLines <= maxLines) {

      if (currentLineCount + totalLines <= maxLines) {

        currentSlide.push(verse);
        currentLineCount += totalLines;

        logMessage(
          `${getCallStackTrace()}: ➕ Added verse ${i}, running line count = ${currentLineCount}`
        );

      } else {

        // finalize current slide
        logMessage(
          `${getCallStackTrace()}: 📄 Finalizing slide:\n${currentSlide.join("\n")}\n with line count = ${currentLineCount}`
        );

        slides.push(currentSlide.join("\n"));

        // start new slide
        currentSlide = [verse];
        currentLineCount = totalLines;

        logMessage(
          `${getCallStackTrace()}: 🆕 New slide started with verse ${i}, running line count = ${currentLineCount}`
        );
      }
    }

    // =========================
    // CASE 2: Verse too long → split across slides
    // =========================
    else {

      logMessage(
        `${getCallStackTrace()}: ⚠️ Verse ${i} exceeds one slide, splitting required`
      );

      // 🔥 NEW: force new slide before splitting
      if (currentSlide.length > 0) {
        logMessage(`${getCallStackTrace()}: ⚠️ Starting new slide for long verse`);

        slides.push(currentSlide.join("\n"));

        currentSlide = [];
        currentLineCount = 0;
      }

      let remainingText = verse;

      while (remainingText.length > 0) {

        const maxCharsThisSlide = maxLines * charsPerLine;

        const chunk = splitTextByMaxChars(
          remainingText,
          maxCharsThisSlide,
          lang
        );

        currentSlide.push(chunk);

        const usedLines = Math.ceil(chunk.length / charsPerLine);
        currentLineCount = usedLines;

        logMessage(
          `${getCallStackTrace()}: ✂️ Split chunk added (chars=${chunk.length}, lines=${usedLines})`
        );

        remainingText = remainingText.substring(chunk.length);

        if (lang === "english") {
          remainingText = remainingText.trimStart();
        }

        // finalize slide immediately after chunk
        logMessage(`${getCallStackTrace()}: 📄 Finalizing split slide`);

        slides.push(currentSlide.join("\n"));

        currentSlide = [];
        currentLineCount = 0;
      }
    }
  }

  // =========================
  // Final slide
  // =========================
  if (currentSlide.length > 0) {

    logMessage(
      `${getCallStackTrace()}: 📄 Final slide:\n${currentSlide.join("\n")}\nLines=${currentLineCount}`
    );

    slides.push(currentSlide.join("\n"));
  }

  logMessage(
    `${getCallStackTrace()}: ✅ Pagination complete. Total slides=${slides.length} (language=${lang})`
  );

  return slides;
}

function splitTextByMaxChars(text, maxChars, language) {

  if (text.length <= maxChars) {
    return text;
  }

  // Chinese → split freely
  if (language === "chinese") {
    return text.substring(0, maxChars);
  }

  // English → avoid breaking words
  let slice = text.substring(0, maxChars);

  const lastSpaceIndex = slice.lastIndexOf(" ");

  if (lastSpaceIndex > 0) {
    return slice.substring(0, lastSpaceIndex);
  }

  // fallback (no space found)
  return slice;
}

