'use client'

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, renderDigitalClockTimeView, renderMultiSectionDigitalClockTimeView } from "@mui/x-date-pickers";
import * as React from 'react';
import {DialogRoot, DialogTrigger, DialogContent, DialogHeader,DialogActionTrigger, DialogCloseTrigger, DialogBody, DialogFooter, DialogTitle} from '@/components/ui/dialog';
import dayjs from 'dayjs';
import { StaticDateTimePicker} from "@mui/x-date-pickers";
import { css } from "../../../styled-system/css";
import { useRef } from "react";
import { Button } from "@chakra-ui/react";
import {Calendar} from "lucide-react"


const DatePicker = ({value, onChange}) => {
    const closeButtonRef = useRef(null);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="es">
            <DialogRoot size={"lg"}>
                <DialogTrigger asChild>
                    <Button variant={'outline'} className={css({padding: '4', fontSize: '16px', borderRadius: 'md',whiteSpace: 'nowrap' })}>
                        {value.format('DD/MM/YYYY HH:mm')}
                        <Calendar size={16} />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Seleccionar fecha</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <StaticDateTimePicker
                            ampm={false}
                            views={['year', 'month', 'day', 'hours', 'minutes']}
                            orientation="landscape"
                            viewRenderers={{
                                hours: renderMultiSectionDigitalClockTimeView,
                                minutes: renderMultiSectionDigitalClockTimeView,
                            }}

                            value={value}
                            onChange={onChange}
                            slotProps={{
                                actionBar: { actions: []}
                            }}
                        />
                    </DialogBody>
                    <DialogFooter>
                        <DialogCloseTrigger ref={closeButtonRef}/>
                        <DialogActionTrigger asChild >
                            <Button variant='outline' >Aceptar</Button>
                        </DialogActionTrigger>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </LocalizationProvider>
    );
}

export default DatePicker;