import { ArrowRightAlt, CloudUploadSharp } from '@material-ui/icons';
import { Button, CircularProgress, Stack } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Controls from '../../../../components/controls/Controls';
import { Form, useForm } from '../../../../components/helper/useForm';
import LinearProgressWithLabel from '../../../../components/ProgressBar/LinearProgressWithLabel';
import { storage } from '../../../../firebase/FirebaseConfig';


const initialValue={
    pdfUrl:"",
    title:""
}
// const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?.pdf$');

function AddOrEditPDFsForm(props) {
    const {recordForEdit,addOrEdit}=props;

    const[progress,setProgress]=useState();
    const [uploadProgress,setUploadProgress]=useState(0);


    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('title' in fieldValues)
            temp.title = fieldValues.title ? "" : "This field is required."

        if ('pdfUrl' in fieldValues)
            temp.pdfUrl = fieldValues.pdfUrl? "" : "Valid pdf file required"
        

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


     const handleSubmit=(event)=>{
        event.preventDefault();
        if(validate()){
            addOrEdit(values.pdf_id,values,resetForm) 
        }
     }

     const handleFileChooser=(event)=>{
        if(event.target.files && event.target.files[0]){
            const pdfFile=event.target.files[0];

            uploadPDF(pdfFile);
          }
     }

     //upload Image 
     const uploadPDF=async (file)=>{
        if(!file){
          toast.error("Please select a file first");
          return
        }
        const fileName=`${file.name}-${Date.now()}`;
        console.log(fileName);
        setProgress(true)
        const storageRef=ref(storage,`/pdfFiles/${fileName}`)
        const uploadTask=uploadBytesResumable(storageRef,file)
        uploadTask.on("state_changed",(snapshot)=>{
          const percent=(snapshot.bytesTransferred/snapshot.totalBytes) * 100
          setUploadProgress(percent)
  
        },(err) => console.log(err),
        ()=> {
          //get download url
          setProgress(false)
          getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
            setValues({...values,pdfUrl:url})
          })
        }
        );
      }

     useEffect(()=>{
        if(recordForEdit!=null){
            setValues({...recordForEdit});
        }
     },[recordForEdit]);

  return (
   <Form onSubmit={handleSubmit}>
        {progress && <LinearProgressWithLabel value={uploadProgress}/>}
            {values.pdfUrl? <iframe src={values.pdfUrl} width="100%" height={350}/>:""}
           
                
               <Stack>
                {progress? <CircularProgress/> : <Button 
                            style={{width:"98%"}}      
                            variant='outlined' 
                            color='primary' 
                            component="label"
                            endIcon={<CloudUploadSharp/>}>
                            Upload PDF File
                            <input hidden
                                accept="application/pdf"
                                id='inputVideoFile'
                                multiple type="file"
                                onChange={handleFileChooser}
                                
                            />
                        </Button> }
               </Stack>
          
        <Controls.Input
            style={{marginTop:"24px",width:"98%"}}
            name="pdfUrl"
            label="Pdf url"
            value={values.pdfUrl}
            onChange={handleInputChange}
            error={errors.pdfUrl}/>
        <Controls.Input
            style={{width:"98%"}}
            name="title"
            label="title"
            value={values.title}
            onChange={handleInputChange}
            error={errors.title}/>

            <Button sx={{my:2}} type='submit' variant='contained' endIcon={<ArrowRightAlt/>}>
                {recordForEdit?"Update Record":"Add New Record"}
            </Button>
   </Form>
  )
}

export default AddOrEditPDFsForm