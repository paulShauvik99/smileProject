import React, { useEffect, useState } from 'react'
import ComplexTable from '../Components/ComplexTable'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import AdminNavbar from '../Components/AdminNavbar'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Backdrop, Box, Button, Fade, IconButton, Modal, Typography } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import {BallTriangle, LineWave} from 'react-loader-spinner';
import CloseIcon from '@mui/icons-material/Close';


//Style for Modal
const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95rem',
    height : '65rem',
    backgroundColor: 'rgb(214, 205, 205)',
    borderRadius: '2rem',
    borderLeft: '2px solid rgb(214,205,205)',
    borderBottom: '2px solid rgb(214,205,205)',
    boxShadow: 24,
    p: 4,
    '@media only screen and (max-width : 767px)' : {
        width: '36rem',
        height : '50rem',
    }
};

const modalTypStyle = {
    display : 'flex', 
    alignItems : 'center', 
    fontSize : '2rem' , 
    color : '#191818',
    '@media only screen and (max-width : 767px)' : {
        fontSize : '1rem'
    }
}



const RequestList = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    // State Variables
    //All Requests List
    const [modalLoad, setModalLoad] = useState(true)
    //Request Lists    
    const [reqRows, setReqRows] = useState([]);
    // Donor Lists
    const [nonPendingList , setNonPendingList]  = useState([])
    //Open Modal
    const [open,setOpen] = useState(false)
    // Modal Data
    const [modalData , setModalData] = useState();
    const [loadingPage , setLoadingPage] = useState(true)
    const [loadingApi , setLoadingApi] = useState(false)
    const [reload,setReload] = useState(false)
    
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

    //Reject Recipient Request
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
                    const res = await axios.post('http://192.168.1.12:8000/adminUser/reject_request/',JSON.stringify({recipient_id : id}))
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
    
    // Accept Recipient Request
    const acceptRequest = async (id) =>{
        console.log(id)
        try {
            const res = await axios.post('http://192.168.1.12:8000/adminUser/confirm_recipient_donation/', JSON.stringify({recipient_id : id}) )
            console.log(res)
            toast.success( res.data.status)
        } catch (error) {
            toast.error(error.response.data.status)
        }
        setReload(!reload)
    }

    
    //API Data Call
    const getTableData = async () =>{
        setLoadingPage(true)
        try{
            const res = await axios.get('http://192.168.1.12:8000/adminUser/get_recipient_list/')
            console.log(res)
            let pendingReq = res.data.list.filter((el)=> { return el.status === 'Pending'})
            let nonPendingReq = res.data.list.filter((el)=> { return el.status !== 'Pending'})
            setReqRows(pendingReq)
            setNonPendingList(nonPendingReq)
        }catch (error){
            Swal.fire({
                title : error.response.data.status,
                icon : 'error'
            })
        }
        setLoadingPage(false)
    }
    
    //Refresh Page
    useEffect(()=>{
        if(loadingApi){
            getTableData()
        }
    },[loadingApi,reload])
    
    // Modal Handlers
    const viewPrevDonation = async (id) => {
        setOpen(true)
        setModalLoad(true)
        console.log(id)
        try{
            const data = await axios.get('http://192.168.1.12:8000/adminUser/get_recipient_list/')
            setModalData(data.data.list.filter(e => e.id === id))
            setModalLoad(false)
        }catch(e) {
            toast.error(e.response.data.status)
            setModalLoad(false)
        }
    }
    const handleClose = () => setOpen(false);

    const adminLogout = () => {
        try{
            axios.get('http://192.168.1.12:8000/adminUser/admin_logout/').then((res)=>{
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
    // console.log()

    return (
        <>  

            <AdminNavbar />
            <div className="admin_outer_div">
                <div className="admin_dashboard">
                    {
                        loadingPage ? (
                            <>
                               
                                    <BallTriangle
                                        height={100}
                                        width={100}
                                        radius={5}
                                        color="#EAEAEA"
                                        ariaLabel="ball-triangle-loading"
                                        wrapperClass=""
                                        visible={true}
                                    />
                              
                            </>
                        ) : (
                            <>
                                <div className="logout">
                                    <Button variant='contained' onClick={adminLogout}
                                        sx={{
                                            backgroundColor : '#d71414',
                                            borderRadius : '2.5rem',
                                            color : '#f0e3e4',
                                            fontWeight : 'bold',
                                            fontSize : '1rem',
                                            "&:hover" : {
                                                backgroundColor : '#d71414',
                                                color : '#f0e3e4',
                                            }
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </div>
                                <h1>Pending Request Lists</h1> 
                                <ComplexTable
                                    type='reqList'
                                    rows={reqRows}
                                    viewPrevDonation={viewPrevDonation}
                                    acceptRequest={acceptRequest}
                                    // setChanges={changeSelectionModel}
                                    rejectRequest={rejectRequest}
                                    // donorData={apiDonorData}
                                />
                                    
                                <h1>All Requests</h1>
                                <ComplexTable
                                    type='nonPendingList'
                                    rows={nonPendingList} 
                                    viewPrevDonation={viewPrevDonation}
                                />
                        </>
                        )
                    }
                </div>
                <ToastContainer />
            </div>
            <div className="modal_div">
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            {
                                modalLoad ? (
                                    <>
                                        <LineWave
                                            visible={true}
                                            height="100"
                                            width="100"
                                            color="#191818"
                                            ariaLabel="line-wave-loading"
                                            wrapperStyle={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%"
                                            }}
                                            wrapperClass=""
                                            firstLineColor=""
                                            middleLineColor=""
                                            lastLineColor=""
                                        />
                                     </>
                                ) : (
                                    <>
                                        
                                        <div className="receipt_view">
                                            <IconButton sx={{position : 'absolute', right : 30 }} onClick={handleClose}>
                                                <CloseIcon color='#191818'/>
                                            </IconButton>
                                            <Typography variant='h4' sx={modalTypStyle} >
                                                <b>Blood Bank Name : </b> {modalData[0].firstDonation.bloodBankName}
                                            </Typography>
                                            <Typography variant='h4' sx={modalTypStyle} >
                                                <b> Donor's Blood : </b> {modalData[0].firstDonation.donBlood}
                                            </Typography>
                                            <Typography variant='h4' sx={modalTypStyle} >
                                                <b>Donation Date : </b> {modalData[0].firstDonation.donationDate}
                                            </Typography>
                                            <Typography variant='h4' sx={modalTypStyle} >
                                                <b> Donor's Name : </b> {modalData[0].firstDonation.donorName}
                                            </Typography>
                                            <img src={modalData[0].firstDonation.donationReceipt} height='200px' width='auto' alt="Receipt" />
                                        </div>
                                    </>
                                )
                            }
                        </Box>
                    </Fade>
                </Modal>
            </div>
        </>
    )
}

export default RequestList