import {
    Button,
    Card, CardContent, CircularProgress, Grid, IconButton, Table, TableBody,
    TableCell, TableHead, TableRow, TextField, Typography
} from '@material-ui/core'

import { Add, Delete, Edit } from '@material-ui/icons'
import { Stack } from '@mui/material'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import DeleteDialog from '../../components/Dialogs/DeleteDialog'
import PopupDialog from '../../components/Dialogs/PopupDialog'
import PageTitle from '../../components/PageTitle/PageTitle'
import { dbFirestore } from '../../firebase/FirebaseConfig'
import CategoryForm from './components/CategoryForm'



function CourseCategory() {
    const [catName,setCatName]=useState("");
    const [categories,setCategories]=useState([]);

    const [inputError,setInputError]=useState(false)
    const [progress,setProgress] = useState(false)

    const [openPopup,setOpenPopup] = useState(false);
    const [catId,setCatId]=useState(null)

    const [updateDialog,setUpdateDialog]=useState(false)
    const [recordForEdit,setRecordForEdit]=useState(null);
    const [editProgress,setEditProgress]=useState(false)

    //toast 
    const toastSuccess=(msg)=>{
        toast.success(msg,{
            theme:"colored"
        });
    }

    const handleAddCategory=async()=>{
        //check if catName is Not empty
        if(catName==""){
            setInputError(true)
            return
        }

        //store category
        try {
            setProgress(true);
            const docRef=doc(collection(dbFirestore,"COURSE_CATEGORIES"))
            await setDoc(docRef,{
                id:docRef.id,
                title:catName,
                timestamp:Timestamp.now()
            });
    
            console.log(docRef.id);
            setProgress(false);
            toastSuccess("Category added successfully");
            setCatName(""); 
            
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateDialog=item=>{
        setUpdateDialog(true);
        setRecordForEdit(item)
    }
    const addOrEdit=async (id,title)=>{ 
        setEditProgress(true)
        const dcRef=doc(dbFirestore,"COURSE_CATEGORIES",id)
        await updateDoc(dcRef,{
            title:title
        })
        setUpdateDialog(false)
        setEditProgress(false)
        toastSuccess("Record edit successfully")
    }
    
    const handleDelete=item=>{
        setOpenPopup(true);
        setCatId(item.id);
    }

    const deleteCategory=async()=>{
        setOpenPopup(false);
        await deleteDoc(doc(dbFirestore,"COURSE_CATEGORIES",catId))      
        toast.success("Category has been deleted",{
            theme:"colored"
        })
       
    }

    useEffect(()=>{
            const qRef=query(collection(dbFirestore,"COURSE_CATEGORIES"),orderBy("timestamp","asc"))
            onSnapshot(qRef,(snapshot)=>{
               setCategories(snapshot.docs.map(doc=>({
                id:doc.id,
                data:doc.data()
               })))
            })
        
    },[])

  return (
   <>
        <PageTitle title="Course Categories" />
        <ToastContainer/>

          <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                 <Card>
                    <CardContent>
                        <Stack spacing={4}>
                            <Typography variant='h5'>New Category</Typography>
                          <TextField
                           error={inputError}
                           variant='outlined' label="Category Name" onChange={(e)=>setCatName
                        (e.target.value)}
                        value={catName}/>
                        
                          {progress? <CircularProgress/> :
                          <Button variant='contained' color='primary' endIcon={<Add/>}  onClick={handleAddCategory}>Add Category</Button>
                          }
                        </Stack>
                    </CardContent>
                 </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                 <Card>
                    <CardContent>
                        {categories.length>0?<>         
                            <Table>
                                <TableHead>
                                    <TableRow key="header">
                                        <TableCell>CategoryName</TableCell>
                                        <TableCell>Edit</TableCell>
                                        <TableCell>Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map((item)=>(
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {item.data.title}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={()=>handleUpdateDialog(item)}>
                                                    <Edit/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton 
                                                  color='secondary' 
                                                  label="delete"
                                                  onClick={()=>handleDelete(item)}>
                                                    <Delete/>
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                    
                        </> : "No category found."}
                        
                    </CardContent>
                 </Card>
              </Grid>
          </Grid>

      <DeleteDialog 
       title="Delete Category"
       openDialog={openPopup}
       setOpenDialog={setOpenPopup}
       onAction={deleteCategory}/>

       <PopupDialog
            title="Update"
            openDialog={updateDialog}
            setOpenDialog={setUpdateDialog}>
            <CategoryForm
               recordForEdit={recordForEdit}
               addOrEdit={addOrEdit}  
               progress={editProgress}
               setProgress={setEditProgress}
             />
        </PopupDialog>
                                        



   </>
  )
}

export default CourseCategory