import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import { fill } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;
  const [lipColor, setLipColor] = useState("");
  const [appmodal, setAppmodel] = useState(false);
  const [modelGallery, setModelGallery] = useState(false);
  const [modelview, setModelview] = useState(false);
  const [modelimg, setModelimg] = useState("");
  
  function adjustColorIntensity(hexColor, intensityFactor) {
    hexColor = hexColor.replace('#', '');
    let r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);
    r = Math.min(255, Math.max(0, Math.round(r * intensityFactor)));
    g = Math.min(255, Math.max(0, Math.round(g * intensityFactor)));
    b = Math.min(255, Math.max(0, Math.round(b * intensityFactor)));
    const adjustedHex = '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    return adjustedHex;
  }
  function onResults(results) {
    console.log(lipColor);
    const isModelImage = !!modelimg;
    const videoWidth = isModelImage ? "500" : webcamRef.current.video.videoWidth;
    const videoHeight = isModelImage ? "500" : webcamRef.current.video.videoHeight;

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
        //console.log(Facemesh.FACEMESH_LIPS.flat());
       
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
        
        // const uniqueNumbersSet = new Set(allNumbers);

        // // Convert Set back to an array
        // const uniqueNumbersArray = [...uniqueNumbersSet];

    

        const allLipLandmarks = [[61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314], [314, 405], [405, 321], [321, 375], [375, 291], [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [78, 95], [95, 88], [88, 178], [178, 87], [87, 14], [14, 317], [317, 402], [402, 318], [318, 324], [324, 308], [78, 191], [191, 80], [80, 81], [81, 82], [82, 13], [13, 312], [312, 311], [311, 310], [310, 415], [415, 308],];
        //new draw indices
        const lipIndicesUpper = [ 61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 61,409, 291,308,  415, 310, 311, 312, 13, 82, 81, 80, 191,78];

        const lipIndicesLower = [ 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78];

        //const lipIndicesUpper = [61, 146, 146, 91, 91, 181, 181, 84, 84, 17, 17, 314, 314, 405, 405, 321, 321, 375, 375, 291, 61, 185, 185, 40, 40, 39, 39, 37, 37, 0, 0, 267, 267, 269, 269, 270, 270, 409, 409, 291, 308];

        //const lipIndicesLower = [78, 95, 95, 88, 88, 178, 178, 87, 87, 14, 14, 317, 317, 402, 402, 318, 318, 324, 324, 308, 78, 191, 191, 80, 80, 81, 81, 82, 82, 13, 13, 312, 312, 311, 311, 310, 310, 415, 415, 308];


        const upperLipPath = new Path2D();
         const multiplier = isModelImage ? 500 : videoWidth;
        for (const index of lipIndicesUpper) {
          upperLipPath.lineTo(
            landmarks[index].x * multiplier,
            landmarks[index].y * videoHeight
          );
        }
        upperLipPath.closePath();
        const lowerLipPath = new Path2D();

        for (const index of lipIndicesLower) {
          lowerLipPath.lineTo(
            landmarks[index].x * canvasElement.width,
            landmarks[index].y * canvasElement.height
          );
        }
        lowerLipPath.closePath();
        const adjustedLipColor = adjustColorIntensity(lipColor, 0.6666);
        canvasCtx.shadowColor = adjustedLipColor; // Shadow color
        canvasCtx.shadowBlur = 1; // Shadow blur radius
        canvasCtx.shadowOffsetX = 0; // Horizontal shadow offset
        canvasCtx.shadowOffsetY = 0; // Vertical shadow offset
        canvasCtx.fillStyle = adjustedLipColor;
        if(lipColor){
          canvasCtx.fill(upperLipPath);
        }
        if(lipColor){
          canvasCtx.fill(lowerLipPath);
        }
        canvasCtx.shadowColor = 'transparent';
        canvasCtx.shadowBlur = 0;
        canvasCtx.shadowOffsetX = 0;
        canvasCtx.shadowOffsetY = 0;

      }
    }
    canvasCtx.restore();
  }
  const modeldemo=(e)=>{
    setModelview(true);
    setModelGallery(false);
    setModelimg(e);
  }
  const processImageWithFacemesh = async () => {
    // Step 1: Load the image
    const img = new Image();
    img.src = modelimg;
  
    // Wait for the image to load
    img.onload = async () => {
      // Step 2: Convert Image to Canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);
  
      // Step 3: Send Canvas Image to facemesh
      const faceMesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });
  
      // Set options for facemesh
      faceMesh.setOptions({
        maxNumFaces: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
  
      faceMesh.onResults(onResults);
  
      // Send the canvas image to facemesh
      await faceMesh.send({ image: canvas });
    };
  };
  
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
  useEffect(() => {
    processImageWithFacemesh();
  },[modelimg,lipColor])

  return (
      <div className="p-5">
        <div className="p-2 relative w-[100%] h-full  flex">
          <div className="w-[50%]">
            
            {appmodal?
            <>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={()=>setAppmodel(false)}
              className="h-[30px] w-[30px] right-[30px] relative cursor-pointer float-right z-[99999] text-[#fff] bg-[#000] rounded-2xl p-1"
              >
              <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              />
            </svg>

              <Webcam
                ref={webcamRef}
                className="absolute left-[100px] top-[0px] w-[500px] [480px] z-[9] text-center"
              />
              <canvas
                ref={canvasRef}
                className="absolute left-[100px] top-[0px]  w-[500px]  z-[9] text-center"
              ></canvas>
            </>
            :
            <div className="w-[70%] text-white font-bold rounded-3xl p-5 m-auto">
              {!modelview?
              <div className="w-[100%] text-white font-bold rounded-3xl p-5 m-auto bg-cover bg-no-repeat bg-center bg-blend-multiply bg-[#302b27] bg-[url('/public/model-bg.jpg')]">
                <div className="live-main h-full flex flex-col justify-center w-70p mx-[15%]">
                    <h2 tabIndex="0" data-radium="true" className="text-center mt-0 mb-4 text-18 font-bold font-roboto">
                        Choose Try-On Experience</h2>
                    <button type="button" aria-label="enter live camera" onClick={()=>{setAppmodel(true);setModelimg("")}} className="flex flex-col justify-center items-center border-2 border-[#ef3f78] cursor-pointer bg-transparent text-white p-5 w-full rounded-3xl h-[14vw] mb-4">
                        <img alt="live" src="live-makeup.png" className="mb-3p h-[5.4vw]"/>
                        <div className="text-center whitespace-normal text-17 leading-22">Live Makeup
                        </div>
                    </button>
                    <div data-radium="true" className="model-main flex items-center justify-between">
                        <button type="button" aria-label="choose a model"  onClick={()=>setModelGallery(!modelGallery)} className="flex flex-col justify-center items-center border-2 border-[#ef3f78] cursor-pointer bg-transparent text-white p-5 rounded-full w-28 h-28">
                            <img alt="choose-model" src="choose-model.png" className="h-10 w-12 mb-1"/>
                            <div  className="text-center text-14 leading-19">Choose a Model</div> 
                          
                
                        </button>
                        <div className="upload-main">
                            <button type="button" aria-label="upload a photo" className="flex flex-col justify-center items-center border-2 border-[#ef3f78] cursor-pointer bg-transparent text-white p-5 rounded-full w-28 h-28">
                                <img alt="upload" src="img-upload.png" className="h-10 w-12 mb-1"/>
                                <div className="text-center text-14 leading-19">Upload a Photo</div>
                            </button>
                            
                        </div>
                    </div>
                    
                </div>
                
              </div>:
              <div className="absolute top-0 flex">
                
                <canvas ref={canvasRef} className="max-w-[85%]  cursor-pointer border-2 p-3"></canvas>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={()=>setModelview(false)}
                  className="h-[30px] w-[30px] right-[0px] relative cursor-pointer float-right z-[99999] text-[#fff] bg-[#000] rounded-2xl p-1"
                >
                  <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  />
                </svg>
               {/* <img src={modelimg} alt="model1 image" className="max-w-[100%] m-[1%] cursor-pointer border-2 p-3" /> */}
              </div>
              }
              {modelGallery?

              <div className="flex m-auto w-[100%] justify-center rounded-3xl p-[15px] bg-[#EF3F78]">
                <img src="model1.jpg" alt="model1 image" className="max-w-[30%] m-[1%] cursor-pointer"   onClick={(e)=>{modeldemo("model1.jpg");setLipColor("")}}/>
                {/* <img src="model2.jpg" alt="model2 image"  className="max-w-[30%]  m-[1%]  cursor-pointer" onClick={(e)=>{modeldemo("model2.jpg");setLipColor("")}}/> */}
                <img src="model3.jpg" alt="model3 image"  className="max-w-[30%]  m-[1%]  cursor-pointer" onClick={(e)=>{modeldemo("model3.jpg");setLipColor("")}}/>
                <img src="model4.jpg" alt="model4 image"  className="max-w-[30%]  m-[1%]  cursor-pointer" onClick={(e)=>{modeldemo("model4.jpg");setLipColor("")}}/>

              </div>
              :""}
            </div>
            }
          </div>
          <div className="w-[50%]  text-white font-bold rounded-3xl p-5  h-[480px] ">
            <label className="text-[#000] block text-[20px]">Choose Color</label>
            <button type="button" className="bg-[#f23b77] w-[50px] h-[50px] rounded-[100%] border-1 border-[#f23b77] m-2" onClick={(e) => setLipColor("#f23b77")}></button>
            <button type="button" className="bg-[#BB1A4B] w-[50px] h-[50px] rounded-[100%] border-1 border-[#BB1A4B] m-2" onClick={(e) => setLipColor("#BB1A4B")}></button>
            <button type="button" className="bg-[#A11564] w-[50px] h-[50px] rounded-[100%] border-1 border-[#A11564] m-2" onClick={(e) => setLipColor("#A11564")}></button>
            <button type="button" className="bg-[#903739] w-[50px] h-[50px] rounded-[100%] border-1 border-[#903739] m-2" onClick={(e) => setLipColor("#903739")}></button>
            <button type="button" className="bg-[#EB5494] w-[50px] h-[50px] rounded-[100%] border-1 border-[#EB5494] m-2" onClick={(e) => setLipColor("#EB5494")}></button>
            <button type="button" className="bg-[#FF0000] w-[50px] h-[50px] rounded-[100%] border-1 border-[#FF0000] m-2" onClick={(e) => setLipColor("#FF0000")}></button>
          </div>
        </div>
      </div>
    

  );
}

export default App;
