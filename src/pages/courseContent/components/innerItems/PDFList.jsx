import { Box } from '@mui/material';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { dbFirestore } from '../../../../firebase/FirebaseConfig';
import PDFListItem from './PDFListItem';

function PDFList(props) {
    const {sectionId,setRecordForEdit,setPdfDialog}=props
    const [pdfData,setPdfData]=useState([]);
    

    const getPDFs=(sid)=>{

      const qRef=query(collection(dbFirestore,"COURSE_PDFS"),where("section_id","==",sid),orderBy("timestamp","asc"))
          onSnapshot(qRef,(snapshot)=>{
            setPdfData(snapshot.docs.map(doc=>({
              id:doc.id,
              data:doc.data()
             })))

             console.log(pdfData);
          });
    }

    

  useEffect(()=>{
    getPDFs(sectionId);
  },[])
  return (
    
    <Box style={{marginTop:"30px"}}>
      {pdfData.map((item)=>(
        <PDFListItem 
          key={item.key} 
          data={item.data}
          setRecordForEdit={setRecordForEdit}
          setPdfDialog={setPdfDialog}/>
      ))}
    </Box>
  )
}

export default PDFList