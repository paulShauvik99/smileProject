import React, { useState } from 'react'
import { Badge, Typography , Stack, Button, Modal, Backdrop, Fade, Stepper, Step, StepLabel, StepContent, Paper, Box } from '@mui/material';
import TableComp from '../Components/Table'
import CalendarComp from '../Components/Calendar';




const DonorDashboard = () => {

    const highlightedDays = {
        26 : 9,
        28 : 6,
        25 : 8,
        30 : 2
    }




    const rows = [
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
    ];


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
                                        tableContent={rows}
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