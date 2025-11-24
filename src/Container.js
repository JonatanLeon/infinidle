import "./styles/styles.css"
import Board from './Board';
import Keyboard from './Keyboard';
import { useState } from "react";

export default function Container({ listaPalabras }) {
    const [highlightedKeys, setHighlightedKeys] = useState([]);
    return (
        <div className="general-container">
            <Board listaPalabras={listaPalabras} onEnter={(keys) => setHighlightedKeys(keys)} />
            <Keyboard highlightedKeys={highlightedKeys} />
        </div>
    );
}