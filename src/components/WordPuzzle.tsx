import { useCallback, useEffect, useState } from "react";

interface Design {
  markedBackgroundColor: string;
  selectedBackgroundColor: string;
  hoveredBackgroundColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  markedForeColor: string;
  selectedForeColor: string;
  hoveredForeColor: string;
  foreColor: string;
  hintBackgroundColor: string; // New color for hint highlights
  hintForeColor: string;
}

interface Options {
  answerWords: string[];
  matrix: string[][];
  isSelecting: boolean;
  setIsSelecting: (isSelecting: boolean) => void;
  availablePaths: string[];
  selectedLetters: { letter: string; row: number; column: number }[];
  setSelectedLetters: (
    selectedLetters: {
      letter: string;
      row: number;
      column: number;
    }[]
  ) => void;
  markedLetters: { row: number; column: number }[];
  setMarkedLetters: (markedLetters: { row: number; column: number }[]) => void;
}

interface Props {
  design: Design;
  options: Options;
}

interface WordLocation {
  word: string;
  locations: { row: number; column: number }[];
}

export const WordPuzzleComponent = (props: Props) => {
  const {
    markedBackgroundColor,
    selectedBackgroundColor,
    hoveredBackgroundColor,
    backgroundColor,
    // fontFamily,
    // fontWeight,
    fontSize,
    markedForeColor,
    selectedForeColor,
    hoveredForeColor,
    foreColor,
    hintBackgroundColor,
    hintForeColor,
  } = props.design;

  const {
    answerWords,
    matrix,
    isSelecting,
    setIsSelecting,
    // availablePaths,
    selectedLetters,
    setSelectedLetters,
    markedLetters,
    setMarkedLetters,
  } = props.options;

  /*const matrix = [
    ["a", "b", "c", "d", "e", "d", "e", "d", "e"],
    ["a", "s", "h", "i", "j", "t", "e", "d", "c"],
    ["a", "g", "m", "n", "o", "r", "e", "d", "i"],
    ["s", "g", "u", "r", "k", "a", "n", "d", "m"],
    ["k", "i", "v", "w", "x", "k", "e", "d", "b"],
    ["i", "k", "m", "n", "o", "y", "e", "d", "o"],
    ["k", "q", "r", "s", "t", "a", "e", "d", "m"],
    ["y", "u", "e", "m", "e", "n", "e", "d", "e"],
  ];*/

  //const answerWords = ["gurkan", "trakya", "deneme", "ask", "cimbom"];
  const [data, setData] = useState<
    {
      letter: string;
      row: number;
      column: number;
    }[][]
  >([]);
  // const [isSelecting, setIsSelecting] = useState(false);
  // const [selectedLetters, setSelectedLetters] = useState([]);
  // const [markedLetters, setMarkedLetters] = useState([]);
  const [path, setPath] = useState<string>();
  const [hover, setHover] = useState<{
    letter: string;
    row: number;
    column: number;
  }>();
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [hintLetters, setHintLetters] = useState<
    { row: number; column: number }[]
  >([]);
  const [wordLocations, setWordLocations] = useState<WordLocation[]>([]);
  const [hintLimit, setHintLimit] = useState(3);

  useEffect(() => {
    const locations: WordLocation[] = [];

    // For each word in the answers
    answerWords.forEach((word) => {
      // Search horizontally (left to right)
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col <= matrix[row].length - word.length; col++) {
          let found = true;
          const positions: { row: number; column: number }[] = [];

          for (let i = 0; i < word.length; i++) {
            if (matrix[row][col + i].toLowerCase() !== word[i].toLowerCase()) {
              found = false;
              break;
            }
            positions.push({ row, column: col + i });
          }

          if (found) {
            locations.push({ word, locations: positions });
          }
        }
      }

      // Search horizontally (right to left)
      for (let row = 0; row < matrix.length; row++) {
        for (let col = matrix[row].length - 1; col >= word.length - 1; col--) {
          let found = true;
          const positions: { row: number; column: number }[] = [];

          for (let i = 0; i < word.length; i++) {
            if (matrix[row][col - i].toLowerCase() !== word[i].toLowerCase()) {
              found = false;
              break;
            }
            positions.push({ row, column: col - i });
          }

          if (found) {
            locations.push({ word, locations: positions });
          }
        }
      }

      // Search vertically (top to bottom)
      for (let col = 0; col < matrix[0].length; col++) {
        for (let row = 0; row <= matrix.length - word.length; row++) {
          let found = true;
          const positions: { row: number; column: number }[] = [];

          for (let i = 0; i < word.length; i++) {
            if (matrix[row + i][col].toLowerCase() !== word[i].toLowerCase()) {
              found = false;
              break;
            }
            positions.push({ row: row + i, column: col });
          }

          if (found) {
            locations.push({ word, locations: positions });
          }
        }
      }

      // Search vertically (bottom to top)
      for (let col = 0; col < matrix[0].length; col++) {
        for (let row = matrix.length - 1; row >= word.length - 1; row--) {
          let found = true;
          const positions: { row: number; column: number }[] = [];

          for (let i = 0; i < word.length; i++) {
            if (matrix[row - i][col].toLowerCase() !== word[i].toLowerCase()) {
              found = false;
              break;
            }
            positions.push({ row: row - i, column: col });
          }

          if (found) {
            locations.push({ word, locations: positions });
          }
        }
      }
    });

    setWordLocations(locations);
  }, [matrix, answerWords]);

  // Update foundWords when a word is marked
  useEffect(() => {
    const words = wordLocations
      .filter((wordLoc) =>
        wordLoc.locations.every((loc) =>
          markedLetters.some(
            (marked) => marked.row === loc.row && marked.column === loc.column
          )
        )
      )
      .map((wordLoc) => wordLoc.word);

    setFoundWords(words);
  }, [markedLetters, wordLocations]);

  const getHint = useCallback(() => {
    // Find words that haven't been found yet
    const remainingWords = answerWords.filter(
      (word) => !foundWords.includes(word)
    );

    if (remainingWords.length === 0) return; // All words found

    // Select a random word from remaining words
    const randomWord =
      remainingWords[Math.floor(Math.random() * remainingWords.length)];

    // Find the locations for this word
    const wordLocation = wordLocations.find((loc) => loc.word === randomWord);

    if (wordLocation) {
      // Clear any existing hints
      setHintLetters([]);

      // Show the first and last letter of the word
      const hintPositions = [
        wordLocation.locations[0],
        wordLocation.locations[wordLocation.locations.length - 1],
      ];

      setHintLetters(hintPositions);
    }
  }, [answerWords, foundWords, wordLocations]);

  const isHinted = (searched: {
    letter: string;
    row: number;
    column: number;
  }) => {
    return hintLetters.some(
      (hint) => hint.row === searched.row && hint.column === searched.column
    );
  };

  useEffect(() => {
    const tmp = matrix.map((row, i) => {
      return row.map((column, j) => {
        return {
          letter: column,
          row: i,
          column: j,
        };
      });
    });
    setData(tmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markLetters = useCallback(
    (
      param: {
        letter: string;
        row: number;
        column: number;
      }[]
    ) => {
      setMarkedLetters(unique([...markedLetters, ...param], ["row", "column"]));
    },
    [markedLetters, setMarkedLetters]
  );

  const isAnswer = useCallback(
    (
      param: {
        letter: string;
        row: number;
        column: number;
      }[]
    ) => {
      const selectedWord = param.map((x) => x.letter).join("");
      let found = false;
      for (let i = 0; i < answerWords.length; i++) {
        const element = answerWords[i];
        if (selectedWord === element) {
          found = true;
          markLetters(param);
          break;
        }
      }
      return found;
    },
    [answerWords, markLetters]
  );

  useEffect(() => {
    if (!isSelecting) {
      const selectedWord = selectedLetters.map((x) => x.letter).join("");
      const result = isAnswer(selectedLetters);
      console.log(selectedWord);
      console.log("is answer : ", result);
      setPath("");
      setSelectedLetters([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelecting]);

  // useEffect(() => {
  //   console.log("marked letters:", markedLetters);
  // }, [markedLetters]);

  const addLetterToSelectedWords = (letter: {
    letter: string;
    row: number;
    column: number;
  }) => {
    if (!isSelecting) return;

    const isLetterSelected = isSelected(letter);
    const lastSelectedLetter = selectedLetters[selectedLetters.length - 1];

    if (!isLetterSelected && isConnected(letter, lastSelectedLetter)) {
      setSelectedLetters([...selectedLetters, letter]);
    } else if (isBeforeSelect(letter, lastSelectedLetter)) {
      removeLetterFromList(lastSelectedLetter);
    }
  };

  const unique = (
    arr: {
      row: number;
      column: number;
    }[],
    keyProps: (keyof { row: number; column: number })[]
  ) => {
    const kvArray: [string, { row: number; column: number }][] = arr.map(
      (entry) => {
        const key = keyProps.map((k) => entry[k]).join("|");
        return [key, entry];
      }
    );
    const map = new Map(kvArray);
    return Array.from(map.values());
  };

  const removeLetterFromList = (letter: {
    letter: string;
    row: number;
    column: number;
  }) => {
    const tmp = selectedLetters.filter((element) => {
      return letter.row !== element.row || letter.column !== element.column;
    });
    setSelectedLetters(tmp);
  };

  const isBeforeSelect = (
    letter: {
      letter: string;
      row: number;
      column: number;
    },
    before: {
      letter: string;
      row: number;
      column: number;
    }
  ) => {
    if (!before) return false;

    return (
      (letter.column + 1 === before.column && letter.row === before.row) || // right
      (letter.column - 1 === before.column && letter.row === before.row) || // left
      (letter.row + 1 === before.row && letter.column === before.column) || // down
      (letter.row - 1 === before.row && letter.column === before.column) // up
    );
  };
  const isConnected = (
    letter: {
      letter: string;
      row: number;
      column: number;
    },
    before: {
      letter: string;
      row: number;
      column: number;
    }
  ) => {
    if (selectedLetters.length < 1) {
      return true;
    }

    if (selectedLetters.length === 1 && isBeforeSelect(letter, before)) {
      const newPath = chosePath(letter);
      setPath(newPath);
      return true;
    }

    if (!path || !before) return false;

    switch (path) {
      case "right2left":
        return before.row === letter.row && before.column - 1 === letter.column;
      case "left2right":
        return before.row === letter.row && before.column + 1 === letter.column;
      case "top2bottom":
        return before.column === letter.column && before.row + 1 === letter.row;
      case "bottom2top":
        return before.column === letter.column && before.row - 1 === letter.row;
      default:
        return false;
    }
  };

  const chosePath = (item: { letter: string; row: number; column: number }) => {
    const lastLetter = selectedLetters[0]; // Get the first letter
    const letter = item;

    if (!lastLetter) return "";

    if (lastLetter.row === letter.row) {
      if (lastLetter.column > letter.column) {
        return "right2left";
      } else if (lastLetter.column < letter.column) {
        return "left2right";
      }
    } else if (lastLetter.column === letter.column) {
      if (lastLetter.row > letter.row) {
        return "bottom2top";
      } else if (lastLetter.row < letter.row) {
        return "top2bottom";
      }
    }

    return "";
  };

  const addFirstLetter = (letter: {
    letter: string;
    row: number;
    column: number;
  }) => {
    setSelectedLetters([letter]);
  };

  const isSelected = (searched: {
    letter: string;
    row: number;
    column: number;
  }) => {
    let found = false;

    if (selectedLetters.length > 0) {
      for (let i = 0; i < selectedLetters.length; i++) {
        const element = selectedLetters[i];
        if (
          searched.row === element.row &&
          searched.column === element.column
        ) {
          found = true;
          break;
        }
      }
    }

    return found;
  };

  //   const isAvailablePath = (searched: string) => {
  //     let found = false;

  //     if (availablePaths.length > 0) {
  //       for (let i = 0; i < availablePaths.length; i++) {
  //         const element = availablePaths[i];
  //         if (searched === element) {
  //           found = true;
  //           break;
  //         }
  //       }
  //     }

  //     return found;
  //   };

  const isMarked = (searched: {
    letter: string;
    row: number;
    column: number;
  }) => {
    let found = false;

    if (markedLetters.length > 0) {
      for (let i = 0; i < markedLetters.length; i++) {
        const element = markedLetters[i];
        if (
          searched.row === element.row &&
          searched.column === element.column
        ) {
          found = true;
          break;
        }
      }
    }

    return found;
  };

  return (
    // <div className="flex justify-center mt-10">
    //   <table onMouseLeave={() => setIsSelecting(false)}>
    //     <tbody>
    //       {data.map((i, row) => {
    //         console.log(row);
    //         return (
    //           <tr>
    //             {i.map((j, column) => {
    //               console.log(column);
    //               return (
    //                 <td
    //                   onMouseLeave={() => setHover(j)}
    //                   onMouseEnter={() => {
    //                     addLetterToSelectedWords(j);
    //                     setHover(j);
    //                   }}
    //                   onMouseDown={() => {
    //                     addFirstLetter(j);
    //                     setIsSelecting(true);
    //                   }}
    //                   onMouseUp={() => setIsSelecting(false)}
    //                   className="p-5 cursor-default"
    //                   style={{
    //                     backgroundColor:
    //                       isMarked(j) === true
    //                         ? markedBackgroundColor
    //                         : isSelected(j) === true
    //                         ? selectedBackgroundColor
    //                         : j === hover
    //                         ? hoveredBackgroundColor
    //                         : backgroundColor,
    //                   }}
    //                 >
    //                   <h3
    //                     style={{
    //                       fontFamily: "monospace", //fontFamily,
    //                       fontSize: fontSize,
    //                       color:
    //                         isMarked(j) === true
    //                           ? markedForeColor
    //                           : isSelected(j) === true
    //                           ? selectedForeColor
    //                           : j === hover
    //                           ? hoveredForeColor
    //                           : foreColor,
    //                     }}
    //                   >
    //                     {j.letter}
    //                   </h3>
    //                 </td>
    //               );
    //             })}
    //           </tr>
    //         );
    //       })}
    //     </tbody>
    //   </table>
    // </div>

    <div className="flex flex-col items-center mt-10">
      <div className="mb-4">
        <button
          onClick={() => {
            if (hintLimit > 0) {
              setHintLimit(hintLimit - 1);
              getHint();
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={hintLimit === 0}
        >
          {hintLimit} / 3 Get Hint
        </button>
      </div>

      <div className="mb-4">
        <p>
          Found: {foundWords.length} / {answerWords.length} words
        </p>
      </div>

      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))`,
        }}
        onMouseLeave={() => setIsSelecting(false)}
      >
        {data.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onMouseLeave={() => setHover(cell)}
              onMouseEnter={() => {
                addLetterToSelectedWords(cell);
                setHover(cell);
              }}
              onMouseDown={() => {
                addFirstLetter(cell);
                setIsSelecting(true);
              }}
              onMouseUp={() => setIsSelecting(false)}
              className="p-3 m-2 rounded-md cursor-default flex items-center justify-center select-none"
              style={{
                backgroundColor: isMarked(cell)
                  ? markedBackgroundColor
                  : isSelected(cell)
                  ? selectedBackgroundColor
                  : isHinted(cell)
                  ? hintBackgroundColor
                  : cell === hover
                  ? hoveredBackgroundColor
                  : backgroundColor,
                aspectRatio: "1/1",
                userSelect: "none",
                WebkitUserSelect: "none",
                touchAction: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: fontSize,
                  color: isMarked(cell)
                    ? markedForeColor
                    : isSelected(cell)
                    ? selectedForeColor
                    : isHinted(cell)
                    ? hintForeColor
                    : cell === hover
                    ? hoveredForeColor
                    : foreColor,
                }}
              >
                {cell.letter}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
