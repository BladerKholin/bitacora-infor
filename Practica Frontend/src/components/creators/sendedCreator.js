import { css } from '../../../styled-system/css';
import { useState } from 'react';
import dayjs from 'dayjs';


import DatePicker from '../datePicker/datePicker';
import { Field } from '@/components/ui/field';
import { Input, Button, Textarea, HStack, VStack } from '@chakra-ui/react'
import { createSended } from '@/app/services/api';

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




const CreateSendedModal = ({category, fetch }) => {
const [document, setDocument] = useState({
    nro: '',
    document_type: '',
    document_date: dayjs(),
    recipient: '',
    prepared_by: '',
    matter: '',
    deploy_date: dayjs(),
    observations: '',
    administrative: '',
    category_id: category,
    attachments: []
});

const handleSubmit = async () => {
    if (!document.nro || !document.document_type || !document.recipient || !document.prepared_by || !document.matter) {
        alert('Por favor llene todos los campos obligatorios');
        return;
    }
    const newDocument = await createSended({
        nro: document.nro,
        document_type: document.document_type,
        document_date: document.document_date.format('YYYY-MM-DD'),
        recipient: document.recipient,
        prepared_by: document.prepared_by,
        matter: document.matter,
        deploy_date: document.deploy_date.format('YYYY-MM-DD'),
        observations: document.observations,
        administrative: document.administrative,
        category_id: category,
        attachments: document.attachments
    });
    fetch();
};

return (
    <DialogRoot size={"xl"}>
        <DialogTrigger className={css({ padding: '4', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md', whiteSpace: 'nowrap', _hover: { bg: 'blue.600' } })}>
            {'Registrar envio'}
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
                <Field label='Fecha del documento:' required>
                    <DatePicker value={document.document_date} onChange={(date) => setDocument({ ...document, document_date: dayjs(date) })} />
                </Field>
                <Field label='Fecha de despacho:' required>
                    <DatePicker value={document.deploy_date} onChange={(date) => setDocument({ ...document, deploy_date: dayjs(date) })} />
                </Field>
                </div>
                <div className={css({ display: 'flex', flexDirection: 'row',alignItems: 'flex-start',justifyContent: 'space-between',gap: '4' })}>
                <Field label='Destinatario:' required>
                    <Input placeholder='Ingrese el destinatario' value={document.recipient} onChange={(e) => setDocument({ ...document, recipient: e.target.value })} />
                </Field>
                <Field label='Preparado por:' required>
                    <Input placeholder='Ingrese el nombre del preparador' value={document.prepared_by} onChange={(e) => setDocument({ ...document, prepared_by: e.target.value })} />
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

export default CreateSendedModal;