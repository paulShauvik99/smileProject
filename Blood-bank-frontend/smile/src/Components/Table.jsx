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
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}}>Dessert </TableCell>
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}} align="right">Calories</TableCell>
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}} align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}} align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell sx={{fontSize : '16px', fontWeight : 'bold'}} align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.tableContent.map((row) => (
                                <TableRow
                                    // key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" sx={{fontSize : '16px'}} scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell sx={{fontSize : '14px'}} align="right">{row.calories}</TableCell>
                                    <TableCell sx={{fontSize : '14px'}} align="right">{row.fat}</TableCell>
                                    <TableCell sx={{fontSize : '14px'}} align="right">{row.carbs}</TableCell>
                                    <TableCell sx={{fontSize : '14px'}} align="right">{row.protein}</TableCell>
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