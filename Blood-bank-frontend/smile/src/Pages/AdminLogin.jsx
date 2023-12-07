import React, { useState } from 'react'
import { ChakraProvider, Heading, Button, FormControl, FormLabel, Input, Icon, InputGroup, InputLeftAddon, HStack, VStack, InputRightElement} from '@chakra-ui/react'
import { User , Password, Eye, EyeSlash} from '@phosphor-icons/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'




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
                const res = await axios.post('http://127.0.0.1:8000/donor/admin_login/', JSON.stringify(data))
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
                            navigate('/admindashboard')
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
                <div className="admin_inner_div">
                    <div className="admin_login">
                        <div className="admin_login_form">
                            <ChakraProvider>
                                <VStack>
                                    <Heading as='h3' > Hello Admin </Heading>
                                        <FormControl mt={15} isRequired width='35rem'>
                                            <FormLabel fontSize='1.4rem' htmlFor='username'>Username</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon backgroundColor='red.200' height={30}>
                                                    <Icon as={User} boxSize={8} weight='duotone' color='#ce2432' />
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
                                                <InputLeftAddon backgroundColor='red.200' height={30}>
                                                    <Icon as={Password} boxSize={8} weight='duotone' color='#ce2432' />
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
                                                <InputRightElement height={30} width={35} onClick={e => setShowPassword(!showPassword)}>
                                                    <Button
                                                        // width='4.5rem'
                                                    >

                                                    {
                                                        showPassword ? (<Icon as={EyeSlash} boxSize={8} weight='duotone' color='#ce2432' />) : ( 
                                                            <Icon as={Eye} boxSize={8} weight='duotone' color='#ce2432' />
                                                        )
                                                    }
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                        </FormControl>
                                        <HStack mt={16} mb={26}>
                                            <Button size='lg' color="red.500" bg="red.200" 
                                                    _hover={{color:'red.50' , bg: 'red.400'}} 
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
            </div>
        </>
    )
}

export default AdminLogin