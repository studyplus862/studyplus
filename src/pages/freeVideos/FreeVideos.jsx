import { AddCardOutlined, AddCircleOutline } from '@mui/icons-material'
import { Button, CircularProgress, Grid, Typography } from '@mui/material'
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import PopupDialog from '../../components/Dialogs/PopupDialog'
import DeleteDialog from '../../components/Dialogs/DeleteDialog'
import PageTitle from '../../components/PageTitle/PageTitle'
import { dbFirestore } from '../../firebase/FirebaseConfig'
import AddOrEditFreeVideoForm from './components/AddOrEditFreeVideoForm'
import VideoCardItem from './components/VideoCardItem'
import { async } from '@firebase/util'

function FreeVideos() {
    //dialog hooks
    const [openDialog,setOpenDialog]=useState(false);
    const [openDeleteDialog,setOpenDeleteDialog]=useState(false);

    //data hooks
    const [recordForEdit,setRecordForEdit]=useState(null);
    const [videosData,setVideosData]=useState([]);
    const [vidId,setVidId]=useState("");

    //progress hooks
    const [submitProgress,setSubmitProgress]=useState(false)
    const [loading,setLoading]=useState(false);


    //methods
    const addOrEdit=async (id,data,resetForm)=>{
        setSubmitProgress(true)
        if(id===undefined || id==="" ){
            try {
                const docRef=doc(collection(dbFirestore,"FREE_VIDEOS"));
                await setDoc(docRef,{
                    timestamp:Timestamp.now(),
                    video_id:docRef.id,
                    ...data
                });
            //toast 
            toast.success("Video added successfully.")
            setOpenDialog(false);
            resetForm();
            setSubmitProgress(false)
            } catch (error) {
                toast.error("something went wrong.")
                console.log(error);
                setSubmitProgress(false)
            }
        }else {
            //update 
            const docRef = doc(dbFirestore, "FREE_VIDEOS",id);
            try {
                //Update data
             await updateDoc(docRef, {
                ...data
            }) 
            
            toast.success("Video updated successfully.")
            setOpenDialog(false);
            resetForm();
            setSubmitProgress(false)
            } catch (error) {
                console.log( error);
                toast.error("something went wrong.")
                setSubmitProgress(false)
            }
        } 
    }

    //handle card button clicks
    const handleEditVideo=item=>{
        setOpenDialog(true);
        setRecordForEdit(item)
    }
    const handleDelete=id=>{
        setVidId(id)
        setOpenDeleteDialog(true)
    }


  

    //onDelete Video
    const onDelete=async ()=>{
        if(vidId!=""){
            //delete document
            try {
                const docRef=doc(dbFirestore,"FREE_VIDEOS",vidId)
                await deleteDoc(docRef)
                toast.success("Record has been deleted");
                setOpenDeleteDialog(false)
            } catch (error) {
                console.log(error)
                toast.error("Error!")
                setOpenDeleteDialog(false)

            }
        }
    }


    useEffect(()=>{
        setLoading(true);
        const cRef=query(collection(dbFirestore,"FREE_VIDEOS"))
        onSnapshot(cRef,(snapshot)=>{
            setVideosData(snapshot.docs.map(doc=>({
            id:doc.id,
            data:doc.data()
           })));
           setLoading(false);
        });
    },[])

  return (
    <>
    <ToastContainer/>
        <PageTitle title="Free Videos"
            button={
                <Button variant='contained'
                    endIcon={<AddCircleOutline/>}
                    onClick={()=>{
                        setOpenDialog(true)
                        setRecordForEdit(null);
                    }}>
                        Add Video
                    </Button>
            }/>

            {/* Card Content */}
            {loading && <div style={{display:"flex",justifyContent:"center"}}><CircularProgress/></div>}
            {
                !loading && videosData.length==0? 
                    <Typography variant='h5'>No Videos found</Typography>:
                    <Grid container spacing={2}>
                {
                    videosData.map((item)=>(
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={item.id}>
                            <VideoCardItem 
                                item={item}
                                handleEditVideo={handleEditVideo}
                                handleDelete={handleDelete}
                            />
                        </Grid>
                    ))
                }
            </Grid>
            }


            <PopupDialog
                title="Add/Update Video"
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                disableBackdropClick={true}
                maxWidth="lg">
                    <AddOrEditFreeVideoForm
                        recordForEdit={recordForEdit}
                        addOrEdit={addOrEdit}
                        submitProgress={submitProgress}/>
                </PopupDialog>

                <DeleteDialog
                    title="Delete"
                    openDialog={openDeleteDialog}
                    setOpenDialog={setOpenDeleteDialog}
                    onAction={onDelete}/>
                    
         
    </>
  )
}

export default FreeVideos