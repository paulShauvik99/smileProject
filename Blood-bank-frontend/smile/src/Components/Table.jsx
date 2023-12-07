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
    mt:12,
    mr: 4,
    overflow : 'hidden',
    backgroundImage: 'linear-gradient(135deg,rgba(235, 234, 172, 0.683) 30% , rgb(240, 130, 139))',
    // maxHeight : 300
}



const TableComp = (props) => {

    return (
        <>
            {
                props.type === 'donor' ? (

                    <Box component={Paper} sx={tableStyle} >
                        <TableContainer sx={{}}>
                            <Table sx={{ minWidth: 650, maxHeight : 300  }} aria-label="simple table">
                                <TableHead >
                                    <TableRow>
                                        {props.tableColumn.map((column)=>{
                                            return(
                                                <TableCell sx={{fontSize : '16px' ,width : '20rem', fontWeight : 'bold'}} align='left'> {column} </TableCell>
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
                ) : (
                    
                    <Box component={Paper} sx={tableStyle} >
                        <TableContainer sx={{maxHeight : 400 }}>
                            <Table  aria-label="simple table" >
                                <TableHead >
                                    <TableRow>
                                        {props.tableColumn.map((column,ind)=>{
                                            return(
                                                <TableCell key={ind} sx={{fontSize : '16px' ,fontWeight : 'bold' , width : '20rem'}} align={column === 'Status'? 'center' : 'left'}> {column} </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                        {
                                            Object.keys(props.requestRecords).length === 0 ? null : (
                                                <TableRow>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.requestRecords.recipient_name}</TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.requestRecords.date}</TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="center">
                                                        <Chip 
                                                            label={props.requestRecords.status}
                                                            size='small'
                                                            sx={{
                                                                backgroundColor : 'orange',
                                                                width : '70%',
                                                                fontSize : '1.2rem',
                                                                fontWeight : 'bold',
                                                                border : '1px solid #ff8800'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.requestRecords.bloodGroup}</TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.requestRecords.donor_name}</TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.requestRecords.donor_phoneNumber}</TableCell>
                                                </TableRow>
                                            )
                                        }
                                        {
                                            Object.keys(props.pendingRecords).length === 0 ? null : (
                                                <TableRow>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.pendingRecords.recipient_name}</TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.pendingRecords.date}</TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">
                                                        <Chip 
                                                            label={props.pendingRecords.status}
                                                            size='small'
                                                            sx={{
                                                                backgroundColor : '#15eea9',
                                                                width : '100%',
                                                                fontSize : '1.2rem',
                                                                fontWeight : 'bold',
                                                                border : '1px solid #00ffae'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.pendingRecords.bloodGroup}</TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.pendingRecords.donor_name}</TableCell>
                                                    <TableCell sx={{fontSize : '14px'}} align="left">{props.pendingRecords.donor_phoneNumber}</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    {props.pastRecords.map((row) => (
                                        <TableRow
                                            key={row.recipient_name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.recipient_name}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.date}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="center">
                                                        {
                                                            row.status === 'Confirmed' ? (
                                                                <Chip 
                                                                    label={row.status}
                                                                    size='small'
                                                                    sx={{
                                                                        backgroundColor : '#1afa31',
                                                                        width : '70%',
                                                                        fontSize : '1.2rem',
                                                                        fontWeight : 'bold',
                                                                        border : '1px solid #00d916'
                                                                    }}
                                                                />

                                                            ) : (
                                                                <Chip 
                                                                    label={row.status}
                                                                    size='small'
                                                                    sx={{
                                                                        backgroundColor : '#ee3127',
                                                                        width : '70%',
                                                                        fontSize : '1.2rem',
                                                                        fontWeight : 'bold',
                                                                        border : '1px solid #ff2015'
                                                                    }}
                                                                />

                                                            )
                                                        }
                                            </TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.bloodGroup}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.donor_name}</TableCell>
                                            <TableCell sx={{fontSize : '14px'}} align="left">{row.donor_phoneNumber}</TableCell>
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