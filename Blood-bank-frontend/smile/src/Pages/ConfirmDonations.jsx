import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import ComplexTable from '../Components/ComplexTable'
import AdminNavbar from '../Components/AdminNavbar'



const ConfirmDonations = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()

    const [conDonationsRows, setconDonationsRows] = useState([]);
    // const [reqRows, setReqRows] = useState([]);
    // const [apiDonorData , setApiDonorData]  = useState({})
    // const [donorRows , setDonorRows] = useState([]);
    const [loadingPage , setLoadingPage] = useState(true)
    const [loadingApi , setLoadingApi] = useState(false)
    const [reload,setReload] = useState(false)


    const donationConfirmed = async (matched_id) =>{
        console.log(matched_id)
        try {
            const res = await axios.post('http://127.0.0.1:8000/donor/confirm_donation/', JSON.stringify({ matched_id : matched_id}))
            console.log(res)
            setReload(!reload)
        } catch (error) {
            Swal.fire({
                text : error.response.data.error,
                icon : 'error'
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
            // getTableData()
            getConfirmDonationsData()
        }
    },[loadingApi,reload])

    return (
        <>     
                    <AdminNavbar />
            <div className="admin_outer_div">
                <div className="admin_dashboard">
                    <h1>Confirm Donations</h1>
                    <ComplexTable
                        type='confirmDonations'
                        rows={conDonationsRows}
                        donationConfirmed={donationConfirmed}
                    />
                </div>
            </div>
        </>
    )
}

export default ConfirmDonations