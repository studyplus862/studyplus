import { Add } from '@material-ui/icons'
import { Button, Grid, Typography } from '@mui/material'
import { collection,deleteDoc, doc, onSnapshot, query, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import PopupDialog from '../../components/Dialogs/PopupDialog'
import DeleteDialog from '../../components/Dialogs/DeleteDialog'
import PageTitle from '../../components/PageTitle/PageTitle'
import { dbFirestore } from '../../firebase/FirebaseConfig'
import AddOrEditEbookForm from './components/AddOrEditEbookForm'
import EbookCardItem from './components/EbookCardItem'

function ManageEbooks() {
    //dialog hooks
   const [openDialog,setOpenDialog]=useState(false)
   const [openDeleteDialog,setOpenDeleteDialog]=useState(false);

   //data hooks
   const [recordForEdit,setRecordForEdit]=useState(null);
   const [ebookData,setEbookData]=useState([]);
   const [ebookId,setEbookId]=useState("");
   
   //progress hooks
   const [loading,setLoading]=useState(false)
   const [submitProgress,setSubmitProgress]=useState(false);



   //methods
   const addOrEdit=async (id,data,resetForm)=>{
    if(id==undefined || id==""){
        //add record
        try {
            setSubmitProgress(true)
            const docRef=doc(collection(dbFirestore,"PDF_BOOKS"))
            await setDoc(docRef,{
                id:docRef.id,
                timestamp:Timestamp.now(),
                className:data.className,
                class_id:data.class_id,
                subjectName:data.subjectName,
                subject_id:data.subject_id,
                paid:data.paid,
                pdfUrl:data.pdfUrl,
                price:parseInt(data.price),
                title:data.title,
                image:data.image,
                type:data.type
                
            })
            toast.success("Record added successfully");
            resetForm();
            setOpenDialog(false);
            setSubmitProgress(false)
        } catch (error) {
            toast.error("Something went wrong"+error)
            setSubmitProgress(false)
        }
    }
    else {
        //update record
        console.log(id);
        try {
            setSubmitProgress(true)
            const docRef=doc(dbFirestore,"PDF_BOOKS",id)
            await updateDoc(docRef,{
                modifiedAt:Timestamp.now(),
                className:data.className,
                class_id:data.class_id,
                subjectName:data.subjectName,
                subject_id:data.subject_id,
                paid:data.paid,
                pdfUrl:data.pdfUrl,
                price:parseInt(data.price),
                title:data.title,
                image:data.image,
                type:data.type
            })
            toast.success("Record updated successfully");
            resetForm();
            setOpenDialog(false);
            setSubmitProgress(false)
        } catch (error) {
            toast.error("Something went wrong"+error)
            setSubmitProgress(false)
        }
    }
   }

   //edit 
   const handleEdit=item=>{
    setOpenDialog(true);
    setRecordForEdit(item)
    console.log(item);
   }
   const handleDelete=id=>{
    setEbookId(id)
    setOpenDeleteDialog(true)
}

//onDelete Video
const onDelete=async ()=>{
    if(ebookId!=""){
        //delete document
        try {
            const docRef=doc(dbFirestore,"PDF_BOOKS",ebookId)
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

    const cRef=query(collection(dbFirestore,"PDF_BOOKS"))
    onSnapshot(cRef,(snapshot)=>{
        setEbookData(snapshot.docs.map(doc=>({
        id:doc.id,
        data:doc.data()
       })));
       setLoading(false);
    });
},[])



  return (
    <>
    <ToastContainer/>
        <PageTitle title="Manage Ebooks / Pdfs"
            button={
                <Button 
                    variant='contained'
                    endIcon={<Add/>}
                    onClick={()=>{
                        setRecordForEdit(null)
                        setOpenDialog(true);
                    }}
                    >
                    Add ebook / Pdf
                </Button>
            }/>

            {/* render ebook Card Item */}
            <Grid container spacing={2}>
                {!loading && ebookData.length>0?
                 <>
                    { ebookData.map((item)=>(
                        <Grid item key={item.id} xs={12} sm={6} md={4} lg={3} xl={3}>
                            
                            <EbookCardItem
                                item={item}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                />
                        </Grid>
                    ))}
                 </>
                :<Typography variant='h5'>No Content Found.</Typography>}
            </Grid>



            <PopupDialog
                title="Add / Update File"
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                maxWidth="lg"
                disableBackdropClick={true}>
                    <AddOrEditEbookForm
                        recordForEdit={recordForEdit}
                        addOrEdit={addOrEdit}
                        submitProgress={submitProgress}
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

export default ManageEbooks