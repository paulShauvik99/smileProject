import { ChakraProvider,  FormHelperText, Heading } from '@chakra-ui/react'
import React, {  useState } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Icon,
    InputGroup,
    InputLeftAddon,
    PinInput,
    PinInputField,
    HStack,
    VStack,
    Text
} from '@chakra-ui/react'
import { Phone } from '@phosphor-icons/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import LoginPage from '../Components/LoginPage'


const RequestBlood = () => {

    axios.defaults.withCredentials=true

    




    return (
        <>

                <div className="request_outer_div">
                    <div className="request_inner_div">
                        <div className="request_register">
                            <div className="request_registration_form">
                                <LoginPage />
                                <ToastContainer />
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default RequestBlood