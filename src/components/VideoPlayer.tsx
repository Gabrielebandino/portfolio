import React from "react";
import b2sVideo from "../assets/videos/b2svideo.mp4";
import "../assets/styles/Creativity.scss";

function VideoPlayer() {
  return (
    <div className="video-component">
      <video
        src={b2sVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="creativity-video"
        aria-hidden="true"
      />
    </div>
  );
}

export default VideoPlayer;
