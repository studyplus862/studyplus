import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { child, equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { dbRealtime } from '../../../../firebase/FirebaseConfig';
import QuizSelectItems from '../innerItems/QuizSelectItems';

function AddOrEditQuizForm(props) {
  
    const {handleAddQuiz,openDialog,setOpenDialog}=props
    const [quizzesData,setQuizzesData]=useState({});
    const [selectedQuizRecord,setSelectedQuizRecord]=useState([]);
    const [loading,setLoading]=useState(false);

    const [boardClassData,setBoardClassData]=useState({
      id:"",
      title:""
    });
    const [subjectData,setSubjectData]=useState({
      id:""
    });


  
    const handleSubmit=()=>{
      handleAddQuiz(selectedQuizRecord)
    }
  
    const handleClose=()=>{
      setOpenDialog(false);
  
    }

    const handleClassFilterChange=(event)=>{
      const value=event.target.value;
      if(value!=""){
        getSubjects(event.target.value);
      }
    }
    const handleSubjectFilterChange=(event)=>{
      const sValue=event.target.value;
      if(sValue!="")
        getFilteredQuizzes(sValue);
    }
    
  const getQuizzes=()=>{
    setLoading(true);
    const dbRef=ref(dbRealtime);
    get(child(dbRef,"/quizzes/")).then((snapshot)=>{
      if(snapshot.exists()){
        const data=snapshot.val();
        setQuizzesData(data);

      }else {
        console.log("No data found");
      }
      setLoading(false);
    }).catch((error)=>{
        console.log(error);
        setLoading(false)
    })
  
  }  

  const getFilteredQuizzes=(subjectId)=>{
    setLoading(true);
   const qRef=query(ref(dbRealtime,"/quizzes"),orderByChild("subject_id"),equalTo(subjectId))
    onValue(qRef,(snapshot)=>{
        setQuizzesData(snapshot.val());
        setLoading(false);
    })
  }
  
  const getBoardClass=()=>{
    const dbRef=ref(dbRealtime);
    get(child(dbRef,"/boardClass/")).then((snapshot)=>{
      if(snapshot.exists()){
        const data=snapshot.val();
        setBoardClassData(data);
      }else {
        console.log("No data found");
      }
    }).catch((error)=>{
        console.log(error);
    })
  }

  //get subjects
  const getSubjects=(id)=>{
    const dbRef=ref(dbRealtime);
    get(child(dbRef,`/${id}/`)).then((snapshot)=>{
      if(snapshot.exists()){
        const data=snapshot.val();
        setSubjectData(data);
  
      }else {
        console.log("No data found");
      }
    }).catch((error)=>{
        console.log(error);
    })
  }





  useEffect(()=>{
    getQuizzes();
    getBoardClass();
  },[])

  useEffect(()=>{
    if(!openDialog){
      setSelectedQuizRecord([]);
    }
  },[openDialog])


  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      disableBackdropClick={true}
    >
      <DialogTitle>Add Quiz</DialogTitle>
      <DialogContentText sx={{px:2,py:1}}>
        {/* FILTER */}
        <Stack direction="row">
        <FormControl fullWidth size='small'>
          <InputLabel id="filterByClass">Filter By Class</InputLabel>
          <Select 
           labelId='filterByClass'
           id='filterClass'
           label="Filter by Class"
           onChange={handleClassFilterChange}>
            <MenuItem 
             value=""
             selected>
              <em>None</em>
            </MenuItem>
            {
              Object.values(boardClassData).map((item)=>(
                <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
              ))
            }
           </Select>
        </FormControl>
        <FormControl fullWidth  size='small'>
          <InputLabel id="filterBySubject">Select Subject</InputLabel>
          <Select
          
           labelId='filterBySubject'
           id='filterSubject'
           label="Select Subject"
           onChange={handleSubjectFilterChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {
              Object.values(subjectData).map((item)=>(
                <MenuItem key={item.subject_id} value={item.subject_id}>{item.name}</MenuItem>
              ))
            }
           </Select>
        </FormControl>
        </Stack>
      </DialogContentText>
      <DialogContent>
        
        {
          loading?<CircularProgress/>:
          <Grid container>
          {Object.values(quizzesData).map((value, index) => (
            <Grid item xs={12} md={6} lg={6} spacing={2}>
              <QuizSelectItems
              key={value.quiz_id}
              item={value}
              setSelectedQuizRecord={setSelectedQuizRecord}
              selectedQuizRecord={selectedQuizRecord}
              />
            </Grid>
            ))}     
        </Grid>
        }
      </DialogContent>
      <DialogActions>
        <Button  onClick={handleClose}>Cancel</Button>
        <Button  onClick={handleSubmit}>Save Record</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddOrEditQuizForm