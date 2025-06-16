import React, { useState, useEffect, useRef } from 'react';
import { css } from '../../../styled-system/css';
import { Calendar } from "lucide-react";


import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { getCalendarEvents, getAttachmentsByAction} from '../../app/services/api';

import {DialogRoot, DialogTrigger, DialogContent, DialogHeader,DialogActionTrigger, DialogCloseTrigger, DialogBody, DialogFooter, DialogTitle} from '@/components/ui/dialog';

import { Button } from "@chakra-ui/react";
import EventModal from './eventModal';

const EventCalendar = () => {
const [events, setEvents] = useState([]);
const [currentDate, setCurrentDate] = useState(new Date());
const calendarRef = useRef(null);
const [modalMode, setModalMode] = useState(null);
const [openModal, setOpenModal] = useState(false);
const [data, setData] = useState(null);
const [api, setApi] = useState(null);
const [attachments, setAttachments] = useState([]);

useEffect(() => {
    fetchEvents(currentDate.getFullYear(), currentDate.getMonth() + 1);
}, []);

const fetchEvents = async () => {
    try {
        const data = await getCalendarEvents();
        if (data && !data.error) {
            // Transform data to format expected by FullCalendar
            const formattedEvents = data.map(event => ({
                id: event.id,
                title: event.title,
                description: event.description,
                start: event.start_date,
                end: event.end_date,
                allDay: event.all_day || false,
            }));
            setEvents(formattedEvents);
            console.log('Eventos obtenidos:', formattedEvents);
        }
    } catch (error) {
        console.error('Error fetching calendar events:', error);
    }
};

const fetchAttachments = async (eventId) => {
    console.log('Fetching attachments for event ID:', eventId);
    try {
        const data = await getAttachmentsByAction(eventId, 'calendar');
        console.log('Attachments data:', data);
        //Set attachments to state
        if (data && !data.error) {
            setAttachments(data);
            console.log('Adjuntos obtenidos:', data);
        }
    } catch (error) {
        console.error('Error fetching attachments:', error);
    }
};

const handleDateChange = (dateInfo) => {
    setCurrentDate(dateInfo.start);
    fetchEvents();
};

const handleDateClick = (info) => {
    setModalMode('create');
    setOpenModal(true);
    setData({
        start: info.date,
        end: info.date,
        allDay: true,
    });
};

const handleDateSelect = (info) => {
    setModalMode('create');
    setOpenModal(true);
    setData({
        start: info.start,
        end: info.end,
        allDay: info.allDay,
    });
};

const handleEventClick = (info) => {
    //get event by name
    setData({
        event: info.event,
        start: info.event.start,
        end: info.event.end,
        allDay: info.event.allDay,
    });
    fetchAttachments(info.event.id);
    console.log(attachments)
    setModalMode('view');
    setOpenModal(true);
    
    console.log(`fecha: ${info.event.end}`);
};


return (
    <DialogRoot size={'cover'}>
        <DialogTrigger asChild>
            <Button variant={'outline'} className={css({padding: '4', fontSize: '16px', borderRadius: 'md',whiteSpace: 'nowrap' })}>
                Calendario
                <Calendar size={16} />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Calendario</DialogTitle>
                <DialogCloseTrigger/>
            </DialogHeader>
            <DialogBody>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    locale={esLocale}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    datesSet={handleDateChange}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    select={handleDateSelect}
                    height='100%'
                />
                <EventModal data={data} mode={modalMode} open={openModal} setOpen={setOpenModal} api={() => fetchEvents()} attachments={attachments}/>
            </DialogBody>
            <DialogFooter>
                <DialogCloseTrigger/>
                <DialogActionTrigger asChild >

                    <Button variant='outline' >Aceptar</Button>
                </DialogActionTrigger>
            </DialogFooter>
        </DialogContent>
        
    </DialogRoot>
);
};

export default EventCalendar;   