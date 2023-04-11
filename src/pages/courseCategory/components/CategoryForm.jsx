import { Button, TextField, Typography } from '@material-ui/core'
import { CircularProgress, Stack } from '@mui/material'
import React from 'react'
import { useState } from 'react'

function CategoryForm(props) {
    const {recordForEdit,addOrEdit,progress,setProgress} = props
    const [title,setTitle]= useState(recordForEdit?recordForEdit.title:"");
    const [id,setId]=useState(recordForEdit?recordForEdit.id:"")

    const [inputError,setInputError]=useState(false)

    const handleSubmit=(e)=>{
        e.preventDefault();
        if(title==""){
            setInputError(true)
            return
        }
        addOrEdit(id,title);
    }

   


  return (
    <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
            <TextField variant='outlined' name='title' color='primary' 
                error={inputError}
            label="Category Name" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            {progress? <CircularProgress/>
             :<Button variant='contained' color='primary' type='submit'>Submit</Button>
            }
        </Stack>
    </form>
  )
}

export default CategoryForm