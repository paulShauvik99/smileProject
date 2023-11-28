import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { DataGrid,  GridActionsCellItem, GridToolbarFilterButton, } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ComplexTable from '../Components/ComplexTable';
import axios from 'axios';



const initialRows = [
        {
            id: 1,
            name: 'ASjdhghhjasd',
            age: 25,
            joinDate: 'asdhjb',
            role: 'roles',
        },
        {
            id: 2,
            name: 'ASjdhghhjasd',
            age: 36,
            joinDate: 'asdhjb',
            role: 'roles',
        },
        {
            id: 3,
            name: 'ASjdhghhjasd',
            age: 19,
            joinDate: 'asdhjb',
            role: 'roles',
        },
        {
            id: 4,
            name: 'ASjdhghhjasd',
            age: 28,
            joinDate: 'asdhjb',
            role: 'roles',
        },
        {
            id: 5,
            name: 'ASjdhghhjasd',
            age: 23,
            joinDate: 'asdhjb',
            role: 'roles',
        },
    ];

const drawerWidth = 240;



const AdminDashboard = (props) => {
    axios.defaults.withCredentials = true

    const ChildRef = useRef(null)
    const [rows, setRows] = useState(initialRows);

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

        
    

    //Donor List Columns
    const columns = [
            { field: 'name', headerName: 'Name', width: 180, editable: true },
            {
                field: 'age',
                headerName: 'Age',
                // type: 'number',
                width: 80,
                align: 'left',
                headerAlign: 'left',
                editable: true,
                sortable : false,   
            },
            {
                field: 'joinDate',
                headerName: 'Join date',
                // type: '',
                width: 180,
                editable: true,
                sortable : false,   
            },
            {
                field: 'role',
                headerName: 'Department',
                width: 220,
                editable: true,
                sortable : false,   
                // type: 'singleSelect',
                valueOptions: ['Market', 'Finance', 'Development'],
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                width: 100,
                cellClassName: 'actions',
                getActions: ({ id }) => {
                    
                    return [
                    <GridActionsCellItem
                        icon={<EditIcon color='success' />}
                        label="Edit"
                        className="textPrimary"
                        // onClick={handleEditClick(id)}    
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                    ];
                },
            },
        ];




    const columnss = [
        { field: 'id', headerName: 'ID', width: 50, sortable: false},
        { field: 'firstName', headerName: 'First name', width: 120, sortable: false },
        { field: 'lastName', headerName: 'Last name', width: 120, sortable: false },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
    
            width: 30,
            sortable: false
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 190,
            valueGetter: (params) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field : 'Date',
            headerName : 'Date of Appointment',
            width: 120,
            sortable : false,
            type : 'date',
            
        },
        {
            field : 'confirm',
            headerName : '',
            width: 120,
            sortable : false,
            renderCell : () => <Button variant='contained'>Confirm Donor</Button>            
        },
        
        
        
    ];
    
    const rowss = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', Date : dayjs().toDate() ,age: 35 , confirm : '2' },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', Date : dayjs().add(2, 'day').toDate() ,age: 42 , confirm : '1'},
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', Date : dayjs().add(4 , 'day').toDate() ,age: 45 , confirm : '1'},
        { id: 4, lastName: 'Stark', firstName: 'Arya', Date : dayjs().add(5 , 'day').toDate() ,age: 16 , confirm : '1'},
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', Date : dayjs().add(3 , 'day').toDate() ,age: null , confirm : '1'},
        { id: 6, lastName: 'Melisandre', firstName: null, Date : dayjs().add(6 , 'day').toDate() ,age: 150 , confirm : '1'},
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', Date : dayjs().add(7 , 'day').toDate() ,age: 44 , confirm : '1'},
        { id: 8, lastName: 'Frances', firstName: 'Rossini', Date : dayjs().add( 8, 'day').toDate() ,age: 36 , confirm : '1'},
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', Date : dayjs().add(1 , 'day').toDate() ,age: 65 , confirm : '1'    },
    ];
    
    
    
    

    

    
    // console.log(rowSelectionModel)
    
    //Drawers
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [tab , setTab] = useState('Match Donors');
    const [showDonorList , setShowDonorList] = useState(false)
    const [rowSelectionModel, setRowSelectionModel] = useState();


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };



    const changeSelectionModel = (id) =>{
        setRowSelectionModel(id)
        setShowDonorList(true)
    }


    const getTableData = async () =>{

        const res = await axios.get('http://127.0.0.1:8000/donor/get_matched_donors/')
        console.log(res)
    }

    useEffect(()=>{
        getTableData()
    },[])

    
    //Nav Drawer 
    const NavDrawer = (
        <Box sx={{
            backgroundColor : '#f0828b',
            height : '100%',
        }}>
            <Toolbar/>
            <Divider />
            <List>
                {['Match Donors' , 'Confirm Donations'].map((text, index) => (
                <ListItem key={text} disablePadding onClick={e => setTab(e.target.innerHTML)}>
                    <ListItemButton>
                    <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon fontSize='large' /> : <MailIcon fontSize='large' />}
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    console.log(rowSelectionModel)
    return (
        <>
            <div className="admin_outer_div">
                <div className="admin_inner_div">
                    <Box sx={{ display: 'flex',  }}>
                        <CssBaseline />
                        <AppBar
                            position="fixed"
                            sx={{
                                width: { sm: `calc(100% - ${drawerWidth}px)` },
                                ml: { sm: `${drawerWidth}px` },
                                backgroundColor : '#c74d57'    
                            }}
                        >
                            <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h3" noWrap component="div">
                                Admin Dashboard
                            </Typography>
                            </Toolbar>
                        </AppBar>
                        <Box
                            component="nav"
                            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                            aria-label="mailbox folders"
                        >
                            <Drawer
                                container={container}
                                variant="temporary"
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                                ModalProps={{
                                    keepMounted: true, 
                                }}
                                sx={{
                                    display: { xs: 'block', sm: 'none' },
                                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                                    backgroundColor : '#c74d57'
                                }}
                            >
                                {NavDrawer}
                            </Drawer>
                            <Drawer
                                variant="permanent"
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                                }}
                                open
                            >
                                {NavDrawer}
                            </Drawer>
                        </Box>
                        <Box
                            component="main"
                            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                        >
                            <Toolbar />
                            {
                                tab === 'Match Donors' ? (
                                    <>  
                                        <ComplexTable
                                            type='reqList'
                                            ref={ChildRef}
                                            rows={rowss}
                                            columns={columnss}
                                            setChanges={changeSelectionModel}
                                        />
                                        {
                                            showDonorList ? (
                                                <>
                                                        <ComplexTable
                                                            type='donorList'
                                                            ref={ChildRef}
                                                            rows={rows}
                                                            columns={columns}
                                                        />
                                                </>
                                            ) : (
                                                <>

                                                </>
                                            )
                                        }




                                    </>
                                ) : (
                                    <>
                                        <ComplexTable
                                            type='donorList'
                                            ref={ChildRef}
                                            rows={rows}
                                            columns={columns}
                                        />
                                    </>
                                )
                            }
                        </Box>
                    </Box> 
                </div>
            </div>
        </>
    )
}

export default AdminDashboard