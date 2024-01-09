import { Box } from '@mui/material';
import { DataGrid,  GridActionsCellItem, GridToolbarFilterButton, } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import JoinInnerTwoToneIcon from '@mui/icons-material/JoinInnerTwoTone';


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
    const [rowSelectionModel, setRowSelectionModel] = useState();

    console.log(rows)

    const columnVisibility = { 
        id : false,
    }



    const reqListCols = [
        // { field: 'id'},
        { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center', headerAlign : 'center', filterable : false },
        { field: 'name', headerName: "Patient's Name" , width: 200, sortable : false, align : 'center', headerAlign : 'center' , filterable : false },
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
            field: 'bloodgroup',
            headerName: 'Requested BloodGroup',
            width: 190,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
            filterable : false

        },
        {
            field: 'date',
            headerName: 'Requested Date',
            type: 'date',
            width: 150,
            align : 'center',
            headerAlign: 'center',
            sortable : false,   
            
            valueFormatter: ({ value }) => new Date(value).toISOString().split('T')[0]
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
                    icon={<JoinInnerTwoToneIcon />}
                    label="Matched Donors"
                    className='new'
                    onClick={() => props.openDonor(params.row.sl,params.row.donor_list)}    
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
            valueGetter : (params) =>{
                let sl = rows.findIndex( x => x.id === params.id) + 1
                return sl
            }
        },
        { field: 'name', headerName: "Name" , width: 250, sortable : false, align : 'center', headerAlign : 'center' , filterable : false,
            valueGetter : (params) =>{
                return `${params.row.firstName} ${params.row.lastName}`
            }
        },
        {
            field: 'address',
            headerName: "Address",
            width: 350,
            align: 'center',
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
    //Confirm Donations

    const conDonationCols = [
        { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center', headerAlign : 'center', filterable : false },
        { field: 'recipient_name', headerName: "Recipient's Name" , width: 200, sortable : false, align : 'center', headerAlign : 'center', filterable : false },
        {
            field: 'recipient_phonenumber',
            headerName: "Recipient's Number",
            width: 170,
            align: 'center',
            headerAlign: 'center',
            sortable : false, 
            filterable : false  
        },
        { field: 'donor_name', headerName: "Donor's Name" , width: 190, sortable : false, align : 'center', headerAlign : 'center' ,filterable : false},
        {
            field: 'donor_phoneNumber',
            headerName: "Donor's Number",
            width: 150,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
            filterable : false
        },
        {
            field: 'bloodgroup',
            headerName: 'Blood Group',
            width: 120,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
            filterable : false
        },
        {
            field: 'date',
            headerName: 'Donation Date',
            width: 150,
            sortable : false,   
            type : 'date' ,
            align : 'center',
            headerAlign: 'center',
            valueFormatter: ({ value }) => new Date(value).toISOString().split('T')[0],
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: (params) => {
                // console.log(params)
                return [
                <GridActionsCellItem
                    icon={<CheckCircleIcon />}
                    label="Donation Confirmed"
                    className='con'
                    onClick={() => props.donationConfirmed(params.id)}    
                    color="success"
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<CancelRoundedIcon />}
                    label="Not Donated"
                    // className='con'
                    // onClick={() => props.reject(params.id , params.row.matched_id)}    
                    // color="success"
                    showInMenu
                />
                ];
            },
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
            
            case 'confirmDonations' : 
                setColumns(conDonationCols)
                break
        }
    },[props.type])
    

    const changeSelectionModel = (id) =>{
        setRowSelectionModel(id)
        props.setChanges(id)
    }

    return (
        <>
            <Box sx={{ height: 400, width: '125rem', backgroundColor: '#daccca', mt : 15,   borderRadius: '2.5rem' , borderLeft: '3px solid rgba(255, 255, 255, 0.7)', boxShadow: '0 0 4rem rgba(0, 0, 0, 0.6)'}}>
                <DataGrid
                    sx={{ 
                        fontSize : 16
                    }}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    rowSelectionModel={rowSelectionModel}
                    pageSizeOptions={[5, 10]}
                    onRowSelectionModelChange={itm => changeSelectionModel(itm) }
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