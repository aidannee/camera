import React, { useState, useRef, useEffect, useContext } from "react";
import ImageContext from "../contexts/ImageContext";

const DrawingCanvas = ({ image }) => {
  let context = null;

  const { savedGallery, setSavedGallery, imageIndex, setIsCanvasActive } =
    useContext(ImageContext);

  const canvasRef = useRef(null);
  const [canvasLineWidth, setCanvasLineWidth] = useState(1);
  const [canvasLineColor, setCanvasLineColor] = useState("#ffff");
  let isDrawing = false;

  const drawingData = []; // Store drawing data

  useEffect(() => {
    const canvas = canvasRef.current;
    context = canvas.getContext("2d");
    context.lineJoin = "round";
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dataUrl = canvas.toDataURL(); // Store the current drawing as an image
      canvas.width = width;
      canvas.height = height;
      const imageObj = new Image();
      imageObj.onload = () => {
        context.clearRect(0, 0, width, height);
        context.drawImage(imageObj, 0, 0, width, height);
      };
      imageObj.src = image;
    };
    const redrawImage = () => {
      drawingData.forEach((point) => {
        const { x, y } = point;
        context.lineTo(x, y);
        context.stroke();
      });
    };
    resizeCanvas();
    redrawImage();
    window.addEventListener("resize", resizeCanvas);
  }, [image]);

  const startDrawing = (e) => {
    context = canvasRef.current.getContext("2d");
    isDrawing = true;
    context.strokeStyle = canvasLineColor;

    console.log(canvasLineColor);
    context.lineWidth = canvasLineWidth;
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  const continueDrawing = (e) => {
    context = canvasRef.current.getContext("2d");

    if (!isDrawing) return;

    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };
  const stopDrawing = () => {
    isDrawing = false;
  };
  const saveCanvasImage = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const updateEditingImg = [...savedGallery];
    updateEditingImg[imageIndex] = dataUrl;
    setSavedGallery(updateEditingImg);
    setIsCanvasActive(false);
  };
  return (
    <>
      {" "}
      {/* PARENT */}
      <div className="flex flex-col justify-center items-center overflow-hidden">
        {/* CANVAS */}
        <div className="h-[80%] overflow-hidden">
          {" "}
          <canvas
            className="aspect-auto bg-gray-200"
            ref={canvasRef}
            draggable={false}
            onMouseDown={startDrawing}
            onMouseMove={continueDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={(e) => {
              e.preventDefault(); // Prevent scrolling
              startDrawing(e.touches[0]);
            }}
            onTouchMove={(e) => {
              e.preventDefault(); // Prevent scrolling
              continueDrawing(e.touches[0]);
            }}
            onTouchEnd={stopDrawing} // For touch devices
            width={400}
            height={400}
          />
        </div>
        {/* EDITING BUTTONS */}
        <div
          className="p-1 h[20%] flex items-center space-x-6 bg-purple-400"
          id="canvasEditorButtons"
        >
          <div className="rounded flex items-center p-1 bg-rose-400">
            <label htmlFor="color">Colour:</label>
            <input
              className="bg-transparent"
              type="color"
              id="color"
              value={canvasLineColor}
              onChange={(e) => {
                setCanvasLineColor(e.target.value);
                console.log(e.target.value);
              }}
            />
          </div>
          <div className="p-1 bg-blue-400 rounded">
            <label htmlFor="lineWidth">Line width(1-20):</label>
            <input
              id="lineWidth"
              type="number"
              min={1}
              value={canvasLineWidth}
              max={20}
              onChange={(e) => {
                setCanvasLineWidth(parseInt(e.target.value));
                // console.log(typeof e.target.value);
              }}
              className=""
            />
          </div>
          <button
            className="p-1 bg-slate-400 rounded"
            onClick={saveCanvasImage}
          >
            Save Image
          </button>
        </div>
      </div>
    </>
  );
};
export default DrawingCanvas;
