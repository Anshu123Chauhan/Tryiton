import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect,useState } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import { fill } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;
  const [lipColor, setLipColor] = useState("#da0533");
  // function onResults(results) {
  //   const videoWidth = webcamRef.current.video.videoWidth;
  //   const videoHeight = webcamRef.current.video.videoHeight;

  //   // Set canvas width
  //   canvasRef.current.width = videoWidth;
  //   canvasRef.current.height = videoHeight;

  //   const canvasElement = canvasRef.current;
  //   const canvasCtx = canvasElement.getContext("2d");
  //   canvasCtx.save();
  //   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  //   canvasCtx.drawImage(
  //     results.image,
  //     0,
  //     0,
  //     canvasElement.width,
  //     canvasElement.height
  //   );
  //   if (results.multiFaceLandmarks) {
  //     for (const landmarks of results.multiFaceLandmarks) {
  //       // connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
  //       //   color: "#C0C0C070",
  //       //   lineWidth: 1,
  //       // });
  //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
  //         color: "#FF3030",
  //         lineWidth: 1,
  //       });
  //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
  //         color: "#FF3030",
  //         lineWidth: 1,
  //       });
       
  //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
  //         color: "#30FF30",
  //         lineWidth: 1,
  //       });
  //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
  //         color: "#30FF30",
  //         lineWidth: 1,
  //       });
        
  //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
  //         color: "#E0E0E0",
  //         lineWidth: 1,
  //       });
       
  //       connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
  //         color: "maroon",
  //         lineWidth: 3,
          
  //       });
       
        
  //     }
  //   }
  //   canvasCtx.restore();
  // }

  // }


  function onResults(results) {
    // console.log(Facemesh);
    // const video = webcamRef.current.video;
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
        console.log("Facemesh_Eye", Facemesh.FACEMESH_LIPS);

        const allNumbers = Facemesh.FACEMESH_LIPS.flat();

        // Use Set to store unique numbers
        const uniqueNumbersSet = new Set(allNumbers);

        // Convert Set back to an array
        const uniqueNumbersArray = [...uniqueNumbersSet];

        console.log("uniqueNumbersArray", uniqueNumbersArray);

        const allLipLandmarks = [ [61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314], [314, 405], [405, 321], [321, 375], [375, 291], [61, 185], [185, 40], [40, 39], [39, 37], [37, 0], [0, 267], [267, 269], [269, 270], [270, 409], [409, 291], [78, 95], [95, 88], [88, 178], [178, 87], [87, 14], [14, 317], [317, 402], [402, 318], [318, 324], [324, 308], [78, 191], [191, 80], [80, 81], [81, 82], [82, 13], [13, 312], [312, 311], [311, 310], [310, 415], [415, 308], ];

        // const lipIndicesUpper = [ 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, ];

        // const lipIndicesLower = [ 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 191, 80, 81, 82, 13, 312, 311, 310, 415, ];

        const lipIndicesUpper = [ 61, 146, 146, 91, 91, 181, 181, 84, 84, 17, 17, 314, 314, 405, 405, 321, 321, 375, 375, 291, 61, 185, 185, 40, 40, 39, 39, 37, 37, 0, 0, 267, 267, 269, 269, 270, 270, 409, 409, 291, 308 ];

        const lipIndicesLower = [ 78, 95, 95, 88, 88, 178, 178, 87, 87, 14, 14, 317, 317, 402, 402, 318, 318, 324, 324, 308, 78, 191, 191, 80, 80, 81, 81, 82, 82, 13, 13, 312, 312, 311, 311, 310, 310, 415, 415, 308 ];

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

        canvasCtx.fillStyle = lipColor;
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
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, [lipColor]);
  return (
    <center>
      <div className="App">
      <div>
            <label>Select Lip Color:</label>
            <input
              type="color"
              value={lipColor}
              onChange={(e) => setLipColor(e.target.value)}
            />
          </div>
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />{" "}
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        ></canvas>
        
      </div>
    </center>
  );
}

export default App;
