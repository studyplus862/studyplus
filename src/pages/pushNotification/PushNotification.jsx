import { async } from '@firebase/util'
import { Send } from '@material-ui/icons'
import { Button, CircularProgress, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import PageTitle from "../../components/PageTitle"

function PushNotification() {
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [actionUrl,setActionUrl]=useState("")

    const date=new Date()
    const todayDate=date.getDate() +"/" + date.getMonth()+ "/" + date.getFullYear()
   
    //progress
    const [progress,setProgress]=useState(false);


    const sendNotification=async (title,body,actionUrl)=>{
        setProgress(true);

        fetch("https://fcm.googleapis.com/fcm/send",{
            method:"POST",
            headers:{
                'Content-Type':"application/json",
                'Authorization':"key=AAAA7MDMLb0:APA91bGk3zNFIbhjMvkUcmB_bUIQeXTBOG3PVV_NM4SB6GVbEM8GxpBoYdMp2NiLO8rLn04IQrgb2auw0rGYrnPr-EZ2mYPbDA2bV7tlIcoZcwEikn_pjcdsQAbfnnlq2o7dG8ByLjtC"
            },
            body:JSON.stringify({
                "to":"/topics/all",
                "data":{
                    title:title,
                    body:body,
                    deeplink:actionUrl,
                    image:image,
                    date:String(todayDate),
                    sound:"yes"
                }
            })
        }).then((res)=>{
            if(res.status==200){
                toast.success("Notification send successfully")
                resetForm();
            }else{
                toast.error("Failed to send notification! try again.")
            }
            setProgress(false)
        })
        .catch((err)=>{
            console.log(err)
            setProgress(false)
            toast.error("error!- "+err)
        })
    }

    const handleSubmit=()=>{
        sendNotification(title,body,actionUrl)
    }

    const resetForm=()=>{
        setTitle("")
        setBody("")
        setImage("")
        setActionUrl("")
    }
 


  return (
    <>
    <ToastContainer/>
        <PageTitle title="Push Notifications"/>
            <Typography variant='subtitle2'>Send Notification</Typography>
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                   <Paper sx={{p:2}}>
                      <Stack direction="column" spacing={2}>
                          <TextField
                              fullWidth
                              label="Title"
                              variant='outlined'
                              value={title}
                              onChange={
                                (e)=>setTitle(e.target.value)
                              }
                              
                               />
                          <TextField
                              fullWidth
                              label="Body"
                              variant='outlined'
                              value={body}
                              onChange={
                                (e)=>setBody(e.target.value)
                              } />
                          <TextField
                              fullWidth
                              label="Image"
                              variant='outlined'
                              value={image}
                              onChange={
                                (e)=>setImage(e.target.value)
                              } />

                          <TextField
                              fullWidth
                              label="Click action URL"
                              variant='outlined'
                              value={actionUrl}
                              onChange={
                                (e)=>setActionUrl(e.target.value)
                              } />

                       {
                        progress?<CircularProgress/>:
                                  <Button type='submit'
                                      variant='contained'
                                      endIcon={<Send />}
                                      disabled={(title === "" || body === "")}
                                      onClick={handleSubmit}
                                  >
                                      Send
                                  </Button>
                       }
                      </Stack>
                   </Paper>
                </Grid>
            </Grid>
       
    </>
  )
}

export default PushNotification