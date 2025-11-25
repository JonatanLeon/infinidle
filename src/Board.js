import "./styles/styles.css"
import { useState, useEffect, useRef } from 'react';
import palabrasAcertables from "./data/palabras.json";

function isWordInList(palabra, listaPalabras) {
  if (listaPalabras.find((e => e.toUpperCase() === palabra))) {
    return true;
  } else {
    return false;
  }
}

export default function Board({ listaPalabras, onEnter, onReset }) {
  const loadState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [palabra, setPalabra] = useState(() => {
    const saved = localStorage.getItem("palabra");
    if (saved) return JSON.parse(saved);
    const idx = Math.floor(Math.random() * palabrasAcertables.length);
    return palabrasAcertables[idx].toUpperCase();
  });
  const [contador, setContador] = useState(() => loadState("contador", 0));
  const [squares, setSquares] = useState(() => loadState("squares", Array(30).fill("")));
  const [currentRow, setCurrentRow] = useState(() => loadState("currentRow", 0));
  const [message, setMessage] = useState(() => loadState("message", ""));
  const [showMessage, setShowMessage] = useState(() => loadState("showMessage", false));
  const [isSuccess, setIsSuccess] = useState(() => loadState("isSuccess", false));
  const [gameEnded, setGameEnded] = useState(() => loadState("gameEnded", false));

  // Refs sincronizados
  const gameEndedRef = useRef(gameEnded);
  const squaresRef = useRef(squares);
  const currentRowRef = useRef(currentRow);

  const [colorRows, setColorRows] = useState(() => loadState("colorRows",
    Array(6).fill(null).map(() => Array(5).fill("")))
  );
  // Guardar cada vez que cambie el estado
  useEffect(() => {
    localStorage.setItem("palabra", JSON.stringify(palabra));
  }, [palabra]);

  useEffect(() => {
    localStorage.setItem("contador", JSON.stringify(contador));
  }, [contador]);

  useEffect(() => {
    localStorage.setItem("squares", JSON.stringify(squares));
    squaresRef.current = squares;
  }, [squares]);

  useEffect(() => {
    localStorage.setItem("currentRow", JSON.stringify(currentRow));
    currentRowRef.current = currentRow;
  }, [currentRow]);

  useEffect(() => {
    localStorage.setItem("message", JSON.stringify(message));
  }, [message]);

  useEffect(() => {
    localStorage.setItem("showMessage", JSON.stringify(showMessage));
  }, [showMessage]);

  useEffect(() => {
    localStorage.setItem("isSuccess", JSON.stringify(isSuccess));
  }, [isSuccess]);

  useEffect(() => {
    localStorage.setItem("gameEnded", JSON.stringify(gameEnded));
    gameEndedRef.current = gameEnded;
  }, [gameEnded]);

  useEffect(() => {
    localStorage.setItem("colorRows", JSON.stringify(colorRows));
  }, [colorRows]);

  useEffect(() => {

    const handleKeyDown = (e) => {
      if (!gameEndedRef.current) {
        const key = e.key;
        if (/^[a-zA-ZÑñ]$/.test(key)) {
          setSquares((prevLetters) => {
            const actualCurrentRow = currentRowRef.current;
            const nextLetters = [...prevLetters];
            const start = actualCurrentRow * 5;
            const end = start + 5;
            const emptyIndex = nextLetters.slice(start, end).findIndex((letter) => letter === "");

            if (emptyIndex !== -1) {
              nextLetters[start + emptyIndex] = key.toUpperCase();
            }

            return nextLetters;
          });
        }

        if (key === "Enter") {
          const start = currentRowRef.current * 5;
          const end = start + 5;

          const currentSquares = squaresRef.current;
          const rowFilled = currentSquares.slice(start, end).every((l) => l !== "");
          const typedWord = currentSquares.slice(start, end).join("");
          const isValidWord = typedWord === palabra;
          const greenSquares = [];
          const trueSquares = [];
          let howManyLetters = 0;
          if (rowFilled && currentRowRef.current < 6) {
            for (let i = 0; i < typedWord.length; i++) {
              const currentLetter = typedWord.charAt(i);
              howManyLetters = 0;
              for (let j = 0; j < palabra.length; j++) {
                if (palabra.charAt(j) === currentLetter) {
                  howManyLetters++;
                  continue;
                }
              }
              if (palabra.charAt(i) === currentLetter) {
                greenSquares.push([currentLetter, 1]);
              } else {
                greenSquares.push([currentLetter, 0]);
              }
            }

            for (let i = 0; i < typedWord.length; i++) {
              let yellowSquares = 0;
              const currentLetter = typedWord.charAt(i);
              howManyLetters = 0;
              let aciertos = 0;
              if (palabra.includes(currentLetter) && palabra.charAt(i) !== currentLetter) {
                for (let j = 0; j < palabra.length; j++) {
                  if (palabra.charAt(j) === currentLetter) {
                    howManyLetters++;
                    continue;
                  }
                }
                for (const [key, value] of greenSquares) {
                  if (key === currentLetter && value === 1) {
                    aciertos++;
                  }
                }

                if (trueSquares.length > 0) {
                  for (const [key, value] of trueSquares) {
                    if (key === currentLetter && value === 2) {
                      yellowSquares++;
                    }
                  }
                }

                if (aciertos < howManyLetters && yellowSquares < howManyLetters) {
                  trueSquares.push([currentLetter, 2]);
                } else {
                  trueSquares.push([currentLetter, 0]);
                }
              } else if (palabra.charAt(i) === currentLetter) {
                trueSquares.push([currentLetter, 1]);
              } else {
                trueSquares.push([currentLetter, 0]);
              }

            }
            const colorNumbersRow = [];
            for (const [key, value] of trueSquares) {
              if (key) {
                colorNumbersRow.push(String(value));
              }
            }
            if (isWordInList(typedWord, listaPalabras)) {
              setColorRows(prev => {
                const newRows = [...prev];
                newRows[currentRowRef.current] = colorNumbersRow;
                return newRows;
              });
            }

            setShowMessage(false);
            if (isValidWord) {
              setMessage("Palabra correcta");
              setIsSuccess(true);
              setShowMessage(true);
              setContador(c => c + 1);
              onEnter(typedWord);
              return;
            } else if (!isWordInList(typedWord, listaPalabras)) {
              setMessage("Palabra no válida");
              setIsSuccess(false);
              setShowMessage(true);
              setTimeout(() => {
                setShowMessage(false);
              }, 2500);
              return;
            }
            setCurrentRow((prev) => prev + 1);
            if (!isValidWord && currentRowRef.current === 5) {
              setMessage("No lo conseguiste");
              setIsSuccess(false);
              setShowMessage(true);
              setGameEnded(true);
              onEnter(typedWord);
              return;
            }
            onEnter(typedWord);
          }
        }

        if (key === "Backspace") {
          setSquares((prevLetters) => {
            const nextLetters = [...prevLetters];
            const actualCurrentRow = currentRowRef.current;
            const start = actualCurrentRow * 5;
            const end = start + 5;

            for (let i = end - 1; i >= start; i--) {
              if (nextLetters[i] !== "") {
                nextLetters[i] = "";
                break;
              }
            }

            return nextLetters;
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEnter, listaPalabras, palabra]);
  return (
    <div className="board-container">
      {showMessage && isSuccess && (
        <div className="success-message">
          {message}
        </div>
      )}

      {showMessage && !isSuccess && (
        <div className="failure-message">
          {message}
        </div>
      )}

      <div className="grid">
        {colorRows.map((row, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {row.map((numStr, squareIndex) => {
              const num = numStr;

              let bgColor;
              if (num === "0") bgColor = "gray";
              if (num === "1") bgColor = "green";
              if (num === "2") bgColor = "yellow";
              if (num === "") bgColor = "lightgray";

              const letter = squares[rowIndex * 5 + squareIndex];
              return (
                <div
                  className="square"
                  key={squareIndex}
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    border: "1px solid #333",
                    borderColor: rowIndex === currentRow ? "blue" : "#333",
                    backgroundColor: bgColor,
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p>Palabras acertadas: </p><h5>{contador}</h5>
      {showMessage && isSuccess && (
        <button className="btn btn-primary" onClick={() => {
          setColorRows(Array(6).fill(null).map(() => Array(5).fill("")));
          setSquares(Array(30).fill(""));
          setIsSuccess(false);
          setShowMessage(false);
          setCurrentRow(0);
          const idx = Math.floor(Math.random() * palabrasAcertables.length);
          setPalabra(palabrasAcertables[idx].toUpperCase());
          onEnter("");
          onReset(true);
        }}>
          Siguiente
        </button>
      )}
      <div>
        <button className="reset" onClick={() => {
          setContador(0);
          setColorRows(Array(6).fill(null).map(() => Array(5).fill("")));
          setSquares(Array(30).fill(""));
          setIsSuccess(false);
          setShowMessage(false);
          setCurrentRow(0);
          const idx = Math.floor(Math.random() * palabrasAcertables.length);
          setPalabra(palabrasAcertables[idx].toUpperCase());
          setGameEnded(false);
          onEnter("");
          onReset(true);
        }}>
          Reiniciar
        </button>
      </div>
      {showMessage && !isSuccess && gameEnded && (
        <p>La palabra era: {palabra}</p>
      )}
    </div >
  );
}