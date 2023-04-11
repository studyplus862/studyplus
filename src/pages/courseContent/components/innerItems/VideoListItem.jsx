import { Card } from '@material-ui/core'
import { DeleteOutline, Edit } from '@material-ui/icons'
import { Button, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import DeleteDialog from '../../../../components/Dialogs/DeleteDialog'
import { decreaseChildCount, deleteDocument } from '../../../../services/CourseService'

function VideoListItem(props) {
  const {data,setRecordForEdit,setVideoDialog}=props
  const [openDialog,setOpenDialog]=useState(false);

  const handleEdit=(data)=>{
    setRecordForEdit(data)
    setVideoDialog(true);
  }

  const handleDelete=()=>{
    deleteDocument("COURSE_VIDEOS",data.video_id,onSuccess,onFailed)
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
        <img src={data.thumbnail_url} alt={data.title} width="150" height="100%"/>
        
        <Stack direction="column" spacing={2}>
          <Typography variant='h6'>{data.title}</Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              variant='outlined' 
              size='small'
              onClick={()=>handleEdit(data)}
              startIcon={<Edit/>}>
                Edit
              </Button>
            <Button 
              variant='outlined' 
              color='secondary' 
              size='small'
              style={{color:"red"}}
              onClick={()=>setOpenDialog(true)}
              startIcon={<DeleteOutline/>}>
                Delete
              </Button>
          </Stack>
        </Stack>
      </Stack>

      <DeleteDialog
          title="Delete Video"
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onAction={handleDelete}/>
 
    </Card>


  )
}

export default VideoListItem