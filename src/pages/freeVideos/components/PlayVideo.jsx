import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react'

function PlayVideo({videoUrl}) {
    const videoRef=useRef();

    useEffect(()=>{
        console.log(videoUrl)
        videoRef.current?.load();
    },[]);

  return (
      <div>
          <video
              width="100%" height="300" controls
            //   onLoadedMetadata={handleVideoMetaData}
              ref={videoRef}
              autoPlay >
              <source src={videoUrl} type='video/mp4' />
              Your browser does not support the video tag.
          </video>
      </div>
  )
}

export default PlayVideo