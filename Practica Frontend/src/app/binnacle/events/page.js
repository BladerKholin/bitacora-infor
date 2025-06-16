'use client';

import { css } from '../../../../styled-system/css';
import { useEffect, useState, useRef } from 'react';
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "@/components/ui/select"
import { LightMode } from '@/components/ui/color-mode';
import { getActionsByEvent, getEventById, getAttachmentsByAction, getUsername, updateEventStatus } from '@/app/services/api';
import CreateActionModal from '@/components/creators/actionCreator';
import { dateFormatter } from '@/components/dateFormatter';
import DownloadButton from '@/components/fileHandler/downloadManager';
import FileViewer from '@/components/fileHandler/docViewer';
import { Grid, GridItem, Box, Button, createListCollection } from '@chakra-ui/react';

import DownloadPDF from '@/components/exports/pdfButton';



const states = createListCollection({items: [
    { value: 'abierto', label: 'Abierto' },
    { value: 'cerrado', label: 'Cerrado' },
    { value: 'en proceso', label: 'En proceso' },
    ]});


const StatusChangeModal = ({event, fetch}) => {
    const [status, setStatus] = useState('');
    const contentRef = useRef(null)
    const handleUpdate = async () => {
        await updateEventStatus(event.id, {status:status[0]});
        const data = await getEventById(event.id);
        fetch(data);
    };
    return (
        <DialogRoot >
            <DialogTrigger className={css({ padding: '10px 20px', fontSize: '16px', bg: 'green', color: 'white', borderRadius: 'md', _hover: { bg: 'blue.600' } })} >
                    {'Cambiar estado'}
            </DialogTrigger>
            <LightMode>
                <DialogContent ref={contentRef}>
                    <DialogHeader className={css({ color: 'black', fontSize: 'lg', fontWeight: 'bold' })}>
                        {'Cambiar estado del evento'}
                    </DialogHeader>
                    <DialogCloseTrigger />
                    <DialogBody>
                        <p>Seleccione un estado</p>
                        <SelectRoot collection={states} value={status} onValueChange={(e) => setStatus(e.value)}>
                            <SelectTrigger>
                                <SelectValueText placeholder='Estado'/>
                            </SelectTrigger>
                            <SelectContent portalRef = {contentRef}>
                                {states.items.map((item) => (
                                    <SelectItem key={item.value} item={item}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>
                        <div className={css({ display: 'flex', flexDirection: 'row', gap: '4', justifyContent: 'space-between', padding: '4' })}>                        
                            <DialogActionTrigger asChild>
                                <Button className={css({ bg: 'red'})} onClick={handleUpdate}>Guardar</Button>
                            </DialogActionTrigger>
                            <DialogActionTrigger asChild>
                                <Button className={css({ bg: 'black'})}>Cerrar</Button>
                            </DialogActionTrigger>

                        </div>

                    </DialogBody>
                </DialogContent>
            </LightMode>
        </DialogRoot>
    );
}


const EventModal = ({event}) => {
    const [user, setUser] = useState({});

    const fetchUser = async () => {
        const data = await getUsername(event.user_id);
        setUser(data);
    };

    return (
        <DialogRoot >
            <DialogTrigger onClick={fetchUser} className={css({ padding: '10px 20px', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md', _hover: { bg: 'blue.600' } })} >
                    {'Ver detalles'}
            </DialogTrigger>
            <LightMode>
                <DialogContent>
                    <DialogHeader className={css({ color: 'black', fontSize: 'lg', fontWeight: 'bold' })}>
                        {event.title}
                    </DialogHeader>
                    <DialogCloseTrigger />
                    <DialogBody>
                        <p>Usuario: {user.name}</p>
                        <p>Responsable: {event.responsible}</p>
                        <p>Fecha de inicio: {event.start_date}</p>
                        <p>Fecha de fin: {event.end_date}</p>
                    </DialogBody>
                </DialogContent>
            </LightMode>
        </DialogRoot>
    );
}

const AttachmentModal = ({attachment}) => {
    const closeButtonRef = useRef(null);
    return (
        <DialogRoot size={'sm'} >
            <DialogTrigger className={css({ padding: '10px 20px', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md', _hover: { bg: 'blue.600' } })} >
                    {attachment.filename}
            </DialogTrigger>
            <LightMode>
                <DialogContent>
                    <DialogHeader className={css({ color: 'black', fontSize: 'lg', fontWeight: 'bold' })}>
                        {attachment.filename}
                    </DialogHeader>
                    <DialogCloseTrigger ref={closeButtonRef} />
                    <DialogBody>
                        <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', backgroundColor: 'white' })}>
                            <p>Fecha de registro: {dateFormatter(attachment.uploaded_at)}</p>
                            <FileViewer fileId={attachment.id} />
                            {console.log(attachment)}
                            <DownloadButton fileId={attachment.id} fileName={attachment.filename} />
                        </div>
                    </DialogBody>
                </DialogContent>
            </LightMode>
        </DialogRoot>
    );
}

const InfoModal = ({action}) => {
    const [attachments, setAttachments] = useState([]);
    useEffect(() => {
        getAttachmentsByAction(action.id, 'actions').then((data) => {
            setAttachments(data);
        });
    }, []);
    return (
        <DialogRoot size={'xl'} >
            <div className={css({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'})}>
                <p>{dateFormatter(action.registry_date)}</p>
                <DialogTrigger className={css({ padding: '10px 20px', fontSize: '16px', bg: 'blue.500', color: 'white', borderRadius: 'md', _hover: { bg: 'blue.600' }, width: '80%' })} >
                    
                            {action.title}

                </DialogTrigger>
            </div>
            <LightMode>
                <DialogContent >
                    <DialogHeader className={css({ color: 'black', fontSize: 'lg', fontWeight: 'bold' })}>
                        {action.title}
                    </DialogHeader>
                    <DialogCloseTrigger />
                    <DialogBody>
                        <p>{action.description}</p>
                        <p>Fecha de registro: {dateFormatter(action.registry_date)}</p>
                        <p>Fecha estimada: {dateFormatter(action.estimated_date)}</p>
                        <p>Responsable: {action.responsible}</p>
                        <h1 className={css({paddingTop: 4, fontWeight: 'bold'})}> Adjuntos</h1>
                        <Box w="full" h="15vh" overflowY="auto" border="1px solid" borderColor="gray.300" p={2}>
                            <Grid templateColumns='repeat(4, 1fr)' className={css({ gap: '4', justifyContent: 'center',paddingTop: 4, })}>
                                {attachments && attachments.map((attachment, index) => (
                                    <GridItem key={index} display='flex' justifyContent='center'>
                                        <AttachmentModal key={attachment.id} attachment={attachment} />
                                    </GridItem>
                                ))}
                            </Grid>
                        </Box>
    
                    </DialogBody>
                </DialogContent>
            </LightMode>
        </DialogRoot>
    );
}





export default function DestinationPage() {
    const [event, setEvent] = useState('');
    const [actions, setActions] = useState([]);
    const [buttonId, setButtonId] = useState(null);
    

    useEffect(() => {
        const eventId = sessionStorage.getItem('eventId');
        let localId = parseInt(eventId);
        setButtonId(localId);

        getEventById(localId).then((data) => {
            setEvent(data);
            
        });
        getActionsByEvent(localId).then((data) => {
            setActions(data);
        }
        );

    }, []);

    return (
        <div className={css({backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '4', width: '100%', alignItems: 'center', height: '100%' })}>
            <div className={css({ display: 'flex', flexDirection: 'row', padding: '4', gap: '4' , justifyContent: 'space-between', width: '100%'})}>
                <DownloadPDF eventId={event.id} />
                <h1 className={css({ color: 'black', fontSize: 'lg', fontWeight:'bold' })}> {event ?  `${event.title} • ${event.status}`   : 'Cargando'}</h1>
                <EventModal event={event} />
            </div>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', width: '100%', padding: '4', overflowY: 'auto', height: '70vh' })}>
            {actions && actions.map((action) => (
                <InfoModal key={action.id} action={action} />
            ))}
            </div>
            <div className={css({ display: 'flex', flexDirection: 'row', gap: '4', justifyContent: 'space-between', paddingStart:'45vw', width: '100%', borderTop: '1px solid' })}>
                <CreateActionModal  event={event} fetch={() => getActionsByEvent(buttonId).then((data) => {setActions(data);})} />
                <StatusChangeModal event={event} fetch={(event) => setEvent(event)} />
            </div>
        </div>
    );
}