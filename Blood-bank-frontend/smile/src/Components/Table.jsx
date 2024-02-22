import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Chip, Paper } from '@mui/material';



// Style for table

const tableStyle = {
    mt:5,
    mr: 4,
    overflow : 'hidden',
    backgroundColor: '#daccca',
    p : 2 ,
    maxWidth : 360
}
const tableStyle2 = {
    mt:5,
    mr: 4,
    overflow : 'hidden',
    backgroundColor: '#daccca',
    p : 2 ,
    maxWidth : 760
}



const TableComp = (props) => {

    return (
        <>
            {
                props.type === 'donor' ? (

                    <Box component={Paper} sx={tableStyle} >
                        <TableContainer sx={{}}>
                            <Table stickyHeader sx={{ maxWidth: 450, maxHeight : 300 , }} aria-label="simple table">
                                <TableHead >
                                    <TableRow>
                                        {props.tableColumn.map((column)=>{
                                            return(
                                                <TableCell sx={{fontSize : '16px' ,width : '25rem', fontWeight : 'bold'}} align='left'> {column} </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.tableContent.map((row) => (
                                        <TableRow
                                            key={row.recipient_name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.firstName} {row.lastName}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="center">{row.totalDonation}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    
                    <Box component={Paper} sx={tableStyle2} >
                        <TableContainer sx={{maxHeight : 200 , maxWidth : {lg : 750 , xs : 300}}}>
                            <Table stickyHeader aria-label="simple table" >
                                <TableHead >
                                    <TableRow sx={{backgroundColor :'red' }}>
                                        {props.tableColumn.map((column,ind)=>{
                                            return(
                                                <TableCell key={ind} sx={{fontSize : '16px' ,fontWeight : 'bold' , width : '10rem'}} align= 'left'> {column} </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.pastRecords.map((row) => (
                                        <TableRow
                                            key={row.recipient_name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.recipient_name}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.date}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="center">{row.bloodGroup}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="left" >
                                                        {
                                                            row.status === 'Confirmed' ? (
                                                                <Chip 
                                                                    label={row.status}
                                                                    size='small'
                                                                    sx={{
                                                                        backgroundColor : '#07bc0c',
                                                                        width : {lg : '60%', xs : '100%'},
                                                                        fontSize : '1.2rem',
                                                                        fontWeight : 'bold',
                                                                    }}
                                                                />

                                                            ) : (
                                                                <Chip 
                                                                    label={row.status}
                                                                    size='small'
                                                                    sx={{
                                                                        backgroundColor : '#d22228',
                                                                        width : {lg : '60%', xs : '100%'},
                                                                        color : '#daccca',
                                                                        fontSize : '1.2rem',
                                                                        fontWeight : 'bold',
                                                                    }}
                                                                />

                                                            )
                                                        }
                                            </TableCell>
                                            {/* <TableCell sx={{fontSize : '14px'}} align="left">{row.donor_name}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.donor_phoneNumber}</TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                )
            }
        </>
    )
}

export default TableComp