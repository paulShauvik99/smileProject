import React, {  useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import LoginPage from '../Components/LoginPage'
import {jwtDecode} from 'jwt-decode'
import {motion} from 'framer-motion'




const RequestBlood = () => {
    axios.defaults.withCredentials=true
    
    const navigate = useNavigate()
    
    useEffect(()=>{
        const now = new Date().getTime()
        if(localStorage.getItem('check') !== null){
            if(JSON.parse(localStorage.getItem('check')).expire > now ) {
                if(jwtDecode(JSON.parse(localStorage.getItem('check')).user).isRecipient){
                    navigate('/request/requestdashboard')
                }
            }else{
                localStorage.removeItem('check')
            }
        }
    },[])

    return (
        <>

                <div className="request_outer_div">
             
                        <div className="request_register">
                            <motion.div className="request_registration_form"
                                initial={{x : '-100vw'}}
                                animate={{x : 0}}
                            >
                                <LoginPage 
                                    type="recipientLogin"
                                />
                                <ToastContainer />
                            </motion.div>
                        </div>
                   
                </div>
        </>
    )
}

export default RequestBlood