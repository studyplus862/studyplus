import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import quizBg from "../../../images/quiz_bg.png";

function QuizCardItem(props) {
    const {item,handleEdit,handleDelete}=props
  return (
    <Card>
        <CardContent>
            <Stack direction="row" spacing={2}>
                <img src={quizBg} alt="" width="90px" height="60px" />
                <Stack direction="column" >
                    <Typography variant='body1' gutterBottom>{item.title}</Typography>
                    <Typography variant='caption' >
                        {item.questions} Questions | 
                        {item.duration} mins. |
                        {item.max_marks} marks
                    </Typography>
                    <Typography variant='caption' >
                       Subject : {item.category}
                    </Typography>
                    <Stack direction="row">
                          {/* <Link to={{
                              pathname: "/app/questions",
                              state: {
                                  quiz_id: item.quiz_id,
                                  title: item.title
                              }
                          }}
                          style={{textDecoration:"none"}}> */}
                    <Link to={`questions/${item.quiz_id}/${item.title}`}>
                        <Button variant='text' color='primary'>questions</Button>
                    </Link>
                        <Button 
                            variant='text' 
                            color='success'
                            onClick={()=>handleEdit(item)}>
                                edit
                        </Button>
                        <Button 
                            variant='text' 
                            color='error'
                            onClick={()=>handleDelete(item.quiz_id)}>
                            delete
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </CardContent>
    </Card>
  )
}

export default QuizCardItem