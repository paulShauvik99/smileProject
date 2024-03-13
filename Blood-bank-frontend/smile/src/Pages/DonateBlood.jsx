// import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import {
    Box,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
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
    Text,
    Heading,
    FormHelperText,
    RadioGroup,
    Stack,
    Radio
} from '@chakra-ui/react'
import { ChakraProvider, IconButton  } from '@chakra-ui/react'
import { IdentificationBadge, Envelope, Phone ,Calendar, Password, Eye, EyeSlash, HouseLine, Drop, Gauge, CalendarCheck      } from '@phosphor-icons/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoginPage from '../Components/LoginPage'
import Swal from 'sweetalert2'
import { jwtDecode } from 'jwt-decode'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';




const steps = [
    { title: 'Personal Details' , description: 'First' },
    { title: 'Anatomical Features', description: 'Second' },
    { title: 'Contact Details', description: 'Third' },
]



const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//Main Page 
const DonateBlood = () => {
    axios.defaults.withCredentials=true

    const navigate = useNavigate()


    useEffect(()=>{
        if(localStorage.getItem('check')!== null){
            const now = new Date().getTime()
            if(JSON.parse(localStorage.getItem('check')).expire > now ) {
                if(jwtDecode(JSON.parse(localStorage.getItem('check')).user).isDonor){
                    navigate('/donate/donordashboard')
                }
            }else{
                localStorage.removeItem('check')
            }
        }
    },[])





    //Active Stepper State 
    const { activeStep , setActiveStep } = useSteps({
        index : 0,
        count : steps.length
    })
// OTP Value
    const [otpVal , setOtpVal] = useState('')
        
    // State Handlers
    //Donor Information
    const [donorInfo, setDonorInfo] = useState({
        firstName : '',
        lastName : '',
        dob : '',
        email : '',
        phoneNumber : '',
        address : '',
        bloodGroup : '',
        gender: '',
        lastDonated : '',
        isThalassemia : false,
        
    })
    

    //Timer Countdown
    const [time , setTime] = useState('')
    //Show Timer
    const [showTime, setShowTime] = useState(false)
    //Change OTP Button text
    const [changeText , setChangeText] = useState('Send OTP')
    //Disable OTP Button
    const [disability , setDisability] = useState(false)
    
    const [n ,setN ] = useState(1)
    const [isLogin , setIsLogin] = useState(false)
    const [isInValid , setIsInValid] = useState({
        firstName : false,
        lastName : false,
        email : false,
        phoneNumber : false,
        address : false,
    })
    //Handlers
    const handleNext = () => {
        switch (activeStep) {
            case 0 : 
                if(donorInfo.firstName.length < 3 || donorInfo.lastName.length < 3 || donorInfo.dob === '' || donorInfo.gender === ''){
                    toast.error("Please Enter the details correctly before continuing.")
                    return
                } 
                break 
            
            case 1 : 
                if(donorInfo.bloodGroup === ''){
                    toast.error("Please Enter the details correctly before continuing.")
                    return 
                }
                break 
            
            case 2 : 
                if(!emailRegex.test(donorInfo.email) || isInValid.phoneNumber || donorInfo.address.length < 10 ){
                    toast.error("Please Enter the details correctly before continuing.")
                    return 
                }
                break 
            
            default : return 
                
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Handle State Change of Donor Details
    const setDetails = (e) =>{
        let name = e.target.name
        let value = e.target.value
        switch(name){
            case 'firstName' : 
                if (value.trim().length < 3){
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break

            case 'lastName' : 
                if(value.trim().length < 3){
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break

            case 'email' : 
                if(!emailRegex.test(value.trim())){
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
                
            case 'phoneNumber' : 
                if(value.trim().length !== 10){
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
                
            case 'address' : 
                if(value.trim().length < 10){
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsInValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
        }
        setDonorInfo(prevState => ({
                ...prevState , 
                [name] : e.target.value
            })
        )
    }

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

    //APIs
    // Send OTP API
    const sendOtp = async () =>{

        if(donorInfo.firstName === '' || donorInfo.lastName === '' || donorInfo.dob === '' || donorInfo.email === '' || donorInfo.phoneNumber === '' || donorInfo.address === '' || donorInfo.bloodGroup === ''){
            Swal.fire({
                text : 'Please Fill the Details Completely',
                icon : 'error'
            })
        }else{
            const phoneNumber = {
                phoneNumber : `+91${donorInfo.phoneNumber}`
            }

            console.log(phoneNumber)
            timer()
            try{
                const res =  await axios.post('/donor/send_otp/', JSON.stringify(phoneNumber))
                if('success' in res.data){
                    toast.success(res.data.success, {
                        position : toast.POSITION.TOP_RIGHT
                    })
                }else{
                    toast.error(res.data.error , {
                        position : toast.POSITION.TOP_RIGHT
                    })
                }
                console.log(res)
                
            }catch(err){
                toast.error(err.response.data.error,{
                    position : toast.POSITION.TOP_RIGHT
                })
            }
        }

    }

    //VErify OTP API
    const verifyOtp = async () =>{
        const donorDet = {
            firstName : donorInfo.firstName,
            lastName : donorInfo.lastName,
            dob : donorInfo.dob,
            email : donorInfo.email,
            phoneNumber : `+91${donorInfo.phoneNumber}`,
            address : donorInfo.address,
            bloodGroup : donorInfo.bloodGroup,
            // weight : donorInfo.weight,
            lastDonated : donorInfo.lastDonated ? donorInfo.lastDonated : null,
            isThalassemia : donorInfo.isThalassemia,
            gender : donorInfo.gender,
            otp : otpVal
        }
        console.log(JSON.stringify(donorDet))
        try {
            const res = await axios.post('/donor/register/',JSON.stringify(donorDet))
            if('success' in res.data){
                const now = new Date().getTime()
                        let check = {
                            user : res.data.user_type,
                            expire : now + 20*60000
                        }
                        localStorage.setItem('check',JSON.stringify(check))
                        Swal.fire({
                            title : 'OTP Successfully verified',
                            icon : 'success'
                        }).then((res) =>{
                            if(res.isConfirmed || res.dismiss==='backdrop'){
                                navigate('/donate/donordashboard')
                            }
                        })
            }else{
                Swal.fire({
                    text : res.data.error,
                    icon : 'error'
                })
            }
        } catch (err) {
            Swal.fire({
                text : err.response.data.error,
                icon : 'error'
            })
        }
    }

    // Donor Register Form
    const formDetails = (activeStep) =>{

        switch(activeStep){

            case 0 : return(
                <>  

                    <Grid templateColumns={{lg : 'repeat(2, 1fr)'}} columnGap={14}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='firstName'>First Name</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon backgroundColor='#d71414'  height={30}>
                                        <Icon as={IdentificationBadge } boxSize={8} weight="duotone" color="#f0e3e4" />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isInValid.firstName ? 'red.400' : 'green.300'} isInvalid={isInValid.firstName} height={30} fontSize={14} type="text" name="firstName" value={donorInfo.firstName} onChange={e =>  setDetails(e)}  colorScheme='pink'/>
                                </InputGroup>
                                    {
                                        isInValid.firstName ? <FormHelperText color="red" fontWeight={500}> Name is too Short, Minimum 3 Characters is required  </FormHelperText> : null
                                    }
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon backgroundColor='#d71414' height={30}>
                                        <Icon as={IdentificationBadge }  boxSize={8} weight="duotone" color="#f0e3e4" />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isInValid.lastName ? 'red.400' : 'green.300'} isInvalid={isInValid.lastName} height={30} fontSize={14} type="text" name="lastName" value={donorInfo.lastName} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                                    {
                                        isInValid.lastName ? <FormHelperText color="red" fontWeight={500}> Name is too Short, Minimum 3 Characters is required  </FormHelperText> : null
                                    }
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='gender'> Gender </FormLabel>
                                <RadioGroup onChange={e => setDonorInfo(prev => ({...prev , gender : e}))} name="gender" value={donorInfo.gender}>
                                    <Stack direction='row' pt={4}>
                                        <Radio size='lg' colorScheme='red' value='male'>Male</Radio>
                                        <Radio size='lg' colorScheme='red' value='female'>Female</Radio>
                                        <Radio size='lg' colorScheme='red' value='others'>Others</Radio>
                                    </Stack>
                                </RadioGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='dob'>Date of Birth</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon backgroundColor='#d71414' height={30}>
                                        <Icon as={Calendar }  boxSize={8} weight="duotone" color="#f0e3e4" />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="date" name="dob" value={donorInfo.dob} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        
                        
                    </Grid>
                </>
            )

            case 1 : return(
                <>
                    <Grid templateColumns={{lg : 'repeat(2, 1fr)'}} columnGap={12}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='bloodGroup'>Blood Group</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon backgroundColor='#d71414' height={30}>
                                        <Icon as={Drop}  boxSize={8} weight='duotone' color='#f0e3e4' />
                                    </InputLeftAddon>
                                    <Select placeholder='Select Your Blood Group' height={30} fontSize={14} variant="outline" backgroundColor='red.50' name='bloodGroup' value={donorInfo.bloodGroup} onChange={e =>  setDetails(e)}>
                                        <option value='A+'>A Positive (A+)</option>
                                        <option value='A-'>A Negative (A-)</option>
                                        <option value='B+'>B Positive (B+)</option>
                                        <option value='B-'>B Negative (B-)</option>
                                        <option value='O+'>O Positive (O+)</option>
                                        <option value='O-'>O Negative (O-)</option>
                                        <option value='AB+'>AB Positive (B+)</option>
                                        <option value='AB-'>AB Negative (AB-)</option>
                                    </Select>
                                </InputGroup>
                                
                            </FormControl>
                        </GridItem>
                        {/* <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='weight'>Weight</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon backgroundColor='#d71414' height={30}>
                                        <Icon as={Gauge}  boxSize={8} weight='duotone' color='#f0e3e4' />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="number" name="weight" value={donorInfo.weight} onChange={e =>  setDetails(e)} />
                                    <InputRightAddon children='kg' backgroundColor='#d71414' color='#f0e3e4'  height={30}/>
                                </InputGroup>
                                
                            </FormControl>
                        </GridItem> */}
                        <GridItem>
                            <FormControl>
                                <FormLabel htmlFor='lastDonated'>Last Donated (Optional) </FormLabel>
                                <InputGroup>
                                    <InputLeftAddon backgroundColor='#d71414' height={30}>
                                        <Icon as={CalendarCheck } boxSize={8} weight='duotone' color='#f0e3e4' />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="date" name="lastDonated" value={donorInfo.lastDonated} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem >
                            <FormControl paddingTop={10}> 
                                <InputGroup>
                                    <FormLabel htmlFor='isThalassemia'>Do you have Thalassemia?</FormLabel>
                                    <Checkbox size='lg' colorScheme='orange' border="red" paddingLeft={5} name='isThalassemia' isChecked={donorInfo.isThalassemia}   onChange={e => setDonorInfo(prevState => ({...prevState, isThalassemia : !prevState.isThalassemia}))} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                    </Grid>
                </>
            )


            case 2 : return(
                <>
                    <Grid templateColumns={{lg : 'repeat(2, 1fr)'}} columnGap={12}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <InputGroup>
                                <InputLeftAddon backgroundColor='#d71414' height={30}>
                                    <Icon as={Envelope} boxSize={8} weight="duotone" color="#f0e3e4" />
                                </InputLeftAddon>
                                <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isInValid.email ? 'red.400' : 'green.300'} isInvalid={isInValid.email} height={30} fontSize={14}  type="email" name="email" value={donorInfo.email} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                                {
                                    isInValid.email ? <FormHelperText color="red" fontWeight={500}> Please Enter a Valid Email  </FormHelperText> : null
                                }
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='phoneNumber'>Phone</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon backgroundColor='#d71414' height={30}>
                                        <Icon as={Phone} boxSize={8} weight='duotone' color='#f0e3e4' />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isInValid.phoneNumber ? 'red.400' : 'green.300'} isInvalid={isInValid.phoneNumber} height={30} fontSize={14}  type="number" name="phoneNumber" value={donorInfo.phoneNumber} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                                {
                                    isInValid.phoneNumber ? <FormHelperText color="red" fontWeight={500}>Please Enter a Valid Phone Number  </FormHelperText> : null
                                }
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{base: 1 , lg :2}}>
                            <FormControl isRequired>
                                <FormLabel htmlFor='address'>Address</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon backgroundColor='#d71414' className='address' height={20}>
                                        <Icon as={HouseLine}  boxSize={8} weight='duotone' color='#f0e3e4' />
                                    </InputLeftAddon>
                                    <Textarea variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isInValid.address ? 'red.400' :  'green.300'} isInvalid={isInValid.address} fontSize={14} resize='none' name="address" value={donorInfo.address} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            {
                                isInValid.address ? <FormHelperText color="red" fontWeight={500}> Address is too Short, Minimum 10 Characters is required  </FormHelperText> : null
                            }
                            </FormControl>
                        </GridItem>
                        
                    </Grid>
                </>
            )
            
            case 3 : return(
                <>
                    <Grid  gap={12}>
                        <GridItem placeItems='center' className='authenticate'>
                            <VStack mt={20}>
                                <HStack>
                                    <Button size='lg'
                                        color="black" bg="#d7141450" 
                                        _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                        mb={10}
                                        height='35px'
                                        width='120px'
                                        fontSize='16px'
                                        onClick={sendOtp}
                                        isDisabled={disability}
                                        fontWeight='400'
                                    >
                                        {changeText}
                                    </Button>
                                    {showTime ? <Text fontSize='lg'>Resend in : {time} </Text> : null}
                                    
                                </HStack>
                                <HStack>
                                    <PinInput otp variant='outline' backgroundColor='red.50' placeholder='_' size='lg' value={otpVal}  onChange={e=>setOtpVal(e)} >
                                        <PinInputField height={20} fontSize={22}   color='black' bg='#d7141450'/>
                                        <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                        <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                        <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                        <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                        <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                    </PinInput>
                                </HStack>
                            </VStack>
                        </GridItem>
                    </Grid>
                </>
            )

            default : return(
                <> No Steps </>
            )

        }


    }



    return (
        <>


            <div className="donate_outer_div">
                <div className="donate_inner_div">
                    {
                        !isLogin ? (
                            <ChakraProvider>
                            <div className="donate_register">
                                <motion.div className="donate_registration_form"
                                    initial={{ x : '-100vw'}}
                                    animate={{ x : 0 }}
                                >
                                    <Heading as='h3' mb={10} textAlign='center' > Donor Registration </Heading>
                                    <Stepper size='lg' index={activeStep} colorScheme='red' >
                                        {steps.map((step, index) => (
                                            <Step key={index} onClick={()=> setActiveStep(index)}>
                                                <StepIndicator>
                                                    <StepStatus
                                                        complete={<StepIcon />}
                                                        incomplete={<StepNumber />}
                                                        active={<StepNumber />}
                                                    />
                                                </StepIndicator>

                                                    <Box flexShrink='0' display={{base : 'none' , lg : 'block'}}>
                                                        <StepTitle>{step.title}</StepTitle>
                                                        {/* <StepDescription>{step.description}</StepDescription> */}
                                                    </Box>

                                                <StepSeparator />
                                            </Step> 
                                        ))}
                                    </Stepper>
                                            
                                    <div className="reg">
                                                <form>
                                                    {formDetails(activeStep)}
                                                </form>
                                    </div>


                                    {activeStep === steps.length  ? (

                                        <div className="redirect">
                                            <VStack>
                                                <HStack>    
                                                    <IconButton
                                                        isRound={true}
                                                        isDisabled={activeStep === 0}
                                                        onClick={handleBack}
                                                        sx={{ mr: 1 }}
                                                        className='reg_btn'
                                                        color="black" bg="#d7141450" 
                                                        _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                        mt={10}
                                                        fontSize='16px'
                                                        height='3rem'
                                                        width='3rem'
                                                        icon={<ArrowBackIosNewIcon />}
                                                    />
                                                    <Button 
                                                        onClick={verifyOtp} 
                                                        color="black" bg="#d7141450" 
                                                        _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                        className='reg_btn'
                                                        mt={10}
                                                        height='30px'
                                                        width='120px'
                                                        fontSize='16px'
                                                        fontWeight='400'
                                                        isDisabled={otpVal.length !== 6}
                                                    >
                                                        Verify OTP
                                                    </Button>   
                                                    
                                                </HStack>
                                            </VStack>
                                        </div>
                                    ) : (

                                        <>  
                                            
                                            <div className="submit">
                                                
                                                <HStack>

                                                    <IconButton
                                                        isRound={true}
                                                        isDisabled={activeStep === 0}
                                                        onClick={handleBack}
                                                        sx={{ mr: 1 }}
                                                        className='reg_btn'
                                                        color="black" bg="#d7141450" 
                                                        _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                        mt={20}
                                                        height={{lg : '3rem', base : '2.5rem'}}
                                                        width={{lg : '3rem', base : '2.5rem'}}
                                                        icon={<ArrowBackIosNewIcon />}
                                                        fontSize='16px'
                                                    />
                                                    
                                                    <IconButton onClick={handleNext} 
                                                        isRound={true}
                                                        color="black" bg="#d7141450" 
                                                        _hover={{color:'#f0e3e4' , bg: '#d71414'}}  className='reg_btn'
                                                        mt={20}
                                                        height={{lg : '3rem', base : '2.5rem'}}
                                                        width={{lg : '3rem', base : '2.5rem'}}
                                                        fontSize='16px'
                                                        icon={<ArrowForwardIosIcon />}
                                                    />
                                                        
                                                    <Button 
                                                        onClick={e => setIsLogin(!isLogin)} 
                                                        color="black" bg="#d7141450" 
                                                        _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                        className='reg_btn'
                                                        mt={20}
                                                        height='35px'
                                                        width='22rem'
                                                        fontSize={{lg :'12px' , base : '8px'}}
                                                        ml={{base : '10rem', lg : '15rem'}}
                                                        justifySelf='flex-end'
                                                    >
                                                        Already Have an Account?
                                                        <br />
                                                        LogIn Here .
                                                    </Button>   
                                                        
                                                </HStack>
                                            </div>
                                        </>
                                    )}       

                                    
                                </motion.div>
                            </div>
                                    <ToastContainer />
                            </ChakraProvider>
                        ) : (
                            <>

                                <ChakraProvider>
                                    <div className="donate_login">
                                        <motion.div className="donate_login_form"
                                            initial={{ x : '100vw'}}
                                            whileInView={{ x : 0 }}
                                        >
                                            <VStack>

                                                <LoginPage 
                                                    setIsLogin={e => setIsLogin(!isLogin)}
                                                    type="donorLogin"
                                                />
                                                <Button 
                                                    onClick={e => setIsLogin(!isLogin)} 
                                                    color="black" bg="#d7141450" 
                                                    _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                    className='reg_btn'
                                                    mt={10}
                                                    height='35px'
                                                    width={{lg : '16rem'}}
                                                    fontSize={{lg :'12px' , base : '8px'}}
                                                    alignSelf='center'
                                                >
                                                    Don't Have an Account?
                                                        <br />
                                                    SignUp Here .
                                                </Button>
                                            </VStack>
                                        </motion.div>
                                    </div>
                                </ChakraProvider>
                            </>
                        )
                    }

                </div>
            </div>



        </>
    )
}

export default DonateBlood