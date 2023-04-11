import { Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'


function PopupDialog(props) {
    const {title,children,openDialog,setOpenDialog,maxWidth,disableBackdropClick} = props
    
  return (
    <Dialog
      disableEnforceFocus 
      disableBackdropClick={true}
      maxWidth={maxWidth}
      open={openDialog}
      onClose={()=>setOpenDialog(false)}>
        <div style={{display:"flex"}}>
            <DialogTitle  style={{flexGrow:"1"}}> {title} </DialogTitle>
            <IconButton onClick={()=>setOpenDialog(false)}>
                    <Close/>
                </IconButton>
            
        </div>
        <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  )
}

export default PopupDialog