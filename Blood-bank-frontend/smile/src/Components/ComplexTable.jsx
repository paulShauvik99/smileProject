import { Box } from '@mui/material';
import { DataGrid,  GridActionsCellItem, GridToolbarFilterButton, } from '@mui/x-data-grid';
import React, { forwardRef, useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import JoinInnerTwoToneIcon from '@mui/icons-material/JoinInnerTwoTone';



const ComplexTable = forwardRef((props , ref) => {

    const rows = props.rows
    // console.log(props.donorData)
    const [columns , setColumns] = useState([])
    const [rowSelectionModel, setRowSelectionModel] = useState();


    const columnVisibility = { 
        id : false,
        matched_id : false
    }



    const reqListCols = [
        { field: 'id'},
        { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center', headerAlign : 'center' },
        { field: 'name', headerName: "Patient's Name" , width: 200, sortable : false, align : 'center', headerAlign : 'center' },
        {
            field: 'address',
            headerName: "Patient's Address",
            width: 300,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
        },
        {
            field: 'phoneNumber',
            headerName: "Patient's Phone Number",
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
        },
        {
            field: 'bloodgroup',
            headerName: 'Requested BloodGroup',
            width: 190,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
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
        { field: 'matched_id', },
        { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center', headerAlign : 'center' },
        { field: 'name', headerName: "Name" , width: 250, sortable : false, align : 'center', headerAlign : 'center' },
        {
            field: 'address',
            headerName: "Address",
            width: 350,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
        },
        {
            field: 'phoneNumber',
            headerName: "Phone Number",
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
        },
        {
            field: 'bloodGroup',
            headerName: 'Blood Group',
            width: 200,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
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
                    onClick={() => props.getMatchedDonorId(params.id , params.row.matched_id)}    
                    color="success"
                    showInMenu
                />
                ];
            },
        },
    ]

    //Confirm Donations


    const conDonationCols = [
        // { field: 'id'},
        // { field: 'matched_id', },
        { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center', headerAlign : 'center' },
        { field: 'recipient_name', headerName: "Recipient's Name" , width: 200, sortable : false, align : 'center', headerAlign : 'center' },
        {
            field: 'recipient_phonenumber',
            headerName: "Recipient's Phone Number",
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
        },
        { field: 'donor_name', headerName: "Donor's Name" , width: 200, sortable : false, align : 'center', headerAlign : 'center' },
        {
            field: 'donor_phoneNumber',
            headerName: "Donor's Phone Number",
            width: 200,
            align: 'center',
            headerAlign: 'center',
            sortable : false,   
        },
        {
            field: 'bloodgroup',
            headerName: 'Blood Group',
            width: 200,
            sortable : false,   
            align : 'center',
            headerAlign: 'center',
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
                    label="Donation Confirmed"
                    className='con'
                    // onClick={() => props.donationConfirmed(params.id , params.row.matched_id)}    
                    color="success"
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<CancelRoundedIcon />}
                    label="Not Donated"
                    // className='con'
                    // onClick={() => props.getMatchedDonorId(params.id , params.row.matched_id)}    
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
    },[])
    

    // console.log(props.rows)
    // console.log(rows)

    // const handleDeleteClick = (id) => () => {
    //     setRows(rows.filter((row) => row.id !== id));
    // };

    const changeSelectionModel = (id) =>{
        setRowSelectionModel(id)
        props.setChanges(id)
    }

    return (
        <>
            <Box sx={{ height: 400, width: '100%', backgroundImage: 'linear-gradient(135deg,rgba(235, 234, 172, 0.683) 30% , rgb(240, 130, 139))', mt : 15 }}>
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
                        toolbar : GridToolbarFilterButton
                    }}
                    disableRowSelectionOnClick
                    columnVisibilityModel={columnVisibility}
                />
            </Box>

        </>
    )
})

export default ComplexTable