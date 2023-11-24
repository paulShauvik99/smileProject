import { ChakraProvider,  FormHelperText, Heading } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Grid,
    GridItem,
    Icon,
    InputRightElement,
    InputRightAddon,
    InputGroup,
    InputLeftAddon,
    Checkbox,
    Select,
    Textarea,
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


const RequestBlood = () => {
    
    // axios.defaults.withCredentials=true

    // Navigate
    const navigate = useNavigate()


    //Show Timer
    const [showTime, setShowTime] = useState(false)
    //Change OTP Button text
    const [changeText , setChangeText] = useState('Send OTP')
    //Disable OTP Button
    const [disability , setDisability] = useState(false)
    //Timer Countdown
    const [time , setTime] = useState('')
    //Recepient Number
    const [number , setNumber] = useState('')
    //Error Msg for Phone Number
    const [errMsg , setErrorMsg] = useState({
        isErr : false,
        msg : ''
    })    
    //Multiplying Timer
    const [n ,setN ] = useState(1)
    // Getting OTP value from user input
    const [otpVal ,setOtpVal] = useState("")
    //Verifying OTP
    const [isLoading , setIsLoading] = useState(false)

    //Handlers
    // OTP Timer
    const timer= () => {

        setShowTime(!showTime)
        setChangeText('Resend OTP')
        setDisability(!disability)
        const end = new Date(Date.now()  + n*15*1000)
        const int = setInterval(()=>{
            const now = new Date()
            const diff = (end - now) / 1000
            let min = Math.floor((diff / 60) % 60)
            let sec = Math.floor(diff % 60)
            if(sec<10){
                sec = `0${sec}`
            }
            setTime(`0${min} : ${sec}`)
            if(min == '00' && sec == '00'){
                setShowTime(prev => !prev)
                setDisability(prev => !prev)
                clearInterval(int)
            }
        },1000)
        setN(prev => prev+1)

    }



    // SEND OTP
    const sendOtp = async() =>{
        
        if(number.length !== 10){
            // console.log("Validation")
            setErrorMsg(prev => ({
                isErr : true,
                msg : "Invalid Number! Please Enter a valid Number."
            }))
            return
        }else{
            timer()
            setErrorMsg(prev => ({
                isErr : false,
                msg : ""
            })) 
            
            let data =  JSON.stringify({
                phoneNumber : `+91${number}`
            })
            
            const res = await axios.post('http://127.0.0.1:8000/donor/send_otp/', data)
            toast.success("OTP Sent Successfully !",{
                position : toast.POSITION.BOTTOM_RIGHT
            })
            
            console.log(res)

        }
    }


    // Verify OTP

    const verifyOtp = async ( ) =>{
        
        if(otpVal.length !== 6){
            toast.error("Wrong OTP", {
                position : toast.POSITION.BOTTOM_RIGHT
            })
            return
        }else{
            // setIsLoading(true)
            let data = JSON.stringify({
                otp : otpVal
            })
            // console.log(data)
            // try {
                const res = await axios.post('http://127.0.0.1:8000/donor/verify_otp/',data)
                console.log(res)
            //     setIsLoading(false)
            // } catch (error) {
            //     console.log(error)                
            // }

            localStorage.setItem("token" , JSON.stringify({token : "checkingifthisworks"}))

            navigate("/request/requestdashboard")



        }
    }

    // console.log(number)


    return (
        <>
            <ChakraProvider>
                <div className="request_outer_div">
                    <div className="request_inner_div">
                        <div className="request_register">
                            <div className="request_registration_form">
                                <VStack>
                                    <Heading as='h3' > Welcome to our Service </Heading>
                                    <FormControl mt={15} isRequired width='35rem'>
                                        <FormLabel fontSize='1.4rem' htmlFor='phone'>Phone</FormLabel>
                                        <InputGroup>
                                            <InputLeftAddon height={30}>
                                                <Icon as={Phone} boxSize={8} weight='duotone' color='#ce2432' />
                                            </InputLeftAddon>
                                            <Input variant='pill' 
                                                height={30} 
                                                fontSize={14}  
                                                type="number" 
                                                name="phone" 
                                                value={number} 
                                                onChange={e =>  setNumber(e.target.value)} 
                                            />
                                        </InputGroup>
                                        {errMsg.isErr ? (
                                            <FormHelperText fontSize={12} color="red" fontWeight={700} >{errMsg.msg}</FormHelperText>
                                        ) : null}
                                            
                                    </FormControl>

                                            <HStack mt={15}>
                                                <Button size='lg' color="red.500" bg="red.200" 
                                                    _hover={{color:'red.50' , bg: 'red.400'}} 
                                                    mb={10}
                                                    height='35px'
                                                    width='120px'
                                                    fontSize='16px'
                                                    onClick={sendOtp}
                                                    isDisabled={disability}
                                                >
                                                    {changeText}
                                                </Button>
                                                {showTime ? <Text fontSize='lg'>Resend in : {time} </Text> : null}
                                                
                                            </HStack>
                                            <HStack>
                                                <PinInput otp variant='pill' size='lg' value={otpVal}  onChange={e=>setOtpVal(e)}
                                                    placeholder='_'
                                                >
                                                    <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                                    <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                                    <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                                    <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                                    <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                                    <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                                </PinInput>
                                            </HStack>

                                            <Button 
                                                // onClick={handleNext} 
                                                color="red.500" bg="red.200" 
                                                _hover={{color:'red.50' , bg: 'red.400'}} 
                                                className='reg_btn'
                                                mt={20}
                                                height='30px'
                                                width='120px'
                                                fontSize='16px'
                                                isLoading={isLoading}
                                                loadingText='Verifying'
                                                onClick={verifyOtp}
                                            >
                                                Verify OTP
                                            </Button>   
                                        </VStack>
                                        <ToastContainer />
                            </div>
                        </div>
                    </div>
                </div>
            </ChakraProvider>
        </>
    )
}

export default RequestBlood