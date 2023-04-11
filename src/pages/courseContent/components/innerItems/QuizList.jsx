import { Box } from '@material-ui/core';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { dbFirestore } from '../../../../firebase/FirebaseConfig';
import QuizListItem from './QuizListItem';

function QuizList(props) {
    const {sectionId}=props
    const [quizData,setQuizData]=useState([]);

    const getQuizzes=(sid)=>{
      console.log(sid);
      const qRef=query(collection(dbFirestore,"COURSE_QUIZZES"),where("section_id","==",sid))
          onSnapshot(qRef,(snapshot)=>{
            setQuizData(snapshot.docs.map(doc=>({
              id:doc.id,
              data:doc.data()
             })))

             console.log(quizData);
          });
    }

  useEffect(()=>{
    getQuizzes(sectionId);
  },[])
    
  return (
    
    <Box style={{marginTop:"30px"}}>
      {quizData.map((item)=>(
        <QuizListItem 
          key={item.key} 
          data={item.data}
          />
      ))}
    </Box>
  )
}

export default QuizList