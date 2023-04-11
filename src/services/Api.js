import { push, ref, set, update } from "firebase/database";
import { Timestamp } from "firebase/firestore";
import { dbRealtime } from "../firebase/FirebaseConfig";
//insert class 
export const insertBoardClass=(title,onSuccess,onFailed)=>{   
    try {
        const dbRef = ref(dbRealtime, "boardClass/");
        const itemRef = push(dbRef);
        set(itemRef, {
            title: title,
            id: itemRef.key
        })
        onSuccess("Insert successfully");

    } catch (error) {
        onFailed("Something went wrong");
        console.log(error);
    }
  
}

export const editBoardClass=(id,title,onSuccess,onFailed)=>{
    try {
        const dbRef = ref(dbRealtime, "boardClass/"+id);
        // const itemRef = push(dbRef);
        update(dbRef, {
            title: title,
        })
        onSuccess("Update successfully");

    } catch (error) {
        onFailed("Something went wrong");
        console.log(error);
    }
}

export const deleteItem=(id,onSuccess,onFailed)=>{
    
        const dbRef = ref(dbRealtime, "boardClass/"+id);
        set(dbRef, null).then(()=>{
            onSuccess("Delete successfully");
        }).catch((error)=>{
            onFailed("Something went wrong");
            console.log(error);

        }) 
}

export const insertSubject=(data,onSuccess,onFailed)=>{   
    try {
        const docRef = ref(dbRealtime, "/subjects/");
        const reference = push(docRef);
        set(reference, {
            subject_id: reference.key,
            ...data
        })
        onSuccess("Insert successfully");
        console.log(reference.key);

    } catch (error) {
        onFailed("Something went wrong");
        console.log(error);
    }
}

export const editSubject=(id,data,onSuccess,onFailed)=>{
        const dbRef = ref(dbRealtime, "subjects/"+id);
        update(dbRef, {
            ...data
        }).then(()=>{
            onSuccess("Update successfully");
        }).catch((error)=>{
            onFailed("Something went wrong");
            console.log(error);
        })
}

export const deleteSubject=(id,onSuccess,onFailed)=>{
    if(id!=""){
        const dbRef = ref(dbRealtime, "subjects/" + id);
        set(dbRef, null).then(() => {
            onSuccess("Delete successfully");
        }).catch((error) => {
            onFailed("Something went wrong");
            console.log(error);
        }) 
    }
}


//const addOrUpdate Quiz 
export const insertQuiz=(data,quizInstruction)=>{
    const dbRef = ref(dbRealtime, "quizzes/");
        const itemRef = push(dbRef);
        return set(itemRef, {
            timestamp: Date.now(),
            quiz_id: itemRef.key,
            duration:parseInt(data.duration),
            max_marks:parseInt(data.max_marks),
            questions:parseInt(data.questions),
            title:data.title,
            instructions:quizInstruction,
            subject_id:data.subject_id,
            class_id:data.class_id
        })
}


export const editQuiz=(id,data,quizInstruction)=>{
    const dbRef = ref(dbRealtime, "quizzes/"+id);
    return update(dbRef, {
        modifiedAt: Date.now(),
        duration:parseInt(data.duration),
        max_marks:parseInt(data.max_marks),
        questions:parseInt(data.questions),
        title:data.title,
        instructions:quizInstruction,
        subject_id:data.subject_id,
        class_id:data.class_id
    })
}

export const deleteQuiz=id=>{
    const dbRef = ref(dbRealtime, "quizzes/" + id);
    return set(dbRef, null)
}


//add question
export const addQuestion=(quiz_id,data)=>{
    const dbRef = ref(dbRealtime, "questions/");
        const itemRef = push(dbRef);
        return set(itemRef, {
            timestamp: Date.now(),
            quiz_id: quiz_id,
            question_id:itemRef.key,
            ...data
        })
}
//update question
export const updateQuestion=(qnId,data)=>{
    const dbRef = ref(dbRealtime, "questions/"+qnId);
    return update(dbRef, {
        modifiedAt: Date.now(),
        ...data
    })
}

export const deleteQuestion=qnId=>{
    const dbRef = ref(dbRealtime, "questions/" + qnId);
    return set(dbRef, null)
}

//app slider
export const addAppSlider=(data)=>{
    const dbRef = ref(dbRealtime, "imageSlider/");
    const itemRef = push(dbRef);
    return set(itemRef, {
        timestamp: Date.now(),
        slide_id:itemRef.key,
        ...data
    })
}

export const editAppSlider=(slide_id,data)=>{
    const dbRef = ref(dbRealtime, "imageSlider/"+slide_id);
    return update(dbRef, {
        modifiedAt: Date.now(),
        ...data
    })
}

export const deleteAppSlider=id=>{
      const dbRef = ref(dbRealtime, "imageSlider/" + id);
        return set(dbRef, null)
    
}
