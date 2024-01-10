import { Box } from '@mui/material';
import { DataGrid,  GridActionsCellItem, GridToolbarFilterButton, } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import JoinInnerTwoToneIcon from '@mui/icons-material/JoinInnerTwoTone';
import { Link } from 'react-router-dom';

const CustomNoRows = () =>{
    return(
        <>
            <h1>No Pending Requests</h1>
        </>
    )
}



const ComplexTable = (props) => {

    const rows = props.rows
    const [columns , setColumns] = useState([])
    // const [rowSelectionModel, setRowSelectionModel] = useState();

    // console.log(rows)

    const columnVisibility = { 
        id : false,
    }


    // Pending Requests
    const reqListCols = [
        { field: 'id'},
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
            width: 190,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
            filterable : false

        },
        {
            field: 'date',
            headerName: 'Previous Details',
            type: 'string',
            width: 150,
            align : 'center',
            headerAlign: 'center',
            sortable : false,   
            renderCell : (params) =>{
                return (<Link onClick={props.viewPrevDonation}> View Receipt </Link>)
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
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<CancelRoundedIcon />}
                    label="Reject Request"
                    onClick={() => props.rejectRequest(params.id, params.row.sl)}
                    color="error"
                    showInMenu
                />,
                ];
            },
        },
    ]
    //Donor Columns
    const donorListCols = [
        { field: 'id'},
        // { field: 'matched_id', },
        { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center',
            headerAlign : 'center' , filterable : false,
        },
        { field: 'name', headerName: "Name" , width: 250, sortable : false, align : 'center', headerAlign : 'center' , filterable : false,
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
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
            filterable : false,
        },
        {
            field: 'bloodGroup',
            headerName: 'Blood Group',
            width: 200,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
            filterable : false,
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
                    icon={<CheckCircleIcon />}
                    label="Confirm Donor"
                    className='con'
                    onClick={() => props.sentForDonation(params.id)}    
                    color="success"
                    showInMenu
                />
                ];
            },
        },
    ]
    // Non Pending Requests
    const nonPendingListCols = [
        { field: 'id'},
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
            width: 190,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
            filterable : false

        },
        {
            field: 'date',
            headerName: 'Previous Details',
            type: 'string',
            width: 150,
            align : 'center',
            headerAlign: 'center',
            sortable : false,   
            renderCell : (params) =>{
                return (<Link onClick={props.viewPrevDonation}> View Receipt </Link>)
            }
            // valueFormatter: ({ value }) => new Date(value).toISOString().split('T')[0]
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerName: 'Actions',
        //     width: 80,
        //     cellClassName: 'actions',
        //     getActions: (params, ind) => {
        //         // console.log(params.row.donor_list)
        //         return [
        //         <GridActionsCellItem
        //             icon={<CheckCircleIcon />}
        //             label="Accept Request"
        //             className='con'
        //             onClick={() => props.acceptRequest(params.id)}    
        //             color="success"
        //             showInMenu
        //         />,
        //         <GridActionsCellItem
        //             icon={<CancelRoundedIcon />}
        //             label="Reject Request"
        //             onClick={() => props.rejectRequest(params.id, params.row.sl)}
        //             color="error"
        //             showInMenu
        //         />,
        //         ];
        //     },
        // },
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
            <Box sx={{ height: 400,  backgroundColor: '#daccca', mt : 15,   borderRadius: '2.5rem' , borderLeft: '3px solid rgba(255, 255, 255, 0.7)', boxShadow: '0 0 4rem rgba(0, 0, 0, 0.6)'}}>
                <DataGrid
                    sx={{ 
                        fontSize : 16,
                        border : 'none',
                        maxWidth : '120rem',
                        
                    }}
                    rows={rows}
                    columns={columns}
                    getRowHeight={() => 'auto'}
                    getColumnWidth={() => 'auto'}
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