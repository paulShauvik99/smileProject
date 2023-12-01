import React, {  useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import LoginPage from '../Components/LoginPage'
import {jwtDecode} from 'jwt-decode'




const RequestBlood = () => {
    axios.defaults.withCredentials=true
    
    const navigate = useNavigate()
    
    if(localStorage.getItem('user') !== null){
        const checkUser = jwtDecode(localStorage.getItem('user'))
        console.log(checkUser)
        if(checkUser.isRecipient){
            navigate('/request/requestdashboard')
        }
    }

    return (
        <>

                <div className="request_outer_div">
                    <div className="request_inner_div">
                        <div className="request_register">
                            <div className="request_registration_form">
                                <LoginPage 
                                    type="recipientLogin"
                                />
                                <ToastContainer />
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default RequestBlood