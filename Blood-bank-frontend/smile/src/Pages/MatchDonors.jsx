import React, { useEffect, useState } from 'react'
import ComplexTable from '../Components/ComplexTable'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import AdminNavbar from '../Components/AdminNavbar'
import { useNavigate } from 'react-router-dom'



const MatchDonors = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    
    
    // const [conDonationsRows, setconDonationsRows] = useState();
    const [reqRows, setReqRows] = useState([]);
    const [apiDonorData , setApiDonorData]  = useState({})
    const [donorRows , setDonorRows] = useState([]);
    const [loadingPage , setLoadingPage] = useState(true)
    const [loadingApi , setLoadingApi] = useState(false)
    const [reload,setReload] = useState(false)

    
    const openDonor = (id,donorRows) =>{
        setShowDonorList(true)
        // console.log(donorData)
        setDonorRows(donorRows)
    }

    const changeSelectionModel = (id) =>{ setShowDonorList(true)}
    
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

    const getMatchedDonorId = async (id,matchedId) =>{
        //API for matched donor
        
        try {
            const res = await axios.post('http://127.0.0.1:8000/donor/confirm_donor/',{matched_id : matchedId})
            console.log(res)
            setReload(!reload)

        } catch (error) {
            Swal.fire({
                text : error.response.data.error,
                icon : 'error',
            })
        }
    }
    
    const getConfirmDonationsData = async () => {
        setLoadingPage(true)
        const res = await axios.get('http://127.0.0.1:8000/donor/get_confirmed_donors/')
        console.log(res)
        setconDonationsRows(res.data.list)
        setLoadingPage(false)
    }

    
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


     
    useEffect(()=>{
        if(loadingApi){
            getTableData()
            getConfirmDonationsData()
        }
    },[loadingApi,reload])

    const getTableData = async () =>{
        setLoadingPage(true)
        const res = await axios.get('http://127.0.0.1:8000/donor/get_matched_donors/')
        console.log(res)
        setReqRows(res.data.recipient_list)
        setApiDonorData(res.data.donor_list)        
        setLoadingPage(false)
    }


    return (
        <>  

            <AdminNavbar />
            <div className="admin_outer_div">
                <div className="admin_dashboard">
                    <h1>Request Lists</h1> 
                    <ComplexTable
                        type='reqList'
                        rows={reqRows}
                        openDonor={openDonor}
                        setChanges={changeSelectionModel}
                        rejectRequest={rejectRequest}
                        donorData={apiDonorData}
                    />
                        
                    <h1>Match Donors</h1>
                    <ComplexTable
                        type='donorList'
                        rows={donorRows}
                        getMatchedDonorId={getMatchedDonorId}
                    />
                </div>
            </div>
        </>
    )
}

export default MatchDonors