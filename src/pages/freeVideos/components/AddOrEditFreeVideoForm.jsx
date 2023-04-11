import { CircularProgress, Grid, IconButton, InputAdornment, TextField } from '@material-ui/core'
import { CloudUploadOutlined } from '@material-ui/icons'
import { Box, Button, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, Switch } from '@mui/material'
import { Stack } from '@mui/system'
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import LinearProgressWithLabel from '../../../components/ProgressBar/LinearProgressWithLabel'

import { AddPhotoAlternate } from '@mui/icons-material'
import { child, equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database'

import { dbRealtime, storage } from '../../../firebase/FirebaseConfig'
import { Form, useForm } from '../../../components/helper/useForm'
import Controls from '../../../components/controls/Controls'
import YouTube from 'react-youtube'
import guideYtVideoIdImg from "../../../images/guideYoutubeId.png"

const dummyimage = "https://dummyimage.com/600x400/a1a1a1/e8e8e8.jpg&text=No+Image";


const initialValue = {
    class_id: "",
    subject_id: "",
    title: "",
    video_length: 0,
    videoLengthStr: "",
    thumbnail_url: dummyimage,
    videoUrl: "",
    validVideo: false,
    youtubePlayer: false,
    ytVideoId: ""
}

function AddOrEditFreeVideoForm(props) {
    const { recordForEdit, addOrEdit, submitProgress } = props

    const [progress, setProgress] = useState(false)
    const [progress2, setProgress2] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0);
 

    //data states
    const [categoryData, setCategoryData] = useState([]);
    const [subjectData, setSubjectData] = useState([]);

    //states
    const [classState,setClassState]=useState("");
    const [subjectState,setSubjectState]=useState(
            recordForEdit?JSON.stringify({
                id:recordForEdit.subject_id,
                name:recordForEdit.subjectName
            }):""
        )
   
    const [checked,setChecked]=useState(
        recordForEdit?recordForEdit.liveVideo:false
    );

     const [ytPlayer, setYtPlayer] = useState(false);


    const videoRef = useRef(null)

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('title' in fieldValues)
            temp.title = fieldValues.title ? "" : "This field is required."

        if ('subtitle' in fieldValues)
            temp.subtitle = fieldValues.subtitle ? "" : "This field is required."

         if(!ytPlayer){
                if ('videoUrl' in fieldValues)
                temp.videoUrl = fieldValues.videoUrl ? "" : "Please upload a video or paste video url"
    
                if ('validVideo' in fieldValues)
                temp.validVideo = fieldValues.validVideo ? "" : toast.error("Please upload a valid video")
    
            }else {
                if ('ytVideoId' in fieldValues)
                    temp.ytVideoId = fieldValues.ytVideoId ? "" : "Paste Youtube Video Id!"
    
            }

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

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm } = useForm(initialValue, true, validate)


    const handleImageChooser = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0]
            uploadImage(img);
        }
    }
    const handleVideoChooser = (event) => {
        if (event.target.files && event.target.files[0]) {
            const video = event.target.files[0];
            videoRef.current.load();
            uploadVideo(video);
        }
    }

    const handleVideoMetaData = () => {

        const video = videoRef.current;
        const formattedDuration = formatDuration(video.duration)

        setValues({
            ...values,
            videoLengthStr: formattedDuration,
            video_length: Math.floor(video.duration),
            validVideo: true
        });


    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addOrEdit(values.video_id, values, resetForm)
        }
    }

      const handleSwitch=(event)=>{
        const checked=event.target.checked;
        setChecked(checked)
        setValues({...values,liveVideo:checked})
    
     }

     const handlePlayerSwitch = (event) => {
        const checked = event.target.checked;
        setYtPlayer(checked)
        setValues({ ...values, youtubePlayer: checked,validVideo:true })
        setErrors({ ...errors })
    }


    //upload video

    const uploadVideo = (file) => {
        if (!file) {
            toast.error("Please select a file first");
            return
        }
        setProgress(true)
        const fileName = `${file.name}_${Date.now()}`;
        const sf = storageRef(storage, `/freeVideos/${fileName}`)
        const uploadTask = uploadBytesResumable(sf, file)
        uploadTask.on("state_changed", (snapshot) => {
            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setUploadProgress(percent)

        }, (err) => console.log(err),
            () => {
                //get download url
                setProgress(false)
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setValues(prev => ({
                        ...prev,
                        videoUrl: url
                    }))
                    //now load video into player
                    videoRef.current?.load();

                })

            }
        );
    }

    //upload Image 
    const uploadImage = async (file) => {
        if (!file) {
            toast.error("Please select a file first");
            return
        }
        setProgress2(true)
        const fileName = `${file.name}_${Date.now()}`;
        const sf = storageRef(storage, `/thumbnails/${fileName}`)
        const uploadTask = uploadBytesResumable(sf, file)
        uploadTask.on("state_changed", (snapshot) => {
            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setUploadProgress(percent)

        }, (err) => console.log(err),
            () => {
                //get download url
                setProgress2(false)
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setValues({ ...values, thumbnail_url: url })
                })
            }
        );
    }

    function formatDuration(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes} min ${seconds} sec`;
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
                console.log(subjectData);
            } else {
                setSubjectData([]);
            }
        })
    }




    // useEffect hooks
    useEffect(()=>{
        if(recordForEdit!=null){
            setValues({...recordForEdit})
            //set state
            setClassState(JSON.stringify(
                {
                    id:recordForEdit.class_id,
                    title:recordForEdit.className
                }
            ));

            setYtPlayer(recordForEdit?.youtubePlayer)
       
        }
    },[recordForEdit])  

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
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={8} lg={10}>
                <FormControlLabel
                            value="start"
                            control={
                                <Switch color="primary"
                                    checked={ytPlayer}
                                    onChange={handlePlayerSwitch}
                                />
                            }
                            label={ytPlayer ? "Youtube Video" : "Regular Video"}
                            labelPlacement="start" />
                    {
                        ytPlayer? 
                        <>

                        
                       
                          <YouTube
                            videoId={values.ytVideoId}
                            id="youtube player"
                            title="Youtube Player"
                            opts={{
                                width:"590",
                                height:"390",
                                playerVars: {
                                    // https://developers.google.com/youtube/player_parameters
                                    autoplay: 1,
                                  }
                            }}/>
                        </> : <>
                    <video
                        width="100%" height="300" controls
                        onLoadedMetadata={handleVideoMetaData}
                        ref={videoRef}
                        autoPlay >
                        <source src={values.videoUrl} type='video/mp4' />
                        Your browser does not support the video tag.
                    </video>
                    {progress && <LinearProgressWithLabel value={uploadProgress} />}

                    </> }

                    </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2}>
                    
                {!ytPlayer && <>
                        { progress ? <CircularProgress /> : <Button
                        fullWidth
                        variant='outlined'
                        color='primary'
                        component="label"
                        endIcon={<CloudUploadOutlined />}>
                        Upload
                        <input hidden
                            accept="video/*"
                            id='inputVideoFile'
                            multiple type="file"
                            onChange={handleVideoChooser} />

                    </Button>}

                    </>}
                </Grid>
            </Grid>
            {
                ytPlayer?
                <>
                 <img src={guideYtVideoIdImg} alt="Guide" />
                    {/* for Youtube Player */}
                    <Controls.Input
                    name="ytVideoId"
                    label="Youtube Video Id"
                    value={values.ytVideoId}
                    onChange={handleInputChange}
                    error={errors.ytVideoId}
                    style={{width:"95%"}}
                    />
                </> :
                <>
            <Stack direction="row" spacing={2}>
                <Controls.Input
                    name="videoUrl"
                    label="Video URL"
                    value={values.videoUrl}
                    onChange={handleInputChange}
                    error={errors.videoUrl}
                    onBlur={() => {
                        videoRef.current?.load();
                    }}
                    style={{ width: "70%" }} />

                <Controls.Input
                    disabled
                    name="videoLengthStr"
                    label="Video Duration"
                    value={values.videoLengthStr}
                    onChange={handleInputChange}
                    error={errors.videoLengthStr}
                    style={{ width: "30%" }} />

                <Controls.Input
                    hidden
                    disabled
                    name="video_length"
                    label="Video Length"
                    value={values.video_length}
                    onChange={handleInputChange}
                    error={errors.video_length}
                    style={{ width: "15%" }} />
            </Stack>
                
                </>
            }



            <Stack direction="row" spacing={3}>

                <img src={values.thumbnail_url} width={300} height={100} />

                <FormControl>
                    <TextField
                        style={{ width: "98%" }}
                        variant='outlined'
                        label="Thumbnail Image URL"
                        name='image'
                        value={values.thumbnail_url}
                        onChange={handleInputChange}
                        error={errors.image}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    {progress2 ?
                                        <CircularProgress /> :
                                        <IconButton color='primary'
                                            aria-label="upload picture" component="label"
                                        >
                                            <input hidden
                                                accept="image/*"
                                                id='inputThumbnailFile'
                                                multiple type="file"
                                                onChange={handleImageChooser}
                                            />
                                            <AddPhotoAlternate />
                                        </IconButton>
                                        // <Button variant='contained' color='primary' component="label">
                                        //     Upload
                                        // </Button>
                                    }
                                </InputAdornment>
                            )
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }} />


                </FormControl>

            </Stack>


            <Controls.Input
                name="title"
                label="Title"
                value={values.title}
                onChange={handleInputChange}
                error={errors.title}
                style={{ width: "98%" }} />


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
                    
                    control={
                        <Switch color="primary" 
                            checked={checked}
                            onChange={handleSwitch}
                             />
                    }
                    label={checked?"Live":"Normal"}
                    labelPlacement="start"/>
               </Box>
            {
                submitProgress ? <CircularProgress /> :

                    <Button
                        type='submit'
                        color='primary'
                        variant='contained'
                        sx={{ mt: 2 }}
                    >
                        Submit Data
                    </Button>
            }

        </Form>
    )
}

export default AddOrEditFreeVideoForm