import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useMemo } from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { dbFirestore } from '../../firebase/FirebaseConfig';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Avatar, Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import MUIDataTable from 'mui-datatables';


function Users() {
    const [loading, setLoading] = useState(true);
    //data state
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const qRef = query(collection(dbFirestore, "USERS_2.0"), orderBy("registeredAt", "asc"))
        const unsubscribe = onSnapshot(qRef, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                phone: doc.data().phone,
                email: doc.data().email,
                // profilePhoto: <Avatar src={doc.data().profilePhoto} />,
                registeredAt: doc.data().registeredAt.toDate().toLocaleDateString("en-GB"),
                lastLoggedIn: timestampToDateAndTime(doc.data().lastLoggedIn)
            })))
            setLoading(false)
        });
        return unsubscribe
    }, [])



    const timestampToDateAndTime = (timestamp) => {
        // Convert to a JavaScript Date object:
        const jsDate = timestamp.toDate();

        // Format the date and time using the JavaScript Intl API:
        const options = {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return new Intl.DateTimeFormat('en-In', options).format(jsDate);
        
    }



    const columns = [
        {
          label: "Name",
          name: "name",
        },
        {
          label: "Email",
          name: "email",
        },
        {
            name: 'phone', 
            label: 'Phone',
        },
        {  
            name: "registeredAt",
            label: 'Registered At',
        },
        {
            name: "lastLoggedIn",
            label: 'Last LoggedIn',
        },
        {
            name: "id",
            label: 'User Id',

        },
      ];

    

    return (
        <>
            <PageTitle title="Registered Users" />

            <div style={{ width: "100%", textAlign: "center" }}>
                {loading ? <CircularProgress /> : ""}
            </div>

            <MUIDataTable
                columns={columns}
                data={users}/>

      

       </>
    )
}

export default Users