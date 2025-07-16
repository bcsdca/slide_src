function splitVerseIntoABDeepSeekAPI(passage) {
  // Extract verse number and optional suffix (a or b)
  const verseMatch = passage.match(/^(\d+)([aAbB])?/);
  const verseNum = verseMatch ? verseMatch[1] : "";
  const suffix = verseMatch && verseMatch[2] ? verseMatch[2].toLowerCase() : "";

  // Remove leading verse label (e.g., 19a or 19) from the passage for API input
  const cleanPassage = passage.replace(/^\d+[aAbB]?\s*/, "");

  const payload = {
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that splits a Bible verse into meaningful parts labeled 'a' and 'b'. Do not split based only on punctuation. Instead, split based on natural shift in action or thought."
      },
      {
        role: "user",
        content: `Split this verse into two parts ("a" and "b"):\n\n${cleanPassage}\n\nReturn the result as a JSON object like {"a": "...", "b": "..."}.\nIf it cannot be split, return {"a": "${cleanPassage}"}.`
      }
    ],
    temperature: 0.5
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${deepSeekAPIKey}`
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(deepSeekAPIUrl, options);
    const json = JSON.parse(response.getContentText());
    const rawReply = json.choices[0].message.content;

    logMessage(`${getCallStackTrace()}: Raw API reply:\n${rawReply}`);

    const cleanedReply = rawReply.replace(/```[\s\S]*?```/g, match => {
      return match.replace(/```json|```/g, '').trim();
    });

    const obj = JSON.parse(cleanedReply);

    // Case: suffix is 'a' or 'b' and both parts exist
    if (obj.a && obj.b && (suffix === "a" || suffix === "b")) {
      const cleanA = obj.a.replace(/^a\s*/i, "").replace(new RegExp(`^${verseNum}\\s*`), "").trim();
      const cleanB = obj.b.replace(/^b\s*/i, "").replace(new RegExp(`^${verseNum}\\s*`), "").trim();
      const result = suffix === "a"
        ? `${verseNum}a ${cleanA}`
        : `${verseNum}b ${cleanB}`;
      logMessage(`${getCallStackTrace()}: Returning part '${suffix}' only: ${result}`);
      return result;
    }

    // Case: verse can be split but no suffix provided → return full original string
    if (obj.a && obj.b && !suffix) {
      logMessage(`${getCallStackTrace()}: No suffix specified. Returning original passage.`);
      return passage;
    }

    // Case: verse could not be split
    if (obj.a && !obj.b) {
      logMessage(`${getCallStackTrace()}: Verse could not be split. Returning original.`);
      return passage;
    }

    throw new Error("Unexpected format in DeepSeek response.");

  } catch (e) {
    logMessageError(`${getCallStackTrace()}: Failed to parse DeepSeek response: ${e}`);
    return passage;
  }
}
