import React from 'react';

const Video = ({ title, url, img }) => {
  return (
    <video
      muted={true}
      loop={true}
      autoPlay={true}
      controls={false}
      title={title}
      width="100%"
    >
      <source src={url} type="video/mp4" />
      <img src={img} />
    </video>
  );
};

export default Video;
