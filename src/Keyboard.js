import "./styles/styles.css"
import { useState } from 'react';

const teclado = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Z", "X", "C", "V", "B", "N", "M"]
];

let storedKeys = [];

export default function Keyboard({ highlightedKeys }) {
    const [keyboard] = useState(teclado);
    console.log("highlightedKeys", highlightedKeys);
    if (highlightedKeys.length > 0) {
        for (let i = 0; i < highlightedKeys.length; i++) {
            if (!storedKeys.includes(highlightedKeys.charAt(i))) {
                storedKeys.push(highlightedKeys.charAt(i));
            }
        }
    } else {
        storedKeys = [];
    }
    console.log("storedKeys", storedKeys);
    return (
        <div className="keyboard-container">
            <div className="keyboard">
                {keyboard.map((row, rowIndex) => (
                    <div className="keyboard-row" key={rowIndex}>
                        {row.map((letter, keyIndex) => (
                            <div
                                key={keyIndex}
                                className={`key ${storedKeys.includes(letter) ? "dark" : ""}`}>
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

