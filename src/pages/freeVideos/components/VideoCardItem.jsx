import { LinkOffRounded, LinkOutlined } from '@material-ui/icons'
import { Delete, Edit, MoreVertOutlined, PlayCircle } from '@mui/icons-material'
import { Avatar, Card, CardContent, CardHeader, CardMedia, Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { red } from '@mui/material/colors'
import React from 'react'
import { useState } from 'react'
import PopupDialog from '../../../components/Dialogs/PopupDialog'
import studyPlusLogo from "../../../images/study_plus.png"
import { createDynamicLink } from '../../../services/Utils'
import PlayVideo from './PlayVideo'

function VideoCardItem(props) {
    const {item,handleEditVideo,handleDelete,handlePlay}=props
    const [anchorEl, setAnchorEl]=useState(null);

    //dialog hooks
    const [vidPlayDialog,setVidPlayDialog]=useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };


  return (
    <Card>
        <CardMedia
          sx={{height:140}}
          image={item.data.thumbnail_url}
          title={item.data.title}
         
        />
        <CardHeader
            title={item.data.title}
            subheader={`${item.data.className}, ${item.data.subjectName}`}
            avatar={
                <Avatar sx={{ bgcolor: red[500] }} 
                    aria-label="recipe"
                    src={studyPlusLogo}
                    />
                 
            }
            action={
                <IconButton aria-label='action'
                onClick={handleClick}
                >
                    <MoreVertOutlined/>
                </IconButton>
            }
        />

        {item.data.liveVideo && 
        <CardContent>
            <Chip label="LIVE" color='error'/>
        </CardContent>
        }

          <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              disableEnforceFocus
              MenuListProps={{
                  'aria-labelledby': 'basic-button',
              }}
          >
              <MenuItem onClick={()=>createDynamicLink(
                item.id,
                item.data.title,
                `${item.data.title} | ${item.data.className}, ${item.data.subjectName}`,
                item.data.thumbnail_url,
                item.data.liveVideo?"liveVideo":"freeVideo"
                
              )}>
                  <ListItemIcon>
                      <LinkOutlined />
                  </ListItemIcon>
                  <ListItemText>
                      Copy Link
                  </ListItemText>
              </MenuItem>

              <MenuItem onClick={()=>setVidPlayDialog(true)}>
                  <ListItemIcon>
                      <PlayCircle />
                  </ListItemIcon>
                  <ListItemText>
                      Play
                  </ListItemText>
              </MenuItem>
              
              <MenuItem onClick={()=>handleEditVideo(item.data)}>
                  <ListItemIcon>
                      <Edit />
                  </ListItemIcon>
                  <ListItemText>
                      Edit
                  </ListItemText>
              </MenuItem>
              <MenuItem onClick={()=>handleDelete(item.id)}>
                  <ListItemIcon>
                      <Delete />
                  </ListItemIcon>
                  <ListItemText>
                      Delete
                  </ListItemText>
              </MenuItem>

          </Menu>

    <PopupDialog
        title="VideoPlayer"
        openDialog={vidPlayDialog}
        setOpenDialog={setVidPlayDialog}
        maxWidth="lg">
            <PlayVideo videoUrl={item.data.videoUrl}/>
        </PopupDialog>

    </Card>
  )
}

export default VideoCardItem