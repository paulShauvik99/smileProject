import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Paper } from '@mui/material';



// Style for table

const tableStyle = {
    mt:12,
    mr: 4,
    overflow : 'hidden',
    backgroundImage: 'linear-gradient(135deg,rgba(235, 234, 172, 0.683) 30% , rgb(240, 130, 139))',

}



const TableComp = (props) => {


    return (
        <>
            <Box component={Paper} sx={tableStyle} >
                <TableContainer sx={{maxHeight : 400 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead >
                            <TableRow>
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}}>Patient's Name </TableCell>
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}} align="left">Donation Date</TableCell>
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}} align="left">Phone Number</TableCell>
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}} align="left">Blood Group</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.tableContent.map((row) => (
                                <TableRow
                                    key={row.recipient_name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{fontSize : '14px'}} align="left">{row.recipient_name}</TableCell>
                                    <TableCell sx={{fontSize : '14px'}} align="left">{row.date}</TableCell>
                                    <TableCell sx={{fontSize : '14px'}} align="left">{row.phoneNumber}</TableCell>
                                    <TableCell sx={{fontSize : '14px'}} align="left">{row.bloodGroup}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default TableComp