import { Delete, Edit, LinkOffOutlined, LinkOutlined, ListAltRounded } from '@material-ui/icons';
import { Button, CardActions, CardHeader, Chip, Divider, IconButton, Stack, Tooltip } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteDialog from '../../../components/Dialogs/DeleteDialog';
import PopupDialog from '../../../components/Dialogs/PopupDialog';
import { dbFirestore } from '../../../firebase/FirebaseConfig';
import { updateCourse } from '../../../services/CourseService';
import InputCourseForm from "../../AddCourse/components/InputCourseForm"
import { getAuth } from 'firebase/auth';



function CourseItemCard(props) {
  const { dataItem } = props;

  const [openDialog, setOpenDialog] = useState(false)
  const [updateDialog, setUpdateDialog] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [progress,setProgress] = useState(false)

  const [dynamicLink,setDynamicLink]=useState("");

  //handle item delete
  const handleDelete = async (item) => {
    console.log(dataItem.id);
    setOpenDialog(false);

    try {
      await deleteDoc(doc(dbFirestore, "COURSES", dataItem.id))
      toast.success("Course has been deleted", {
        theme: "colored"
      });
    } catch (error) {
      console.log(error)
    }
  }

  const addOrEdit = (docId,data,cDescription, resetForm) => {
    if (docId!= null){
      updateCourse(docId,data,cDescription)
      toast.success("Data update successfully");
    }
    setUpdateDialog(false)
    setProgress(false);
  }

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setUpdateDialog(true)
  }

  const createLink=()=>{
    createDynamicLink();
  }
  

  const createDynamicLink = async () => {
    // Get an access token for Firebase API authentication
    
    // Define the request payload
    const payload = {
      dynamicLinkInfo: {
        domainUriPrefix: "https://studyplus12.page.link",
        link: `https://starcentre.in/courses?id=${dataItem.id}&type=course`,
        androidInfo: {
          androidPackageName: "com.studygrown.studyplus"
        },
        socialMetaTagInfo: {
          socialTitle: dataItem.title,
          socialDescription:`${dataItem.data.discount}% off for ${dataItem.data.title}`,
          socialImageLink: dataItem.data.image
      }
      },
      suffix: {
        option: "SHORT"
      }
    };
    
    // Send a POST request to the Firebase API endpoint to create a Dynamic Link
    const response = await fetch("https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBYfAssJvj4uBIAuFZRg89rlYmKpcxyPkA", {
      method: "POST",
      headers: {
        "Authorization": "bearer AIzaSyBYfAssJvj4uBIAuFZRg89rlYmKpcxyPkA",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
    // Parse the response JSON and extract the short Dynamic Link
    const json = await response.json();
    const shortLink = json.shortLink;
    
  
    //copy to clipboard
    try {
      await navigator.clipboard.writeText(shortLink);
      toast.success("Link copied to clipboard -"+shortLink);
    } catch (error) {
      toast.error("something went wrong");
    }
  }
  


  return (
    <Card>
     
      <CardMedia
        sx={{ height: 200 }}
        image={dataItem.data.image}
        title={dataItem.data.title}
      />
      <CardContent>
        <Typography variant='h5' component="div">{dataItem.data.title}</Typography>
        
        <Stack direction="row"  spacing={1} sx={{marginTop:4}}>
          <Typography variant='subtitle2' component="p">
            <strong>₹{dataItem.data.finalPrice} </strong>
          </Typography>
         
          <Typography variant='subtitle2' sx={{color:"#9e9e9e",textDecoration:"line-through"}} >
            <strong>₹{dataItem.data.original_price} </strong>
          </Typography>

          <Chip size='small' label={`${dataItem.data.discount}% Off`} color="success"></Chip>

        </Stack>


      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Link to={{
          pathname:"/app/courseContent",
          state:{
            courseId:dataItem.id,
            title:dataItem.data.title
          }
          }} style={{textDecoration:"none"}}>
          <Button
            variant='contained'
            color='primary'
            startIcon={<ListAltRounded />}>Content</Button>
        </Link>

        <Stack direction="row">
          <Tooltip title="Edit">
            <IconButton
              style={{ color: "green", marginRight: "10px" }}
              onClick={() => openInPopup(dataItem.data)}>
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              onClick={() => setOpenDialog(true)}
              style={{ color: "red" }}>
              <Delete />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy Link">
            <IconButton
              onClick={() => createLink()}
              style={{ color: "blue" }}>
              <LinkOutlined />
            </IconButton>

          </Tooltip>

        </Stack>
      </CardActions>

      <DeleteDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onAction={handleDelete}
        title="Delete" />

      <PopupDialog
        title="Update Course Details"
        openDialog={updateDialog}
        setOpenDialog={setUpdateDialog}
        maxWidth="lg">
        <InputCourseForm
         recordForEdit={recordForEdit}
         addOrEdit={addOrEdit}
         progress={progress}
         setProgress={setProgress}
        />
      </PopupDialog>
    </Card>
  )
}

export default CourseItemCard