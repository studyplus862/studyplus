import { Add } from '@material-ui/icons'
import { Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import PopupDialog from "../../components/Dialogs/PopupDialog"
import DeleteDialog from "../../components/Dialogs/DeleteDialog"
import PageTitle from "../../components/PageTitle/PageTitle"
import { deleteQuiz, editQuiz, insertQuiz } from '../../services/Api'
import AddOrEditQuizForm from './components/AddOrEditQuizForm'

import { child, equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database'
import { useEffect } from 'react'
import { dbRealtime } from '../../firebase/FirebaseConfig'
import QuizCardItem from './components/QuizCardItem'


function Quizzes() {
  //dialog hooks
  const [addQuizDialog,setAddQuizDialog]=useState(false)
  const [openDeleteDialog,setOpenDeleteDialog]=useState(false);

 //data states
 const [categoryData,setCategoryData]=useState([]);
 const [subjectData,setSubjectData]=useState([]);
 const [quizzesData,setQuizzesData]=useState([]);
 const [quizRecordForEdit,setQuizRecordForEdit]=useState(null);

 const [qid,setQid]=useState("");

 //loading hooks
 const [loading,setLoading]=useState(false);
 const [loading2,setLoading2]=useState(false);



 

  const addOrEditQuiz=(id,data,quizInstruction,resetForm)=>{
    setLoading2(false);
    if(id=="" || id==undefined){
      //add
      console.log(data);
      insertQuiz(data,quizInstruction).then(()=>{
        toast.success("Quiz created successfully")
        resetForm();
        setAddQuizDialog(false);
        setLoading2(false);
      }).catch((error)=>{
        toast.error("Something went wrong")
        setLoading2(false);
      })

    }else {
      //update
      editQuiz(id,data,quizInstruction).then(()=>{
        toast.success("Quiz Update successfully")
        resetForm();
        setAddQuizDialog(false);
        setLoading2(false);
      }).catch((error)=>{
        toast.error("Something went wrong")
        setLoading2(false);
      })
    }
  }

  //const handle quiz edit click
  const handleAddQuizBtn=()=>{
    setQuizRecordForEdit(null);
    setAddQuizDialog(true)
  }

  const handleEdit=item=>{
    setQuizRecordForEdit(item);
    setAddQuizDialog(true);
    console.log(item);
   
  }

  const handleDelete=id=>{
    setOpenDeleteDialog(true)
    setQid(id);
  }

  const onDelete=()=>{
    if(qid!=""){
      deleteQuiz(qid).then(()=>{
        toast.success("Deleted")
        setOpenDeleteDialog(false);
        setQid("");
      }).catch((error)=>{
        toast.error("something went wrong")
      })
    }
  }


  //handle filter inputs
  const handleClassFilter=(event)=>{
    const v=event.target.value;
    if(v!=""){
      getSubjects(v);
      //get quiz order by class_id
      getQuizOrderBy("class_id",v)
      console.log(v);
    }
  }
  const handleSubjectFilter=(event)=>{
    const value=event.target.value;
    if(value!=""){
      getQuizOrderBy("subject_id",value)
    }
  }



  //get filter data
  //get board Class
 const getBoardClass=()=>{
  const dbRef=ref(dbRealtime);
  get(child(dbRef,"/boardClass/")).then((snapshot)=>{
    if(snapshot.exists()){
      const data=snapshot.val();
      setCategoryData(Object.values(data));
      console.log(data)
    }else {
      console.log("No data found");
    }
  }).catch((error)=>{
      console.log(error);
  })
}

//get subjects
const getSubjects=(id)=>{
  const qRef=query(ref(dbRealtime,"/subjects"),orderByChild("class_id"),equalTo(id))
  onValue(qRef,(snapshot)=>{
    if(snapshot.exists()){
      const data=snapshot.val();
      setSubjectData(Object.values(data))
      console.log(subjectData);
    }else {
      setSubjectData([]);
    }
  })
}

//get quizzes all
const getAllQuizzes=()=>{
  setLoading(true);
  const qRef=query(ref(dbRealtime,"/quizzes"),orderByChild("timestamp"))
  onValue(qRef,(snapshot)=>{
    if(snapshot.exists()){
      const data=snapshot.val();
      setQuizzesData(Object.values(data))
     
    }else {
      setSubjectData([]);
    }
    setLoading(false);
  })
}

//get quiz filter by class
const getQuizOrderBy=(orderBy,id)=>{
  setLoading(true);
  const qRef=query(ref(dbRealtime,"/quizzes"),orderByChild(orderBy),equalTo(id))
  onValue(qRef,(snapshot)=>{
    if(snapshot.exists()){
      const data=snapshot.val();
      setQuizzesData(Object.values(data))
     
    }else {
      setQuizzesData([]);
    }
    setLoading(false);
  })
}

// get quizzes filter by subject

//use effect hooks
useEffect(()=>{
  getBoardClass();
  getAllQuizzes();
},[])

useEffect(()=>{
  console.log(quizzesData);
},[quizzesData])

  return (
    <>
    <ToastContainer/>
        <PageTitle title="Manage Quizzes"
            button={
                <Button 
                    variant='contained'
                    endIcon={<Add/>}
                    onClick={handleAddQuizBtn}>
                        Add Quiz
                    </Button>

            }
            />

            <Paper sx={{p:2}}>
              
              <Stack direction="row" spacing={2}>
                {/* FILTER INPUTS */}
                
              <FormControl fullWidth>
                    <InputLabel id='lbl-select-class'>Filter by Class</InputLabel>
                    <Select
                        labelId='lbl-select-class'
                        id='select-class'
                        label="Select Class"
                        name='class_id'
                        onChange={handleClassFilter}>
                            {
                                categoryData.map((item)=>(
                                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                ))
                            }
                        </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id='lbl-select-subject'>Filter by Subject</InputLabel>
                    <Select
                        labelId='lbl-select-subject'
                        id='select-subject'
                        label="Select Subject"
                        name='subject_id'
                       
                        onChange={handleSubjectFilter}>
                            {
                                subjectData.map((item)=>(
                                    <MenuItem key={item.subject_id} value={item.subject_id}>{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                       
                </FormControl>
              </Stack>
            </Paper>

          {loading && <div style={{display:"flex",justifyContent:"center",padding:"24px"}}>
             <CircularProgress/>
            </div>}

           {!loading && quizzesData.length===0?<Typography sx={{m:4}} variant='h4'>
                No content found.
           </Typography>:""} 

          <Grid container spacing={2} sx={{mt:2}}>
            {
              quizzesData.map((item)=>(
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                
                  <QuizCardItem 
                    key={item.quiz_id}
                    item={item}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    />
                </Grid>
              ))
            }         
          </Grid>


            <PopupDialog
              title="Add / Update Quiz"
              openDialog={addQuizDialog}
              setOpenDialog={setAddQuizDialog}
              disableBackdropClick={true}
              maxWidth="lg">
                <AddOrEditQuizForm
                  addOrEdit={addOrEditQuiz}
                  recordForEdit={quizRecordForEdit}
                  loading={loading2}
                  />
              </PopupDialog>

            <DeleteDialog
              title="Delete"
              openDialog={openDeleteDialog}
              setOpenDialog={setOpenDeleteDialog}
              onAction={onDelete}/>

    </>
  )
}

export default Quizzes