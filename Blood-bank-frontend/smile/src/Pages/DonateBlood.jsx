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
    Text
} from '@chakra-ui/react'
import { ChakraProvider, IconButton  } from '@chakra-ui/react'
import { IdentificationBadge, Envelope, Phone ,Calendar, Password, Eye, EyeSlash, HouseLine, Drop, Gauge, CalendarCheck      } from '@phosphor-icons/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'



const steps = [
    { title: 'Personal Details' , description: 'First' },
    { title: 'Anatomical Features', description: 'Second' },
    { title: 'Contact Details', description: 'Third' },
]


//Main Page 
const DonateBlood = () => {
    axios.defaults.withCredentials=true

    //Active Stepper State 
    const { activeStep , setActiveStep } = useSteps({
        index : 0,
        count : steps.length
    })

        
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
        weight : '',
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
    
    //Handlers
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const setDetails = (e) =>{
        let name = e.target.name
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
        const end = new Date(Date.now()  + 15*1000)
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
        

    }

    //APIs

    const sendOtp = async () =>{
        const phoneNumber = {
            phoneNumber : `+91${donorInfo.phoneNumber}`
        }

        console.log(phoneNumber)
        timer()
        try{
            const res =  await axios.post('http://127.0.0.1:8000/donor/send_otp/', JSON.stringify(phoneNumber))
            console.log(res)
            


        }catch(err){
            toast.error('Something Went Wrong!',{
                position : toast.POSITION.BOTTOM_RIGHT
            })
        }

    }


    const verifyOtp = async () =>{
        const donorDet = {
            firstName : donorInfo.firstName,
            lastName : donorInfo.lastDonated,
            dob : donorInfo.dob,
            email : donorInfo.email,
            phoneNumber : `+91${donorInfo.phoneNumber}`,
            address : donorInfo.address,
            bloodGroup : donorInfo.bloodGroup,
            weight : donorInfo.weight,
            lastDonated : donorInfo.lastDonated,
            isThalassemia : donorInfo.isThalassemia,
        }
        console.log(donorDet)
        try {
            const res = await axios.post('http://127.0.0.1:8000/donor/register/',JSON.stringify(donorDet))
            console.log(res)
        } catch (err) {
            toast.error("Couldn't Verify. Something Went Wrong!",{
                position : toast.POSITION.BOTTOM_RIGHT
            })
        }
    }

    // console.log(donorInfo)


    const formDetails = (activeStep) =>{

        switch(activeStep){

            case 0 : return(
                <>  

                    <Grid templateColumns='repeat(2, 1fr)' columnGap={14}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='firstName'>First Name</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={IdentificationBadge } boxSize={8} weight="duotone" color="#ce2432" />
                                    </InputLeftAddon>
                                    <Input variant='pill' height={30} fontSize={14} type="text" name="firstName" value={donorInfo.firstName} onChange={e =>  setDetails(e)}  colorScheme='pink'/>
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={IdentificationBadge }  boxSize={8} weight="duotone" color="#ce2432" />
                                    </InputLeftAddon>
                                    <Input variant='pill' height={30} fontSize={14} type="text" name="lastName" value={donorInfo.lastName} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='dob'>Date of Birth</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Calendar }  boxSize={8} weight="duotone" color="#ce2432" />
                                    </InputLeftAddon>
                                    <Input variant='pill' height={30} fontSize={14}  type="date" name="dob" value={donorInfo.dob} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        
                        
                    </Grid>
                </>
            )

            case 1 : return(
                <>
                    <Grid templateColumns='repeat(2, 1fr)' gap={12}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='bloodGroup'>Blood Group</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Drop}  boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Select placeholder='Select Your Blood Group' height={30} fontSize={14} variant="pill" name='bloodGroup' value={donorInfo.bloodGroup} onChange={e =>  setDetails(e)}>
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
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='weight'>Weight</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Gauge}  boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='pill' height={30} fontSize={14}  type="number" name="weight" value={donorInfo.weight} onChange={e =>  setDetails(e)} />
                                    <InputRightAddon children='kg'  height={30}/>
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl>
                                <FormLabel htmlFor='lastDonated'>Last Donated</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={CalendarCheck } boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='pill' height={30} fontSize={14}  type="date" name="lastDonated" value={donorInfo.lastDonated} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem >
                            <FormControl isRequired paddingTop={10}> 
                                <InputGroup>
                                    <FormLabel htmlFor='isThalassemia'>Do you have Thalassemia?</FormLabel>
                                    <Checkbox size='lg' colorScheme='orange' border="red" paddingLeft={5} name='isThalassemia'   onChange={e => setDonorInfo(prevState => ({...prevState, isThalassemia : !prevState.isThalassemia}))} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                    </Grid>
                </>
            )


            case 2 : return(
                <>
                    <Grid templateColumns='repeat(2, 1fr)' gap={12}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <InputGroup>
                                <InputLeftAddon height={30}>
                                    <Icon as={Envelope} boxSize={8} weight="duotone" color="#ce2432" />
                                </InputLeftAddon>
                                <Input variant='pill' height={30} fontSize={14}  type="email" name="email" value={donorInfo.email} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel htmlFor='phoneNumber'>Phone</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Phone} boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='pill' height={30} fontSize={14}  type="number" name="phoneNumber" value={donorInfo.phoneNumber} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={2}>
                            <FormControl isRequired>
                                <FormLabel htmlFor='address'>Address</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon className='address' height={20}>
                                        <Icon as={HouseLine}  boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Textarea variant='pill' fontSize={14} resize='none' name="address" value={donorInfo.address} onChange={e =>  setDetails(e)} />
                                </InputGroup>
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
                                    <PinInput otp variant='pill' placeholder='_' size='lg' >
                                        <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                        <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                        <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                        <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                        <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
                                        <PinInputField height={20} fontSize={22}  color='red.500' bg='red.100'/>
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
            <ChakraProvider>


            <div className="donate_outer_div">
                <div className="donate_inner_div">
                    
                    <div className="donate_register">
                        <div className="donate_registration_form">
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

                                            <Box flexShrink='0'>
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
                                            <Button
                                                isDisabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{ mr: 1 }}
                                                className='reg_btn'
                                                color="red.500" 
                                                bg="red.200"
                                                _hover={{color:'red.50' , bg: 'red.400'}}
                                                mt={20}
                                                height='30px'
                                                width='80px'
                                                fontSize='16px'
                                                
                                            >
                                                Back
                                            </Button>

                                            <Button 
                                                onClick={verifyOtp} 
                                                color="red.500" bg="red.200" 
                                                _hover={{color:'red.50' , bg: 'red.400'}} 
                                                className='reg_btn'
                                                mt={20}
                                                height='30px'
                                                width='120px'
                                                fontSize='16px'
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

                                            <Button
                                                isDisabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{ mr: 1 }}
                                                className='reg_btn'
                                                color="red.500" 
                                                bg="red.200"
                                                _hover={{color:'red.50' , bg: 'red.400'}}
                                                mt={20}
                                                height='30px'
                                                width='80px'
                                                fontSize='16px'
                                            >
                                                Back
                                            </Button>
                                            
                                            <Button onClick={handleNext} 
                                                color="red.500" bg="red.200"
                                                _hover={{color:'red.50' , bg: 'red.400'}} className='reg_btn'
                                                mt={20}
                                                height='30px'
                                                width='80px'
                                                fontSize='16px'
                                            >
                                                Next
                                            </Button>
                                                
                                        </HStack>
                                    </div>
                                </>
                            )}       


                        </div>
                    </div>

                    <div className="donate_login">

                    </div>
                    <ToastContainer />
                </div>
            </div>



            </ChakraProvider>
        </>
    )
}

export default DonateBlood