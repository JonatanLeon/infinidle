import "./styles/styles.css";
import { useState, useEffect } from "react";

const teclado = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Z", "X", "C", "V", "B", "N", "M"]
];

export default function Keyboard({ highlightedKeys, resetPressed }) {
    const loadState = (key, defaultValue) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    };
    const [keyboard] = useState(() => loadState("keyboard", teclado));
    const [storedKeys, setStoredKeys] = useState(() => loadState("storedKeys", []));

    useEffect(() => {
        localStorage.setItem("keyboard", JSON.stringify(keyboard));
    }, [keyboard]);

    useEffect(() => {
        if (highlightedKeys && highlightedKeys.length > 0) {
            setStoredKeys(prev => {
                const nuevas = [...prev];
                for (let i = 0; i < highlightedKeys.length; i++) {
                    const letra = highlightedKeys.charAt(i);
                    if (!nuevas.includes(letra)) {
                        nuevas.push(letra);
                    }
                }
                return nuevas;
            });
        } else if (resetPressed) setStoredKeys([]);
    }, [highlightedKeys, resetPressed]);


    useEffect(() => {
        localStorage.setItem("storedKeys", JSON.stringify(storedKeys));
    }, [storedKeys]);
    return (
        <div className="keyboard-container">
            <div className="keyboard">
                {keyboard.map((row, rowIndex) => (
                    <div className="keyboard-row" key={rowIndex}>
                        {row.map((letter, keyIndex) => (
                            <div
                                key={keyIndex}
                                className={`key ${storedKeys.includes(letter) ? "dark" : ""}`}
                            >
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
