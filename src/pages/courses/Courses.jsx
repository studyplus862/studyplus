import React from 'react'

import { Add } from '@material-ui/icons'
import { Button, Card, Chip, Grid, Paper } from '@mui/material'
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { CardContent, LinearProgress } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import PageTitle from '../../components/PageTitle/PageTitle'
import { dbFirestore } from '../../firebase/FirebaseConfig'
import CourseItemCard from './components/CourseItemCard'


function Courses() {
    const [categories,setCategories]=useState([]);
    const [courses,setCourses]=useState([])
    const [loading,setLoading] = useState(false);
    const [selectedChip,setSelectedChip] = useState("all");
   

    const handleChipClick=(id)=>{
        getCourses(id);
        setSelectedChip(id);
    }

    const getCourses=async (id)=>{
      setLoading(true);
      let cRef;
      if(id==="all"){
        cRef=collection(dbFirestore,"COURSES");
      }else {
        cRef=query(collection(dbFirestore,"COURSES"),where("category_id","==",id))
      }
      const snapshot=await getDocs(cRef)
      setCourses(snapshot.docs.map(doc=>({
        id:doc.id,
        data:doc.data()
      })))
      setLoading(false);
    }

    useEffect(()=>{
      
      const qRef=query(collection(dbFirestore,"COURSE_CATEGORIES"),orderBy("timestamp","asc"))
          onSnapshot(qRef,(snapshot)=>{
              setCategories(snapshot.docs.map(doc=>({
              id:doc.id,
              data:doc.data()
             })))
          });

      const cRef=query(collection(dbFirestore,"COURSES"))
          onSnapshot(cRef,(snapshot)=>{
              setCourses(snapshot.docs.map(doc=>({
              id:doc.id,
              data:doc.data()
             })))
          });

          
    
    
     
   },[])


  return (
    <>
    <ToastContainer/>
      <PageTitle title="Courses" button={
        <Link to="/app/newCourse" style={{textDecoration:"none"}}>
          <Button variant='contained'  color='primary'  endIcon={<Add/>}>
              Add New Course
          </Button>
        </Link>
      }/>

      <Card>
         <CardContent>
         <Chip 
            label="All"    
            style={{marginLeft:"8px"}}
            onClick={()=>handleChipClick("all")}
            color={selectedChip==="all"?"primary":"default"}
            selected />

            {categories.length >0? <>
                {categories.map((item)=>(
                 <Chip 
                  key={item.id}
                  label={item.data.title} 
                  variant='contained' 
                  style={{marginLeft:"8px"}}
                  onClick={()=>handleChipClick(item.id)} 
                  color={selectedChip===item.id?"primary":"default"}

                />
            ))}
            </> : "No Category"}
         </CardContent>
      </Card>

      <Paper variant='outlined' style={{padding:"16px",marginTop:"16px"}}>
        {loading && <LinearProgress style={{margin:"16px"}}/>}
         <Grid container spacing={2}>
            {courses.map((item)=>(
              <Grid key={item.id} item xs={12} sm={12} md={6} lg={3} xl={3}>
                <CourseItemCard 
                  dataItem={item}
                 />
              </Grid>
            ))}
         </Grid>
      </Paper>

    
    </>
  )
}

export default Courses