import React from 'react'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, renderDigitalClockTimeView, renderMultiSectionDigitalClockTimeView } from "@mui/x-date-pickers";
import { StaticDatePicker} from "@mui/x-date-pickers";
import { css } from "../../../styled-system/css";
import { useRef, useState } from "react";
import { Button } from '@chakra-ui/react';
import { esES } from '@mui/x-date-pickers/locales';




const DateFilter = ({ ref, setFilter, mode }) => {
    const [value, setValue] = useState(null);
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs} 
            localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}>
            <StaticDatePicker
                className={css({maxW: '70%'})}
                displayStaticWrapperAs='desktop'
                views={['year', 'month', 'day']}
                orientation="portrait"
                onChange={(e) => {setValue(e);
                    setFilter(mode, e.format('YYYY-MM-DD'))}}
                value={value}
                slotProps={{
                    actionBar: { actions: []},
                    toolbar: {toolbarTitle: ''},
                }}
            />
            <Button onClick={() => {
                setValue(null);
                setFilter(mode, '')}}>Limpiar</Button>
        </LocalizationProvider>
    )
}

export default DateFilter