import React, { useEffect, useState } from 'react'
import { Button,Typography, Avatar, Card, CardContent, Paper} from '@mui/material';
import TableComp from '../Components/Table'
import CalendarComp from '../Components/Calendar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ChakraProvider, Grid, GridItem, Skeleton, } from '@chakra-ui/react';



const DonorDashboard = () => {
    axios.defaults.withCredentials=true 

    const navigate = useNavigate()
    const [loadingPage,setLoadingPage] = useState(true)
    const [loadApi, setLoadApi] = useState(false)

    useEffect(()=>{
        if(localStorage.getItem('check') !== null){
            const now  =  new Date().getTime()
            if(JSON.parse(localStorage.getItem('check')).expire < now){
                setLoadingPage(true)
                Swal.fire({
                    title: 'Session Expired! Please Login Again!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        localStorage.removeItem('check')
                        navigate('/donate')
                    }
                })
            }else if(!jwtDecode(JSON.parse(localStorage.getItem('check')).user).isDonor){
                setLoadingPage(true)
                Swal.fire({
                    title : 'You are not authorized to view this Page!',
                    text :  'Pleaase Register, to Continue!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/donate')
                    }
                })
            }else{
                setLoadApi(true)
            }
        }else{
            setLoadingPage(true)
            Swal.fire({
                title : 'You are not authorized to view this Page',
                text : 'Please Login/Register to Continue.',
                icon : 'warning'
            }).then((res)=>{
                if(res.isConfirmed || res.dismiss === 'backdrop'){
                    navigate('/donate')
                }
            })
        }
    },[])



    const [pastRecordRows, setPastRecordRows] = useState([])
    const [donorDetails, setDonorDetails] = useState()

    const getDonorRecords = async () =>{
        setLoadingPage(true)
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
        setLoadingPage(false)
    }

    console.log(loadApi)
    useEffect(()=>{
        if(loadApi){
            getDonorRecords()
        }
    },[loadApi])

    const logout = () => {
        try{
            axios.get('http://127.0.0.1:8000/donor/logout/').then((res)=>{
                setLoadingPage(true)
                localStorage.removeItem('check')
                Swal.fire({
                    title : 'Logout Successful',
                    icon : 'success',
                }).then((res) =>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/request')
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

    const tableColumn = ["Patient's Name", "Donation Date", "Phone Number", "Blood Group"]

    const highlightedDays = {
        26 : 9,
        28 : 6,
        25 : 8,
        30 : 2
    }
    console.log(loadingPage)

    return (
        <>
                        <div className="don_dashboard_outer_div">
                            <div className="don_dashboard_inner_div">
                                <div className="don_dashboard_content">
                                    <div className="actual_content">
                        {
                                !loadingPage ? (
                                    <>
                                        <div className="logout">
                                            <Button variant='contained' onClick={logout}>
                                                Logout
                                            </Button>
                                        </div>
                                        <div className="grid_container">
                                            <div className="main">
                                                <div className="content">
                                                    <div className="upper">
                                                        <Card sx={{ width: 820 , display : 'flex', alignItems : 'center' ,gap : 10, p:3, pl:10 , backgroundImage : 'linear-gradient(135deg,rgb(235, 234, 172) 30% , rgb(240, 130, 139))' }}>
                                                            <Avatar sx={{width : 100 , height : 100, fontSize : 50 , bgcolor : '#ea5d69'}}>GD</Avatar>
                                                            <CardContent>
                                                                <Typography variant="h3" m={0.5} mb={2} >
                                                                    Hi there, Gourab Das.
                                                                </Typography>
                                                                <Typography variant="h5" m={0.5} >
                                                                    <b>Phone Number : </b> +91 7002450760
                                                                </Typography>
                                                                <Typography variant="h5" m={0.5} >
                                                                    <b>Address : </b> Somewhere in the City of Joy
                                                                </Typography>
                                                                <Typography variant="h5" m={0.5}>
                                                                    <b> Sex :</b> Male
                                                                </Typography>
                                                                <Typography variant="h5" m={0.5}>
                                                                    <b> Last Donated : </b> 04/12/2023
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                    <div className="lower">
                                                        <Paper sx={{width : 820 , p : 3, mt : 2 ,backgroundImage : 'linear-gradient(135deg,rgb(235, 234, 172) 30% , rgb(240, 130, 139))'}}>
                                                                <Typography variant="h4" m={0.5}>
                                                                    You Have an Upcoming Appointment on 08/12/2023
                                                                </Typography>
                                                                <Typography variant="h4" container="div" m={0.5} sx={{display : 'flex' , justifyContent : 'space-between', mt :3}}>
                                                                    <Typography variant="h6">
                                                                        Patient's Name : Someone
                                                                    </Typography>
                                                                    <Typography variant="h6">
                                                                        Patient's Number : +91 1234567890
                                                                    </Typography>
                                                                    <Typography variant="h6">
                                                                        Patient's Address : Somewhere in this Planet
                                                                    </Typography>
                                                                </Typography>
                                                        </Paper>
                                                    </div>
                                                </div>
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
                                                <Typography variant="h3" >
                                                    Previous Donations
                                                </Typography>
                                                <TableComp
                                                    type='donor'
                                                    tableColumn={tableColumn}
                                                    tableContent={pastRecordRows}
                                                />
                                            </div>  
                                        </div>
                                    </>  
                                    ) : (
                                        <ChakraProvider>
                                            <Grid 
                                                templateRows='repeat(2,1fr)'
                                                templateColumns='repeat(3,1fr)'
                                                gap={4}
                                                p={5}

                                            >
                                                <GridItem
                                                    colSpan={2}
                                                >
                                                    <Skeleton
                                                        height='40rem'
                                                        startColor='red.100'
                                                        speed={1}
                                                    >

                                                    </Skeleton>
                                                    
                                                </GridItem>
                                                <GridItem
                                                    colSpan={1}
                                                    rowSpan={2}
                                                >
                                                    <Skeleton
                                                        startColor='red.100'
                                                        speed={1}

                                                        height='100%'
                                                        // width='70rem'
                                                    >

                                                    </Skeleton>

                                                </GridItem>
                                                <GridItem
                                                    colSpan={2}
                                                >

                                                    <Skeleton
                                                        startColor='red.100'
                                                        height='40rem'
                                                        speed={1}
                                                    >

                                                    </Skeleton>
                                                </GridItem>
                                            </Grid>

                                        </ChakraProvider>
                                    )   
                                }
                                    </div>
                                </div>
                            </div>
                        </div>
                            
        </>
    )
}

export default DonorDashboard