import { Button, CircularProgress, Grid, InputAdornment } from '@material-ui/core'
import { ArrowRight, CheckSharp, Delete } from '@material-ui/icons'
import { Autocomplete, Chip, FormControl, FormHelperText, IconButton, Stack, TextField } from '@mui/material'

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'

import { toast } from 'react-toastify'
import Controls from '../../../components/controls/Controls'
import TinyMceEditor from '../../../components/helper/TinyMceEditor'
import { Form, useForm } from "../../../components/helper/useForm"
import { dbFirestore, storage } from '../../../firebase/FirebaseConfig'


const dummyimage="https://dummyimage.com/600x400/a1a1a1/e8e8e8.jpg&text=No+Image";

const initValue={
  title:"",
  image:dummyimage,
  original_price:"",
  discount:0,
  finalPrice:0,
  validity:0,
  category_id:"",
  tags:[],
  shortHighlights:[],
  status:"draft",
  course_description:"<p>Course Description</p>"
}

const statusValue=[
  {
    id:"draft",
    title:"Draft"
  },
  {
    id:"public",
    title:"Public"

  }
]


function InputCourseForm(props) {
  const {recordForEdit,addOrEdit,progress,setProgress} = props

  const [selectedImage,setSelectedImage] = useState(dummyimage)
  const [categories,setCategories]=useState([])
  const [shortHighlights,setShortHighlights]= useState([])
  const [tags,setTags] = useState([])
  const [uploadProgress,setUploadProgress] = useState(false)

  const [docId,setDocId]=useState(null);
  const editorRef= useRef(null)
 
 
  const validate=(fieldValues = values) => {

    let temp = { ...errors }
        if ('title' in fieldValues)
            temp.title = fieldValues.title ? "" : "This field is required."
        if ('original_price' in fieldValues)
            temp.original_price = fieldValues.original_price>0 ? "" : "This field is required."
         
        if ('finalPrice' in fieldValues)
            temp.original_price = fieldValues.finalPrice>0 ? "" : "This field is required."
         
        if ('category_id' in fieldValues)
            temp.category_id = fieldValues.category_id ? "" : "This field is required."
         
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
    resetForm
} = useForm(initValue, true, validate);



   //toast 
   const errorToast=(msg)=>{
    toast.error(msg,{
        theme:"colored"
    });
}
    const handleImageChooser=(event)=>{
      if(event.target.files && event.target.files[0]){
        let img=event.target.files[0]
        setSelectedImage(URL.createObjectURL(img));
        uploadImage(img);
      }
     
    }

    const uploadImage=async (file)=>{
      if(!file){
        errorToast("Please select a file first");
        return
      }
      setUploadProgress(true)
      const fileName=`${file.name}_${Date.now()}`
      const storageRef=ref(storage,`/thumbnails/${fileName}`)
      const uploadTask=uploadBytesResumable(storageRef,file)
      uploadTask.on("state_changed",(snapshot)=>{
        const percent=(snapshot.bytesTransferred/snapshot.totalBytes) * 100
        console.log(percent)

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

    const calculateDiscount=()=>{
      let discountedPrice=(values.original_price*values.discount)/100
      let finalPrice=Math.ceil(values.original_price-discountedPrice);
      setValues({...values,finalPrice:finalPrice})
    }


    const handleSubmit=(e)=>{
      e.preventDefault();
      const cDescription=editorRef.current.getContent();
      

      if(validate()){
        addOrEdit(docId,values,cDescription,resetForm)     
      }
      
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

    useEffect(()=>{
      if(recordForEdit!=null){
        setValues({...recordForEdit});
        setTags(recordForEdit.tags);
        setShortHighlights(recordForEdit.shortHighlights);
        setDocId(recordForEdit.course_id);
      }
    },[recordForEdit])
    
  return (
    <>
    <Form onSubmit={handleSubmit}>
     <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Stack direction="column">
              <Controls.Input
                fullWidth
                name="title"
                label="Course Title"
                value={values.title}
                onChange={handleInputChange}
                error={errors.title}
              />
              
              <Grid container>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Controls.Input
                    type='number'
                    label="Original Price"
                    name='original_price'
                    value={values.original_price}
                    onChange={handleInputChange}
                    error={errors.original_price}

                    InputProps={{
                      startAdornment: <InputAdornment position='start'>₹</InputAdornment>
                    }}
                    onBlur={calculateDiscount}

                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Controls.Input
                    label="Discount"
                    type='number'
                    name='discount'
                    value={values.discount}
                    onChange={handleInputChange}
                    error={errors.discount}
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>%</InputAdornment>
                    }}
                    onBlur={calculateDiscount}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Controls.Input
                    type='number'
                    variant='outlined'
                    label="Final Price After Discount"
                    disabled
                    InputProps={{
                      readOnly: true,
                      startAdornment: <InputAdornment position='start'>S.P</InputAdornment>
                    }}

                    name="finalPrice"
                    value={values.finalPrice}
                    onChange={handleInputChange}
                    error={errors.finalPrice}

                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Controls.Input
                    type='number'
                    name='validity'
                    value={values.validity}
                    onChange={handleInputChange}
                    error={errors.validity}
                    variant='outlined' label="Validity"
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>Month(s)</InputAdornment>
                    }}
                  />
                </Grid>
              </Grid>

              <Controls.Select
                label="Category"
                name="category_id"
                value={values.category_id}
                onChange={handleInputChange}
                options={categories}
                error={errors.category_id}/>

              <Autocomplete
                multiple
                freeSolo
                name="shortHighlights"
                options={shortHighlights}
                onChange={
                  (e, newVal, reason) => {
                    setValues({ ...values, shortHighlights: newVal })
                  }
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option} {...getTagProps({ index })}
                      icon={<CheckSharp />}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params}  label="Short highlights" placeholder="type and enter" />
                )}
              />


              <Autocomplete 
                multiple
                freeSolo
                options={tags}
                defaultValue={tags}
                onChange={
                  (e, newVal, reason) => {
                    setValues({ ...values, tags: newVal })
                  }
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Tags" placeholder="type and enter" />
                )}
              />

            </Stack>
          </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          
              <div style={{ position: "relative" }}>
                <img src={values.image} alt="image" style={{width:"90%",height:"250px"}} />
                 {values.image && 
                 <IconButton
                  onClick={() => {
                    setValues({...values,image:dummyimage})
                  }}
                  sx={{ color: "red", position: "absolute", bottom: "10px", right: "10px" }}>
                  <Delete />
                </IconButton>}
              </div>
            

            <FormControl fullWidth>
              <TextField 
                fullWidth
                variant='outlined'
                label="Thumbnail Image URL"
                name='image'
                value={values.image}
                onChange={handleInputChange}
                error={errors.image}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {uploadProgress ?
                        <CircularProgress /> :
                        <Button variant='contained' color='primary' component="label">
                          Upload
                          <input hidden
                            accept="image/*"
                            id='inputThumbnailFile'
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
            </FormControl>
      </Grid>
     </Grid>

      
         <TinyMceEditor
           name="course_description"
           editorRef={editorRef}
           initValue={values.course_description}/>

        <FormControl>
          <Controls.RadioGroup
            name="status"
            label="Status"
            value={values.status}
            onChange={handleInputChange}
            items={statusValue}/>

            <FormHelperText>{errors.status}</FormHelperText>

        </FormControl>

         {progress? <CircularProgress/> : 
           <Button endIcon={<ArrowRight/>} type='submit' style={{marginTop:"25px"}} variant='contained' color='primary'>Submit Data</Button>
        }
        </Form>
    </>
  )
}

export default InputCourseForm