import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import { fill } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";
import { AiFillCloseCircle } from "react-icons/ai";
function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;
  const [lipColor, setLipColor] = useState("#A22141");
  const [appmodal, setAppmodel] = useState(false);


  function adjustColorIntensity(hexColor, intensityFactor) {
    // Remove '#' from the beginning
    hexColor = hexColor.replace('#', '');

    // Convert hex to RGB
    let r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);

    // Adjust color intensity
    r = Math.min(255, Math.max(0, Math.round(r * intensityFactor)));
    g = Math.min(255, Math.max(0, Math.round(g * intensityFactor)));
    b = Math.min(255, Math.max(0, Math.round(b * intensityFactor)));

    // Convert RGB back to hex
    const adjustedHex = '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    return adjustedHex;
}


  function onResults(results) {
 
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        // console.log("landmarks", landmarks);
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
        //   color: "#C0C0C070",
        //   lineWidth: 1,
        // });
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
        //   color: "#FF3030",
        //   // color: eyeColor,
        // });
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
        //   color: "#FF3030",
        // });
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
        //   // color: "#30FF30",
        //   color: eyeColor,
        // });
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
        //   color: "#30FF30",
        // });
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
        //   color: "#E0E0E0",
        // });
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
        //   color: lipColor,
        // });
     

        const allNumbers = Facemesh.FACEMESH_LIPS.flat();
        
        // Use Set to store unique numbers
        const uniqueNumbersSet = new Set(allNumbers);

        // Convert Set back to an array
        const uniqueNumbersArray = [...uniqueNumbersSet];

    

        const allLipLandmarks = [[61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314], [314, 405], [405, 321], [321, 375], [375, 291], [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [78, 95], [95, 88], [88, 178], [178, 87], [87, 14], [14, 317], [317, 402], [402, 318], [318, 324], [324, 308], [78, 191], [191, 80], [80, 81], [81, 82], [82, 13], [13, 312], [312, 311], [311, 310], [310, 415], [415, 308],];

        // const lipIndicesUpper = [ 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, ];

        // const lipIndicesLower = [ 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 191, 80, 81, 82, 13, 312, 311, 310, 415, ];

        const lipIndicesUpper = [61, 146, 146, 91, 91, 181, 181, 84, 84, 17, 17, 314, 314, 405, 405, 321, 321, 375, 375, 291, 61, 185, 185, 40, 40, 39, 39, 37, 37, 0, 0, 267, 267, 269, 269, 270, 270, 409, 409, 291, 308];

        const lipIndicesLower = [78, 95, 95, 88, 88, 178, 178, 87, 87, 14, 14, 317, 317, 402, 402, 318, 318, 324, 324, 308, 78, 191, 191, 80, 80, 81, 81, 82, 82, 13, 13, 312, 312, 311, 311, 310, 310, 415, 415, 308];

        const lipPath = new Path2D();
        for (const index of lipIndicesUpper) {
          lipPath.lineTo(
            landmarks[index].x * videoWidth,
            landmarks[index].y * videoHeight
          );
        }
        for (const index of lipIndicesLower.reverse()) {
          lipPath.lineTo(
            landmarks[index].x * canvasElement.width,
            landmarks[index].y * canvasElement.height
          );
        }
        lipPath.closePath();
        const adjustedLipColor = adjustColorIntensity(lipColor, 0.5);
        canvasCtx.fillStyle = adjustedLipColor;
        canvasCtx.fill(lipPath);
      }
    }
    canvasCtx.restore();
  }
  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
      
      });
      camera.start();
    }
  }, [lipColor]);
  
  return (

      <div className="App">


       
        <div className="p-5 relative w-[100%] h-full  flex">
          <div className="w-[50%]">

            {appmodal?
            <>
            <AiFillCloseCircle  onClick={()=>setAppmodel(false)} style={{height:"30px",width:"30px",float: "right",right: "30px",position: "relative",cursor:"pointer",zIndex:"99999"}}/>
              <Webcam
                ref={webcamRef}
                style={{
                  textAlign: "center",
                  zindex: 9,
              
                }}
                className="absolute left-[100px] top-[0px] w-[500px] [480px]"
              />
              <canvas
                ref={canvasRef}
             
                style={{
                  textAlign: "center",
                  zindex: 9,
                  
                }}
                className="absolute left-[100px] top-[0px]  w-[500px] "
              ></canvas>
            </>
            :
            <div className="background w-[70%] text-white font-bold rounded-3xl p-5 m-auto">
              <div className="live-main">
                  <h2 tabIndex="0" data-radium="true">
                      Choose Try-On Experience</h2>
                  <button aria-label="enter live camera" onClick={()=>setAppmodel(true)}>
                      <img alt="live" src="live-makeup.png" />
                      <div className="text">Live Makeup
                      </div>
                  </button>
                  <div data-radium="true" className="model-main">
                      <button aria-label="choose a model">
                          <img alt="choose-model" src="choose-model.png" />
                          <div className="text">Choose a Model</div> 
                      </button>
                      <div className="upload-main">
                          <button aria-label="upload a photo">
                              <img alt="upload" src="img-upload.png" />
                              <div className="text">Upload a Photo</div>
                          </button>
                          
                      </div>
                  </div>
              </div>
            </div>
            }
          </div>
          <div className="w-[50%]  text-white font-bold rounded-3xl p-5 m-auto h-[480px] ">
          <label className="text-[#000] block text-[20px]">Choose Color</label>
          <button style={{ backgroundColor: "#f23b77", border: "1px solid #f23b77", width: "50px", height: "50px", borderRadius: "100%" }} onClick={() => setLipColor("#f23b77")}></button>
          <button style={{ backgroundColor: "#BB1A4B", border: "1px solid #BB1A4B", width: "50px", height: "50px", borderRadius: "100%" }} onClick={() => setLipColor("#BB1A4B")}></button>
          <button style={{ backgroundColor: "#A11564", border: "1px solid #A11564", width: "50px", height: "50px", borderRadius: "100%" }} onClick={() => setLipColor("#A11564")}></button>
          <button style={{ backgroundColor: "#903739", border: "1px solid #903739", width: "50px", height: "50px", borderRadius: "100%" }} onClick={() => setLipColor("#903739")}></button>
          <button style={{ backgroundColor: "#EB5494", border: "1px solid #EB5494", width: "50px", height: "50px", borderRadius: "100%" }} onClick={() => setLipColor("#EB5494")}></button>
          <button style={{ backgroundColor: "#FF0000", border: "1px solid #FF0000", width: "50px", height: "50px", borderRadius: "100%" }} onClick={() => setLipColor("#FF0000")}></button>
          </div>
        </div>
      </div>
    

  );
}

export default App;
