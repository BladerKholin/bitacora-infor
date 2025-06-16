import { css } from '../../../styled-system/css';
import { useState } from 'react';
import dayjs from 'dayjs';

import {
    DialogRoot,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogActionTrigger
} from "@/components/ui/dialog";

import {
    FileUploadList,
    FileUploadRoot,
    FileUploadTrigger,
    FileUploadDropzone,
} from "@/components/ui/file-upload";

import DatePicker from '../datePicker/datePicker';

import { Field } from '@/components/ui/field';
import { Input, Button, Textarea, HStack, VStack } from '@chakra-ui/react'

import { createReception } from '@/app/services/api';

const CreateReceptionModal = ({category,  fetch }) => {
    const [document, setDocument] = useState({
        nro: '',
        administrative: '',
        document_type: '',
        document_number: '',
        document_date: dayjs(),
        deploy_date: dayjs(),
        sender: '',
        receiver: '',
        matter: '',
        observations: '',
        category_id: category,
        attachments: []
    });

    const handleSubmit = async () => {
        if (!document.nro || !document.document_type || !document.document_number || !document.sender || !document.receiver || !document.matter) {
            alert('Por favor llene todos los campos obligatorios');
            return;
        }
        const newDocument = await createReception({
            nro: document.nro,
            administrative: document.administrative,
            document_type: document.document_type,
            document_number: document.document_number,
            document_date: document.document_date.format('YYYY-MM-DD'),
            deploy_date: document.deploy_date.format('YYYY-MM-DD'),
            sender: document.sender,
            receiver: document.receiver,
            matter: document.matter,
            observations: document.observations,
            category_id: category,
            attachments: document.attachments
        });
        fetch();
    };

    return (
        <DialogRoot size={"xl"}>
            <DialogTrigger className={css({ padding: '4', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md', whiteSpace: 'nowrap', _hover: { bg: 'blue.600' } })}>
                {'Registrar recibo'}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Documento</DialogTitle>
                    <DialogCloseTrigger />
                </DialogHeader>
                <DialogBody>
                    <div className={css({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',gap: '4' })}>
                        <Field label='N° de ingreso:' required>
                            <Input placeholder='Ingrese el número' value={document.nro} onChange={(e) => setDocument({ ...document, nro: e.target.value })} />
                        </Field>
                        <Field label='Administrativo:'>
                            <Input placeholder='Ingrese administrativo' value={document.administrative} onChange={(e) => setDocument({ ...document, administrative: e.target.value })} />
                        </Field>
                    </div>
                    <div className={css({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',gap: '4' })}>
                    <Field label='Tipo de documento:' required>
                        <Input placeholder='Ingrese el tipo de documento' value={document.document_type} onChange={(e) => setDocument({ ...document, document_type: e.target.value })} />
                    </Field>
                    <Field label='N° de documento o factura:' required>
                        <Input placeholder='Ingrese el número de documento o factura' value={document.document_number} onChange={(e) => setDocument({ ...document, document_number: e.target.value })} />
                    </Field>
                    <Field label='Fecha del documento:' required>
                        <DatePicker value={document.document_date} onChange={(date) => setDocument({ ...document, document_date: dayjs(date) })} />
                    </Field>
                    <Field label='Fecha de despacho:' required>
                        <DatePicker value={document.deploy_date} onChange={(date) => setDocument({ ...document, deploy_date: dayjs(date) })} />
                    </Field>
                    </div>
                    <div className={css({ display: 'flex', flexDirection: 'row',alignItems: 'flex-start',justifyContent: 'space-between',gap: '4' })}>
                    <Field label='Remitente:' required>
                        <Input placeholder='Ingrese el remitente' value={document.sender} onChange={(e) => setDocument({ ...document, sender: e.target.value })} />
                    </Field>
                    <Field label='Destinatario:' required>
                        <Input placeholder='Ingrese el destinatario' value={document.receiver} onChange={(e) => setDocument({ ...document, receiver: e.target.value })} />
                    </Field>
                    </div>
                    <Field label='Materia:' required>
                        <Textarea placeholder='Ingrese la materia' value={document.matter} onChange={(e) => setDocument({ ...document, matter: e.target.value })} />
                    </Field>
                    <Field label='Observaciones:'>
                        <Textarea placeholder='Ingrese las observaciones' value={document.observations} onChange={(e) => setDocument({ ...document, observations: e.target.value })} />
                    </Field>
                    <Field label='Anexos' helperText='Archivos permitidos: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png'>
                        <FileUploadRoot maxW='100%' alignItems="stretch" maxFiles={10} maxFileSize={41943040} onFileChange={(file) => { setDocument({ ...document, attachments: file.acceptedFiles }) }}
                            accept={['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']}>
                            <FileUploadDropzone
                                label="Arrastre archivos aquí o haga click para seleccionar"
                                description="hasta 40MB, máximo 10 archivos"
                            />
                            <FileUploadList clearable />
                        </FileUploadRoot>
                    </Field>
                    <DialogActionTrigger asChild>
                        <Button type="submit" onClick={() => { handleSubmit() }}>Crear</Button>
                    </DialogActionTrigger>
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    );
}

export default CreateReceptionModal;