import {DialogRoot, DialogTrigger, DialogContent, DialogHeader,DialogActionTrigger, DialogCloseTrigger, DialogBody, DialogFooter, DialogTitle} from '@/components/ui/dialog';
import { Button } from "@chakra-ui/react";
import { css } from '../../../styled-system/css';
import { useRef, useState, useEffect} from "react";
import { createCalendarEvent, removeCalendarEvent, getAttachmentsByAction } from '@/app/services/api';
import { Field } from '@/components/ui/field';
import { Input, Box, Grid, GridItem } from '@chakra-ui/react';
import { dateFormatter } from '../dateFormatter';
import { format } from 'date-fns';
import dayjs from 'dayjs';

import FileViewer  from '@/components/fileHandler/docViewer';
import DownloadButton from '@/components/fileHandler/downloadManager';

import {
    FileUploadList,
    FileUploadRoot,
    FileUploadTrigger,
    FileUploadDropzone,
  } from "@/components/ui/file-upload"

//momentjs formatter
const formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
}

//Confirmation dialog for delete action
const ConfirmationDialog = ({ onConfirm }) => {
    return (
        <DialogRoot >
            <DialogTrigger asChild>
                <Button variant='outline' colorScheme='red'>Eliminar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmación</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    ¿Estás seguro de que deseas eliminar este evento?
                </DialogBody>
                <DialogFooter>
                    <DialogCloseTrigger/>
                    <DialogActionTrigger asChild>
                        <Button variant='outline' >Cancelar</Button>
                    </DialogActionTrigger>
                    <DialogActionTrigger asChild>
                        <Button variant='outline' colorScheme='red' onClick={onConfirm}>Eliminar</Button>
                    </DialogActionTrigger>
                </DialogFooter>
            </DialogContent>
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

        </DialogRoot>
    );
}


const EventModal = ({data, mode, open, setOpen, api, attachments}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState([]);
    return (
        <DialogRoot size={"md"} lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
            {
            mode === 'create' ? (
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Evento</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <p>Fecha de inicio: {dateFormatter(data.start)}</p>
                    <p>Fecha de fin: {dateFormatter(data.end)}</p>
                    <p>Todo el dia: {data.allDay ? 'Si' : 'No'}</p>

                    <Field label="Título" required>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del evento" />
                    </Field>

                    <Field label="Descripción" required>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción del evento" />
                    </Field>
                    <Field label='Adjuntos' helperText='Archivos permitidos: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png' >
                        <FileUploadRoot maxW='100%' alignItems="stretch" maxFiles={10} maxFileSize={41943040} onFileChange={(file)=>{setAttachment(file.acceptedFiles)}}
                            accept= {['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']}>
                            <FileUploadDropzone 
                            label="Arrastre archivos aquí o haga click para seleccionar"
                            description="hasta 40MB, máximo 10 archivos"
                            />
                    
                            <FileUploadList clearable />
                        </FileUploadRoot>
                    </Field>

                </DialogBody>
                <DialogFooter>
                    <DialogCloseTrigger/>
                    <DialogActionTrigger asChild >
                        <Button variant='outline' onClick={() => {
                            console.log(attachment)
                            createCalendarEvent({
                                title: title,
                                start_date: formatDate(data.start),
                                end_date: formatDate(data.end),
                                all_day: data.allDay,
                                description: description,
                                attachment: attachment,
                            }).then((res) => {
                                if (res) {
                                    api();
                                    setOpen(false);
                                }
                            })
                        }} >Aceptar</Button>
                    </DialogActionTrigger>
                </DialogFooter>
            </DialogContent>
            )
            :
            mode === 'view' && (
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ver Evento</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <p>ID: {data.event.id}</p>
                    <p>Título: {data.event.title}</p>
                    <p>Descripción: {data.event.description}</p>
                    <p>Fecha de inicio: {dateFormatter(data.start)}</p>
                    <p>Fecha de fin: {data.end ? dateFormatter(data.end): dateFormatter(dayjs(data.start).add(23,'h').add(59,'m')) }</p>
                    {console.log(data.end)}
                    <p>Todo el dia: {data.event.allDay ? 'Si' : 'No'}</p>
                    <Box w="full" h="15vh" overflowY="auto" border="1px solid" borderColor="gray.300" p={2}>
                        <Grid templateColumns='repeat(4, 1fr)' className={css({ gap: '4', justifyContent: 'center',paddingTop: 4, })}>
                            {attachments  && attachments.map((attachment, index) => (
                                <GridItem key={index} display='flex' justifyContent='center'>
                                    <AttachmentModal key={attachment.id} attachment={attachment} />
                                </GridItem>
                            ))}
                        </Grid>
                    </Box>
                </DialogBody>
                <DialogFooter>
                    <DialogCloseTrigger/>
                    <DialogActionTrigger asChild >
                        <Button variant='outline' >Aceptar</Button>
                    </DialogActionTrigger>
                    <DialogActionTrigger asChild >
                        <ConfirmationDialog onConfirm={() => {
                            removeCalendarEvent(data.event.id).then((res) => {
                                if (res) {
                                    api();
                                    setOpen(false);
                                }
                            })
                        }} />
                    </DialogActionTrigger>
                </DialogFooter>
            </DialogContent>
            )
        } 
        </DialogRoot>
    )
}

export default EventModal;