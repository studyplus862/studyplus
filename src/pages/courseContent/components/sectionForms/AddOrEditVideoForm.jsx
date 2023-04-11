import { CircularProgress, FormControl, Grid, IconButton, InputAdornment, TextField } from '@material-ui/core'
import { CameraAlt, CloudUploadOutlined } from '@material-ui/icons'
import { Button, FormControlLabel, Switch } from '@mui/material'
import { Stack } from '@mui/system'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import YouTube from 'react-youtube'
import Controls from '../../../../components/controls/Controls'
import { Form, useForm } from '../../../../components/helper/useForm'
import LinearProgressWithLabel from '../../../../components/ProgressBar/LinearProgressWithLabel'
import { storage } from '../../../../firebase/FirebaseConfig'
import guideYtVideoIdImg from "../../../../images/guideYoutubeId.png"

const dummyimage = "https://dummyimage.com/600x400/a1a1a1/e8e8e8.jpg&text=No+Image";

const initialValue = {
    title: "",
    video_length: 0,
    videoLengthStr: "",
    thumbnail_url: dummyimage,
    videoUrl: "",
    validVideo: false,
    youtubePlayer: false,
    ytVideoId: "",
}

function AddOrEditVideoForm(props) {
    const { recordForEdit, addOrEditVideo } = props

    const [progress, setProgress] = useState(false)
    const [progress2, setProgress2] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [videoLoadSuccess, setVideoLoadSuccess] = useState(false);

    const videoRef = useRef(null)

    //states
    const [ytPlayer, setYtPlayer] = useState(false);



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
            setSelectedImage(URL.createObjectURL(img));
            uploadImage(img);
        }
    }
    const handleVideoChooser = (event) => {
        if (event.target.files && event.target.files[0]) {
            const video = event.target.files[0];
            const objectURL = URL.createObjectURL(video);
            setSelectedVideo(objectURL);
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

    const handleSwitch = (event) => {
        const checked = event.target.checked;
        setYtPlayer(checked)
        setValues({ ...values, youtubePlayer: checked })
        setErrors({ ...errors })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addOrEditVideo(values.video_id, values, resetForm)
        }
    }

    //upload video

    const uploadVideo = (file) => {
        if (!file) {
            toast.error("Please select a file first");
            return
        }
        setProgress(true)
        const fileName = `${file.name}_${Date.now()}`;
        const storageRef = ref(storage, `/videos/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
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
        const storageRef = ref(storage, `/thumbnails/${fileName}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
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

    //useEffect hooks
    useEffect(() => {
        if (recordForEdit != null) {
            setValues({ ...recordForEdit })
            setYtPlayer(recordForEdit?.youtubePlayer)
            
        }
    }, [recordForEdit])


    return (
        <Form onSubmit={handleSubmit}>
            <Grid container spacing={1}>       
                <Grid item xs={12} sm={12} md={8} lg={10}>
                <FormControlLabel
                            value="start"
                            control={
                                <Switch color="primary"
                                    checked={ytPlayer}
                                    onChange={handleSwitch}
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
                        </> 
                        : 
                        <>
                            <video
                                width="100%" height="300" controls
                                onLoadedMetadata={handleVideoMetaData}
                                ref={videoRef}
                                autoPlay >
                                <source src={values.videoUrl} type='video/mp4' />
                                Your browser does not support the video tag.
                            </video>
                            {progress && <LinearProgressWithLabel value={uploadProgress} />}
                        </>
                    }
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
                                            <CameraAlt />
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

            <Button
                type='submit'
                color='primary'
                variant='contained'
                sx={{ mt: 2 }}
            >
                Submit Data
            </Button>

        </Form>
    )
}

export default AddOrEditVideoForm