import React, { useEffect, useMemo, useState } from 'react'
import { dbFirestore } from '../../firebase/FirebaseConfig';
import PageTitle from '../../components/PageTitle/PageTitle';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import MUIDataTable from 'mui-datatables';

function AllOrders() {
  const [loading,setLoading]=useState(true);

  //data states
  const [orders,setOrders]=useState([]);

  useEffect(()=>{
    
    const qRef = query(collection(dbFirestore, "ALL_ORDERS"), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(qRef, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({
            id: doc.id,
            productName: doc.data().productName,
            productType: doc.data().productType,
            status: doc.data().status,
            amount: doc.data().amount,
            productId: doc.data().productId,
            purchaseDate: doc.data().purchaseDate.toDate().toLocaleDateString("en-In"),
            mobile:doc.data().mobile,
            email:doc.data().userEmail
        })))
        setLoading(false)
    });
    return unsubscribe
  },[])  


  //table columns
  const columns=useMemo(()=>[
    {
        name: 'productName', //access nested data with dot notation
        label: 'Product Name',
    },
    {
        name: 'productType', //access nested data with dot notation
        label: 'Type',
    },
    {
        name: 'status', //access nested data with dot notation
        label: 'Status',
    },
    {
        name: "purchaseDate",
        label: 'Purchase Date',
    },
    {
        name: "mobile",
        label: 'Mobile No',
    },
    {
        name: "email",
        label: 'Email',
    },
  ])


  return (
    <>
        <PageTitle title="Orders"/>

        <MUIDataTable
                columns={columns}
                data={orders}
                title="ORDERS"
            />
    </>
  )
}

export default AllOrders