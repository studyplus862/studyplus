import { DeleteOutline, Edit } from '@material-ui/icons';
import { Button, Card, Stack, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';
import DeleteDialog from '../../../../components/Dialogs/DeleteDialog'
import pdfBg from "../../../../images/pdf_bg.png";
import { decreaseChildCount, deleteDocument } from '../../../../services/CourseService';

function PDFListItem(props) {
    const {data,setRecordForEdit,setPdfDialog}=props
    const [openDialog,setOpenDialog]=useState(false);

    const handleEditPdf=item=>{
        setRecordForEdit(item);
        setPdfDialog(true);
    }

    const handleDelete=()=>{
        console.log(data);
        deleteDocument("COURSE_PDFS",data.pdf_id,onSuccess,onFailed)
      }

      const onSuccess=(msg)=>{
         toast.success(msg)
         decreaseChildCount("COURSE_LESSON_SECTIONS",data.section_id);
           
      }
      const onFailed=(msg)=>{
        toast.error(msg);
      }

  return (
      <Card variant='outlined' style={{ marginTop: 4, width: "auto !important" }}>
          <Stack direction="row" spacing={2} sx={{ p: 1 }}>
              <img src={pdfBg} alt={data.title} width="150" height="100%" />

              <Stack direction="column" spacing={1}>
                  <Typography variant='h6'>{data.title}</Typography>
                  <Stack direction="row" spacing={2}>
                      <Button
                          variant='outlined'
                          size='small'
                          onClick={() => handleEditPdf(data)}
                          startIcon={<Edit />}>
                          Edit
                      </Button>
                      <Button
                          variant='outlined'
                          color='secondary'
                          size='small'
                          style={{ color: "red" }}
                          onClick={() => setOpenDialog(true)}
                          startIcon={<DeleteOutline />}>
                          Delete
                      </Button>
                  </Stack>
              </Stack>
          </Stack>

          <DeleteDialog
              title="Delete File"
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              onAction={handleDelete} />

      </Card>
  )
}

export default PDFListItem