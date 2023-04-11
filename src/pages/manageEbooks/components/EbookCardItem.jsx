import { Button, Card, CardActions, CardContent, CardMedia, Chip, Stack, Typography } from '@mui/material'
import React from 'react'

function EbookCardItem(props) {
    const {item,handleEdit,handleDelete}=props

  return (
    <Card>
        <CardMedia
            component="img"
            height="150"
            image={item.data.image}
            alt="cover image"/>

            <CardContent>
                <Typography variant='h6'>
                    {item.data.title}
                </Typography>
                <Typography variant='body2'>
                    {item.data.className} , {item.data.subjectName} 
                </Typography>

                <Stack direction="row" sx={{justifyContent:"space-between"}}>
                    <Typography variant='subtitle1' sx={{mt:2}}>
                    {item.data.paid? `Price: ₹${item.data.price}`:"Free"}
                    </Typography>

                    <Chip  sx={{mt:2}} 
                        label={(item.data.type).toUpperCase()}
                        color="warning"/>
                    
                    
                </Stack>

            </CardContent>

            <CardActions>
                <Button variant='text' color='success' 
                    onClick={()=>handleEdit(item.data)}>
                    Edit
                </Button>
                <Button variant='text' color='error'
                    onClick={()=>handleDelete(item.id)}>
                    Delete
                </Button>
            </CardActions>
        
    </Card>
  )
}

export default EbookCardItem