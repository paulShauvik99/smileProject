import React, { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Badge, Typography } from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers';





function ServerDay(props) {
        const { highlightedDays = [], day, ...other } = props;

        
        const isSelected = !props.disabled && (props.day.date() in highlightedDays) ;
        
        return (
            <Badge
                key={props.day.toString()}
                overlap="circular"
                color='primary'
                badgeContent={isSelected ? highlightedDays[props.day.date()] : undefined}
            >
                <PickersDay {...other}  day={day} />
            </Badge>
        );
}

const disable15Days = (date) => date > dayjs().add(15 , 'day') 


const RequestDashboard = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [highlightedDays, setHighlightedDays] = useState(
        {
            22 : 6,
            25 : 8,
            30 : 2
        }
    );

    const handleMonthChange = () => {
        setIsLoading(true);
        
    };
    



    return (
        <>
                <div className="req_dashboard_outer_div">
                    <div className="req_dashboard_inner_div">
                        <div className="req_dashboard_content">
                            <div className="actual_content">
                                <div className="grid_container">
                                    <div className="main">
                                        
                                    </div>
                                    <div className="calendar">
                                        <Typography variant='h2' component='h2' textAlign='center'>
                                            Available Days                                            
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <StaticDatePicker
                                                showDaysOutsideCurrentMonth
                                                disablePast
                                                fixedWeekNumber={6}
                                                defaultValue={dayjs()}
                                                readOnly
                                                loading={isLoading}
                                                onMonthChange={handleMonthChange}
                                                slots={{
                                                    day: ServerDay,
                                                }}
                                                slotProps={{
                                                    day: {
                                                        highlightedDays,
                                                    },
                                                }}
                                                shouldDisableDate={disable15Days}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="requests">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default RequestDashboard