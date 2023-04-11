import { Card, CardContent, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import PageTitle from '../../components/PageTitle/PageTitle';
import { insertCourse } from '../../services/CourseService';
import InputCourseForm from './components/InputCourseForm';


function AddOrEditCourse() {
  const [progress,setProgress] = useState(false);
  const [alert,setAlert]=useState(false);
  const ref=useRef()

  const addOrEdit = (docId,data,cDescription, resetForm) => {
    setProgress(true);
    if (docId == null){
      insertCourse(data,cDescription)
      resetForm()
      setProgress(false)
      setAlert(true);
      toast.success("New Course Created successfully")
      scrollToTop()
    }
  }

  const scrollToTop=()=>{
    window.scrollTo({
      top:0,
      behavior:"smooth"
    })
  }




  return (
    <>
    <ToastContainer/>
    <PageTitle title="Add New Course"/>
    {/*  ALERT */}
    <Collapse in={alert} >
      <Alert severity="success"
        action={
          <IconButton
          aria-label='close'
          color='inherit'
          size='small'
          onClick={()=>setAlert(false)}>
           <Close fontSize='inherit'/> 
          </IconButton>
        }
        style={{marginBottom:"16px"}}>
          <AlertTitle>Success</AlertTitle>
          Course has been created — <Link to="/app/courses">Check Courses</Link>
        </Alert>

    </Collapse>
       <Card>
         <CardContent>
            <InputCourseForm
              addOrEdit={addOrEdit}
              progress={progress}
              setProgress={setProgress}
            />
         </CardContent>
       </Card>
    </>
  )
}

export default AddOrEditCourse