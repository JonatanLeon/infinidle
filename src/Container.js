import "./styles/styles.css"
import Board from './Board';
import Keyboard from './Keyboard';
import { useState } from "react";

export default function Container({ listaPalabras }) {
    const [highlightedKeys, setHighlightedKeys] = useState([]);
    const [resetPressed, setResetPressed] = useState(false);
    return (
        <div className="general-container">
            <Board listaPalabras={listaPalabras} onEnter={(keys) => setHighlightedKeys(keys)} onReset={(state) => setResetPressed(state)} />
            <Keyboard highlightedKeys={highlightedKeys} resetPressed={resetPressed} />
        </div>
    );
}