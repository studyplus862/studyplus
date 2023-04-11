import { FormControl, FormHelperText } from '@material-ui/core'
import { Button } from '@mui/material'
import React, { useEffect } from 'react'
import Controls from '../../../components/controls/Controls'
import { Form, useForm } from '../../../components/helper/useForm'


const initialValue={
    title:"",
    subtitle:"",
    type:"",
    totalItemCount:0
}

const sectionItem=[
    {id:"video",title:"Video"},
    {id:"pdf",title:"PDFs"},
    {id:"quiz",title:"Quiz"}
]


function SectionForm(props) {
    const {recordForEdit,addOrEditSection,progress,SetProgress}=props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('title' in fieldValues)
            temp.title = fieldValues.title ? "" : "This field is required."

        if ('subtitle' in fieldValues)
            temp.subtitle = fieldValues.subtitle ? "" : "This field is required."
        
        if ('type' in fieldValues)
            temp.type = fieldValues.type ? "" : "This field is required."

        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

 const {values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm} = useForm(initialValue,true,validate)
 
 const handleSubmit=(e)=>{
    e.preventDefault();
    if(validate()){
        addOrEditSection(values.section_id,values,resetForm)
        console.log(values);
    }
 }




 useEffect(()=>{
    if(recordForEdit!=null){
        setValues({...recordForEdit.data})
    }
 },[recordForEdit])




  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Controls.Input
            name="title"
            label="Title"
            value={values.title}
            onChange={handleInputChange}
            error={errors.title}/>

        <Controls.Input
            name="subtitle"
            label="Subtitle"
            value={values.subtitle}
            onChange={handleInputChange}
            error={errors.subtitle}/>

        <FormControl 
            error={Boolean(errors.type)}>
            <Controls.RadioGroup
                name="type"
                label="Section Type"
                value={values.type}
                onChange={handleInputChange}
                items={sectionItem}
                />

            <FormHelperText>{errors.type}</FormHelperText>

        </FormControl>


         <Button type='submit' sx={{marginTop:2,marginBottom:2}} variant='contained'>
            {recordForEdit?"Update":"Add Section"}
         </Button>
            
      </Form>
    </>
  )
}

export default SectionForm