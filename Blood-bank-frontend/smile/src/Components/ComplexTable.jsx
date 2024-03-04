import { Box, Button, Chip, Tooltip, Typography } from '@mui/material';
import { DataGrid,  GridActionsCellItem, GridToolbarFilterButton, } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import SmsIcon from '@mui/icons-material/Sms';
import FeedbackIcon from '@mui/icons-material/Feedback';
import DoneIcon from '@mui/icons-material/Done';


const ComplexTable = (props) => {
    
    const rows = props.rows
    const [columns , setColumns] = useState([])
    
    
    const CustomNoRows = () =>{
        return(
            <>
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255,0.3)'
                }}>
                    {props.type === 'donorList' ?  (
                        <Typography variant='h2' sx={{fontSize : {xs : '1.8rem'}}} >
                            No Donors Available
                        </Typography>
                    ) : (
                        <Typography variant='h2' sx={{fontSize : {xs : '1.8rem'}}}>
                            No Pending Requests
                        </Typography>
                    )}
                </Box>
            </>
        )
    }
    
    const columnVisibility = { 
        id : false,
    }


    // Pending Requests
    const reqListCols = [
        { field: 'id', filterable: false, sortable: false},
        { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center', headerAlign : 'center', filterable : false },
        { field: 'name', headerName: "Patient's Name" ,
            width: 200, 
            sortable : false, align : 'center', headerAlign : 'center' , filterable : false,
            valueGetter : (params) =>{
                return `${params.row.firstName} ${params.row.lastName}`
            }
        },
        {
            field: 'address',
            headerName: "Patient's Address",
            width: 300,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
            filterable : false

        },
        {
            field: 'phoneNumber',
            headerName: "Patient's Phone Number",
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
            filterable : false

        },
        {
            field: 'bloodGroup',
            headerName: 'Requested BloodGroup',
            type : 'singleSelect',
            width: 190,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
            valueOptions : [ 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']         

        },
        {
            field: 'date',
            headerName: 'Previous Details',
            type: 'string',
            width: 150,
            align : 'center',
            headerAlign: 'center',
            filterable : false,
            sortable : false,   
            renderCell : (params) =>{
                return (<Button variant='contained' 
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
                            onClick={() => props.viewPrevDonation(params.id)}> View Receipt </Button>)
            }
            // valueFormatter: ({ value }) => new Date(value).toISOString().split('T')[0]
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 80,
            cellClassName: 'actions',
            getActions: (params, ind) => {
                // console.log(params.row.donor_list)
                return [
                <GridActionsCellItem
                    icon={<CheckCircleIcon />}
                    label="Accept Request"
                    className='con'
                    onClick={() => props.acceptRequest(params.id)}    
                    color="success"
                    // showInMenu
                />,
                <GridActionsCellItem
                    icon={<CancelRoundedIcon />}
                    label="Reject Request"
                    onClick={() => props.rejectRequest(params.id, params.row.sl)}
                    color="error"
                    // showInMenu
                />,
                ];
            },
        },
    ]
    //Donor Columns
    const donorListCols = [
        { field: 'id', filterable: false },
        // { field: 'matched_id', },
        { field: 'sl', headerName: "SL. No." , 
        width:80, 
        sortable : false, align : 'center',
            headerAlign : 'center' , 
            type : 'number'
            // filterable : false,
        },
        { field: 'name', headerName: "Name" , 
            type : 'string',
            width: 250,
            sortable : false, align : 'center',
            headerAlign : 'center' ,
            filterable : true,
            valueGetter : (params) =>{
                return `${params.row.firstName} ${params.row.lastName}`
            }
        },
        {
            field: 'address',
            headerName: "Address",
            width: 200,
            align: 'left',
            headerAlign: 'center',
            sortable : false,   
            filterable : false,
        },
        {
            field: 'phoneNumber',
            headerName: "Phone Number",
            type : 'string',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
            filterable : true,
        },
        {
            field: 'bloodGroup',
            headerName: 'Blood Group',
            type : 'singleSelect',
            valueOptions : ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
            width: 150,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
            filterable : true,
        },
        {
            field: 'loan',
            headerName: 'Has Loan',
            width: 100,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
            filterable : true,
            renderCell : (params) => {return (params.row.loan ?  (<DoneIcon className='con' />) : '')}
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: (params) => {
                return [
                <GridActionsCellItem
                    icon={<Tooltip title="Confirm Donation"><CheckCircleIcon /></Tooltip>}
                    label="Confirm Donor"
                    className='con'
                    onClick={() => props.sentForDonation(params.id)}    
                    // color="success"
                    // showInMenu
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="Add Donor for Loan"><PlusOneIcon /></Tooltip>}
                    label="Add Loan"
                    className='loan'
                    onClick={() => props.addLoan(params.id)}    
                    // color="success"
                    // showInMenu
                />,
                ];
            },
        },
        {
            field: 'sendsms',
            type: 'actions',
            headerName: 'Send SMS',
            width: 100,
            cellClassName: 'actions',
            getActions: (params) => {
                return [
                <GridActionsCellItem
                    icon={<Tooltip title="Send SMS"><SmsIcon /></Tooltip>}
                    label="Send SMS"
                    className='sms'
                    onClick={() => props.sendSMS(params.id)}    
                    // color="success"
                    // showInMenu
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="Send Reminder For Loan"><FeedbackIcon /></Tooltip>}
                    label="Send Reminder"
                    className='rem'
                    onClick={() => props.sendReminder(params.id)} 
                       
                    // color="success"
                    // showInMenu
                />,
                ];
            },
        },
    ]
    // Non Pending Requests
    const nonPendingListCols = [
        { field: 'id', filterable: false,},
        { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center', headerAlign : 'center', filterable : false },
        { field: 'name', headerName: "Patient's Name" ,
            width: 200, 
            sortable : false, align : 'center', headerAlign : 'center' , filterable : false,
            valueGetter : (params) =>{
                return `${params.row.firstName} ${params.row.lastName}`
            }
        },
        {
            field: 'address',
            headerName: "Patient's Address",
            width: 300,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
            filterable : false

        },
        {
            field: 'phoneNumber',
            headerName: "Patient's Phone Number",
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
            filterable : false

        },
        {
            field: 'bloodGroup',
            headerName: 'Requested BloodGroup',
            type : 'singleSelect',
            width: 190,
            sortable : false,   
            align : 'center',
            // headerAlign: 'center',
            valueOptions : [ 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']         
        },
        {
            field : 'status',
            headerName: 'Status',
            type: 'singleSelect',
            width : 180,
            align: 'center',
            sortable : false,   
            headerAlign: 'center',
            valueOptions: [
                'Confirmed',
                'Rejected'
            ],
            renderCell : (params) =>{
                return (
                    
                        params.row.status === 'Confirmed' ? (
                            <Chip 
                                label={params.row.status}
                                size='small'
                                sx={{
                                    backgroundColor : '#07bc0c',
                                    width : '50%',
                                    fontSize : '1.2rem',
                                    fontWeight : 'bold',
                                }}
                            />

                        ) : (
                            <Chip 
                                label={params.row.status}
                                size='small'
                                sx={{
                                    backgroundColor : '#d22228',
                                    width : '50%',
                                    color : '#daccca',
                                    fontSize : '1.2rem',
                                    fontWeight : 'bold',
                                }}
                            />

                        )
                )
            }
        },
        {
            // field: 'date',
            headerName: 'Previous Details',
            // type: 'singleselect',
            width: 140,
            align : 'center',
            // headerAlign: 'center',
            filterable: false,
            sortable : false,   
            renderCell : (params) =>{
                return (<Button 
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
                        variant='contained' onClick={() => props.viewPrevDonation(params.id)}> View Receipt </Button>)
            }
            // valueFormatter: ({ value }) => new Date(value).toISOString().split('T')[0]
        },
    ]

    useEffect(()=>{
        switch(props.type){
            case 'reqList': 
                setColumns(reqListCols)
                break
            
            case 'donorList' : 
                setColumns(donorListCols)
                break
            
            case 'nonPendingList' : 
                setColumns(nonPendingListCols)
        }
    },[props.type])
    

    // const changeSelectionModel = (id) =>{
    //     setRowSelectionModel(id)
    //     props.setChanges(id)
    // }

    return (
        <>
            <Box className={props.type} sx={{ height: 400,  backgroundColor: '#daccca', mt : 5,mb : 5 ,  borderRadius: '2.5rem' , borderLeft: '3px solid rgba(255, 255, 255, 0.7)', boxShadow: '0 0 4rem rgba(0, 0, 0, 0.6)', }}>
                <DataGrid
                    sx={{ 
                        fontSize : 16,
                        border : 'none',
                        maxWidth : '140rem',
                        pt : 3,
                        '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                        '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                        '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
                        '@media only screen and (max-width : 767px)' : {
                            maxWidth : '34rem',
                        }
                    }}
                    rows={rows}
                    columns={columns}
                    getRowHeight={() => 'auto'}
                    getEstimatedRowHeight={() => 50}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    // rowSelectionModel={rowSelectionModel}
                    pageSizeOptions={[5, 10]}
                    // onRowSelectionModelChange={itm => changeSelectionModel(itm) }
                    disableColumnMenu
                    slots={{
                        toolbar : GridToolbarFilterButton,
                        noRowsOverlay : CustomNoRows
                    }}
                    disableRowSelectionOnClick
                    columnVisibilityModel={columnVisibility}    
                />
            </Box>

        </>
    )
}

export default ComplexTable