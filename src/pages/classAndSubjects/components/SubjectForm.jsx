import { Button, CircularProgress, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import Controls from '../../../components/controls/Controls'
import { Form, useForm } from '../../../components/helper/useForm'
import { dbRealtime, storage } from '../../../firebase/FirebaseConfig'
import { getDownloadURL, ref as StorageRef, uploadBytesResumable } from 'firebase/storage'
import { toast } from 'react-toastify'

const initialValue={
    name:"",
    iconUrl:"",
    class_id:"",
    class_name:""
}
function SubjectForm(props) {
    const { recordForEdit, addOrEdit, progress, SetProgress } = props
    const [uploadProgress,setUploadProgress]=useState(false);

    //category data
    const [categories,setCategories]=useState([]);

 

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."

        if ('iconUrl' in fieldValues)
            temp.iconUrl = fieldValues.iconUrl ? "" : "This field is required."

        if ('class_id' in fieldValues)
            temp.class_id = fieldValues.class_id ? "" : "This field is required."

        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const { values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm } = useForm(initialValue, true, validate)


        const handleImageChooser=(event)=>{
            if(event.target.files && event.target.files[0]){
              let img=event.target.files[0]
              uploadImage(img);
            }
           
          }
      
          const uploadImage=async (file)=>{
            if(!file){
              toast.error("Please select a file first");
              return
            }
            setUploadProgress(true)
            const fileName=`${file.name}_${Date.now()}`;
            const storageRef=StorageRef(storage,`/iconUrl/${fileName}`)
            const uploadTask=uploadBytesResumable(storageRef,file)
            uploadTask.on("state_changed",(snapshot)=>{
              const percent=(snapshot.bytesTransferred/snapshot.totalBytes) * 100
              console.log(percent)
      
            },(err) => console.log(err),
            ()=> {
              //get download url
              setUploadProgress(false)
              getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
                setValues({...values,iconUrl:url})
              })
            }
            );
          }   

    const handleSubmit = (event) => {
        event.preventDefault();
        if(validate()){
            addOrEdit(values.subject_id,values,resetForm)
        }
    }

    const getCategories=()=>{
        //realtime update
        const docRef=ref(dbRealtime,"boardClass")
        onValue(docRef,(snapshot)=>{
            if(snapshot.exists()){
                const data=snapshot.val();
                setCategories(Object.values(data))
            }
        })
    }


  useEffect(()=>{
    if(recordForEdit!=null){
        setValues({...recordForEdit});
    }

    getCategories();
  },[]);  

  useEffect(()=>{
    console.log(categories)
  },[categories])


  return (
    <Form onSubmit={handleSubmit}>
        <Controls.Input
          name="name"
          label="Subject Name"
          value={values.name}
          onChange={handleInputChange}
          error={errors.name}
          />

          <Stack direction="column">
            {
                values.iconUrl && <>
                    <img src={values.iconUrl} alt="" width="200px" height="200px" />
                </>
            }
            <TextField
                  variant='outlined'
                  label="Icon Image"
                  name='iconUrl'
                  value={values.iconUrl}
                  onChange={handleInputChange}
                  error={errors.iconUrl}
                  InputProps={{
                      endAdornment: (
                          <InputAdornment position='end'>
                              {uploadProgress ?
                                  <CircularProgress /> :
                                
                                  <Button variant='outlined' color='primary' component="label">
                                      Upload
                                      <input hidden
                                          accept="image/*"
                                          id='iconImage'
                                          multiple type="file"
                                          onChange={handleImageChooser}
                                      />
                                  </Button>
                              }
                          </InputAdornment>
                      )
                  }}
                  InputLabelProps={{
                      shrink: true,
                  }} />
          </Stack>

              
               <FormControl fullWidth>
                    <InputLabel id="select-class-category">Select Class Name</InputLabel>
                    <Select
                        labelId="select-class-category"
                        id="simple-select"
                        name="class_id"
                        label="Select Class Name"
                        value={values.class_id}
                        error={errors.class_id}
                        onChange={handleInputChange}
                        
                        >
                             <MenuItem value=""><em>none</em></MenuItem>
                           {
                            categories.map((item)=>(
                                <MenuItem 
                                  value={item.id}
                                  >
                                    {item.title}
                                </MenuItem>
                            ))
                           }
                            
                        </Select>
                        {errors.class_id && <FormHelperText>{errors.class_id}</FormHelperText>}
                </FormControl>
               
        

          <Button 
            sx={{mt:2}}
            type="submit"
            variant='contained'>
                Submit
            </Button>
    </Form>
  )
}

export default SubjectForm