import { useState, useEffect, useMemo } from "react";
import { WordPuzzleComponent } from "./components/WordPuzzle";

const App = () => {
  const answerWords = useMemo(
    () => [
      "gurkan",
      "example",
      "project",
      "github",
      "npm",
      "b2t",
      "r2l",
      "star",
      "react",
    ],
    []
  );

  const matrix = [
    ["p", "g", "i", "t", "h", "u", "b", "t", "e"],
    ["r", "s", "n", "p", "m", "e", "r", "e", "c"],
    ["o", "g", "m", "n", "o", "x", "q", "r", "i"],
    ["j", "g", "u", "r", "k", "a", "n", "e", "m"],
    ["e", "i", "v", "w", "x", "m", "e", "a", "s"],
    ["c", "t", "m", "n", "o", "p", "v", "c", "t"],
    ["t", "2", "r", "s", "t", "l", "b", "t", "a"],
    ["y", "b", "e", "k", "c", "e", "l", "2", "r"],
  ];
  const [found, setFound] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState<
    {
      letter: string;
      row: number;
      column: number;
    }[]
  >([]);
  const [markedLetters, setMarkedLetters] = useState<
    { row: number; column: number }[]
  >([]);

  const pathNames = ["left2right", "right2left", "top2bottom", "bottom2top"];
  const [paths, setPaths] = useState(["left2right", "top2bottom"]);

  useEffect(() => {
    const addToFound = (founded: string) => {
      if (isInList(founded, answerWords)) {
        if (!isInList(founded, found)) {
          setFound([...found, founded]);
          console.log(founded);
        }
      }
    };

    if (isSelecting) {
      console.log("selected");
    } else {
      console.log("released");
      const selectedWord = selectedLetters.map((x) => x.letter).join("");
      console.log(selectedWord);
      addToFound(selectedWord);
    }
  }, [answerWords, found, isSelecting, selectedLetters]);

  const isInList = (searched: string, arr: string[]) => {
    let found = false;

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (searched === element) {
        found = true;
        break;
      }
    }

    return found;
  };

  const addOrRemovePath = (param: string) => {
    // console.log(param);
    if (!isInList(param, paths)) {
      setPaths([...paths, param]);
    } else {
      setPaths(paths.filter((element) => element !== param));
    }
  };

  useEffect(() => {
    console.log("available paths:", paths);
  }, [paths]);

  useEffect(() => {
    console.log("marked letters:", markedLetters);
  }, [markedLetters]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
        <h2>Ways:</h2>
        {pathNames.map((element) => {
          return (
            <span
              style={{
                cursor: "pointer",
                marginLeft: 20,
                marginRight: 20,
                color: "black",
              }}
            >
              <h2
                onClick={() => addOrRemovePath(element)}
                style={{
                  textDecoration: !isInList(element, paths)
                    ? "line-through"
                    : "none",
                }}
              >
                {element}
              </h2>
            </span>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {answerWords.map((element) => {
          return (
            <span
              style={{
                marginTop: 15,
                marginLeft: 20,
                marginRight: 20,
                color: "black",
              }}
            >
              <h2
                style={{
                  textDecoration: isInList(element, found)
                    ? "line-through"
                    : "none",
                }}
              >
                {element}
              </h2>
            </span>
          );
        })}
      </div>
      <WordPuzzleComponent
        design={{
          markedBackgroundColor: "#00C3FF",
          selectedBackgroundColor: "white",
          hoveredBackgroundColor: "rgb(0, 218, 145)",
          backgroundColor: "rgb(1, 146, 98)",
          fontFamily: "monospace",
          fontWeight: "",
          fontSize: "2.5rem",
          markedForeColor: "white",
          selectedForeColor: "rgb(1, 146, 98)",
          hoveredForeColor: "white",
          foreColor: "white",
          hintBackgroundColor: "#fff3cd", // or your preferred color
          hintForeColor: "#856404",
        }}
        options={{
          answerWords: answerWords,
          matrix: matrix,
          isSelecting: isSelecting,
          selectedLetters: selectedLetters,
          setSelectedLetters: setSelectedLetters,
          markedLetters: markedLetters,
          setMarkedLetters: setMarkedLetters,
          setIsSelecting: setIsSelecting,
          availablePaths: paths,
          /*[
            // "right2left",
            "left2right",
            "top2bottom",
            //"bottom2top",
          ],*/
        }}
      />
    </div>
  );
};

export default App;
