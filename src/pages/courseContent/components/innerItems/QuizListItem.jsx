import { Card } from '@material-ui/core'
import { DeleteOutline } from '@material-ui/icons'
import { Button, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import DeleteDialog from '../../../../components/Dialogs/DeleteDialog'
import { decreaseChildCount, deleteDocument } from '../../../../services/CourseService'
import quizBg from "../../../../images/quiz_bg.png";

function VideoListItem(props) {
  const {data}=props
  const [openDialog,setOpenDialog]=useState(false);



  const handleDelete=()=>{
    console.log(data);
    deleteDocument("COURSE_QUIZZES",data.doc_id,onSuccess,onFailed)
    setOpenDialog(false)
  }

  const onSuccess=(msg)=>{
    toast.success(msg)
       // //decrease child count
     decreaseChildCount("COURSE_LESSON_SECTIONS",data.section_id);
       
  }
  const onFailed=(msg)=>{
    toast.error(msg);
  }


  return (
    <Card variant='outlined' style={{marginTop:4,width:"auto !important"}}>
   
        <Stack direction="row" spacing={2} sx={{p:1}}>
        <img src={quizBg} alt={data.title} width="150" height="100%"/>
        
        <Stack direction="column" spacing={2}>
          <Typography variant='h6'>{data.title}</Typography>
          <Stack direction="row" spacing={2}>
            {/* <Button 
              variant='outlined' 
              size='small'
              onClick={()=>handleEdit(data)}
              startIcon={<Edit/>}>
                Edit
              </Button> */}
            <Button 
              variant='outlined' 
              color='secondary' 
              size='small'
              style={{color:"red"}}
              onClick={()=>setOpenDialog(true)}
              startIcon={<DeleteOutline/>}>
                Remove
              </Button>
          </Stack>
        </Stack>
      </Stack>

      <DeleteDialog
          title="Remove Quiz"
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onAction={handleDelete}/>
 
    </Card>
  )
}

export default VideoListItem