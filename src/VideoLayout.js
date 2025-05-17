import React, { useEffect, useRef, useState } from "react";

const KitchenViewer = () => {
  const skyRef = useRef(null);
  const cameraRigRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(60000); // default rotation speed
  const [currentImage, setCurrentImage] = useState("/images/kitchen2.jpg");
  const [fov, setFov] = useState(80); // default FOV value
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

    const handlePinch = e => {
      const scale = rig.getAttribute("scale");
      const newScale = e.detail.scale;
      const clamped = Math.min(Math.max(scale.x * newScale, 0.5), 3);
      rig.setAttribute("scale", `${clamped} ${clamped} ${clamped}`);
    };

    rig.addEventListener("pinchmove", handlePinch);
    return () => {
      rig.removeEventListener("pinchmove", handlePinch);
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
    setFov(80); // reset to default FOV
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* A-Frame Viewer */}
      <a-scene embedded vr-mode-ui="enabled: false">
        <a-entity
          id="cameraRig"
          ref={cameraRigRef}
          gesture-detector
          scale="1 1 1"
        >
          <a-camera
            ref={cameraRef}
            wasd-controls-enabled="false"
            look-controls
            position="0 1.6 0"
          />
        </a-entity>
        <a-sky ref={skyRef} rotation="0 160 0" />
      </a-scene>

      {/* Thumbnail Images */}
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

      {/* Control Panel */}
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
