import React, { useEffect, useState } from 'react'
import { Badge, Typography , Stack, Button, Modal, Backdrop, Fade, Stepper, Step, StepLabel, StepContent, Paper, Box } from '@mui/material';
import TableComp from '../Components/Table'
import CalendarComp from '../Components/Calendar';
import axios from 'axios';
import Swal from 'sweetalert2';




const DonorDashboard = () => {
    axios.defaults.withCredentials=true 

    const [pastRecordRows, setPastRecordRows] = useState([])
    const [donorDetails, setDonorDetails] = useState()

    const getDonorRecords = async () =>{
        try {
            const res = await axios.get('http://127.0.0.1:8000/donor/get_donor_records/')
            console.log(res)
            setPastRecordRows(res.data.pastRecord)
            setDonorDetails(res.data.donorDetails)
        } catch (error) {
            Swal.fire({
                text : error.response.data.error,
                icon : 'error'
            })
        }
    }


    useEffect(()=>{
        getDonorRecords()
    },[])

    


    const highlightedDays = {
        26 : 9,
        28 : 6,
        25 : 8,
        30 : 2
    }

    return (
        <>
            <div className="don_dashboard_outer_div">
                <div className="don_dashboard_inner_div">
                    <div className="don_dashboard_content">
                        <div className="actual_content">
                            <div className="grid_container">
                                <div className="main">

                                </div>
                                <div className="calendar">
                                        <Typography variant='h2' component='h2' mb={10} textAlign='center'>
                                            Your Appoinment Date                                            
                                        </Typography>
                                        <CalendarComp
                                            highlightedDays={highlightedDays}
                                        />
                                    </div>
                                <div className="requests">
                                    <TableComp
                                        tableContent={pastRecordRows}
                                    />
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DonorDashboard