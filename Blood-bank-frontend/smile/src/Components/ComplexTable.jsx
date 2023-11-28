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
            field: 'requestedDate',
            headerName: 'Requested Date',
            type: 'date',
            width: 150,
            align : 'center',
            headerAlign: 'center',
            sortable : false,   
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 80,
            cellClassName: 'actions',
            getActions: (params, ind) => {
                console.log(props.donorData)
                return [
                <GridActionsCellItem
                    icon={<JoinInnerTwoToneIcon />}
                    label="Matched Donors"
                    onClick={() => props.openDonor(params.row.sl,props.donorData)}    
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
        { field: 'matched_id'},
        // { field: 'sl', headerName: "SL. No." , width:80, sortable : false, align : 'center', headerAlign : 'center' },
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
                    label="Confirm Donor"
                    onClick={() => props.getMatchedDonorId(params.id , params.row.matched_id)}    
                    color="success"
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
                setColumns(props.columns)
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
                    
                    columnVisibilityModel={columnVisibility}
                />
            </Box>

        </>
    )
})

export default ComplexTable