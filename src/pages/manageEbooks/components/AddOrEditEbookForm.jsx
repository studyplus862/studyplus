import { ArrowRightAlt, CloudUploadSharp } from '@material-ui/icons';
import { Button, CircularProgress, FormControl, FormControlLabel, FormGroup, FormHelperText, InputAdornment, MenuItem, Select, Stack, Switch, TextField } from '@mui/material';
import { getDownloadURL, ref as StorageReference, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { dbRealtime, storage } from '../../../firebase/FirebaseConfig';
import Controls from '../../../components/controls/Controls';
import { useForm,Form } from '../../../components/helper/useForm';
import LinearProgressWithLabel from '../../../components/ProgressBar/LinearProgressWithLabel';
import { Box } from '@mui/system';
import { child, equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import { InputLabel } from '@mui/material';

const initialValue={
    pdfUrl:"",
    title:"",
    image:"",
    paid:true,
    price:0,
    subject_id:"",
    subjectName:"",
    class_id:"",
    className:"",
    type:"",

}
// const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?.pdf$');

function AddOrEditEbookForm(props) {
    const {recordForEdit,addOrEdit,submitProgress}=props;

    const[progress,setProgress]=useState();
    const [uploadProgress,setUploadProgress]=useState(0);


    //data states
    const [categoryData, setCategoryData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);

    //state
    const [checked,setChecked]=useState(true)
    const [classState,setClassState]=useState("");
    const [subjectState,setSubjectState]=useState(
            recordForEdit?JSON.stringify({
                id:recordForEdit.subject_id,
                name:recordForEdit.subjectName
            }):""
        )

   

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('title' in fieldValues)
            temp.title = fieldValues.title ? "" : "This field is required."

        if ('pdfUrl' in fieldValues)
            temp.pdfUrl = fieldValues.pdfUrl? "" : "Valid pdf file required"

        if ('subject_id' in fieldValues)
            temp.subject_id = fieldValues.subject_id? "" : "This field is required."
        if ('class_id' in fieldValues)
            temp.class_id = fieldValues.class_id? "" : "This field is required."
        if ('image' in fieldValues)
            temp.image = fieldValues.image? "" : "This field is required."
       
        if ('type' in fieldValues)
            temp.type = fieldValues.type? "" : "This field is required."
        
        if(checked)
            if ('price' in fieldValues)
            temp.price = fieldValues.price>0? "" : "Price should be greater than 0"
        else temp.price=""

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
            addOrEdit(values.id,values,resetForm) 
        }
     }

     const handleSwitch=(event)=>{
        const checked=event.target.checked;
        setChecked(checked)
        setValues({...values,paid:checked,price:0})
        setErrors({...errors,price:0})
     }

     

     const handleFileChooser=(event)=>{
        if(event.target.files && event.target.files[0]){
            const pdfFile=event.target.files[0];

            uploadPDF(pdfFile);
          }
     }

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
        setProgress(true)
        const fileName=`${file.name}_${Date.now()}`
        const storageRef=StorageReference(storage,`/coverImages/${fileName}`)
        const uploadTask=uploadBytesResumable(storageRef,file)
        uploadTask.on("state_changed",(snapshot)=>{
          const percent=(snapshot.bytesTransferred/snapshot.totalBytes) * 100
          setUploadProgress(percent)
  
        },(err) => console.log(err),
        ()=> {
          //get download url
          setUploadProgress(0)
          setProgress(false)
          getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
            setValues({...values,image:url})
          })
        }
        );
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
        const storageRef=StorageReference(storage,`/pdfFiles/${fileName}`)
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

   
        //handle filter inputs
    const handleClassSelector = (event) => {
        const v = event.target.value;
        if (v != "") {
            setClassState(v)
            const jVal=JSON.parse(v);
            const id=jVal.id;
            const title=jVal.title;
            setSubjectData([]);
            getSubjects(id);
            //update value of class_id
            setValues({
                ...values,
                class_id: id,
                className:title
            })
        }
    }

    const handleSubjectSelector=(event)=>{
        const v = event.target.value;
        if (v != "") {
            console.log(v);
            setSubjectState(v)
            const jVal=JSON.parse(v);
            const id=jVal.id;
            const name=jVal.name;
           
            //update value of subject
            setValues({
                ...values,
               subject_id:id,
               subjectName:name
            })
        }
    }


    //get subjects
    const getSubjects = (id) => {
        
        const qRef = query(ref(dbRealtime, "/subjects"), orderByChild("class_id"), equalTo(id))
        onValue(qRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setSubjectData(Object.values(data))
               
            } else {
                setSubjectData([]);
            }
        })
    }

     useEffect(()=>{
        if(recordForEdit!=null){
            setValues({...recordForEdit});
            //set state
            setClassState(JSON.stringify(
                {
                    id:recordForEdit.class_id,
                    title:recordForEdit.className
                }
            ));
            setChecked(recordForEdit.paid)
        }
     },[recordForEdit]);


     useEffect(() => {
        const getBoardClass = () => {
            const dbRef = ref(dbRealtime);
            get(child(dbRef, "/boardClass/")).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setCategoryData(Object.values(data));
                    console.log(data)
                } else {
                    console.log("No data found");
                }
            }).catch((error) => {
                console.log(error);
            })
        }

        getBoardClass();
       
    }, [])

    useEffect(() => {
        if (values.class_id != "" && values.class_id != undefined) {
            getSubjects(values.class_id);
        }
    }, [values.class_id])



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

            
               

             
                {values.image &&  <img src={values.image} alt="cover image" width="200px" height="150px" />}
             
              <TextField 
                fullWidth
                variant='outlined'
                label="Cover Image"
                name='image'
                value={values.image}
                onChange={handleInputChange}
                error={errors.image}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {progress ?
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

<Stack direction="row" spacing={2}>
                {/* FILTER INPUTS */}

                <FormControl fullWidth>
                    <InputLabel id='lbl-select-class'>Select Class</InputLabel>
                    <Select
                        labelId='lbl-select-class'
                        id='select-class'
                        label="Select Class"
                        name='class_id'
                        value={classState|| ""}
                        defaultValue={""}
                        error={Boolean(errors.class_id)}
                        InputLabelProps={{
                            shrink: true
                          }}
                        onChange={handleClassSelector}>
                        {
                            categoryData.map((item) => (
                                <MenuItem key={item.id} value={JSON.stringify({
                                        id:item.id,
                                        title:item.title
                                    })}>
                                    {item.title}
                                </MenuItem>
                            ))
                        }
                    </Select>
                    {errors.class_id && <FormHelperText>{errors.class_id}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id='lbl-select-subject'>Select Subject</InputLabel>
                    <Select
                        labelId='lbl-select-subject'
                        id='select-subject'
                        label="Select Subject"
                        name='subject_id'
                        values={subjectState || ""}
                        defaultValue={""}
                        error={Boolean(errors.subject_id)}
                        onChange={handleSubjectSelector}>
                        
                        {
                            subjectData.map((item) => (
                                <MenuItem key={item.subject_id} 
                                    value={JSON.stringify({
                                        id:item.subject_id,
                                        name:item.name
                                    })}>
                                    {item.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                    {errors.subject_id && <FormHelperText>{errors.subject_id}</FormHelperText>}

                </FormControl>
            </Stack>
            
            <Box>
               <FormControlLabel 
                    value="start"
                    control={
                        <Switch color="primary" 
                            checked={checked}
                            onChange={handleSwitch}
                             />
                        }
                    label={checked?"Paid":"Free"}
                    labelPlacement="start"/>
               </Box>


               {
                checked && 
                <Controls.Input
                    style={{width:"98%"}}
                    name="price"
                    label="Price"
                    type="number"
                    value={values.price}
                    onChange={handleInputChange}
                    error={errors.price}/>
               }

          <FormControl
              error={Boolean(errors.type)}>
              <Controls.RadioGroup
                  name="type"
                  label="Type"
                  value={values.type}
                  onChange={handleInputChange}
                  items={[
                    {id:"pdf",title:"Pdf"},
                    {id:"ebook",title:"eBook"},
                ]}
              />

              <FormHelperText>{errors.type}</FormHelperText>

          </FormControl>
         
                
        {submitProgress? <CircularProgress/>:
            <Button sx={{my:2}} type='submit' variant='contained' endIcon={<ArrowRightAlt/>}>
                {recordForEdit?"Update Record":"Add New Record"}
            </Button>
            }
   </Form>
  )
}

export default AddOrEditEbookForm