import React, { useEffect, useRef, useState } from "react";

const KitchenViewer = () => {
  const skyRef = useRef(null);
  const cameraRigRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(60000);
  const [currentImage, setCurrentImage] = useState("/images/kitchen2.jpg");
  const [fov, setFov] = useState(80);
  const cameraRef = useRef(null);
  const thumbnails = [
    "/images/elevation.webp",
    "/images/livingroom.webp",
    "/images/kamalsir.jpeg",
    "/images/kitchen2.jpg",
    "/images/hall.webp"
  ];

  useEffect(
    () => {
      if (skyRef.current) {
        skyRef.current.setAttribute("src", currentImage);
        if (isPlaying) {
          skyRef.current.setAttribute("animation", {
            property: "rotation",
            to: "0 360 0",
            loop: true,
            dur: speed,
            easing: "linear"
          });
        } else {
          skyRef.current.removeAttribute("animation");
        }
      }
      if (cameraRef.current) {
        cameraRef.current.setAttribute("camera", { fov });
      }
    },
    [currentImage, speed, isPlaying, fov]
  );

  useEffect(() => {
    const rig = cameraRigRef.current;
    if (!rig) return;

    let baseScale = 1;

    const handleTwoFingerStart = () => {
      const scale = rig.getAttribute("scale");
      baseScale = parseFloat(scale.x);
    };

    const handleTwoFingerMove = event => {
      const spread = event.detail.spread || 1;
      let newScale = baseScale * spread;

      // Clamp scale between 0.5x and 3x
      newScale = Math.max(0.5, Math.min(3, newScale));
      rig.setAttribute("scale", `${newScale} ${newScale} ${newScale}`);
    };

    rig.addEventListener("twofingerstart", handleTwoFingerStart);
    rig.addEventListener("twofingermove", handleTwoFingerMove);

    return () => {
      rig.removeEventListener("twofingerstart", handleTwoFingerStart);
      rig.removeEventListener("twofingermove", handleTwoFingerMove);
    };
  }, []);

  const handleThumbnailClick = imgSrc => setCurrentImage(imgSrc);
  const handlePause = () => setIsPlaying(false);
  const handlePlay = () => setIsPlaying(true);
  const increaseSpeed = () => setSpeed(prev => Math.max(prev - 10000, 10000));
  const decreaseSpeed = () => setSpeed(prev => prev + 10000);
  const resetZoom = () => {
    if (cameraRigRef.current) {
      cameraRigRef.current.setAttribute("scale", "1 1 1");
    }
    setFov(80);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* A-Frame Viewer */}
      <a-scene embedded vr-mode-ui="enabled: false" gesture-detector>
        <a-entity
          id="cameraRig"
          ref={cameraRigRef}
          position="0 1.6 0"
          scale="1 1 1"
        >
          <a-camera
            ref={cameraRef}
            wasd-controls-enabled="false"
            look-controls
          />
        </a-entity>
        <a-sky ref={skyRef} rotation="0 160 0" />
      </a-scene>

      {/* Thumbnails */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex space-x-4 px-4">
        {thumbnails.map((src, index) =>
          <div
            key={index}
            onClick={() => handleThumbnailClick(src)}
            className="w-20 h-12 rounded-md overflow-hidden shadow-lg border-2 border-white hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src={src}
              alt={`thumb-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-6 py-3 flex items-center space-x-4 z-20">
        {isPlaying
          ? <button
              onClick={handlePause}
              className="text-red-500 text-2xl hover:scale-110 transition-transform"
              title="Pause"
            >
              <i className="ri-pause-circle-fill" />
            </button>
          : <button
              onClick={handlePlay}
              className="text-green-500 text-2xl hover:scale-110 transition-transform"
              title="Play"
            >
              <i className="ri-play-circle-fill" />
            </button>}

        <button
          onClick={decreaseSpeed}
          className="text-blue-500 text-xl hover:scale-110 transition-transform"
          title="Slower"
        >
          <i className="ri-subtract-line" />
        </button>

        <button
          onClick={increaseSpeed}
          className="text-blue-500 text-xl hover:scale-110 transition-transform"
          title="Faster"
        >
          <i className="ri-add-line" />
        </button>

        <button
          onClick={() => setFov(prev => Math.max(prev - 5, 30))}
          className="text-purple-500 text-xl hover:scale-110 transition-transform"
          title="Zoom In"
        >
          <i className="ri-zoom-in-line" />
        </button>

        <button
          onClick={() => setFov(prev => Math.min(prev + 5, 120))}
          className="text-purple-500 text-xl hover:scale-110 transition-transform"
          title="Zoom Out"
        >
          <i className="ri-zoom-out-line" />
        </button>

        <button
          onClick={resetZoom}
          className="text-gray-700 text-xl hover:scale-110 transition-transform"
          title="Reset Zoom"
        >
          <i className="ri-refresh-line" />
        </button>
      </div>
    </div>
  );
};

export default KitchenViewer;
