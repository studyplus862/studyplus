import { Add, Delete } from '@material-ui/icons';
import { Box, Button, CircularProgress, FormLabel, IconButton, Radio, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';


function AddOrEditQuestionForm(props) {
  const {recordForEdit,addOrEdit,progress}=props

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [correctOption, setCorrectOption] = useState(-1);
  const [explain,setExplain]=useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const resetForm=()=>{
    setQuestion("");
    setOptions([""]);
    setCorrectOption(-1);
    setErrorMessage("");
  }

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);

    if (correctOption === index) {
      setCorrectOption(-1);
    } else if (correctOption > index) {
      setCorrectOption(correctOption - 1);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (index) => {
    setCorrectOption(index);
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setErrorMessage("Please enter a question.");
    } else if (options.some((option) => !option.trim())) {
      setErrorMessage("All options must be filled in.");
    } else if (correctOption === -1) {
      setErrorMessage("Please select a correct option.");
    } else {
      // Save the quiz to the database
      const data={
        question,
        options,
        correctOption,
        explain
      }
      addOrEdit(recordForEdit?.question_id,data,resetForm);
    }
  };


  useEffect(()=>{
    if(recordForEdit!=null){
      setQuestion(recordForEdit.question);
      setOptions(recordForEdit.options);
      setCorrectOption(recordForEdit.correctOption);
      setExplain(recordForEdit.explain);
  
    }
  },[recordForEdit])



  return (
    <form onSubmit={handleSaveQuestion}>

    <div>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <Box sx={{ py: 1 }}>
         <Stack direction="row" 
          spacing={2} 
          justifyContent="space-between" 
          justifyItems="center"
          sx={{py:2}}>
        
        <FormLabel>Options</FormLabel>
        <Button variant="contained" color="primary" endIcon={<Add/>} onClick={handleAddOption}>
          Add
        </Button>
        </Stack>
        {options.map((option, index) => (
          <Box key={index} sx={{mb:2}}>
            <Radio
              checked={correctOption === index}
              onChange={() => handleCorrectOptionChange(index)}/>
            <TextField
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            <IconButton
              variant="contained"
              color="secondary"
              onClick={() => handleRemoveOption(index)}
            >
              <Delete/>
            </IconButton>
          </Box>
        ))}
      </Box>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      
      <TextField
        multiline
        rows={3}
        fullWidth
        label="Explain"
        value={explain}
        onChange={(e)=>{
          setExplain(e.target.value);
        }}/>

    </div>

    {progress?<CircularProgress/>:
      <Button
        sx={{mt:2}}
        variant='contained'
        type='submit'
      >
        submit
      </Button>}
    </form>
  )
}

export default AddOrEditQuestionForm