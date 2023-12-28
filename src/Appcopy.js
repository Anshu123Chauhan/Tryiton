import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState } from "react";
import * as Facemesh from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  var camera = null;

  const [lipColor, setLipColor] = useState("#da0533");
  const [eyeColor, setEyeColor] = useState("#30FF30");

  function fillArea(ctx, landmarks, indices, { color }) {
    // Check if landmarks and indices are valid
    if (landmarks && landmarks.length > 0 && indices && indices.length > 1) {
      const firstIndices = indices[0];
      const secondIndices = indices[1];
      // Check if both indices from the arrays are within the landmarks bounds
      if (
        firstIndices[0] < landmarks.length &&
        firstIndices[1] < landmarks.length &&
        secondIndices[0] < landmarks.length &&
        secondIndices[1] < landmarks.length
      ) {
        const startPoint1 = landmarks[firstIndices[0]];
        const startPoint2 = landmarks[firstIndices[1]];
        const endPoint1 = landmarks[secondIndices[0]];
        const endPoint2 = landmarks[secondIndices[1]];
        ctx.beginPath();
        ctx.moveTo(startPoint1.x, startPoint1.y);
        ctx.lineTo(startPoint2.x, startPoint2.y);
        ctx.lineTo(endPoint2.x, endPoint2.y);
        ctx.lineTo(endPoint1.x, endPoint1.y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        console.error("Invalid indices or landmarks data format.");
      }
    } else {
      console.error("Invalid landmarks or indices data.");
    }
  }
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
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
        //   color: "#C0C0C070",
        //   lineWidth: 1,
        // });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          color: "#FF3030",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
          color: "#FF3030",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          // color: "#30FF30",
          color: eyeColor,
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
          color: "#30FF30",
        });
        // connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
        //   color: "#E0E0E0",
        // });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: "#00000",
        });
        connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          color: lipColor,
        });
        // fillArea(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
        //   color: lipColor,
        // });

        // const upperEyeLandmarks = [
        //   landmarks[263],y
        //   landmarks[249],
        //   landmarks[390],
        //   landmarks[373],
        //   landmarks[374],
        //   landmarks[380],
        //   landmarks[381],
        //   landmarks[382],
        // ];
        // for (let i = 0; i < upperEyeLandmarks.length - 1; i++) {
        //   const startPoint = upperEyeLandmarks[i];
        //   const endPoint = upperEyeLandmarks[i + 1];
        //   canvasCtx.beginPath();
        //   canvasCtx.moveTo(startPoint.x * videoWidth, startPoint.y * videoHeight);
        //   canvasCtx.lineTo(endPoint.x * videoWidth, endPoint.y * videoHeight);
        //   canvasCtx.strokeStyle = "#000"; // Red color
        //   canvasCtx.lineWidth = 2;
        //   canvasCtx.stroke();
        // }
      }
    }
    canvasCtx.restore();
  }
  // }

  // setInterval(())
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
  }, [lipColor,eyeColor]);
  const myStyles = {
    display: 'flex',
    position: 'absolute',
    bottom: '10%',
    left: '20%',
    width: '50%',
  };
  return (
    <>
      <center>
        <div className="App">
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
        <div className="btnContainer" style={myStyles}>
          <div style={{ position: "absolute", bottom: "10%", left: "45%" }}>
            <label>Select Eye Color:</label>
            <input
              type="color"
              value={eyeColor}
              onChange={(e) => setEyeColor(e.target.value)}
            />
          </div>
          <div>
            <label>Select Lip Color:</label>
            <input
              type="color"
              value={lipColor}
              onChange={(e) => setLipColor(e.target.value)}
            />
          </div>
        </div>
      </center>
    </>
  );
}

export default App;