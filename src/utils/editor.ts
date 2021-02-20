const NUMBER_REG = /^(\d+) /;
const NUMBER_DOT_REG = /^(\d+)\. /;
const NUMBER_ONLY_REG = /^(\d+)$/;
const NUMBER_DOT_ONLY_REG = /^(\d+)\./;

/**
 * exported for testing purposes only
 */
export const getNextLineCharacter = (prevLine: string) => {
  if (prevLine.startsWith('- ')) {
    return '- ';
  } else if (prevLine.startsWith('-')) {
    return '-';
  }

  let numberAtStart = prevLine.match(NUMBER_REG);
  if (typeof numberAtStart !== 'undefined' && numberAtStart !== null) {
    return parseInt(numberAtStart[1]) + 1 + ' ';
  }

  numberAtStart = prevLine.match(NUMBER_DOT_REG);
  if (typeof numberAtStart !== 'undefined' && numberAtStart !== null) {
    return parseInt(numberAtStart[1]) + 1 + '. ';
  }

  numberAtStart = prevLine.match(NUMBER_ONLY_REG);
  if (typeof numberAtStart !== 'undefined' && numberAtStart !== null) {
    return parseInt(numberAtStart[1]) + 1 + '';
  }

  numberAtStart = prevLine.match(NUMBER_DOT_ONLY_REG);
  if (typeof numberAtStart !== 'undefined' && numberAtStart !== null) {
    return parseInt(numberAtStart[1]) + 1 + '.';
  }
};

/**
 * exported for testing purposes only
 * @returns undefined if the new character is not a newline
 */
export const getLocationOfNewNewLine = (
  oldContent: string,
  newContent: string
) => {
  if (newContent.length !== oldContent.length + 1) {
    // if we didn't just add one character
    return;
  }

  // to speed things up, go from the end to the beginning. People probably
  // append to the end more often than the beginning.
  let i = oldContent.length - 1;
  for (; i >= 0; i--) {
    if (newContent[i + 1] !== oldContent[i]) {
      if (newContent[i + 1] === '\n') {
        return i + 1;
      } else {
        return;
      }
    }
  }
};

const splice = (str: string, start: number, toInsert: string) => {
  return str.slice(0, start) + toInsert + str.slice(start);
};

export const massageNewEditorContent = (
  oldContent: string,
  newContent: string
) => {
  // we are just checking if the previous line leads with a dash.
  const locationOfNewLine = getLocationOfNewNewLine(oldContent, newContent);
  if (locationOfNewLine) {
    const lines = oldContent.substring(0, locationOfNewLine).split('\n');
    if (lines && lines.length > 1) {
      const nextChar = getNextLineCharacter(lines[lines.length - 1]);
      if (nextChar) {
        return splice(newContent, locationOfNewLine + 1, nextChar);
      }
    }
  }

  return newContent;
};
