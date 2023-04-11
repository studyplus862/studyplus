import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Dialog } from '@mui/material'
import React from 'react'

function DeleteDialog(props) {
    const {title,openDialog,setOpenDialog,onAction} = props

  return (
    <Dialog
     open={openDialog}
     onClose={()=>setOpenDialog(false)}
    >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent >
            <DialogContentText>Do you really want to delete this Item</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button onClick={onAction}>Delete</Button>
        </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog