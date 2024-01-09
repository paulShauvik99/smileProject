import React, { useEffect, useState } from 'react'
import ComplexTable from '../Components/ComplexTable'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import AdminNavbar from '../Components/AdminNavbar'
import { useNavigate } from 'react-router-dom'



const MatchDonors = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    
    //Page Validation
    useEffect(() => {
        if(localStorage.getItem('adminCheck') !== null){
            const now = new Date().getTime()
            if(JSON.parse(localStorage.getItem('adminCheck')).expire < now ){
                setLoadingPage(true)
                    Swal.fire({
                        title: 'Session Expired! Please Login Again!',
                        icon : 'warning'
                    }).then((res)=>{
                        if(res.isConfirmed || res.dismiss === 'backdrop'){
                            localStorage.removeItem('adminCheck')
                            navigate('/admin')
                        }
                    })
            }else if(!jwtDecode(JSON.parse(localStorage.getItem('adminCheck')).isAdmin)){
                setLoadingPage(true)
                Swal.fire({
                    title : 'You are not authorized to view this Page!',
                    text :  'Pleaase Login with correct Admin Credentials to Continue!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/admin')
                    }
                })
            }else{
                setLoadingApi(true)
            }
        }else{
            setLoadingPage(true)
            Swal.fire({
                title : 'You are not authorized to view this Page',
                text : 'Pleaase Login with correct Admin Credentials to Continue!',
                icon : 'warning'
            }).then((res)=>{
                if(res.isConfirmed || res.dismiss === 'backdrop'){
                    navigate('/admin')
                }
            })
        }

    },[])


    // State Variables
    //Request Lists    
    const [reqRows, setReqRows] = useState([]);
    // Donor Lists
    const [donorList , setDonorList]  = useState([])
    // const [donorRows , setDonorRows] = useState([]);
    const [loadingPage , setLoadingPage] = useState(true)
    const [loadingApi , setLoadingApi] = useState(false)
    const [reload,setReload] = useState(false)

    
    const rejectRequest = async (id, sl) => {
        //Reject API
        console.log(id)
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Reject Request!"
        }).then(async (res)=>{

            if(res.isConfirmed){
                try {
                    const res = await axios.post('http://127.0.0.1:8000/donor/reject_reject/',JSON.stringify({recipient_id : id}))
                    console.log(res)
                    Swal.fire({
                        text : "The Request Has Been Rejected",
                        icon : 'warning'
                    })
                } catch (error) {
                    Swal.fire({
                        text : error.response.data.error,
                        icon : 'error'
                    })
                }
                setReload(!reload)
            }else if(res.isDismissed || res.dismiss === 'backdrop' ){
                return
            }

        })
    }

    const sentForDonation = async (id) =>{
        //API for matched donor
        console.log(id)
        // try {
        //     const res = await axios.post('http://127.0.0.1:8000/admin/confirm_donor/',{id : id})
        //     console.log(res)
        //     setReload(!reload)

        // } catch (error) {
        //     Swal.fire({
        //         text : error.response.data.error,
        //         icon : 'error',
        //     })
        // }
    }



    // URLs during load
    const urls = ['http://127.0.0.1:8000/admin/get_donor_list/']
    //API Data Call
    const getTableData = async () =>{
        setLoadingPage(true)
        const res = await axios.all(urls.map(()=>axios.get(urls)))
        console.log(res[0].data.donor_list)
        // setReqRows(res.data.recipient_list)
        setDonorList(res[0].data.donor_list)        
        setLoadingPage(false)
    }
    
    
    useEffect(()=>{
        if(loadingApi){
            getTableData()
        }
    },[loadingApi,reload])
    


    // console.log()

    return (
        <>  

            <AdminNavbar />
            <div className="admin_outer_div">
                <div className="admin_dashboard">
                    <h1>Request Lists</h1> 
                    <ComplexTable
                        type='reqList'
                        rows={reqRows}
                        // openDonor={openDonor}
                        // setChanges={changeSelectionModel}
                        rejectRequest={rejectRequest}
                        // donorData={apiDonorData}
                    />
                        
                    <h1>Available Donors</h1>
                    <ComplexTable
                        type='donorList'
                        rows={donorList}
                        sentForDonation={sentForDonation}
                    />
                </div>
            </div>
        </>
    )
}

export default MatchDonors