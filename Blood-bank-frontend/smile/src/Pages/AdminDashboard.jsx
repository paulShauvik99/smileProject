import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import JoinLeftTwoToneIcon from '@mui/icons-material/JoinLeftTwoTone';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WaterDropTwoToneIcon from '@mui/icons-material/WaterDropTwoTone';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ComplexTable from '../Components/ComplexTable';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'
import { ChakraProvider, Skeleton, HStack} from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import AdminNavbar from '../Components/AdminNavbar';



const drawerWidth = 240;


const AdminDashboard = (props) => {
    axios.defaults.withCredentials = true
    
    const navigate = useNavigate()
    //Drawers
   
    
    const [tab , setTab] = useState('Match Donors');
    const [showDonorList , setShowDonorList] = useState(false)
    const [conDonationsRows, setconDonationsRows] = useState();
    const [reqRows, setReqRows] = useState([]);
    const [apiDonorData , setApiDonorData]  = useState({})
    const [donorRows , setDonorRows] = useState([]);
    const [loadingPage , setLoadingPage] = useState(true)
    const [loadingApi , setLoadingApi] = useState(false)
    const [reload,setReload] = useState(false)

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






    
    const getTableData = async () =>{
        setLoadingPage(true)
        const res = await axios.get('http://127.0.0.1:8000/donor/get_matched_donors/')
        console.log(res)
        setReqRows(res.data.recipient_list)
        setApiDonorData(res.data.donor_list)        
        setLoadingPage(false)
    }

    const getConfirmDonationsData = async () => {
        setLoadingPage(true)
        const res = await axios.get('http://127.0.0.1:8000/donor/get_confirmed_donors/')
        console.log(res)
        setconDonationsRows(res.data.list)
        setLoadingPage(false)
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

  

    
    useEffect(()=>{
        if(loadingApi){
            getTableData()
            getConfirmDonationsData()
        }
    },[loadingApi,reload])

    // console.log(apiDonorData)
    //Action Functions 


    
    const openDonor = (id,donorRows) =>{
        setShowDonorList(true)
        // console.log(donorData)
        setDonorRows(donorRows)
    }

    const logout = async () =>{
        try{
            axios.get('http://127.0.0.1:8000/donor/admin_logout/').then((res)=>{
                setLoadingPage(true)
                localStorage.removeItem('adminCheck')
                Swal.fire({
                    title : 'Logout Successful',
                    icon : 'success',
                }).then((res) =>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/admin')
                    }
                })
            })
        }catch(err){
            Swal.fire({
                title : 'Something Went Wrong',
                icon : 'error'
            })
        }
    }
    


    const changeSelectionModel = (id) =>{ setShowDonorList(true)}


    
    
    
   
    return (
        <>
            <div className="admin_outer_div">
                <div className="admin_dashboard">
                    {
                        !loadingPage ? (
                            <>

                                <AdminNavbar />
                                <Box
                                    component="main"
                                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                                >
                                    <Toolbar />
                                    {
                                        tab === 'Match Donors' ? (
                                            <>  
                                                <h1>Request Lists</h1> 
                                                <ComplexTable
                                                    type='reqList'
                                                    rows={reqRows}
                                                    openDonor={openDonor}
                                                    setChanges={changeSelectionModel}
                                                    rejectRequest={rejectRequest}
                                                    donorData={apiDonorData}
                                                />
                                                {
                                                    showDonorList ? (
                                                                <>
                                                                    <h1>Match Donors</h1>
                                                                    <ComplexTable
                                                                        type='donorList'
                                                                        rows={donorRows}
                                                                        getMatchedDonorId={getMatchedDonorId}
                                                                    />
                                                                </>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <>
                                                <h1>Confirm Donations</h1>
                                                <ComplexTable
                                                    type='confirmDonations'
                                                    rows={conDonationsRows}
                                                    donationConfirmed={donationConfirmed}
                                                />
                                            </>
                                        )
                                    }
                                </Box>
                            </>
                        ) : (
                            <ChakraProvider>
                                
                                    <Skeleton
                                        mx={14}
                                        mt={14}
                                        height='70rem'
                                        startColor='red.100'
                                        speed={1}
                                    >
                                    </Skeleton>
                       
                            </ChakraProvider>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default AdminDashboard