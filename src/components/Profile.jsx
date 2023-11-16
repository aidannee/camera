import { useContext } from "react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import DrawingCanvas from "./DrawingCanvas";
import ImageContext from "../contexts/ImageContext";

const WebcamComponent = () => <Webcam />;
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};
function Profile() {
  const {
    savedGallery,
    setSavedGallery,
    imageIndex,
    setImageIndex,
    isCanvasActive,
    setIsCanvasActive,
    picture,
    setPicture,
    deleteImage,
    handleRetake,
    drawImage,
  } = useContext(ImageContext);

  const webcamRef = React.useRef(null);
  // galery of images
  // let [savedGallery, setSavedGallery] = useState([]);
  // let [imageIndex, setImageIndex] = useState(-1);
  // let [isCanvasActive, setIsCanvasActive] = useState(false);
  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
  });
  useEffect(() => {
    if (picture != "") setSavedGallery([...savedGallery, picture]);
  }, [picture]);
  useEffect(() => {
    // console.log(savedGallery);
  }, [savedGallery]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* DRAWING */}
      <div className="h-[70%] flex items-center justify-center bg-green-500 overflow-y-auto text-center">
        <div className="z-20">
          {isCanvasActive ? (
            <DrawingCanvas
              setIsCanvasActive={setIsCanvasActive}
              image={savedGallery[imageIndex]}
              setSavedGallery={setSavedGallery}
              savedGallery={savedGallery}
              imgIdx={imageIndex}
            />
          ) : (
            <div className="flex flex-col items-center">
              {/* CAMERA */}
              {picture === "" ? (
                <div className="flex justify-center items-center h-[80%]">
                  <div className="flex flex-col justify-center ">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/png"
                      videoConstraints={videoConstraints}
                      className="h-[80%] mt-3 rounded"
                    />
                    <div className="h-[20%] flex justify-center items-center">
                      <button
                        onClick={capture}
                        className="bg-red-400 px-8 py-2 m-4 rounded"
                      >
                        Capture
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRetake}
                  className="bg-blue-400 px-4 py-2 m-4 rounded"
                >
                  Retake
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GALLERY */}
      <div
        id="imageGallery"
        className="h-[30%] bg-red-500 p-4 overflow-y-hidden overflow-x-scroll"
      >
        <div className="flex space-x-4 h-full">
          {savedGallery.map((img, index) => {
            return (
              <div
                key={index}
                className="min-w-[150px] md:min-w-[200px] lg:min-w-[250px] bg-white rounded-lg shadow-md p-4 object-contain opacity-50 hover:opacity-100 transform hover:scale-110 transition duration-300 ease-in-out"
              >
                <img
                  src={img}
                  alt="Image"
                  className="h-[80%] w-full object-cover rounded cursor-pointer"
                  onClick={() => drawImage(img, index)}
                />
                <div className="h-[20%] flex justify-between items-center text-lg">
                  <button onClick={() => deleteImage(index)}>
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                  <a className="" href={savedGallery[index]} download={index}>
                    <button>
                      <i className="fa-regular fa-circle-down"></i>
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Profile;
