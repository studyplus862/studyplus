import { Autocomplete, Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { child, equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import TinyMceEditor from '../../../components/helper/TinyMceEditor'
import {useForm} from "../../../components/helper/useForm"
import { dbRealtime } from '../../../firebase/FirebaseConfig'



const initialValue={
    title:"",
    questions:"",
    max_marks:"",
    duration:"",
    subject_id:"",
    class_id:"",
    instructions:"<p>Write quiz instructions here..</p>"

}

function AddOrEditQuizForm(props) {

    const {recordForEdit,addOrEdit,loading}=props

    //data states
    const [categoryData,setCategoryData]=useState(["Test1","test2"]);
    const [subjectData,setSubjectData]=useState([]);
   

    
 

    //ref Hooks
    const editorRef=useRef(null);



    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('title' in fieldValues)
            temp.title = fieldValues.title ? "" : "This field is required."

        if ('questions' in fieldValues)
            temp.questions = fieldValues.questions ? "" : "This field is required."
        
        if ('duration' in fieldValues)
            temp.duration = fieldValues.duration ? "" : "This field is required."

        if ('max_marks' in fieldValues)
            temp.max_marks = fieldValues.max_marks ? "" : "This field is required."
        
        if ('class_id' in fieldValues)
            temp.class_id = fieldValues.class_id ? "" : "This field is required."
        
        if ('subject_id' in fieldValues)
            temp.subject_id = fieldValues.subject_id ? "" : "This field is required."
        
        
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }
    

 const {values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm} = useForm(initialValue,true,validate)
 
 const handleSubmit=(e)=>{
    e.preventDefault();
    
    if(validate()){
       const quizInstruction=editorRef.current.getContent();
       addOrEdit(values.quiz_id,values,quizInstruction, resetForm)
    }
 }

 //handle board class autocomplete filed
 const handleClassSelector=(event)=>{
    const value=event.target.value;
    if(value!=null){
        setSubjectData([]);
        getSubjects(value);

        //update value of class_id
        setValues({
            ...values,
            class_id:value
        })
        
    }
 }








//get board Class
 const getBoardClass=()=>{
    const dbRef=ref(dbRealtime);
    get(child(dbRef,"/boardClass/")).then((snapshot)=>{
      if(snapshot.exists()){
        const data=snapshot.val();
        setCategoryData(Object.values(data));
        console.log(data)
      }else {
        console.log("No data found");
      }
    }).catch((error)=>{
        console.log(error);
    })
  }

  //get subjects
  const getSubjects=(id)=>{
    const qRef=query(ref(dbRealtime,"/subjects"),orderByChild("class_id"),equalTo(id))
    onValue(qRef,(snapshot)=>{
      if(snapshot.exists()){
        const data=snapshot.val();
        setSubjectData(Object.values(data))
        console.log(subjectData);
      }else {
        setSubjectData([]);
      }
    })
  }

 useEffect(()=>{
    if(recordForEdit!=null){
        setValues({...recordForEdit})
    }

    getBoardClass();

 },[recordForEdit])

 useEffect(()=>{
    if(values.class_id!="" && values.class_id!=undefined){
        getSubjects(values.class_id);
        console.log(values.class_id);
    }
 },[values.class_id])



  return (
    <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                    fullWidth
                    variant='outlined'
                    label="Quiz Name"
                    type='text'
                    name='title'
                    value={values.title}
                    error={errors.title}
                    onChange={handleInputChange}/>

            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                    <TextField
                        variant='outlined'
                        label="Time (in Minutes)"
                        type='number'
                        name='duration'
                        value={values.duration}
                        error={errors.duration}
                        onChange={handleInputChange}/>
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                     <TextField
                        variant='outlined'
                        label="Total Qn."
                        type='number'
                        name='questions'
                        value={values.questions}
                        error={errors.questions}
                        onChange={handleInputChange}/>
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                 <TextField
                        variant='outlined'
                        label="Max Marks"
                        type='number'
                        name='max_marks'
                        value={values.max_marks}
                        error={errors.max_marks}
                        onChange={handleInputChange}/>
            </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mt:1}}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControl fullWidth>
                    <InputLabel id='lbl-select-class'>Select Class</InputLabel>
                    <Select
                        labelId='lbl-select-class'
                        id='select-class'
                        label="Select Class"
                        name='class_id'
                        error={errors.class_id}
                        value={values.class_id}
                        onChange={handleClassSelector}>
                            {
                                categoryData.map((item)=>(
                                    <MenuItem value={item.id}>{item.title}</MenuItem>
                                ))
                            }
                        </Select>
                        {errors.class_id &&  <FormHelperText>{errors.class_id}</FormHelperText>}
                </FormControl>
                {/* <Autocomplete
                    freeSolo
                    id='selectClass'
                    options={categoryData}
                    getOptionLabel={(option)=>option.title ||""}
                    onChange={handleClassSelector}
                    
                    renderInput={
                        (params)=>(
                            <TextField 
                                {...params} 
                                label="Select Class"
                                error={errors.subject_id}
                                helperText={errors.subject_id}/>
                        )
                    }/> */}
                   
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControl fullWidth>
                    <InputLabel id='lbl-select-subject'>Select Class</InputLabel>
                    <Select
                        labelId='lbl-select-subject'
                        id='select-subject'
                        label="Select Subject"
                        name='subject_id'
                        error={errors.subject_id}
                        value={values.subject_id}
                        onChange={handleInputChange}>
                            {
                                subjectData.map((item)=>(
                                    <MenuItem  value={item.subject_id}>{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                       {errors.subject_id &&  <FormHelperText>{errors.subject_id}</FormHelperText>}
                </FormControl>
                {/* <Autocomplete
                    id='selectSubject'
                    options={subjectData}
                    getOptionLabel={(option)=>option.name ||""}
                    onChange={handleSubjectSelector}
                    loading={loading}
                    open={openSubField}
                    onOpen={handleOpenSubField}
                    onClose={()=>setOpenSubField(false)}
                    renderInput={
                        (params)=>(
                            <TextField 
                                {...params} 
                                label="Select Subject"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment:(
                                        <>
                                            {loading?<CircularProgress color="inherit" size={20}/>:null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    )
                                }}
                                />
                        )
                    }
                    
                    /> */}
                   
            </Grid>
        </Grid>

        <Box sx={{mt:1}}>
            <TinyMceEditor
                name="Quiz Instructions"
                editorRef={editorRef}
                initValue={values.instructions}
                />
        </Box>

          {loading ? <CircularProgress /> :
              <Button
                  type='submit'
                  variant='contained'
                  sx={{ mt: 2 }}
              >
                  Submit
              </Button>
          }

    </form>
  )
}

export default AddOrEditQuizForm