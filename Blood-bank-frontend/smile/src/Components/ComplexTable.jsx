import { Box } from '@mui/material';
import { DataGrid,  GridActionsCellItem, GridToolbarFilterButton, } from '@mui/x-data-grid';
import React, { forwardRef, useState } from 'react'






const ComplexTable = forwardRef((props , ref) => {

    const [rows , setRows] = useState(props.rows)
    const [columns , setColumns] = useState(props.columns)
    const [rowSelectionModel, setRowSelectionModel] = useState();
    
    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

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
                />
            </Box>

        </>
    )
})

export default ComplexTable