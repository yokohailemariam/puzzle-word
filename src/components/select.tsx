// import React, { useCallback, useEffect, useState } from "react";

// // Previous interfaces remain the same...

// export const WordPuzzleComponent = (props: Props) => {
//   // Previous state and props destructuring...
//   const [hintLimit, setHintLimit] = useState(3);
//   const [clickStartCell, setClickStartCell] = useState<{
//     letter: string;
//     row: number;
//     column: number;
//   } | null>(null);

//   const handleCellClick = (cell: {
//     letter: string;
//     row: number;
//     column: number;
//   }) => {
//     if (!clickStartCell) {
//       // First click - start selection
//       setClickStartCell(cell);
//       setSelectedLetters([cell]);
//     } else {
//       // Second click - try to complete selection
//       const possiblePath = determineSelectionPath(clickStartCell, cell);
//       if (possiblePath) {
//         const selectedCells = getLettersBetween(
//           clickStartCell,
//           cell,
//           possiblePath
//         );
//         if (selectedCells.length > 0) {
//           setSelectedLetters(selectedCells);
//           // Check if it forms a valid word
//           const selectedWord = selectedCells.map((c) => c.letter).join("");
//           if (answerWords.includes(selectedWord.toLowerCase())) {
//             setMarkedLetters(
//               unique(
//                 [
//                   ...markedLetters,
//                   ...selectedCells.map((c) => ({
//                     row: c.row,
//                     column: c.column,
//                   })),
//                 ],
//                 ["row", "column"]
//               )
//             );
//           }
//         }
//       }
//       setClickStartCell(null);
//       setSelectedLetters([]);
//     }
//   };

//   const determineSelectionPath = (
//     start: {
//       letter: string;
//       row: number;
//       column: number;
//     },
//     end: {
//       letter: string;
//       row: number;
//       column: number;
//     }
//   ) => {
//     if (start.row === end.row) {
//       if (Math.abs(start.column - end.column) <= start.letter.length) {
//         return start.column > end.column ? "right2left" : "left2right";
//       }
//     } else if (start.column === end.column) {
//       if (Math.abs(start.row - end.row) <= start.letter.length) {
//         return start.row > end.row ? "bottom2top" : "top2bottom";
//       }
//     }
//     return null;
//   };

//   const getLettersBetween = (
//     start: {
//       letter: string;
//       row: number;
//       column: number;
//     },
//     end: {
//       letter: string;
//       row: number;
//       column: number;
//     },
//     path: string
//   ) => {
//     const letters = [];

//     switch (path) {
//       case "left2right": {
//         const row = start.row;
//         for (let col = start.column; col <= end.column; col++) {
//           letters.push(data[row][col]);
//         }
//         break;
//       }
//       case "right2left": {
//         const row = start.row;
//         for (let col = start.column; col >= end.column; col--) {
//           letters.push(data[row][col]);
//         }
//         break;
//       }
//       case "top2bottom": {
//         const col = start.column;
//         for (let row = start.row; row <= end.row; row++) {
//           letters.push(data[row][col]);
//         }
//         break;
//       }
//       case "bottom2top": {
//         const col = start.column;
//         for (let row = start.row; row >= end.row; row--) {
//           letters.push(data[row][col]);
//         }
//         break;
//       }
//     }

//     return letters;
//   };

//   return (
//     <div className="flex flex-col items-center mt-10">
//       <div className="mb-4">
//         <button
//           onClick={() => {
//             if (hintLimit > 0) {
//               setHintLimit(hintLimit - 1);
//               getHint();
//             }
//           }}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={hintLimit === 0}
//         >
//           {hintLimit} / 3 Get Hint
//         </button>
//       </div>

//       <div className="mb-4">
//         <p>
//           Found: {foundWords.length} / {answerWords.length} words
//         </p>
//       </div>

//       <div
//         className="grid gap-0 border border-gray-200"
//         style={{
//           gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))`,
//         }}
//         onMouseLeave={() => {
//           setIsSelecting(false);
//           setSelectedLetters([]);
//         }}
//       >
//         {data.map((row, rowIndex) =>
//           row.map((cell, colIndex) => (
//             <div
//               key={`${rowIndex}-${colIndex}`}
//               onClick={() => handleCellClick(cell)}
//               onMouseLeave={() => setHover(cell)}
//               onMouseEnter={() => {
//                 addLetterToSelectedWords(cell);
//                 setHover(cell);
//               }}
//               onMouseDown={() => {
//                 addFirstLetter(cell);
//                 setIsSelecting(true);
//               }}
//               onMouseUp={() => setIsSelecting(false)}
//               className="p-5 cursor-pointer flex items-center justify-center select-none transition-colors duration-150"
//               style={{
//                 backgroundColor: isMarked(cell)
//                   ? markedBackgroundColor
//                   : isSelected(cell)
//                   ? selectedBackgroundColor
//                   : isHinted(cell)
//                   ? hintBackgroundColor
//                   : cell === hover
//                   ? hoveredBackgroundColor
//                   : backgroundColor,
//                 aspectRatio: "1/1",
//                 userSelect: "none",
//                 WebkitUserSelect: "none",
//                 touchAction: "none",
//               }}
//             >
//               <span
//                 style={{
//                   fontFamily: "monospace",
//                   fontSize: fontSize,
//                   color: isMarked(cell)
//                     ? markedForeColor
//                     : isSelected(cell)
//                     ? selectedForeColor
//                     : isHinted(cell)
//                     ? hintForeColor
//                     : cell === hover
//                     ? hoveredForeColor
//                     : foreColor,
//                 }}
//                 className="select-none"
//               >
//                 {cell.letter}
//               </span>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="mt-4 text-sm text-gray-600">
//         <p>Tip: You can either drag to select or click start and end letters</p>
//       </div>
//     </div>
//   );
// };

// export default WordPuzzleComponent;
