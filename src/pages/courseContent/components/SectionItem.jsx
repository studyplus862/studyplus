import { Add, Delete, Edit, ExpandMore } from '@material-ui/icons'
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { deleteDoc, doc } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { dbFirestore } from '../../../firebase/FirebaseConfig';
import DeleteDialog from "../../../components/Dialogs/DeleteDialog";
import PopupDialog from '../../../components/Dialogs/PopupDialog'
import AddOrEditVideoForm from './sectionForms/AddOrEditVideoForm'
import { addPdfInSection, insertQuizInSection, insertVideoInSection, updateItemInSection, updateVideoInSection } from '../../../services/CourseService'
import { Box } from '@material-ui/core'
import VideosList from './innerItems/VideosList'
import AddOrEditPDFsForm from './sectionForms/AddOrEditPDFsForm'
import PDFList from './innerItems/PDFList'
import AddOrEditQuizForm from './sectionForms/AddOrEditQuizForm'
import QuizList from './innerItems/QuizList'


function SectionItem(props) {
    const {sectionData,courseId,setRecordForEdit,setOpenSectionDialog}=props
    const [openDeleteDialog,setOpenDeleteDialog]=useState(false);
    const [videoDialog,setVideoDialog]=useState(false);
    const [videoRecordForEdit,setVideoRecordForEdit]=useState(null);
    const [pdfRecordForEdit,setPdfRecordForEdit]=useState(null);
    const [pdfDialog,setPdfDialog]=useState(false);

    const [quizDialog,setQuizDialog]=useState(false);
    const [quizRecordForEdit,setQuizRecordForEdit]=useState(null);

    const handleSectionEdit=(item)=>{
        setOpenSectionDialog(true);
        setRecordForEdit(item);
    }

    const DeleteSectionButton=()=>(
        <Tooltip title='Delete Section'>
          <IconButton 
            variant="contained"
            onClick={()=>setOpenDeleteDialog(true)}>
            <Delete/>
        </IconButton>
        </Tooltip>
    )

    const ItemType=()=>{
        if(sectionData.data.type=="video"){
            return (
                <>
                <Stack direction="row" spacing={5} sx={{justifyContent:"space-between"}}>
                <Button variant='contained'
                    color='secondary'
                    endIcon={<Add />}
                    onClick={()=>{
                        setVideoRecordForEdit(null);
                        setVideoDialog(true)
                    }}>
                    Add Video
                </Button>
                <Typography>{sectionData.data.totalItemCount} Video(s)</Typography>    
                
                </Stack>

                {<VideosList 
                    sectionId={sectionData.id}
                    setRecordForEdit={setVideoRecordForEdit}
                    setVideoDialog={setVideoDialog}
                />}
                </>
            )
        }else if(sectionData.data.type=="pdf"){
            return(
                <>
                <Stack direction="row" spacing={5} sx={{justifyContent:"space-between"}}>
                    <Button variant='contained'
                color='primary'
                endIcon={<Add/>}
                onClick={()=>{
                    setPdfRecordForEdit(null);
                    setPdfDialog(true)
                }}>
                   Add PDF
                </Button>
                <Typography>{sectionData.data.totalItemCount} PDF(s)</Typography>
                </Stack> 
               
                <PDFList
                    sectionId={sectionData.id}
                    setRecordForEdit={setPdfRecordForEdit}
                    setPdfDialog={setPdfDialog}/>

                    </>
            )
        }else if(sectionData.data.type=="quiz"){
            return (
            <>
                <Stack direction="row" spacing={5} sx={{justifyContent:"space-between"}}>
                <Button variant='contained'
                    color='primary'
                    endIcon={<Add />}
                    onClick={()=>setQuizDialog(true)}>
                    Add Quiz
                </Button>
                <Typography>{sectionData.data.totalItemCount} Quiz(s)</Typography>
                </Stack>
                
                <QuizList 
                    sectionId={sectionData.id}
                    />
            </>
            )
        }
    }

    const addOrEditVideo=(videoId,data,resetForm)=>{
       if(videoId==null){
           insertVideoInSection(courseId,sectionData.id,data);
           toast.success("Video added successfully");
           resetForm();
           setVideoDialog(false);
       }else {
         //update
         updateVideoInSection(videoId,data,onSuccess,onFailed)
         resetForm();
         setVideoDialog(false);
       }
    }

    //add Or Edit PDF
    const addOrEditPDFs=(pdfId,data,resetForm)=>{
        if(pdfId==null){
            //add new file
            addPdfInSection(courseId,sectionData.id,data,onSuccess,onFailed)
            resetForm();
            setPdfDialog(false);
        }else {
            //update file
            updateItemInSection("COURSE_PDFS",pdfId,data,onSuccess,onFailed);
            setPdfDialog(false);
            resetForm();
        }
    }

    const handleAddQuiz=(arr)=>{
        console.log(arr)
        if(arr.length==0 || arr==undefined) {
            toast.error("Please select at least 1 item");
            return
        }
        //save record to server
        insertQuizInSection(courseId,sectionData.id,arr,onSuccess,onFailed)
        setQuizDialog(false);

       
    }


    const onSuccess=(msg)=>{
        toast.success(msg);
    }
    const onFailed=(msg)=>{
        toast.error(msg);
    }


      //delete section
    const deleteSection=async ()=>{
      if(sectionData.data.totalItemCount<=0){
        try {     
            await deleteDoc(doc(dbFirestore,"COURSE_LESSON_SECTIONS",sectionData.id))
            toast.success("Section deleted.")
          } catch (error) {
           console.log("delete")
           toast.error("Something went wrong try again")
        }
      }else {
        toast.info("First delete all item inside this section then try to delete");
      }
      setOpenDeleteDialog(false)
  }

    

  return (
    <>
   
        <Accordion>
            <AccordionSummary
             expandIcon={<ExpandMore/>}
            >
                <Stack spacing={3} sx={{width:"90%"}}  direction="row" justifyContent="space-between">
                <Box sx={{display:"flex",justifyContent:"center",maxWidth:"100%"}}>
                <Typography variant='h6'>
                    {sectionData.data.title} 
                </Typography>
                <Typography variant='body1'>
                    {sectionData.data.subtitle}
                </Typography>

                </Box>
                 <Box>
                    <DeleteSectionButton/>
                    <Tooltip title='Edit Section'>
                        <IconButton 
                            variant="contained"
                            onClick={()=>handleSectionEdit(sectionData)}>
                            <Edit/>
                        </IconButton>
                        </Tooltip>
                 </Box>

                </Stack>

            </AccordionSummary>
                
            <AccordionDetails>
                {ItemType()}
                
            </AccordionDetails>
        </Accordion>

        <DeleteDialog
            title="Delete Section"
            openDialog={openDeleteDialog}
            setOpenDialog={setOpenDeleteDialog}
            onAction={deleteSection}/>

        <PopupDialog
         disableBackdropClick={true}
         title="Add New Video"
         openDialog={videoDialog}
         setOpenDialog={setVideoDialog}
         maxWidth="xl"   
        >
          <AddOrEditVideoForm
            addOrEditVideo={addOrEditVideo}
            recordForEdit={videoRecordForEdit}
          />
        </PopupDialog>
        {/* PDF AddOrEditDialog */}
        <PopupDialog
         disableBackdropClick={true}
         title="Add/Update PDF"
         openDialog={pdfDialog}
         setOpenDialog={setPdfDialog}
         maxWidth="xl"   
        >
          <AddOrEditPDFsForm
            addOrEdit={addOrEditPDFs}
            recordForEdit={pdfRecordForEdit}
          />
         
        </PopupDialog>
        {/* PDF AddOrEdit Quiz */}
       
          <AddOrEditQuizForm
            recordForEdit={setQuizRecordForEdit}
            handleAddQuiz={handleAddQuiz}
            openDialog={quizDialog}
            setOpenDialog={setQuizDialog}
          />

    </>
 
  )
}

export default SectionItem