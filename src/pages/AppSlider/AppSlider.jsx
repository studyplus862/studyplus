import { Delete, Edit } from '@material-ui/icons';
import { Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import DeleteDialog from '../../components/Dialogs/DeleteDialog';
import PopupDialog from '../../components/Dialogs/PopupDialog';
import PageTitle from '../../components/PageTitle/PageTitle';
import { dbRealtime } from '../../firebase/FirebaseConfig';
import { addAppSlider, deleteAppSlider, editAppSlider } from '../../services/Api';
import SlideAddOrEditForm from './components/SlideAddOrEditForm';


function AppSlider() {
  
  //data hooks
  const [slideData,setSlideData]=useState([]);
  const [recordForEdit,setRecordForEdit]=useState([]);
  const [sid,setSid]=useState("");

  //dialog hooks
  const [openDialog,setOpenDialog]=useState(false);
  const [deleteDialog,setDeleteDialog]=useState(false);

  //loading hook
  const [loading,setLoading]=useState(false);
  const [progress,setProgress]=useState(false);

  const addOrEdit=(id,data,resetForm)=>{
    if(id===undefined || id===null){
      console.log(id)
      setProgress(true);
      //add
      addAppSlider(data).then(()=>{
        toast.success("Data added successfully")
        setProgress(false)
        setOpenDialog(false)
        resetForm();

      }).catch((error)=>{
        toast.error("Error! "+error);
        setProgress(false)
      })
    }else {
      //update
      editAppSlider(id,data).then(()=>{
        toast.success("Data edit successfully")
        setProgress(false)
        setOpenDialog(false)
        resetForm();
      }).catch((error)=>{
        toast.error("Error! "+error);
        setProgress(false)
      })
    }
  }

  const handleDelete=id=>{
    setSid(id);
    setDeleteDialog(true)
  }

  const actionDelete=()=>{
    if(sid!=""){
      deleteAppSlider(sid).then(()=>{
        toast.success("Deleted");
        setDeleteDialog(false);

      }).catch((error)=>{
        toast.error("error"+error)
        setDeleteDialog(false)
      })
    }
  }


  useEffect(()=>{

    const docRef=ref(dbRealtime,"imageSlider")
         onValue(docRef,(snapshot)=>{
             if(snapshot.exists()){
                 const data=snapshot.val();
                 setSlideData(Object.values(data));
             }else {
              setSlideData([]);
             }
             setLoading(false)
         });

  },[])



  return (
    <>
    <ToastContainer/>
      <PageTitle title="App Slider"
        button={
          <Button 
            variant='contained'
            onClick={()=>{
              setOpenDialog(true)
              setRecordForEdit(null);
            }}
            >
              Add New Slide
            </Button>
        }/>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Action Url</TableCell>              
                <TableCell>Edit</TableCell>              
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
               {
                slideData.map((item)=>(
                  <TableRow>
                    <TableCell>
                      <img src={item.image} alt="Slide Image" width="360px" height="180px"/>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body1'>{item.click_action}</Typography>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant='outlined' color='success' startIcon={<Edit/>}
                        onClick={()=>{
                          setRecordForEdit(item);
                          setOpenDialog(true);
                        }
                        }
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant='outlined' color='error' startIcon={<Delete/>}
                        onClick={()=>handleDelete(item.slide_id)}>
                          Delete
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
               }
            </TableBody>
          </Table>
        </Paper>

        <PopupDialog
          title="Add/Update Slider"
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          maxWidth="lg">
              <SlideAddOrEditForm
                addOrEdit={addOrEdit}
                recordForEdit={recordForEdit}
                progress={progress}/>

          </PopupDialog>

          <DeleteDialog
           title="Delete"
           openDialog={deleteDialog}
           setOpenDialog={setDeleteDialog}
           onAction={actionDelete}/>
    </>
  )
}

export default AppSlider