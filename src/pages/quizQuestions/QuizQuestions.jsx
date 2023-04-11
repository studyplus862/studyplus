import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { child, equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import DeleteDialog from '../../components/Dialogs/DeleteDialog';
import PopupDialog from '../../components/Dialogs/PopupDialog';
import PageTitle from '../../components/PageTitle/PageTitle';
import { dbRealtime } from '../../firebase/FirebaseConfig';
import { addQuestion, deleteQuestion, updateQuestion } from '../../services/Api';
import AddOrEditQuestionForm from './components/AddOrEditQuestionForm';
import QuestionCardItem from './components/QuestionCardItem';

function QuizQuestions() {
   
    const {qid,title} = useParams();

    //data hooks
    const [questions,setQuestions]=useState([]);
    const [recordForEdit,setRecordForEdit]=useState(null);

    const [questionId,setQuestionId]=useState("");

    //dialog hooks
    const [open,setOpen]=useState(false);
    const [deleteDialog,setDeleteDialog]=useState(false);

    //loading hooks
    const [progress,setProgress]=useState(false);
    const [loading,setLoading]=useState(false);


 //crud methods
 const addOrEditQn=(id,data,resetForm)=>{
    setProgress(true);
    if(id==undefined || id=="" || id==null){
      //add question
      addQuestion(qid,data,resetForm).then(()=>{
        toast.success("Question added successfully!")
        setOpen(false);
        setProgress(false);
      }).catch((error)=>{
        toast.success("Something went wrong"+error)
        setProgress(false);
      })
      console.log("add")
    }else {
      updateQuestion(id,data).then(()=>{
        toast.success("Question updated successfully!")
        setOpen(false);
        setProgress(false);
      }).catch((err)=>{
        toast.success("Something went wrong"+err)
        setProgress(false);
      })
    }
 }  

 const handleEdit=item=>{
  setRecordForEdit(item);
  setOpen(true);
  console.log(item);
 
}

const handleDelete=id=>{
  setDeleteDialog(true)
  setQuestionId(id);
}

const onDelete=()=>{
  if(questionId!=null || questionId!=""){
    deleteQuestion(questionId).then(()=>{ 
      toast.success("Deleted successfully")
    }).catch((error)=>{
      toast.error("Try again!"+error)
    })
    setDeleteDialog(false);
  }
}
 



const getQuestions=(id)=>{
   setLoading(true)
    const qRef=query(ref(dbRealtime,"/questions"),orderByChild("quiz_id"),equalTo(id))
    onValue(qRef,(snapshot)=>{
    if(snapshot.exists()){
      const data=snapshot.val();
      setQuestions(Object.values(data))
      console.log(questions);
      
    }else {
      setQuestions([]);
    }
    setLoading(false)
  })
  
}


useEffect(()=>{
    if(qid!=undefined && qid!=""){
        console.log(qid);
        getQuestions(qid);
    }
},[])

  return (
    <>
    <ToastContainer/>
        <PageTitle title={title}
            button={
                <Button 
                    variant='contained'
                    onClick={()=>{
                      setOpen(true)
                      setRecordForEdit(null);
                    }}>
                        Add question
                    </Button>
            }
            />

          {loading && <div style={{display:"flex",justifyContent:"center"}}><CircularProgress /></div>}
          {!loading && questions.length==0? <Typography variant='h5'>
            No Questions found.
          </Typography>
            :
            <Grid container spacing={2}>
              {
                  questions.map((item, index) => (
                      <Grid item key={item.question_id} xs={12} sm={12} md={6} lg={6} xl={6}>
                          <QuestionCardItem
                              item={item}
                              index={index}
                              handleEdit={handleEdit}
                              handleDelete={handleDelete} />
                      </Grid>
                  ))
              }
          </Grid>  
        }

          <PopupDialog
            title="Add / Update Question"
            openDialog={open}
            setOpenDialog={setOpen}
            disableBackdropClick={true}
            maxWidth="lg">
                <AddOrEditQuestionForm
                   addOrEdit={addOrEditQn}
                   recordForEdit={recordForEdit}
                   progress={progress}
                  />
            </PopupDialog>


            <DeleteDialog
              title="Delete"
              openDialog={deleteDialog}
              setOpenDialog={setDeleteDialog}
              onAction={onDelete}/>
    </>
  )
}

export default QuizQuestions