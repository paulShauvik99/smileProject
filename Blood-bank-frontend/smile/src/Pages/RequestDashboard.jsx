import React, { useState , useEffect, useRef} from 'react'
import { Typography , Stack, Button, Modal, Backdrop, Fade, Stepper, Step, StepLabel, IconButton} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import CreateIcon from '@mui/icons-material/Create';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';
import { ChakraProvider,  Flex,  HStack,  RadioGroup,  Skeleton, Spacer, VStack, position } from '@chakra-ui/react';
import {
    FormControl,
    FormLabel,
    Input,
    Grid,
    GridItem,
    Icon,
    InputGroup,
    InputLeftAddon,
    Checkbox,
    Select,
    Textarea,
    Radio
} from '@chakra-ui/react'
import { IdentificationBadge, Envelope, Phone ,Calendar, HouseLine, Drop, CalendarCheck , Bed , FirstAid , Receipt, UserCircle, CloudArrowUp, UserCirclePlus} from '@phosphor-icons/react'
import TableComp from '../Components/Table';
import axios from 'axios';
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {BallTriangle} from 'react-loader-spinner';




// Email Regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//Accepted File Types
const fileTypes = ['jpg', 'png', 'jpeg']


// Steps for Requesting Blood
const steps = ["Patient Details", "Patient Contact Details", "Patient Requirement", "Requisition Form"]

//Style for Modal
const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {lg : '95rem' , xs : '40rem'},
    minHeight : '65rem',
    backgroundColor: 'rgb(214, 205, 205)',
    borderRadius: '2rem',
    borderLeft: '2px solid rgb(214,205,205)',
    borderBottom: '2px solid rgb(214,205,205)',
    boxShadow: 24,
    p: 4,
    // scrollY : 'show'
    // zIndex : 3,

};


//Step Connector Style
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },

        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor : '#d71414',
            },
        },

        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor : '#d71414',
            },
        },

        [`& .${stepConnectorClasses.line}`]: {
            height: 4,
            border: 0,
            backgroundColor: '#a69797',
            borderRadius: 1,
            
        },
    }));

//Stepper Icons Styles
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[100] : '#a69797',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundColor : '#d71414',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundColor : '#d71414',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        
        }),
}));

//Function for Stepper
function ColorlibStepIcon(props) {
        const { active, completed, className } = props;
    
        const icons = {
            1: <AccountBoxIcon fontSize='large' />,
            2: <ContactPageIcon fontSize='large'/>,
            3: <VaccinesIcon fontSize='large'/>,
            4: <DynamicFormIcon fontSize='large'/>,
            };
    
        return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {
                completed ? (
                    <DoneIcon fontSize='large'/>
                ) : (
                    icons[String(props.icon)]
                )
                
            }
            
        </ColorlibStepIconRoot>
        );
    }

//Props for Stepper
ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};




// Main Export Function
export default function RequestDashboard() {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()

    //Referring to file input
    const inpRef = useRef(null)
    //State Variables

    //Patient Records
    const [recDetails, setRecDetails] = useState()
    const [pastRecords,setPastRecords] = useState([])
    const [pendingRecords,setPendingRecords] = useState()
    // State for active steps
    const [activeStep, setActiveStep] = useState(0);
    //Modal Open and Close state
    const [open, setOpen] = useState(false);
    //Request Patient Details
    const [patientDetails, setPatientDetails] = useState({
        firstName : '',
        lastName : '',
        dob : '',
        email : '',
        phoneNumber : '',
        address : '',
        bloodGroup : '',
        gender : '',
        hospitalName : '',
        isThalassemia : false,
        hasCancer : false,
        donBlood : '',
        bloodBankName : '',
        donorName : '',
        donationDate : '',
        donationReceipt : '',
    })

    //Patient Details Validation
    const [patInValid, setPatInValid] = useState({
        firstName : false,
        lastName : false,
        email : false,
        phoneNumber : false,
        address : false,
        hospitalName : false,
        bloodBankName : false,
        donorName : false,
        donationReceipt : false
    })
    //Loading Page
    const [loadingPage,setLoadingPage] = useState(true)
    //Loading APIs
    const [loadingApi , setLoadingApi] = useState(false)
    //Loading Button var
    const [loadingBtn, setLoadingBtn] = useState(false)
    //Reloading API
    const [reload , setReloadApi] = useState(false)
    //Control Step
    const [controlStep, setControlStep] = useState(false)
    //Set Time
    const [time, setTime] = useState(['', '' , ''])
    //Set Date
    const [date, setDate] = useState(['','',''])


    //Page Validation
    useEffect(()=>{
        if(localStorage.getItem('check') !== null){
            const now  =  new Date().getTime()
            if(JSON.parse(localStorage.getItem('check')).expire < now){
                setLoadingPage(true)
                Swal.fire({
                    title : 'Session Expired! Please Login Again!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss==='backdrop'){
                        localStorage.removeItem('check')
                        navigate('/request')
                    }
                })
            }else if(!jwtDecode(JSON.parse(localStorage.getItem('check')).user).isRecipient){
                setLoadingPage(true)
                Swal.fire({
                    title : 'You are not authorized to view this Page!',
                    text :  'Pleaase Register, to Continue!',
                    icon : 'warning'
                }).then((res)=>{
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        navigate('/request')
                    }
                })
            }else{
                setLoadingApi(true)
            } 
        }else{
            setLoadingPage(true)
            Swal.fire({
                title : 'You are not authorized to view this page.',
                text : 'Please Login to Continue.',
                icon : 'warning'
            }).then((res)=>{
                if(res.isConfirmed || res.dismiss==='backdrop'){
                    navigate('/request')
                }
            })
        }
    },[])





    //Handlers
    //Handles Modal Open and Close
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Stepper Controller
    const handleNext = () => {

        switch(activeStep) {
            
            case 0: 
                if(patientDetails.firstName.length <3 || patientDetails.lastName.length < 3 || patientDetails.dob === '' || patientDetails.gender === '' ) {
                    toast.error("Please enter your details correctly before continuing.")
                    return
                }
                break
            
            case 1:
                
                if(!emailRegex.test(patientDetails.email) || patientDetails.address.length <= 10 || patInValid.phoneNumber){
                    toast.error("Please enter your details correctly before continuing.")
                    return
                }
                break

            case 2:
                if(patientDetails.bloodGroup === '' || patientDetails.hospitalName <3){
                    toast.error("Please enter your details correctly before continuing.")
                    return
                }
                break  
            
            default:
                break
        }
 
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
        console.log(activeStep)
    }
    const handleBack = () => {setActiveStep((prevActiveStep) => prevActiveStep - 1)}

    //Control Stepper with condition of first donation
    const controlStepper = () =>{
        setControlStep(prev => !prev)
        console.log(controlStep)
        if(!controlStep){
            steps.splice(3,1)
        }else{
            steps.push("Requisition Form")
        }
    }
    
    //Handler function for setting the Patient Details
    const setDetails = (e) =>{
        let name = e.target.name
        let value = e.target.value
    

        switch(name){   
            case 'firstName':
                if(value.trim().length<3){
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break
            
            case 'lastName':
                if(value.trim().length < 3){
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : false    
                    }))
                }
                break

            case 'email':
                if(!emailRegex.test(value.trim())){
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setPatInValid(pS => ({
                        [name] : false
                    }))
                }
                break

            case 'phoneNumber':
                if(value.trim().length !== 10 && value.trim() !== ''){
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break

            case 'address':
                if(value.trim().length < 10){
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break

            case 'hospitalName':
                if( value.trim().length <3 ){
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break

            case 'bloodBankName':
                if( value.trim().length <3){
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break

            case 'donorName':
                if( value.trim().length < 3 && value.trim() !== ''){
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : true
                    }))
                }else{
                    setPatInValid(pS => ({
                        ...pS,
                        [name] : false
                    }))
                }
                break
                
            case 'donationReceipt':
                if(value !== ''){
                    if(!fileTypes.includes(e.target.files[0].name.split('.')[1]) || e.target.files[0].size > 200000 ){
                        console.log("Check")
                        toast.warning('Receipt must be in jpg/jpeg/png format and size should be less than 200KB')
                        setPatInValid(pS => ({
                            ...pS,
                            [name] : true
                        }))
                        return
                    }else{
                        setPatInValid(pS => ({
                            ...pS,
                            [name] : false
                        }))
                    }
                }
                break
            
            default:
                break
        }


        if(name === 'donationReceipt'){
            setPatientDetails(prevState => ({
                ...prevState,
                [name] : e.target.files[0]
            }))
        }else{
            setPatientDetails(prevState => ({
                ...prevState , 
                [name] : e.target.value
            })
            )
        }
    }
    

    //Function to select a receipt
    const clickReceipt = (e) =>{ inpRef.current.click() }

    //Modal Content
    const formDetails = (activeStep) =>{

        switch(activeStep){
    
            case 0 : return(
                <>  
    
                        <Grid templateColumns={{lg : 'repeat(2, 1fr)'}} rowGap={12} marginTop={24} columnGap={14}>
                            <GridItem>
                                <FormControl isRequired>
                                    <FormLabel fontSize={12} htmlFor='firstName'>Patient's First Name</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon height={30}>
                                            <Icon as={IdentificationBadge } boxSize={8} weight="duotone" color="#ce2432" />
                                        </InputLeftAddon>
                                        <Input variant='outline' isInvalid={patInValid.firstName}  focusBorderColor={patInValid.firstName ? 'red.400' : 'green.300'} backgroundColor='red.50'  height={30} fontSize={14} type="text" name="firstName" required value={patientDetails.firstName} onChange={e =>  setDetails(e)}  colorScheme='pink'/>
                                    </InputGroup>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl isRequired>
                                    <FormLabel fontSize={12} htmlFor='lastName'>Patient's Last Name</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon height={30}>
                                            <Icon as={IdentificationBadge }  boxSize={8} weight="duotone" color="#ce2432" />
                                        </InputLeftAddon>
                                        <Input variant='outline' backgroundColor='red.50' isInvalid={patInValid.lastName} focusBorderColor={patInValid.lastName  ? 'red.400' : 'green.300'} height={30} fontSize={14} type="text" name="lastName" value={patientDetails.lastName} onChange={e =>  setDetails(e)} />
                                    </InputGroup>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl isRequired>
                                    <FormLabel htmlFor='gender' fontSize={12}> Gender </FormLabel>
                                    <RadioGroup onChange={e => setPatientDetails(prev => ({...prev , gender : e}))} name="gender" value={patientDetails.gender}>
                                        <Stack direction='row' pt={1} gap={1}> 
                                            <Radio size='lg' colorScheme='red' value='male'>Male</Radio>
                                            <Radio size='lg' colorScheme='red' value='female'>Female</Radio>
                                            <Radio size='lg' colorScheme='red' value='others'>Others</Radio>
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl isRequired>
                                    <FormLabel fontSize={12} htmlFor='dob'>Patient's Date of Birth</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon height={30}>
                                            <Icon as={Calendar }  boxSize={8} weight="duotone" color="#ce2432" />
                                        </InputLeftAddon>
                                        <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="date" name="dob" value={patientDetails.dob} onChange={e =>  setDetails(e)} />
                                    </InputGroup>
                                </FormControl>
                            </GridItem>
                            
                            
                        </Grid>
                </>
            )
    
            case 1 : return(
                <>
                    <Grid templateColumns={{lg : 'repeat(2, 1fr)'}} rowGap={12} marginTop={24} gap={12}>

                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel fontSize={12} htmlFor='email'>Patient's Email</FormLabel>
                                <InputGroup>
                                <InputLeftAddon height={30}>
                                    <Icon as={Envelope} boxSize={8} weight="duotone" color="#ce2432" />
                                </InputLeftAddon>
                                <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14} isInvalid={patInValid.email} focusBorderColor={patInValid.email ? 'red.400' : 'green.300'} type="email" name="email" value={patientDetails.email} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize={12} htmlFor='phoneNumber'>Alternate Phone Number (Optional)</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Phone} boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="number" name="phoneNumber" value={patientDetails.phoneNumber} onChange={e =>  setDetails(e)} isInvalid={patInValid.phoneNumber} focusBorderColor={patInValid.phoneNumber ? 'red.400' : 'green.300'} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={{ lg : 2}}>
                                <FormControl isRequired>
                                    <FormLabel fontSize={12} htmlFor='address'>Patient's Address</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon className='address' height={20}>
                                            <Icon as={HouseLine}  boxSize={8} weight='duotone' color='#ce2432' />
                                        </InputLeftAddon>
                                        <Textarea variant='outline' backgroundColor='red.50' fontSize={14} resize='none' name="address" value={patientDetails.address} onChange={e =>  setDetails(e)} isInvalid={patInValid.address} focusBorderColor={patInValid.address ? 'red.400' : 'green.300'} />
                                    </InputGroup>
                                </FormControl>
                        </GridItem>
                    </Grid>
                </>
            )
    
    
            case 2 : return(
                <>
                    <Grid templateColumns={{lg : 'repeat(2, 1fr)'}} rowGap={12} marginTop={24} gap={12}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel fontSize={12} htmlFor='blood' >Patient's Blood Group</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Drop}  boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Select placeholder='Select Blood Group' height={30} fontSize={14} variant="outline" backgroundColor='red.50' name='bloodGroup' value={patientDetails.bloodGroup} onChange={e =>  setDetails(e)}>
                                        <option value='A+'>A Positive (A+)</option>
                                        <option value='A-'>A Negative (A-)</option>
                                        <option value='B+'>B Positive (B+)</option>
                                        <option value='B-'>B Negative (B-)</option>
                                        <option value='O+'>O Positive (O+)</option>
                                        <option value='O-'>O Negative (O-)</option>
                                        <option value='AB+'>AB Positive (AB+)</option>
                                        <option value='AB-'>AB Negative (AB-)</option>
                                    </Select>
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel fontSize={12} htmlFor='hospitalName'>Hospital Name</FormLabel>
                                <InputGroup >
                                    <InputLeftAddon height={30}>
                                        <Icon as={Bed} boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="text" name="hospitalName" value={patientDetails.hospitalName} onChange={e =>  setDetails(e)} isInvalid={patInValid.hospitalName} focusBorderColor={patInValid.hospitalName ? 'red.400' : 'green.300'} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>

                        <GridItem marginTop={20}  colSpan={{lg : 2}}>
                            <Stack >
                                <FormControl> 
                                    <InputGroup>
                                        <FormLabel htmlFor='isThalassemia' fontSize={{base : 10, lg : 15}}>Does Patient have  Thalassemia?</FormLabel>
                                        <Checkbox size='lg'  colorScheme='orange' border="red" paddingLeft={5} name='isThalassemia' isChecked={patientDetails.isThalassemia}  onChange={e => setPatientDetails(prevState => ({...prevState, isThalassemia : !prevState.isThalassemia}))} />
                                    </InputGroup>
                                </FormControl>
                                
                                <FormControl > 
                                    <InputGroup>
                                        <FormLabel htmlFor='hasCancer' fontSize={{base : 10, lg : 15}}>Does Patient have Cancer?</FormLabel>
                                        <Checkbox size='lg'  colorScheme='orange' border="red" paddingLeft={5} name='hasCancer' isChecked={patientDetails.hasCancer}  onChange={e => setPatientDetails(prevState => ({...prevState, hasCancer : !prevState.hasCancer}))} />
                                    </InputGroup>
                                </FormControl>
                                <FormControl > 
                                    <InputGroup>
                                        <FormLabel htmlFor='controlStep' fontSize={{base : 10, lg : 15}}>Is First Donation?</FormLabel>
                                        <Checkbox size='lg'  colorScheme='orange' border="red" paddingLeft={5} name='controlStep' isChecked={controlStep}  onChange={controlStepper} />
                                    </InputGroup>
                                </FormControl>
                            </Stack>
                        </GridItem>
                        
                    </Grid>
                </>
            )

            case 3 : return(
                <>
                    <Grid templateColumns={{lg : 'repeat(2, 1fr)'}} marginTop={{lg : 24, base : 5}} gap={{lg : 12, base  : 5}}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel fontSize={12} htmlFor='donBlood' >Donor's Blood Group</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Drop}  boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Select placeholder='Select Blood Group' height={30} fontSize={14} variant="outline" backgroundColor='red.50' name='donBlood' value={patientDetails.donBlood} onChange={e =>  setDetails(e)}>
                                        <option value='A+'>A Positive (A+)</option>
                                        <option value='A-'>A Negative (A-)</option>
                                        <option value='B+'>B Positive (B+)</option>
                                        <option value='B-'>B Negative (B-)</option>
                                        <option value='O+'>O Positive (O+)</option>
                                        <option value='O-'>O Negative (O-)</option>
                                        <option value='AB+'>AB Positive (AB+)</option>
                                        <option value='AB-'>AB Negative (AB-)</option>
                                    </Select>
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel fontSize={12} htmlFor='bloodBankName'>Blood Bank Name</FormLabel>
                                <InputGroup >
                                    <InputLeftAddon height={30}>
                                        <Icon as={FirstAid} boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="text" name="bloodBankName" value={patientDetails.bloodBankName} onChange={e =>  setDetails(e)} isInvalid={patInValid.bloodBankName} focusBorderColor={patInValid.bloodBankName ? 'red.400' : 'green.300'} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize={12} htmlFor='donorName'>Donor's Name (Optional)</FormLabel>
                                <InputGroup >
                                    <InputLeftAddon height={30}>
                                        <Icon as={UserCircle} boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="text" name="donorName" value={patientDetails.donorName} onChange={e =>  setDetails(e)} isInvalid={patInValid.donorName} focusBorderColor={patInValid.donorName ? 'red.400' : 'green.300'} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel fontSize={12} htmlFor='donationDate'>Donation Date</FormLabel>
                                <InputGroup >
                                    <InputLeftAddon height={30}>
                                        <Icon as={CalendarCheck} boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14}  type="date" name="donationDate" value={patientDetails.donationDate} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl display='none' isRequired>
                                <FormLabel fontSize={12} htmlFor='donationReceipt'>Donation Receipt</FormLabel>
                                <InputGroup >
                                    <InputLeftAddon height={35}>
                                        <Icon as={Receipt} boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='outline' ref={inpRef} backgroundColor='red.50' height={35} fontSize={14}  type="file" name="donationReceipt" onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                            <div className="receipt_input" onClick={clickReceipt}>
                                
                                    <CloudArrowUp size={50} color="#ec3c3c" weight="duotone" />
                                    Upload Your Receipt
                                <p> (Only .jpg, .jpeg and .png images are supported. And size less than 200KB ) </p>
                            </div>
                        </GridItem>

                        <GridItem>
                            <div className="receipt">
                                {
                                    patientDetails.donationReceipt && !patInValid.donationReceipt ? (
                                        <img src={URL.createObjectURL(patientDetails.donationReceipt)} alt="" />
                                    ) : (
                                        <p> No Receipt Uploaded</p>
                                    )
                                }
                            </div>
                        </GridItem>
                        
                    </Grid>
                </>
            )
                
            default : return(
                <>  </>
            )
    
        }
    
    
    }


    //function to submit Patient Request
    const placeRequest = async (patDet) =>{ 

        // console.log(patientDetails)
        if(controlStep){
            if(patientDetails.bloodGroup === '' || patientDetails.hospitalName < 3 ){
                toast.error("Please enter the details correctly before submitting.")
                return
            }else if(['A+','B+','O+','AB+'].includes(patientDetails.bloodGroup) && !patientDetails.isThalassemia && !patientDetails.hasCancer) {
                toast.error("Only Patients having negative blood groups, patients having thalassemia/cancer are allowed to place requests for first donation.")
                return
            }
        }else{
            if(patientDetails.donBlood === '' || patientDetails.bloodBankName < 3 || patientDetails.donationReceipt === undefined || patientDetails.donationReceipt === '' || (patientDetails.donorName < 3 && patientDetails.donorName !== '') || patientDetails.donationDate === '' ){
                toast.error("Please enter your details correctly before continuing.")
                return
            }
        }

        const formData = new FormData();
        //Complete the Function
        setLoadingBtn(true)
        const data = {
            firstName : patDet.firstName,
            lastName : patDet.lastName,
            dob : patDet.dob,
            email : patDet.email,
            phoneNumber : `+91${patDet.phoneNumber}`,
            address : patDet.address,
            bloodGroup : patDet.bloodGroup,
            isThalassemia : patDet.isThalassemia,
            hospitalName : patDet.hospitalName,
            hasCancer : patDet.hasCancer,
            donBlood : patDet.donBlood,
            bloodBankName : patDet.bloodBankName,
            donorName : patDet.donorName,
            donationDate : patDet.donationDate,
            donationReceipt : patDet.donationReceipt,
            firstDonCheck : controlStep,
            gender : patDet.gender,
        }

        for(const key in data){
            formData.append(key, data[key]);
        }

        try {
            const res = await axios.post('/recipient/request_blood/',formData);
            console.log(res)
            Swal.fire({
                text : res.data.success,
                icon : 'success'
            }).then((res)=>{
                setLoadingBtn(false)
                if(res.isConfirmed || res.dismiss === 'backdrop'){
                    handleClose()
                    setReloadApi(!reload)
                }
            })
        } catch (error) {
            console.log(error)
            if(error.response.status == 500){
                Swal.fire({
                    text : 'Please Fill up the Form Correctly',
                    icon : 'warning',
                })
                setLoadingBtn(false)
            }else{

                Swal.fire({
                    text : error.response.data.error,
                    icon : 'warning'
                }).then((res)=>{
                    setLoadingBtn(false)
                    if(res.isConfirmed || res.dismiss === 'backdrop'){
                        setReloadApi(!reload)
                        // handleClose()
                    }
                })
            }
        }



    }
    //Page Loading API
    const loadAPI = async () =>{
        setLoadingPage(true)
        try {
            const res = await axios.get('/recipient/get_recipient_records/')
            console.log(res)       
            let pendingReq = res.data.pastRecord.filter(el => el.status === 'Pending')
            let pastRecord = res.data.pastRecord.filter(el => el.status !== 'Pending')
            setPendingRecords(pendingReq)
            setPastRecords(pastRecord)
            setRecDetails(res.data.recipientData)

        } catch (error) {
            console.log(error)
            toast.error(error.resoponse.data.error, {
                position : toast.POSITION.TOP_RIGHT
            })
        }
        setLoadingPage(false)
    }
    //Logout API
    const logout = () => {
        try{
            axios.get('/donor/logout/').then((res)=>{
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


    //Page Loading API 
    useEffect(() => {
        // Date and Time for Display
        setInterval(()=>{
            let date = new Date()
            setTime(date.toLocaleTimeString('en-US',{hour12: true, hour : '2-digit', minute : '2-digit'}).split(/[\s:]/))
            setDate(date.toLocaleDateString('en-US', {weekday : 'short', day : '2-digit', month : 'long'}).split(' '))
        },1000)

        if(loadingApi){
            loadAPI()
        }

    }, [loadingApi,reload]);


    const tableColumn = ["Patient's Name", "Requested Date", "Blood Group", "Status" ]

    //Main Return
    return (
        <>
                <div className="req_dashboard_outer_div">
                    
                        <div className="req_dashboard_content">
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
                                                <div className="remaining_units">
                                                    <p>  Hi, </p>
                                                    <p> You Can Request for 1 unit blood. </p>
                                                </div>
                                                <div className="register_patient">
                                                    <Typography variant='h6' sx={{mb : 3 , mt : 3, padding : '0.5rem' , backgroundColor : '#f0e3e4' , borderRadius : '1rem' , fontSize : '1rem', textAlign : 'center', color : '#d71414' }} >
                                                        <b>Note :</b> Only patients with negative blood group, patients with Cancer/Thalassemia can request for blood even there is no slot.
                                                    </Typography>
                                                    <Stack direction="row" spacing={8} mt={2}>
                                                        <Typography variant='h4' sx={{display : 'flex', alignItems : 'center', fontSize : '2rem' , color : '#191818'}} >
                                                            Request For A Unit ?
                                                        </Typography>
                                                        <Button variant="contained" size='large' onClick={handleOpen} 
                                                            startIcon={<PersonAddIcon />}
                                                            sx={{
                                                                backgroundColor : '#d7141450',
                                                                borderRadius : '2.5rem',
                                                                color: 'black',
                                                                fontWeight : 'bold',
                                                                fontSize : '1rem',
                                                                alignItems : 'center',
                                                                "&:hover" : {
                                                                    backgroundColor : '#d71414',
                                                                    color : '#f0e3e4',
                                                                }
                                                            }}
                                                        >
                                                            Register Patient
                                                        </Button>
                                                    </Stack>
                                                    {
                                                        pendingRecords.length === 0 ? (
                                                            <>
                                                                <Typography variant='h6' sx={{mt : 3 ,  fontSize : '1.8rem' , color : recDetails.quantity === 0 ? '#d71414' : '#191818', backgroundColor : '#f0e3e4' , borderRadius : '1rem', textAlign : 'center',width : '65%'}} >
                                                                    { recDetails.quantity -5 > 0 ? `${recDetails.quantity - 5} Available Slots Left` : ( recDetails.quantity > 0 ) ?  `${recDetails.quantity} Slots in Waiting List` : `No Slots Available ` } 
                                                                </Typography>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Typography variant='h6' sx={{mt : 3 , width : '65%' , fontSize : '1.6rem' , color : '#ff6700', backgroundColor : '#f0e3e4' , borderRadius : '1rem' , textAlign : 'center',}} >
                                                                    Your Request is <b> Pending </b>
                                                                </Typography>
                                                            </>
                                                        )
                                                    }
                                                    {
                                                        recDetails.isEligible && recDetails.remainingDays <= 0 ? (
                                                            <>
                                                                <Typography variant='h6' sx={{mt : 3 , pl : 3 ,fontSize : '1.2rem' , color : '#191818' ,backgroundColor : '#f0e3e4' , borderRadius : '1rem' , textAlign : 'left',width : '50%'}} >
                                                                    You are eligible to make a request for Blood.
                                                                </Typography>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Typography variant='h6' sx={{mt : 3 , pl : 3, fontSize : '1.2rem' , color : '#191818', backgroundColor : '#f0e3e4' , borderRadius : '1rem' , textAlign : 'left',width : {lg : '50%', xs : '70%'}}} >
                                                                    You will be eligible after <b>{recDetails.remainingDays} Days </b>
                                                                </Typography>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>

                                            <div className="requests">
                                                <Typography variant="h3" sx={{  fontSize : '4rem' , color : '#f0e3e4', fontWeight : 'bold'}} >
                                                    Past Records
                                                </Typography>
                                                <TableComp
                                                    type='recipient'
                                                    tableColumn={tableColumn}
                                                    pastRecords={pastRecords}
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


                                {/* Function to Open A Modal For Registering a Patient in need of Blood Units */}
                                <div className="modal_div">
                                    <Modal
                                        aria-labelledby="transition-modal-title"
                                        aria-describedby="transition-modal-description"
                                        open={open}
                                        onClose={handleClose}
                                        closeAfterTransition
                                        slots={{ backdrop: Backdrop }}
                                        slotProps={{
                                        backdrop: {
                                            timeout: 500,
                                        },
                                        }}
                                    >
                                        <Fade in={open}>
                                        <Box sx={style}>
                                            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                                                {steps.map((label,ind) => (
                                                        <Step key={label}>
                                                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                                                        </Step>
                                                    )
                                                )}
                                            </Stepper>
                                            <ChakraProvider>

                                                <div className="pat_reg">
                                                    <form>
                                                        {formDetails(activeStep)}
                                                    </form>
                                                </div>
                                                
                                            </ChakraProvider>

                                            {activeStep === steps.length - 1 ? (
                                                <React.Fragment>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', pl : 5 , pb : 2 , position : 'absolute', bottom : 15, left : 0, width : {lg : '60%', xs : '65%'} , justifyContent : 'space-between', }}>
                                                        <IconButton
                                                            // color="inherit"
                                                            disabled={activeStep === 0}
                                                            onClick={handleBack}
                                                            sx={{ 
                                                                color:"#F4D9D5" , 
                                                                background:"#d7141480",
                                                                fontWeight : 'bold',
                                                                fontSize : '16px',
                                                                height:'30px',
                                                                '&:hover': {
                                                                        background: '#d71414',
                                                                        color : '#fff'
                                                                }
                                                            }}
                                                        >
                                                            <ArrowBackIosNewIcon />
                                                        </IconButton>
                                                        

                                                        <LoadingButton 
                                                            onClick={e => placeRequest(patientDetails)} 
                                                            loading={loadingBtn}
                                                            sx={{color:"#F4D9D5" , 
                                                                background:"#d7141480",
                                                                fontWeight : 'bold',
                                                                fontSize : {lg : '16px', xs : '12px'},
                                                                height:'35px',
                                                                width:{lg : '200px', xs : '120px'},
                                                                '&:hover': {
                                                                        background: '#d71414',
                                                                        color : '#fff'
                                                                }
                                                            }}
                                                        >
                                                            Place Request
                                                        </LoadingButton>
                                                    </Box>

                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', p : 5  , width : '100%' , justifyContent : 'space-between' , position : 'absolute', bottom : 15, left : 0}}>
                                                        <IconButton
                                                            // color="inherit"
                                                            disabled={activeStep === 0}
                                                            onClick={handleBack}
                                                            sx={{ 
                                                                color:"#F4D9D5" , 
                                                                background:"#d7141480",
                                                                fontWeight : 'bold',
                                                                fontSize : '16px',
                                                                height:'30px',
                                                                '&:hover': {
                                                                        background: '#d71414',
                                                                        color : '#fff'
                                                                }
                                                            }}
                                                        >
                                                            <ArrowBackIosNewIcon />
                                                        </IconButton>
                                                        

                                                        <IconButton 
                                                            onClick={handleNext} 
                                                            sx={{color:"#F4D9D5" , 
                                                                background:"#d7141480",
                                                                fontWeight : 'bold',
                                                                fontSize : '16px',
                                                                height:'30px',
                                                                position : 'flex-end',
                                                                '&:hover': {
                                                                        background: '#d71414',
                                                                        color : '#fff'
                                                                }
                                                            }}
                                                        >
                                                            <ArrowForwardIosIcon />
                                                        </IconButton>
                                                    </Box>
                                                </React.Fragment>
                                            )}
                                        <ToastContainer />
                                        </Box>
                                        </Fade>
                                    </Modal>

                                </div>
                            </div>
                        </div>
                    
                </div>
        </>
    )
}
