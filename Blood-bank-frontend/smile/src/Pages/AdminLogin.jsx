import React, { useState } from 'react'
import { ChakraProvider, Heading, Button, FormControl, FormLabel, Input, Icon, InputGroup, InputLeftAddon, HStack, VStack, InputRightElement} from '@chakra-ui/react'
import { User , Password, Eye, EyeSlash, SignIn} from '@phosphor-icons/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AdminLogin = () => {
    axios.defaults.withCredentials = true
    const navigate = useNavigate()

    //States
    const [adminInfo , setAdminInfo] = useState({ 
        username : '',
        password : '',
    })

    const [isAdminInvalid, setIsAdminInvalid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const submitDetails = async (data) => {
        // code
        if(data.username === '' || data.password === ''){
            Swal.fire({
                title : 'Please enter your username/password',
                icon : 'warning'
            })
        }else{
            try {
                setIsLoading(true)
                const res = await axios.post('http://127.0.0.1:8000/adminUser/admin_login/', JSON.stringify(data))
                console.log(res)
                if('success' in res.data){
                    const now = new Date().getTime()
                    let adminCheck ={
                        isAdmin: res.data.is_Admin,
                        expire : now + 45*60000
                    }
                    localStorage.setItem('adminCheck', JSON.stringify(adminCheck))
                    Swal.fire({
                        text : res.data.success,
                        icon : 'success'
                    }).then((res)=>{
                        if(res.isConfirmed || res.dismiss == 'backdrop'){
                            navigate('/admindashboard/matchdonor')
                        }
                    })
                    setIsLoading(false)
                }
            } catch (error) {
                Swal.fire({
                    title : error.response.data.error,
                    icon : 'error'
                })
                setIsLoading(false)
            }
        }
    }


    return (
        <>
            <div className="admin_outer_div">
                    <div className="admin_login">
                        <div className="admin_login_form">
                            <ChakraProvider>
                                <VStack>
                                    <Heading as='h3' > Hello Admin </Heading>
                                        <FormControl mt={15} isRequired width='35rem'>
                                            <FormLabel fontSize='1.4rem' htmlFor='username'>Username</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                    <Icon as={User} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                </InputLeftAddon>
                                                <Input variant='outline'
                                                        backgroundColor='red.50'
                                                        isInvalid={isAdminInvalid}
                                                        focusBorderColor='green.300'
                                                        errorBorderColor='red.400'
                                                        height={30} 
                                                        fontSize={14}  
                                                        type="text" 
                                                        name="username" 
                                                        value={adminInfo.username} 
                                                        onChange={e =>  setAdminInfo({...adminInfo , username : e.target.value})} 
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormControl mt={15} isRequired width='35rem'>
                                            <FormLabel fontSize='1.4rem' htmlFor='password'>Password</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                    <Icon as={Password} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                </InputLeftAddon>
                                                <Input variant='outline'
                                                        backgroundColor='red.50'
                                                        isInvalid={isAdminInvalid}
                                                        focusBorderColor='green.300'
                                                        errorBorderColor='red.400'
                                                        height={30} 
                                                        fontSize={14}  
                                                        type={showPassword ? 'text' : 'password'} 
                                                        name="password" 
                                                        value={adminInfo.password} 
                                                        onChange={e =>  setAdminInfo({...adminInfo , password: e.target.value})} 
                                                />
                                                <InputRightElement height={30} width={35} bgColor='#d71414' onClick={e => setShowPassword(!showPassword)}>
                                                    <Button
                                                        bgColor='#d71414'
                                                        _hover={{bg:'#d71414'}}
                                                        // width='4.5rem'
                                                    >

                                                    {
                                                        showPassword ? (<Icon as={VisibilityIcon} boxSize={8} weight='duotone' color='#f0e3e4' />) : ( 
                                                            <Icon as={VisibilityOffIcon} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                        )
                                                    }
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                        </FormControl>
                                        <HStack mt={16} mb={26}>
                                            <Button
                                                    leftIcon={<LoginIcon fontSize='24px' />}     
                                                    size='lg' color="black" bg="#d7141450" 
                                                    _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                    isLoading={isLoading}
                                                    height='35px'
                                                    width='120px'
                                                    fontSize='16px'
                                                    type='submit'
                                                    onClick={() => submitDetails(adminInfo)}
                                                    // isDisabled={disability}
                                            >
                                                LogIn
                                            </Button>
                                        </HStack>
                                    </VStack>                            
                            </ChakraProvider>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default AdminLogin