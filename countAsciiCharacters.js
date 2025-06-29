function countAsciiCharacters(input) {
  let asciiCount = 0;
  for (let i = 0; i < input.length; i++) {
    let charCode = input.charCodeAt(i);
    if (charCode >= 0 && charCode <= 127) {
      asciiCount++;
    }
  }
  return asciiCount;
}
