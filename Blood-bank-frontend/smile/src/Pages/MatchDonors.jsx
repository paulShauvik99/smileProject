import React, { useEffect, useState } from 'react'
import ComplexTable from '../Components/ComplexTable'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import AdminNavbar from '../Components/AdminNavbar'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Backdrop, Box, Fade, Modal } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'

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
    // zIndex : 3,

};


const MatchDonors = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    
    
    
    // State Variables
    //Request Lists    
    const [reqRows, setReqRows] = useState([]);
    // Donor Lists
    const [nonPendingList , setNonPendingList]  = useState([])
    //Open Modal
    const [open,setOpen] = useState(false)
    // const [donorRows , setDonorRows] = useState([]);
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
                    const res = await axios.post('http://127.0.0.1:8000/adminUser/reject_request/',JSON.stringify({recipient_id : id}))
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
            const res = await axios.post('http://127.0.0.1:8000/adminUser/confirm_recipient_donation/', JSON.stringify({recipient_id : id}) )
            console.log(res)
            toast.success( res.data.status)
        } catch (error) {
            toast.error(error.response.data.status)
        }
        setReload(!reload)
    }

    // Modal Handlers
    const viewPrevDonation = () => {setOpen(true) }
    const handleClose = () => setOpen(false);

    //API Data Call
    const getTableData = async () =>{
        setLoadingPage(true)
        const res = await axios.get('http://127.0.0.1:8000/adminUser/get_recipient_list/')
        console.log(res)
        let pendingReq = res.data.list.filter((el)=> { return el.status === 'Pending'})
        let nonPendingReq = res.data.list.filter((el)=> { return el.status !== 'Pending'})
        setReqRows(pendingReq)
        setNonPendingList(nonPendingReq)
        setLoadingPage(false)
    }
    
    //Refresh Page
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
                        viewPrevDonation={viewPrevDonation}
                        acceptRequest={acceptRequest}
                        // setChanges={changeSelectionModel}
                        rejectRequest={rejectRequest}
                        // donorData={apiDonorData}
                    />
                        
                    <h1>Available Donors</h1>
                    <ComplexTable
                        type='nonPendingList'
                        rows={nonPendingList} 
                        // sentForDonation={sentForDonation}
                    />
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
                            {/* <img src={reqRows[0].firstDonation.donationReceipt} height='200px' width='auto' alt="Receipt" /> */}
                        </Box>
                    </Fade>
                </Modal>
            </div>
        </>
    )
}

export default MatchDonors