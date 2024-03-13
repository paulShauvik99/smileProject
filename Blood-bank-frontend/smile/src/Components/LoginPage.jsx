import React, {  useEffect, useState } from 'react'
import { ChakraProvider,  FormHelperText, Heading, Button, FormControl, FormLabel, Input, Icon, InputGroup, InputLeftAddon, PinInput, PinInputField, HStack, VStack, Text} from '@chakra-ui/react'
import { Phone } from '@phosphor-icons/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'



export default function LoginPage(props){
    axios.defaults.withCredentials=true

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
        //Checking Number Validity
        const [isNumValid , setIsNumValid] = useState(false)
    
        //Handlers
        // OTP Timer
        const timer= () => {
    
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
        const sendOtp = async(number) =>{
            if(number.length != 10){
                console.log("Validation")
                setErrorMsg(prev => ({
                    isErr : true,
                    msg : "Invalid Number! Please Enter a valid Number."
                }))
                return
            }else{
                setShowTime(!showTime)
                timer()
                setErrorMsg({
                    isErr : false,
                    msg : ""
                })
                
                let data =  JSON.stringify({
                    phoneNumber : `+91${number}`
                })
                // console.log(data)
                let url = ''
                try {
                    switch(props.type){
                        case 'recipientLogin':
                            url = 'donor/send_otp/'
                            break
                        
                        case 'donorLogin' :
                            url = 'donor/donor_send_otp/'
                            break
                        
                        default:
                            Swal.fire({
                                text: 'Invalid URL! Please Try Again.', 
                                icon : 'error'
                            })
                            break
                    }
                    const res = await axios.post(`/${url}`, data)
                    console.log(res)
                    toast.success("OTP Sent Successfully !",{
                        position : toast.POSITION.TOP_CENTER
                    })
                } catch (err) {
                    console.log(err)

                    toast.error(err.response.data.error,{
                        position : toast.POSITION.TOP_CENTER
                    })                
                }

                
                // console.log(res)
    
            }
        }
    
        // Verify OTP
    
        const verifyOtp = async ( ) =>{
            
            if(otpVal.length !== 6){
                toast.error("Please Put a Valid OTP", {
                    position : toast.POSITION.TOP_CENTER
                })
                return
            }else{
                setIsLoading(true)
                let data = JSON.stringify({
                    otp : otpVal
                })
                try {
                    const res = await axios.post('/donor/verify_otp/',data)
                    console.log(res)
                    if( 'success' in res.data){
                        const now = new Date().getTime()
                        let check = {
                            user : res.data.user_type,
                            expire : now + 24*60*60000
                        }
                        localStorage.setItem('check',JSON.stringify(check))
                        Swal.fire({
                            title : 'OTP Successfully verified',
                            icon : 'success'
                        }).then((res) =>{
                            if(res.isConfirmed || res.dismiss==='backdrop'){
                                switch(props.type){
                                case 'recipientLogin' :
                                    navigate('/request/requestdashboard')
                                    break

                                case 'donorLogin':
                                    navigate('/donate/donordashboard')
                                    break
                                
                                default :
                                    Swal.fire({
                                        text : 'Something Went Wrong',
                                        icon : 'error'
                                    })
                                }
                            }
                        })
                        setIsLoading(false)
                    }else{
                        Swal.fire({
                            text : res.data.error,
                            icon : 'error'
                        })
                    }
                } catch (error) {
                    console.log(error)
                    Swal.fire({
                        title : error.response.data.error , 
                        icon  : 'error'
                    })                
                    setIsLoading(false)
                }
    
            }
        }

        //Real Time Number check
        const numberCheck =(num) =>{
            if(num.length !== 10 ){
                setIsNumValid(true)
                setNumber(num)
            }else{
                setIsNumValid(false)
                setNumber(num)
            }
        }

    return(
        <>
            <ChakraProvider>
                <VStack>
                    <Heading as='h3' > {props.type === 'recipientLogin' ? "Recipient Login" : "Donor Login"} </Heading>
                        <FormControl mt={15} isRequired width={{base : '28rem', lg : '35rem'}}>
                            <FormLabel fontSize='1.4rem' htmlFor='phone'>Phone</FormLabel>
                            <InputGroup>
                                <InputLeftAddon backgroundColor='#d71414' height={30}>
                                    <Icon as={Phone} boxSize={8} weight='duotone' color='#f0e3e4' />
                                </InputLeftAddon>
                                <Input variant='outline'
                                        backgroundColor='red.50'
                                        isInvalid={isNumValid}
                                        focusBorderColor={isNumValid ? 'red.400' : 'green.300'}
                                        errorBorderColor='red.400'
                                        height={30} 
                                        fontSize={14}  
                                        type="tel" 
                                        name="phone" 
                                        value={number} 
                                        onChange={e =>  numberCheck(e.target.value)} 
                                />
                            </InputGroup>
                            {errMsg.isErr ? (
                                    <FormHelperText fontSize={12} color="red" fontWeight={500} >{errMsg.msg}</FormHelperText>
                                ) : null}                                        
                        </FormControl>
                        <HStack mt={10} mb={26}>
                            <Button size='lg' 
                                    color="black" bg="#d7141450" 
                                    _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                    height='35px'
                                    width='120px'
                                    fontSize='16px'
                                    fontWeight='400'
                                    onClick={() => sendOtp(number)}
                                    isDisabled={disability}
                            >
                                {changeText}
                            </Button>
                            {showTime ? 
                            <Text fontSize={14} >Resend in : {time} </Text> 
                            : null} 
                        </HStack>
                        <HStack>
                            <PinInput otp variant='pill' size='lg' value={otpVal}  onChange={e=>setOtpVal(e)}
                                        placeholder='_'
                            >
                                <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                            </PinInput>
                        </HStack>
                        <Button 
                            // onClick={handleNext} 
                            color="black" bg="#d7141450" 
                            _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                            className='reg_btn'
                            mt={10}
                            height='30px'
                            width='120px'
                            fontSize='16px'
                            fontWeight='400'
                            isLoading={isLoading}
                            loadingText='Verifying'
                            onClick={verifyOtp}
                            isDisabled={otpVal.length !== 6}
                        >
                            Verify OTP
                        </Button>   
                    </VStack>                            
            </ChakraProvider>

        </>
    )


}