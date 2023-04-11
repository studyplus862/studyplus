import { Box } from '@material-ui/core';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { dbFirestore } from '../../../../firebase/FirebaseConfig';
import VideoListItem from './VideoListItem';

function VideosList(props) {
    const {sectionId,setRecordForEdit,setVideoDialog}=props
    const [videosData,setVideosData]=useState([]);

    const getVideos=(sid)=>{
      console.log(sid);
      const qRef=query(collection(dbFirestore,"COURSE_VIDEOS"),where("section_id","==",sid),orderBy("timestamp","asc"))
          onSnapshot(qRef,(snapshot)=>{
            setVideosData(snapshot.docs.map(doc=>({
              id:doc.id,
              data:doc.data()
             })))

             console.log(videosData);
          });
    }

  useEffect(()=>{
    getVideos(sectionId);
  },[])
    
  return (
    
    <Box style={{marginTop:"30px"}}>
      {videosData.map((item)=>(
        <VideoListItem 
          key={item.key} 
          data={item.data}
          setRecordForEdit={setRecordForEdit}
          setVideoDialog={setVideoDialog}/>
      ))}
    </Box>
  )
}

export default VideosList