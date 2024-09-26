// App.js
import React, { useState } from "react";
import "./App.css";

const CANVAS_SIZE = 16; // 16x16 grid (adjustable)
const DEFAULT_COLOR = "#ffffff"; // Default white color for pixels
const PALETTE = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#000000"]; // Palette

const App = () => {
  // Initialize the canvas with default colors
  const [pixels, setPixels] = useState(
    Array(CANVAS_SIZE * CANVAS_SIZE).fill(DEFAULT_COLOR)
  );
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default color

  // Handle pixel click to change its color
  const handlePixelClick = (index) => {
    const newPixels = [...pixels];
    newPixels[index] = selectedColor;
    setPixels(newPixels);
  };

  return (
    <div className="App">
      <h1>R/Place Style Canvas</h1>

      {/* Color Palette */}
      <div className="palette">
        {PALETTE.map((color) => (
          <button
            key={color}
            className="palette-color"
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>

      {/* Canvas */}
      <div className="canvas">
        {pixels.map((color, index) => (
          <div
            key={index}
            className="pixel"
            style={{ backgroundColor: color }}
            onClick={() => handlePixelClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
