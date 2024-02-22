import React, { useEffect, useState } from 'react'
import { Button,Typography, Avatar, Card, CardContent, Paper, Divider} from '@mui/material';
import TableComp from '../Components/Table'
import CalendarComp from '../Components/Calendar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ChakraProvider, Grid, GridItem, Skeleton, } from '@chakra-ui/react';
import {BallTriangle} from 'react-loader-spinner';


// Avatar Color
function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            width : 75, 
            height : 75, 
            fontSize : 28,
            boxShadow : '0 0 2rem rgba(0,0,0,0.5)'

        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}



const DonorDashboard = () => {
    axios.defaults.withCredentials=true 

    const navigate = useNavigate()
    const [loadingPage,setLoadingPage] = useState(true)
    const [loadApi, setLoadApi] = useState(false)

    //Page Validation
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



    const [donorList, setDonorList] = useState([])
    const [donorDetails, setDonorDetails] = useState()
    //Set Time
    const [time, setTime] = useState(['','',''])
    //Set Date
    const [date, setDate] = useState(['','',''])


    //Fetch Donor Records 
    const getDonorRecords = async () =>{
        setLoadingPage(true)
        try {
            const res = await axios.get('http://192.168.1.12:8000/donor/get_donor_records/')
            console.log(res)
            setDonorList(res.data.donorList)
            setDonorDetails(res.data.donorDetails)
        } catch (error) {
            Swal.fire({
                text : error.response.data.error,
                icon : 'error'
            })
        }
        setLoadingPage(false)
    }

    //Page loading API
    useEffect(()=>{
        // Date and Time for Display
        setInterval(()=>{
            let date = new Date()
            setTime(date.toLocaleTimeString('en-US',{hour12: true, hour : '2-digit', minute : '2-digit'}).split(/[\s:]/))
            setDate(date.toLocaleDateString('en-US', {weekday : 'short', day : '2-digit', month : 'long'}).split(' '))
        },1000)


        if(loadApi){
            getDonorRecords()
        }
    },[loadApi])

    // Logout API call
    const logout = () => {
        try{
            axios.get('http://192.168.1.12:8000/donor/logout/').then((res)=>{
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

    const tableColumn = ["Donor's Name","Total Donations"]

    return (
        <>
                        <div className="don_dashboard_outer_div">
                                <div className="don_dashboard_content">
                                    <div className="actual_content">
                        {
                                !loadingPage ? (
                                    <>
                                        <div className="logout">
                                            <Button variant='contained' onClick={logout}
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
                                        <div className="grid_container">
                                            <div className="calendar">
                                                <div className="date_time">
                                                    <div className="date">
                                                        <p>{`${date[0]} ${date[2]}`}</p>   
                                                        <p>{date[1]}</p>   
                                                    </div>
                                                    <div className="time">
                                                        <p>{time[0]}</p>
                                                        <p> : </p>
                                                        <p>{time[1]}</p>
                                                        <p> {time[2].toLowerCase()} </p>                                                        
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="main">
                                                    <div className="upper">     
                                                        <div className="first">
                                                            <Avatar {...stringAvatar(`${donorDetails.firstName} ${donorDetails.lastName}`)}/>
                                                            <Typography variant="h3" >
                                                                Hi, {`${donorDetails.firstName} ${donorDetails.lastName}`}
                                                            </Typography>
                                                        </div>    
                                                        <div className="second">
                                                                <Typography  variant="h5" m={0.5} >
                                                                    <b>Phone Number : </b> {donorDetails.phoneNumber}
                                                                </Typography>
                                                                <Typography  variant="h5" m={0.5} >
                                                                    <b>Email : </b> {donorDetails.emailId}
                                                                </Typography>
                                                                <Typography  variant="h5" m={0.5} >
                                                                    <b>Address : </b> {donorDetails.address} 
                                                                </Typography>
                                                                <Typography  variant="h5" m={0.5}>
                                                                    <b> Sex :</b> Male
                                                                </Typography>
                                                                <Typography  variant="h5" m={0.5}>
                                                                    <b> Blood Group :</b> {donorDetails.bloodGroup}
                                                                </Typography>
                                                                <Typography  variant="h5" m={0.5}>
                                                                    <b> Last Donated : </b> {donorDetails.lastDonated}
                                                                </Typography>
                                                        </div>                                               
                                                    </div>
                                                    <Divider />
                                                    <div className="lower">
                                                                <Typography variant="h4" m={0.5} mt='1rem' sx={{padding : '0.5rem' , backgroundColor : '#f0e3e4' , borderRadius : '1rem' , fontSize : '2rem', textAlign : 'center', color : '#d71414', fontWeight : 'bold' }} >
                                                                    {
                                                                        donorDetails.isEligible ?  "You're Eligible for Donation." : "You're Not Eligible for Donation."

                                                                    }
                                                                </Typography>                                                               
                                                                <Typography variant="h5" mt={2} fontSize={16}>
                                                                    {
                                                                        donorDetails.remainingDays < 0 ? "" : `You'll be eligible for donations after ${donorDetails.remainingDays} days.`
                                                                    }
                                                                </Typography>
                                                    </div>
                                            </div>
                                            <div className="requests">
                                                <Typography variant="h3" sx={{fontWeight : 'bold' , color : '#f0e3e4', fontSize : '4rem'}}>
                                                    Top Donors
                                                </Typography>
                                                <TableComp
                                                    type='donor'
                                                    tableColumn={tableColumn}
                                                    tableContent={donorList}
                                                />
                                            </div>  
                                        </div>
                                    </>  
                                    ) : (
                                        <>
                                            <BallTriangle
                                                height={100}
                                                width={100}
                                                radius={5}
                                                color="#EAEAEA"
                                                ariaLabel="ball-triangle-loading"
                                                wrapperStyle={{
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "100%"
                                                }}
                                                wrapperClass=""
                                                visible={true}
                                            />
                                        </>
                                    )   
                                }
                                    </div>
                                </div>
                        </div>
                            
        </>
    )
}

export default DonorDashboard