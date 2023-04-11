import { Paper } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Button, Typography } from '@mui/material';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import PopupDialog from "../../components/Dialogs/PopupDialog";
import PageTitle from "../../components/PageTitle/PageTitle";
import { dbFirestore } from '../../firebase/FirebaseConfig';
import { insertSection, updateSection } from '../../services/CourseService';
import SectionForm from './components/SectionForm';
import SectionItem from './components/SectionItem';

function CourseContent(props) {
    const location=useLocation()
    // const courseId=
    const courseName=location.state?.title;
    const [courseId,setCourseId]=useState(location.state?.courseId);
    const [sectionData,setSectionData]=useState([]);
    const [openSectionDialog,setOpenSectionDialog]=useState(false)
    const [progress,setProgress]=useState(false)

    const [sectionRecordForEdit,setSectionRecordForEdit]=useState(null);
   


    const addOrEditSection=(id,data,resetForm)=>{
      if(id==null){
        // add record
        insertSection(data,courseId)
        resetForm();
        setOpenSectionDialog(false)
        toast.success("Section Added Successfully")
      }else {
        //update record
        console.log("update"+id);
        updateSection(id,data,onSuccess,onFailed);
        resetForm()
        setOpenSectionDialog(false);
      }
    }

     //interface methods
 const onSuccess=(msg)=>{
  toast.success(msg);
}
const onFailed=(msg)=>{
  toast.error(msg);
}
  
    useEffect(()=>{
      console.log(courseId)
      if(courseId==undefined){
        window.history.back();
      }
      const qRef=query(collection(dbFirestore,"COURSE_LESSON_SECTIONS"),where("course_id","==",courseId),orderBy("timestamp","asc"))
          onSnapshot(qRef,(snapshot)=>{
              setSectionData(snapshot.docs.map(doc=>({
              id:doc.id,
              data:doc.data()
             })))
          });

    },[])

    
  return (
    <>
    <ToastContainer/>
      <PageTitle 
        title={courseName}
        button={
            <Button 
                variant='contained'
                color='primary' 
                endIcon={<Add/>}
                onClick={()=>{
                  setSectionRecordForEdit(null);
                  setOpenSectionDialog(true)
                }}
                >
                    Add New Section
            </Button>
        }
      />

        <div>
          {sectionData.length>0?  
          <>{sectionData.map((item)=>(
            <SectionItem
              key={item.id}
              courseId={courseId}
              sectionData={item}
              setRecordForEdit={setSectionRecordForEdit}
              setOpenSectionDialog={setOpenSectionDialog}
            />
          ))} </> : 
            <Paper style={{padding:"16px"}}>
              <Typography variant='h6'>No Section Found.</Typography>
            </Paper>
          }
        </div>


      <PopupDialog
        title="Add New Section"
        openDialog={openSectionDialog}
        setOpenDialog={setOpenSectionDialog}
        maxWidth="lg">
          <SectionForm
            addOrEditSection={addOrEditSection}
            progress={progress}
            setProgress={setProgress}
            recordForEdit={sectionRecordForEdit}            
          />
      </PopupDialog>

     
    </>
  )
}

export default CourseContent