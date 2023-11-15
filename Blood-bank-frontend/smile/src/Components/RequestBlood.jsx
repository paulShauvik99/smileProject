import { ChakraProvider, Heading } from '@chakra-ui/react'
import React, { useState } from 'react'
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
import { Phone } from '@phosphor-icons/react'



//Steps

const steps = [
    { title: 'Personal Details' , description: 'First' },
    { title: 'Anatomical Features', description: 'Second' },
    { title: 'Contact Details', description: 'Third' },
]


const RequestBlood = () => {

    //Active Stepper State 
    const { activeStep , setActiveStep } = useSteps({
        index : 0,
        count : steps.length
    })

    //Show Timer
    const [showTime, setShowTime] = useState(false)
    //Change OTP Button text
    const [changeText , setChangeText] = useState('Send OTP')
    //Disable OTP Button
    const [disability , setDisability] = useState(false)
    //Timer Countdown
    const [time , setTime] = useState('')

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
                                                // value={donorInfo.phone} 
                                                // onChange={e =>  setDetails(e)} 
                                            />
                                        </InputGroup>
                                    </FormControl>

                                            <HStack mt={15}>
                                                <Button size='lg' color="red.500" bg="red.200" 
                                                    _hover={{color:'red.50' , bg: 'red.400'}} 
                                                    mb={10}
                                                    height='35px'
                                                    width='120px'
                                                    fontSize='16px'
                                                    onClick={timer}
                                                    isDisabled={disability}
                                                >
                                                    {changeText}
                                                </Button>
                                                {showTime ? <Text fontSize='lg'>Resend in : {time} </Text> : null}
                                                
                                            </HStack>
                                            <HStack>
                                                <PinInput otp variant='pill' size='lg' >
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
                                            >
                                                Verify OTP
                                            </Button>   
                                        </VStack>
                            </div>
                        </div>
                    </div>
                </div>
            </ChakraProvider>
        </>
    )
}

export default RequestBlood