import { Add, Delete, Edit } from '@material-ui/icons'
import { Button, Card, CardContent, CardHeader, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import PageTitle from '../../components/PageTitle/PageTitle'
import PopupDialog from '../../components/Dialogs/PopupDialog'
import DeleteDialog from '../../components/Dialogs/DeleteDialog'
import { dbRealtime } from '../../firebase/FirebaseConfig'
import { deleteItem, deleteSubject, editBoardClass, editSubject, insertBoardClass, insertSubject } from '../../services/Api'
import CategoryForm from '../courseCategory/components/CategoryForm'
import SubjectForm from './components/SubjectForm'
import { CircularProgress } from '@mui/material'

function ManageClassAndSubject() {

    const [openClassDialog,setOpenClassDialog]=useState(false);
    const [openSubDialog,setOpenSubDialog]=useState(false);
    const [catDeleteDialog,setCatDeleteDialog]=useState(false);
    const [subDelDialog,setDelDialog]=useState(false);

    const [categoryRecord,setCategoryRecord]=useState(null);
    const [subjectRecord,setSubjectRecord]=useState(null);

    const [classData,setClassData]=useState([]);
    const [subjectData,setSubjectData]=useState([]);
    const [catId,setCatId]=useState("");
    const [subId,setSubId]=useState("");

    const [loading1,setLoading1]=useState(false);
    const [loading2,setLoading2]=useState(false);

    const addOrEditCategory=(id,data)=>{
        if(id==""){
            //add record
            insertBoardClass(data,onSuccess,onFailed);
            setOpenClassDialog(false);
        }else {
            //update record
            console.log(id);
            editBoardClass(id,data,onSuccess,onFailed);
            setOpenClassDialog(false);
        }
    
    }

    const addOrEditSubject=(id,data,resetForm)=>{
        if(id=="" || id==undefined || id==null){
            //add New Data
            insertSubject(data,onSuccess,onFailed);
            resetForm();
            setOpenSubDialog(false)
            
        }else {
            //update data
            editSubject(id,data,onSuccess,onFailed);
            resetForm();
            setOpenSubDialog(false)
        }
        console.log(id);
    }

    const onDeleteCategory=()=>{
        if(catId!=""){
            deleteItem(catId,onSuccess,onFailed);
            setCatDeleteDialog(false);
        }
    }
    const onDeleteSubject=()=>{
        if(subId!=""){
            deleteSubject(subId,onSuccess,onFailed);
            setDelDialog(false);
        }else {
            toast.error("something went wrong.null sub id")
        }
    }
    const handleDelete=id=>{
        setCatId(id);
        setCatDeleteDialog(true);
    }


    const onSuccess=(msg)=>{
        toast.success(msg)
    }
    const onFailed=(msg)=>{
        toast.error(msg)
    }

    //const get categories

    const getCategories=()=>{
        setLoading1(true);
        //realtime update
        const docRef=ref(dbRealtime,"boardClass")
        onValue(docRef,(snapshot)=>{
            if(snapshot.exists()){
                const data=snapshot.val();
                setClassData(data)
            }else {
                setClassData([]);
            }
            setLoading1(false)
        })
    }

    const getSubjects=()=>{
        setLoading2(true);
         //realtime update
         const docRef=ref(dbRealtime,"subjects")
         onValue(docRef,(snapshot)=>{
             if(snapshot.exists()){
                 const data=snapshot.val();
                 setSubjectData(Object.values(data));
             }else {
                setSubjectData([]);
             }
             setLoading2(false)
         })
    }
    const getSubjectFilterByClass=(subjectId)=>{
         //realtime update
         setLoading2(true);
         const qRef=query(ref(dbRealtime,"subjects/"),orderByChild("class_id"),equalTo(subjectId))
         onValue(qRef,(snapshot)=>{
             if(snapshot.exists()){
                 const data=snapshot.val();
                 setSubjectData(Object.values(data));
                 console.log(subjectData)
             }else {
                setSubjectData([]);
             }
             setLoading2(false);
         })
    }

// class name edit button click action
    const handleEditCat=item=>{
        setCategoryRecord(item);
        setOpenClassDialog(true);
    }
   // subject edit click action
   const handleSubjectEdit=item=>{
        setSubjectRecord(item)
        setOpenSubDialog(true);
   } 

   const handleDeleteSubject=id=>{
    console.log("id_"+id);
    setSubId(id);
    setDelDialog(true);
}

const handleClassFilter=(event)=>{
    let id=event.target.value;
    if(id!=="")
        getSubjectFilterByClass(id)
}



    useEffect(()=>{
        getCategories();
        getSubjects();
    },[])

  return (
    <>
    <ToastContainer/>
        <PageTitle title="Manage Class & Subjects"/>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Card>
                    <CardHeader
                        subheader="Manage Class"
                        action={
                            <Button 
                                variant='outlined'
                                endIcon={<Add/>}
                                onClick={()=>{
                                    setCategoryRecord(null);
                                    setOpenClassDialog(true)
                                }}
                                >
                               Add New 
                            </Button>
                        }
                    />
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Class Name</strong></TableCell>
                                    <TableCell align="right"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading1 && <CircularProgress sx={{m:5}}/>}
                               {
                                Object.values(classData).map((item)=>(
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.title}
                                    </TableCell>
                                    <TableCell align="right">
                                       <IconButton
                                            color='primary'
                                            onClick={
                                                ()=>handleEditCat(item)
                                            }
                                        >
                                            <Edit/>
                                       </IconButton>
                                       <IconButton 
                                         color='error'
                                          disabled={true}
                                        //   onClick={()=>handleDelete(item.id)}
                                        //   ={item.id=="subjects_10th"?true:false}
                                          >
                                            <Delete/>
                                       </IconButton>
                                    </TableCell>
                                </TableRow>
                                ))
                               }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <Card>
                    <CardHeader
                        subheader="Manage Subjects"
                        action={
                            <Button 
                                variant='outlined' 
                                endIcon={<Add/>}
                                onClick={()=>{
                                    setOpenSubDialog(true)
                                    setSubjectRecord(null);
                                }
                                }>
                                    New Subject
                            </Button>
                        }
                    />
                    <CardContent>
                        {/* filter by category */}
                        <FormControl fullWidth>
                        <InputLabel id="select-class-category">Filter by Class</InputLabel>
                              <Select
                                  labelId="select-class-category"
                                  id="simple-select"
                                  name="class_id"
                                  label="Select Class Name"
                                  
                                  onChange={handleClassFilter}>
                                  <MenuItem value=""><em>none</em></MenuItem>
                                  {
                                       Object.values(classData).map((item) => (
                                          <MenuItem
                                              value={item.id}
                                          >
                                              {item.title}
                                          </MenuItem>
                                      ))
                                  }

                              </Select>

                        </FormControl>
                        
                    <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Subject Name</strong></TableCell>
                                    <TableCell align="right"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading2 && <CircularProgress sx={{m:5}}/>}
                                 { subjectData.length<=0?
                                    <TableRow>
                                        <TableCell colSpan="3">
                                           <Typography variant='body1'>No Data Found</Typography>
                                        </TableCell>
                                    </TableRow> :""
                                 }
                               {
                                subjectData.map((item)=>(
                                <TableRow key={item.subject_id}>
                                    <TableCell>
                                        <Typography variant='subtitle'>{item.name}</Typography>
                                        
                                    </TableCell>
                                    <TableCell align="right">
                                       <IconButton
                                            color='primary'
                                            onClick={
                                                ()=>handleSubjectEdit(item)
                                            }
                                        >
                                            <Edit/>
                                       </IconButton>
                                       <IconButton 
                                         color='error'
                                          disabled={item.id=="subjects_10th"?true:false}
                                          onClick={()=>handleDeleteSubject(item.subject_id)}
                                          >
                                            <Delete/>
                                       </IconButton>
                                    </TableCell>
                                </TableRow>
                                ))
                               }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </Grid>
        </Grid>

        <PopupDialog
            title="Add/Update Class"
            openDialog={openClassDialog}
            setOpenDialog={setOpenClassDialog}
            maxWidth="lg">
            <CategoryForm
                addOrEdit={addOrEditCategory}
                recordForEdit={categoryRecord}/>
         </PopupDialog>
        <PopupDialog
            title="Add / Update Subject"
            openDialog={openSubDialog}
            setOpenDialog={setOpenSubDialog}
            maxWidth="lg"
             >
            <SubjectForm
                addOrEdit={addOrEditSubject}
                recordForEdit={subjectRecord}/>
         </PopupDialog>

         <DeleteDialog
            title="Delete"
            openDialog={catDeleteDialog}
            setOpenDialog={setCatDeleteDialog}
            onAction={onDeleteCategory}/>

         <DeleteDialog
            title="Delete"
            openDialog={subDelDialog}
            setOpenDialog={setDelDialog}
            onAction={onDeleteSubject}/>
    </>
  )
}

export default ManageClassAndSubject