import { collection, deleteDoc, doc, runTransaction, setDoc, Timestamp, updateDoc, writeBatch } from "firebase/firestore"
import { dbFirestore } from "../firebase/FirebaseConfig"

export const insertCourse=async(data,cDescription)=>{
    const docRef = doc(collection(dbFirestore, "COURSES"))
    //store data
    await setDoc(docRef, {
        course_id: docRef.id,
        title: data.title,
        image: data.image,
        original_price: parseInt(data.original_price),
        discount: parseInt(data.discount),
        finalPrice: parseInt(data.finalPrice),
        validity: parseInt(data.validity),
        category_id: data.category_id,
        tags: data.tags,
        status:data.status,
        shortHighlights: data.shortHighlights,
        course_description: cDescription,
    })
}


export const updateCourse=async(docId,data,cDescription)=>{
    const ref=doc(dbFirestore,"COURSES",docId);
   try {
    await updateDoc(ref,{
        title: data.title,
        image: data.image,
        original_price: parseInt(data.original_price),
        discount: parseInt(data.discount),
        finalPrice: parseInt(data.finalPrice),
        validity: parseInt(data.validity),
        category_id: data.category_id,
        tags: data.tags,
        status:data.status,
        shortHighlights: data.shortHighlights,
        course_description: cDescription
    })
   } catch (error) {
    console.log(error)
   }
}

export const insertSection=async(data,cid)=>{
    const docRef = doc(collection(dbFirestore, "COURSE_LESSON_SECTIONS"))
    //store data
    await setDoc(docRef, {
        timestamp:Timestamp.now(),
        course_id:cid,
        section_id:docRef.id,
        ...data
    })
}

export const updateSection=async(sid,data,onSuccess,onFailed)=>{
    try {
        const docRef = doc(dbFirestore, "COURSE_LESSON_SECTIONS",sid)
        await updateDoc(docRef,{
            modifiedAt:Timestamp.now(),
            ...data
        });
        onSuccess("Record has been update");
    } catch (error) {
        onFailed(error);
    }
}


export const insertVideoInSection=async (courseId,sectionId,data)=>{
    const docRef = doc(collection(dbFirestore, "COURSE_VIDEOS"))
    try {
        //store data
     await setDoc(docRef, {
        timestamp:Timestamp.now(),
        course_id:courseId,
        section_id:sectionId,
        video_id:docRef.id,
        ...data
    }) 
    //increase child count
    const ref=doc(dbFirestore,"COURSE_LESSON_SECTIONS",sectionId)
    increaseChildCount(ref,1);



    } catch (error) {
        console.log("insertVideoInSection Error"+ error);
    }
}

export const updateVideoInSection=async (video_id,data,onSuccess,onFailed)=>{
    const docRef = doc(dbFirestore, "COURSE_VIDEOS",video_id);
    try {
        //Update data
     await updateDoc(docRef, {
        ...data
    }) 
    onSuccess("Record has been update")
   

    } catch (error) {
        console.log( error);
        onFailed("Something went wrong");
    }
}
//delete videos in Section
// export const deleteVideoInSection=async (video_id,onSuccess,onFailed)=>{
//     const docRef=doc(dbFirestore,"COURSE_VIDEOS",video_id)
// }

export const deleteDocument=async(docPath,docId,onSuccess,onFailed)=>{
    try {
        const docRef=doc(dbFirestore,docPath,docId);
        await deleteDoc(docRef);
        onSuccess("Record has been deleted");

    } catch (error) {
        onFailed(error)
    }
}



const increaseChildCount=async(docRef,increment)=>{
    try {
        await runTransaction(dbFirestore,async(transaction)=>{
            const document= await transaction.get(docRef);
            if(!document.exists()){
                throw "document not exists";
            }
            //update counter
            const newCount=document.data().totalItemCount+increment;
            transaction.update(docRef,{totalItemCount:newCount})
        });

    } catch (error) {
        console.log(error);
    }
}
export const decreaseChildCount=async(docPath,docId)=>{
    try {
        const docRef=doc(dbFirestore,docPath,docId);

        await runTransaction(dbFirestore,async(transaction)=>{
            const document= await transaction.get(docRef);
            if(!document.exists()){
                throw "document not exists";
            }
            //update counter
            if(document.data().totalItemCount>0){
                const newCount=document.data().totalItemCount-1;
                 transaction.update(docRef,{totalItemCount:newCount})
            }
        });

    } catch (error) {
        console.log(error);
    }
}


//add pdf into section 
export const addPdfInSection=async(courseId,sectionId,data,onSuccess,onFailed)=>{
    const docRef = doc(collection(dbFirestore, "COURSE_PDFS"))
    try {
        //store data
     await setDoc(docRef, {
        timestamp:Timestamp.now(),
        course_id:courseId,
        section_id:sectionId,
        pdf_id:docRef.id,
        ...data
    }) 
    //increase child count
    const ref=doc(dbFirestore,"COURSE_LESSON_SECTIONS",sectionId)
    increaseChildCount(ref,1);
    onSuccess("Record Added Successfully");

    } catch (error) {
        console.log("insertVideoInSection Error"+ error);
        onFailed(error);
    }
}

//update PDF
export const updateItemInSection=async (docPath,docId,data,onSuccess,onFailed)=>{
    const docRef = doc(dbFirestore, docPath,docId);
    try {
        //Update data
     await updateDoc(docRef, {
        ...data
    }) 
    onSuccess("Record has been update")
   
    } catch (error) {
        console.log( error);
        onFailed("Something went wrong");
    }
}


//insert quiz in section
export const insertQuizInSection=async (courseId,sectionId,dataArr,onSuccess,onFailed)=>{
   try {
    const batch=writeBatch(dbFirestore);
    let docNum=0;
    dataArr.forEach((element) => {
        const docRef=doc(collection(dbFirestore, "COURSE_QUIZZES"))
        batch.set(docRef,{
            timestamp:Timestamp.now(),
            course_id:courseId,
            section_id:sectionId,
            doc_id:docRef.id,
            ...element
        })
        docNum++;
   });

   batch.commit();
   onSuccess("Success");
   const ref=doc(dbFirestore,"COURSE_LESSON_SECTIONS",sectionId)
   increaseChildCount(ref,docNum);


   } catch (error) {
     console.log(error)
     onFailed("Something went wrong");
   }
}