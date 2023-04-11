import { Check, CheckCircle } from '@material-ui/icons';
import { Button, CardActions, Stack } from '@mui/material';
import { Avatar, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { blue, red } from '@mui/material/colors';
import React from 'react'

function QuestionCardItem(props) {
    const {item,index,handleEdit,handleDelete}=props;

    const correctOption=item.correctOption;
    const active={
        color:"green",
        fontWeight:"700"
    }

  return (
    <Card>
      
        <CardContent>
         <Typography variant='h6'>Q{index+1}. {item.question}</Typography>
              <ol type='A' style={{ padding: "none",fontSize:"16px" }}>
                  {
                    
                      item.options.map((item,index) => (
                          <li style= {correctOption==index?active:null}>
                            {item} 
                            {correctOption==index?
                                <CheckCircle/>:""}
                          </li>
                      ))
                  }
              </ol>

              {item.explain?
                  <Stack direction="column">
                      <Typography variant='subtitle2'>Explanation:</Typography>
                      <Typography variant='subtitle1'>
                          {item.explain}
                      </Typography>
                  </Stack> :""
                }
             
        </CardContent>
        <CardActions>
            <Button 
                variant='outlined' 
                color='success'
                onClick={()=>handleEdit(item)}>
                Edit
            </Button>
            <Button 
                variant='outlined' 
                color='error'
                onClick={()=>handleDelete(item.question_id)}>
                Delete
            </Button>
        </CardActions>
    </Card>
  )
}

export default QuestionCardItem