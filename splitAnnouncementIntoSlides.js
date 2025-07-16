function splitAnnouncementIntoSlides(announcement) {
  const resultSlides = [];
  const currentChunks = [];

  let currentCharCount = 0;
  let cleanAnnouncement = cleanUpExtraSpaces(announcement);

  const chunks = (
    cleanAnnouncement.split(/([。？，、；,])/)
      .reduce((acc, val, idx, arr) => {
        if (idx % 2 === 0) {
          const next = arr[idx + 1] || "";
          acc.push(val + next);
        }
        return acc;
      }, [])
  ).filter(chunk => chunk.trim().length > 0);

  logMessageError(`${getCallStackTrace()}: 💬 Cleaned Chunks = ${JSON.stringify(chunks, null, 2)}`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk.trim()) continue;

    const asciiCount = countAsciiCharacters(chunk);
    const effectiveCount = chunk.length - asciiCount + (asciiCount * 5) / 8;

    logMessageError(`${getCallStackTrace()}: 📦 Chunk ${i + 1}: "${chunk.trim()}"`);
    logMessageError(`${getCallStackTrace()}: 🔢 Length = ${chunk.length}, ASCII = ${asciiCount}, Effective = ${effectiveCount}`);
    logMessageError(`${getCallStackTrace()}: 📊 Running total if added = ${currentCharCount + effectiveCount} (Limit = ${maxEffectiveChars})`);

    if (currentCharCount + effectiveCount > maxEffectiveChars && currentChunks.length > 0) {
      const slideText = currentChunks.join("");
      logMessageError(`${getCallStackTrace()}: 🚨 Exceeds max chars. Committing current slide.`);
      logMessageError(`${getCallStackTrace()}: 📝 Slide content: "${slideText}"`);
      logMessageError(`${getCallStackTrace()}: 🔢 Slide char count: ${currentCharCount}`);
      resultSlides.push(slideText);
      currentChunks.length = 0;
      currentCharCount = 0;
    }

    currentChunks.push(chunk.trim());
    currentCharCount += effectiveCount;
  }

  // Final slide
  if (currentChunks.length > 0) {
    const finalSlideText = currentChunks.join("");
    logMessageError(`${getCallStackTrace()}: ✅ Final slide committed`);
    logMessageError(`${getCallStackTrace()}: 📝 Slide content: "${finalSlideText}"`);
    logMessageError(`${getCallStackTrace()}: 🔢 Slide char count: ${currentCharCount}`);
    resultSlides.push(finalSlideText);
  }
  
  logMessageError(`${getCallStackTrace()}: resultSlides return = ${JSON.stringify(resultSlides, null, 2)}`);
  return resultSlides;
}


function countAsciiCharacters(str) {
  return (str.match(/[\x00-\x7F]/g) || []).length;
}

function cleanUpExtraSpaces(text) {
  // Remove multiple spaces between Chinese characters or words
  return text
    .replace(/([\u4E00-\u9FFF])\s+([\u4E00-\u9FFF])/g, '$1$2')  // Chinese char space fix
    //.replace(/([\u4E00-\u9FFF])\s+([a-zA-Z0-9])/g, '$1$2')      // Chinese + ASCII (start)
    //.replace(/([a-zA-Z0-9])\s+([\u4E00-\u9FFF])/g, '$1$2')      // ASCII + Chinese (end)
    .replace(/\s{2,}/g, ' ')                                     // Normalize multiple spaces
    .trim();
}


