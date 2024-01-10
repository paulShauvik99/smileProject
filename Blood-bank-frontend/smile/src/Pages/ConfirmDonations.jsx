import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import ComplexTable from '../Components/ComplexTable'
import AdminNavbar from '../Components/AdminNavbar'



const ConfirmDonations = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()

    // const [conDonationsRows, setconDonationsRows] = useState([]);
    // const [reqRows, setReqRows] = useState([]);
    // const [apiDonorData , setApiDonorData]  = useState({})
    const [donorList , setDonorList] = useState([]);
    const [loadingPage , setLoadingPage] = useState(true)
    const [loadingApi , setLoadingApi] = useState(false)
    const [reload,setReload] = useState(false)
    
    // Page validation
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

    
    //Send Donor For Donation
    const sentForDonation = async (id) =>{
        //API for matched donor
        console.log(id)
        try {
            const res = await axios.post('http://127.0.0.1:8000/adminUser/confirm_donor/',{donor_id : id})
            console.log(res)
            setReload(!reload)

        } catch (error) {
            Swal.fire({
                text : error.response.data.error,
                icon : 'error',
            })
        }
    }



    const getAvailableDonors = async () => {
        setLoadingPage(true)
        const res = await axios.get('http://127.0.0.1:8000/adminUser/get_donor_list/')
        console.log(res)
        setDonorList(res.data.donor_list)
        setLoadingPage(false)
    }

    useEffect(()=>{
        if(loadingApi){
            getAvailableDonors()
        }
    },[loadingApi,reload])

    return (
        <>     
            <AdminNavbar />
            <div className="admin_outer_div">
                <div className="admin_dashboard">
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

export default ConfirmDonations