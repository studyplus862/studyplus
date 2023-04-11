import { CardContent } from '@material-ui/core';
import { Card, Checkbox, Stack, Typography } from '@mui/material'
import React from 'react'

function QuizSelectItems(props) {
    const {item,selectedQuizRecord, setSelectedQuizRecord}=props;

    const handleCheckbox=(event)=>{
        if(event.target.checked){
            //add selected record
            setSelectedQuizRecord(
                [...selectedQuizRecord,
                    {
                        title: item.title,
                        quiz_id: item.quiz_id,
                        instructions: item.instructions,
                        duration: item.duration,
                        questions: item.questions,
                        max_marks: item.max_marks
                    }
                ]     
            )
          }else {
            //remove selected record
            selectedQuizRecord.map((item)=>{
                setSelectedQuizRecord(
                    selectedQuizRecord.filter(a =>
                        a.quiz_id !== item.quiz_id
                        )
                    )   
            })

        }
    }
        
  return (
    
     <Card sx={{margin:"8px"}}>
        <CardContent>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant='h6'>{item.title}</Typography>
                    <Checkbox
                        name={item.quiz_id}
                        value={item.quiz_id}
                        onChange={handleCheckbox}
                        
                    />
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={5}>
                    <Typography variant='subtitle'>
                        {item.questions} Questions | 
                        {item.duration} Mins | 
                        {item.max_marks} Mark 
                    
                    </Typography>
                    
                    <Typography variant='subtitle'>{item.category}</Typography>
                    
                </Stack>
            </Stack>
        </CardContent>
     </Card>
   
  )
}

export default QuizSelectItems