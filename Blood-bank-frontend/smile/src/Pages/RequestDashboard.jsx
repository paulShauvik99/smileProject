import React, { useState , useEffect } from 'react'
import { Badge, Typography , Stack, Button, Modal, Backdrop, Fade, Stepper, Step, StepLabel} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CreateIcon from '@mui/icons-material/Create';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';
import { ChakraProvider, HStack, Skeleton, VStack } from '@chakra-ui/react';
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
    
} from '@chakra-ui/react'
import { IdentificationBadge, Envelope, Phone ,Calendar, HouseLine, Drop, CalendarCheck  } from '@phosphor-icons/react'
import TableComp from '../Components/Table';
import CalendarComp from '../Components/Calendar';
import axios from 'axios';
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';


// Steps for Requesting Blood
const steps = ["Patient Details", "Patient Contact Details", "Patient Requirement"]

//Style for Modal
const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90rem',
    height : '55rem',
    backgroundColor: '#f0bcbf',
    boxShadow: 24,
    p: 4,
    // zIndex : 3,

};


//Step Connector Style
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },

        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor : '#ea5d69',
                // backgroundImage:
                // 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            },
        },

        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor : '#ea5d69',
                // backgroundImage:
                // 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            },
        },

        [`& .${stepConnectorClasses.line}`]: {
            height: 4,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[100] : '#a69797',
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
            backgroundColor : '#ea5d69',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundColor : '#ea5d69',
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


//Function to Create Circular Progress
function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent:'center', alignItems:'center' , height: '36rem' , width: '36rem' }}>
            <CircularProgress variant="determinate" size="20rem" {...props} />
            <Box
            sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            >
                <Typography variant="h1" component="h1" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}





// Main Export Function
export default function RequestDashboard() {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    //State Variables
    //Progress of Circular Progress
    const [progress, setProgress] = useState(0);
    
    //Days with Number of Slots
    const [highlightedDays,setHighlightedDays] = useState({})
    //Patient Records
    const [pastRecords,setPastRecords] = useState([])
    const [pendingRecords,setPendingRecords] = useState({})
    const [requestRecords,setRequestRecords] = useState({})
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
        isThalassemia : false,
        registeredDate : '',
    })
    //Loading Page
    const [loadingPage,setLoadingPage] = useState(true)
    //Loading APIs
    const [loadingApi , setLoadingApi] = useState(false)


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
            } 
            setLoadingApi(true)
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
    const handleNext = () => {setActiveStep((prevActiveStep) => prevActiveStep + 1)}
    const handleBack = () => {setActiveStep((prevActiveStep) => prevActiveStep - 1)}

    const setDetails = (e) =>{
        let name = e.target.name
        setPatientDetails(prevState => ({
                ...prevState , 
                [name] : e.target.value
            })
        )
    }
    

    //Dates to be disabled
    const today = new Date()
    const tomorrow = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0]
    const disable7days = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0]


    const checkDisabledDates = (e) => {
        let name = e.target.name
        if(highlightedDays[new Date(e.target.value).getDate()] === '0'){
            Swal.fire({
                text : 'The Date Slot you are trying to choose is Full. Please try another date.',
                icon : 'warning'
            })
            setPatientDetails(prevState => ({
                ...prevState,
                [name] : ''
            }))
        }else{
            
            setPatientDetails(prevState => ({
                ...prevState,
                [name] : e.target.value
            }))
            console.log('false')
        }
    }
    
    
    
    //Modal Content
    const formDetails = (activeStep) =>{

        switch(activeStep){
    
            case 0 : return(
                <>  
    
                        <Grid templateColumns='repeat(2, 1fr)' rowGap={12} marginTop={24} columnGap={14}>
                            <GridItem>
                                <FormControl isRequired>
                                    <FormLabel fontSize={12} htmlFor='firstName'>Patient's First Name</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon height={30}>
                                            <Icon as={IdentificationBadge } boxSize={8} weight="duotone" color="#ce2432" />
                                        </InputLeftAddon>
                                        <Input variant='pill' height={30} fontSize={14} type="text" name="firstName" required value={patientDetails.firstName} onChange={e =>  setDetails(e)}  colorScheme='pink'/>
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
                                        <Input variant='pill' height={30} fontSize={14} type="text" name="lastName" value={patientDetails.lastName} onChange={e =>  setDetails(e)} />
                                    </InputGroup>
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl isRequired>
                                    <FormLabel fontSize={12} htmlFor='dob'>Patient's Date of Birth</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon height={30}>
                                            <Icon as={Calendar }  boxSize={8} weight="duotone" color="#ce2432" />
                                        </InputLeftAddon>
                                        <Input variant='pill' height={30} fontSize={14}  type="date" name="dob" value={patientDetails.dob} onChange={e =>  setDetails(e)} />
                                    </InputGroup>
                                </FormControl>
                            </GridItem>
                            
                            
                        </Grid>
                </>
            )
    
            case 1 : return(
                <>
                    <Grid templateColumns='repeat(2, 1fr)' rowGap={12} marginTop={24} gap={12}>

                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel fontSize={12} htmlFor='email'>Patient's Email</FormLabel>
                                <InputGroup>
                                <InputLeftAddon height={30}>
                                    <Icon as={Envelope} boxSize={8} weight="duotone" color="#ce2432" />
                                </InputLeftAddon>
                                <Input variant='pill' height={30} fontSize={14}  type="email" name="email" value={patientDetails.email} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize={12} htmlFor='phoneNumber'>Alternate Phone Number</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Phone} boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Input variant='pill' height={30} fontSize={14}  type="number" name="phoneNumber" value={patientDetails.phoneNumber} onChange={e =>  setDetails(e)} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>

                        <GridItem colSpan={2}>
                                <FormControl isRequired>
                                    <FormLabel fontSize={12} htmlFor='address'>Patient's Address</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon className='address' height={20}>
                                            <Icon as={HouseLine}  boxSize={8} weight='duotone' color='#ce2432' />
                                        </InputLeftAddon>
                                        <Textarea variant='pill' fontSize={14} resize='none' name="address" value={patientDetails.address} onChange={e =>  setDetails(e)} />
                                    </InputGroup>
                                </FormControl>
                        </GridItem>
                    </Grid>
                </>
            )
    
    
            case 2 : return(
                <>
                    <Grid templateColumns='repeat(2, 1fr)' rowGap={12} marginTop={24} gap={12}>
                        <GridItem>
                            <FormControl isRequired>
                                <FormLabel fontSize={12} htmlFor='blood' >Patient's Blood Group</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon height={30}>
                                        <Icon as={Drop}  boxSize={8} weight='duotone' color='#ce2432' />
                                    </InputLeftAddon>
                                    <Select placeholder='Select Blood Group' height={30} fontSize={14} variant="pill" name='bloodGroup' value={patientDetails.bloodGroup} onChange={e =>  setDetails(e)}>
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
                        
                        
                        <GridItem >
                            <FormControl isRequired paddingTop={10}> 
                                <InputGroup>
                                    <FormLabel htmlFor='isThalassemia' fontSize={15}>Does Patient have  Thalassemia?</FormLabel>
                                    <Checkbox size='lg'  colorScheme='orange' border="red" paddingLeft={5} name='isThalassemia'   onChange={e => setPatientDetails(prevState => ({...prevState, isThalassemia : !prevState.isThalassemia}))} />
                                </InputGroup>
                            </FormControl>
                        </GridItem>
                        <GridItem>
                                <FormControl isRequired>
                                    <FormLabel fontSize={12} htmlFor='registeredDate'>Date of Requirement</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon height={30}>
                                            <Icon as={CalendarCheck  }  boxSize={8} weight="duotone" color="#ce2432" />
                                        </InputLeftAddon>
                                        <Input variant='pill' height={30} fontSize={14} min={tomorrow} max={disable7days}  type="date" name="registeredDate" value={patientDetails.registeredDate} onChange={e =>  checkDisabledDates(e)} />
                                    </InputGroup>
                                </FormControl>
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
        //Complete the Function
        const data = {
            firstName : patDet.firstName,
            lastName : patDet.lastName,
            dob : patDet.dob,
            email : patDet.email,
            phoneNumber : `+91${patDet.phoneNumber}`,
            address : patDet.address,
            bloodGroup : patDet.bloodGroup,
            isThalassemia : patDet.isThalassemia,
            units : 1,
            date : patDet.registeredDate
        }

        try {
            const res = await axios.post('http://127.0.0.1:8000/recipient/request_blood/',JSON.stringify(data))
            console.log(res)
            Swal.fire({
                text : res.data.success,
                icon : 'success'
            })
        } catch (error) {
            Swal.fire({
                text : error.response.data.error,
                icon : 'warning'
            })            
        }



    }

    const urls = ['http://127.0.0.1:8000/recipient/get_available_dates/', 'http://127.0.0.1:8000/recipient/get_recipient_records/']

    const loadAPI = async () =>{
        setLoadingPage(true)
        try {
            const res = await axios.all(urls.map(url => axios.get(url)))
            console.log(res)       
            
            setPastRecords(res[1].data.pastRecord)
            setRequestRecords(res[1].data.requestPlaced)
            setPendingRecords(res[1].data.pendingDonation)

        } catch (error) {
            console.log(error)
            toast.error(error.resoponse.data.msg, {
                position : toast.POSITION.TOP_RIGHT
            })
        }
        setLoadingPage(false)
    }


    useEffect(() => {
        if(loadingApi){
            loadAPI()
        }

        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 25));
        }, 800);
        return () => {
            clearInterval(timer);
        };


    }, [loadingApi]);



    const rows = [
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
        {
            name : 'Frozen yoghurt',
            calories : 159,
            fat :  6.0,
            carbs : 24,
            protein : 4.0 
        },
    ];

    const tableColumn = ["Patient's Name", "Requested Date", "Status" , "Blood Group" ,"Donor's Name", "Donor's Phone Number"]

    //Main Return
    return (
        <>
                <div className="req_dashboard_outer_div">
                    <div className="req_dashboard_inner_div">
                        <div className="req_dashboard_content">
                            <div className="actual_content">
                            {
                                !loadingPage ? (
                                    <>

                                        <div className="grid_container">
                                            <div className="main">
                                                <div className="remaining_units">
                                                    <CircularProgressWithLabel value={progress} />
                                                    <Typography variant="h4" component="h4"> Your Next available Unit is in 12 days </Typography>
                                                </div>
                                                <div className="register_patient">
                                                    <Stack direction="row" spacing={8}>
                                                        <Typography variant='h4' sx={{display : 'flex', alignItems : 'center'}} component='h4'>
                                                            Request For An Unit ?
                                                        </Typography>
                                                        <Button variant="contained" size='large' onClick={handleOpen} startIcon={<CreateIcon />}>
                                                            Register Patient
                                                        </Button>
                                                    </Stack>
                                                </div>
                                            </div>


                                            <div className="calendar">
                                                <Typography variant='h2' mb={10} component='h2' textAlign='center'>
                                                    Available Days                                            
                                                </Typography>
                                                <CalendarComp 
                                                    highlightedDays={highlightedDays}
                                                />
                                            </div>


                                            
                                            <div className="requests">
                                                <TableComp
                                                    type='recipient'
                                                    tableColumn={tableColumn}
                                                    pastRecords={pastRecords}
                                                    pendingRecords={pendingRecords}
                                                    requestRecords={requestRecords}
                                                />
                                            </div>
                                        </div>
                                    </> 
                                ) : (
                                    <ChakraProvider>
                                            <Grid 
                                                templateRows='repeat(2,1fr)'
                                                templateColumns='repeat(3,1fr)'
                                                gap={4}
                                                p={5}

                                            >
                                                <GridItem
                                                    colSpan={2}
                                                >
                                                    <Skeleton
                                                        height='40rem'
                                                        // width='70rem'
                                                    >

                                                    </Skeleton>
                                                    
                                                </GridItem>
                                                <GridItem
                                                    colSpan={1}
                                                    rowSpan={2}
                                                >
                                                    <Skeleton

                                                        height='100%'
                                                        // width='70rem'
                                                    >

                                                    </Skeleton>

                                                </GridItem>
                                                <GridItem
                                                    colSpan={2}
                                                >

                                                    <Skeleton
                                                        height='40rem'
                                                        // width='70rem'
                                                    >

                                                    </Skeleton>
                                                </GridItem>
                                            </Grid>

                                    </ChakraProvider>
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
                                                {steps.map((label) => (
                                                    <Step key={label}>
                                                        <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                            <ChakraProvider>

                                                <div className="pat_reg">
                                                    <form>
                                                        {formDetails(activeStep)}
                                                    </form>
                                                </div>
                                                
                                            </ChakraProvider>

                                            {activeStep === steps.length ? (
                                                <React.Fragment>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 , mt: 17, gap:21, ml:8}}>
                                                        <Button
                                                            // color="inherit"
                                                            disabled={activeStep === 0}
                                                            onClick={handleBack}
                                                            sx={{ mr: 1,
                                                                color:"#e3362d" , 
                                                                background:"#f48686",
                                                                fontWeight : 'bold',
                                                                fontSize : '16px',
                                                                height:'30px',
                                                                width:'80px',
                                                                '&:hover': {
                                                                        background: '#e3362d',
                                                                        color : '#efcece'
                                                                }
                                                            }}
                                                        >
                                                            Back
                                                        </Button>
                                                        

                                                        <Button 
                                                            onClick={e => placeRequest(patientDetails)} 
                                                            sx={{color:"#e3362d" , 
                                                                background:"#f48686",
                                                                fontWeight : 'bold',
                                                                fontSize : '16px',
                                                                height:'35px',
                                                                width:'200px',
                                                                '&:hover': {
                                                                        background: '#e3362d',
                                                                        color : '#efcece'
                                                                }
                                                            }}
                                                        >
                                                            Place Request
                                                        </Button>
                                                    </Box>

                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 , mt: 4}}>
                                                        <Button
                                                            // color="inherit"
                                                            disabled={activeStep === 0}
                                                            onClick={handleBack}
                                                            sx={{ mr: 1,
                                                                color:"#e3362d" , 
                                                                background:"#f48686",
                                                                fontWeight : 'bold',
                                                                fontSize : '16px',
                                                                height:'30px',
                                                                width:'80px',
                                                                '&:hover': {
                                                                        background: '#e3362d',
                                                                        color : '#efcece'
                                                                }
                                                            }}
                                                        >
                                                        Back
                                                        </Button>
                                                        

                                                        <Button 
                                                            onClick={handleNext} 
                                                            sx={{color:"#e3362d" , 
                                                                background:"#f48686",
                                                                fontWeight : 'bold',
                                                                fontSize : '16px',
                                                                height:'30px',
                                                                width:'80px',
                                                                '&:hover': {
                                                                        background: '#e3362d',
                                                                        color : '#efcece'
                                                                }
                                                            }}
                                                        >
                                                            Next
                                                        </Button>
                                                    </Box>
                                                </React.Fragment>
                                            )}
                                        </Box>
                                        </Fade>
                                    </Modal>

                                    <ToastContainer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}
