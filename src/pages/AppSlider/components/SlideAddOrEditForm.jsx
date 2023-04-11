import { AddPhotoAlternate } from '@material-ui/icons';
import { BrowseGallery } from '@mui/icons-material';
import { Button, CircularProgress, FormControl, IconButton, InputAdornment, TextField } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Form, useForm } from '../../../components/helper/useForm';
import { storage } from '../../../firebase/FirebaseConfig';



const initialValue = {
    image:"",
    click_action:"",

}

function SlideAddOrEditForm({addOrEdit,recordForEdit,progress}) {
    //progress hook
    const [uploadProgress,setUploadProgress]=useState(false);

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('image' in fieldValues)
            temp.image = fieldValues.image ? "" : "This field is required."

        if ('click_action' in fieldValues)
            temp.click_action = fieldValues.click_action ? "" : "This field is required."

        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const { 
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm } = useForm(initialValue, true, validate)


     const handleSubmit=(ev)=>{
        ev.preventDefault();
        if(validate()){
            addOrEdit(values.slide_id,values,resetForm);
        }
     }   

    const handleImageChooser = (event) => {
        if(event.target.files && event.target.files[0]){
            let img=event.target.files[0]
            uploadImage(img);
          }
    }

    
    


     //upload Image 
     const uploadImage=async (file)=>{
        if(!file){
          toast.error("Please select a file first");
          return
        }
        setUploadProgress(true)
        const fileName=`${file.name}_${Date.now()}`;
        
        const storageRef=ref(storage,`/slideImages/${fileName}`)
        const uploadTask=uploadBytesResumable(storageRef,file)
        uploadTask.on("state_changed",(snapshot)=>{
          const percent=(snapshot.bytesTransferred/snapshot.totalBytes) * 100
  
        },(err) => console.log(err),
        ()=> {
          //get download url
          setUploadProgress(false)
          getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
            setValues({...values,image:url})
          })
        }
        );
      }

      useEffect(()=>{
        if(recordForEdit!=null){
            setValues({...recordForEdit})
        }
      },[recordForEdit])


  return (
    <Form onSubmit={handleSubmit}>
       {values.image &&  <img src={values.image} width={360} height={180} />}
             
                 <TextField
                    fullWidth
                     variant='outlined'
                     label="Image URL"
                     name='image'
                     value={values.image}
                     onChange={handleInputChange}
                     error={Boolean(errors.image)}
                     InputProps={{
                         endAdornment: (
                        
                             <InputAdornment position='end'>
                                 {uploadProgress ?
                                     <CircularProgress /> :
                                     <IconButton color='primary'
                                     aria-label="upload picture" component="label"
                                     >
                                         <input hidden
                                             accept="image/*"
                                             id='sliderImage'
                                             multiple type="file"
                                             onChange={handleImageChooser}
                                             />
                                             <AddPhotoAlternate/>
                                     </IconButton>

                                 }
                             </InputAdornment>
                         )
                     }}
                     InputLabelProps={{
                         shrink: true,
                     }} />
        
             
             <TextField 
                fullWidth
                variant='outlined'
                label="Click Action URL"
                name="click_action"
                value={values.click_action}
                onChange={handleInputChange}
                error={Boolean(errors.click_action)}/>

        {progress?<CircularProgress/>:
                <Button 
                    variant='contained'
                    type="submit">
                        Submit
                    </Button>}

    </Form>
  )
}

export default SlideAddOrEditForm