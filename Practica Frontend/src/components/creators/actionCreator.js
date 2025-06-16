import { css } from '../../../styled-system/css';
import { useState, useEffect, act } from 'react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogActionTrigger
} from "@/components/ui/dialog"

import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
  FileUploadDropzone,
} from "@/components/ui/file-upload"

import { Field } from '@/components/ui/field';
import { Input, Button, Textarea } from '@chakra-ui/react'
import { createAction} from '../../app/services/api';
import DatePicker from '../datePicker/datePicker';
import dayjs from 'dayjs';



const CreateActionModal = ({  event, fetch}) => {
    const [action, setAction] = useState({
        title : '',
        description: '',
        responsible: '',
        startDate: dayjs(),
        endDate: dayjs(),
        attachment: []
    });
    const handleSubmit = async () => {
      if (!action.title || !action.responsible || !action.description) {
        alert('Por favor llene todos los campos');
        return;
      }
      console.log(action);
      const newAction = await createAction(
        {
        title: action.title,
        description: action.description,
        responsible: action.responsible,
        registry_date: action.startDate.format('YYYY-MM-DD HH:mm:ss'),
        estimated_date: action.endDate.format('YYYY-MM-DD HH:mm:ss'),
        event_id: event.id,
        attachment: action.attachment
      });
      console.log(newAction);
      fetch();
    };

    

    return (
      <DialogRoot size={"lg"} >
        {event ? <DialogTrigger className={css({padding: '4', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md',whiteSpace: 'nowrap' , _hover: { bg: 'blue.600' } })} >
          {'Crear Acción'}
        </DialogTrigger> : <></>}
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear acción</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Field label='Nombre de la acción:' required>
            <Input placeholder='Ingrese el nombre de la acción' value={action.title} onChange={(e) => setAction({...action, title: e.target.value})}/>
            </Field>
            <Field label="Responsable:" required>
            <Input placeholder='Ingrese el responsable' value={action.responsible} onChange={(e) => setAction({...action, responsible: e.target.value})}/>
            </Field>
            <div className={css({display: 'flex', flexDirection: 'row', justifyContent: 'space-between'})}>
                <div className={css({display: 'flex', flexDirection: 'column'})}>
                <Field>Fecha de inicio:
                <DatePicker
                    value={action.startDate}
                    onChange={(date) => setAction({...action, startDate:dayjs(date)})}
                />
                </Field>
                
                </div>
                <div className={css({display: 'flex', flexDirection: 'column'})}>
                <Field>Fecha de fin:
                <DatePicker
                    value={action.endDate}
                    onChange={(date) => setAction({...action, endDate: dayjs(date)})}
                />
                </Field>
                </div>
            </div>
            <Field label='Descripción:'  required>
                <Textarea size={'xl'} placeholder='Ingrese la descripción' value={action.description} onChange={(e) => setAction({...action, description: e.target.value})}/>
            </Field>
            <Field label='Adjuntos' helperText='Archivos permitidos: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpg, .jpeg, .png' >
              <FileUploadRoot maxW='100%' alignItems="stretch" maxFiles={10} maxFileSize={41943040} onFileChange={(file)=>{setAction({...action, attachment: file.acceptedFiles})}}
                accept= {['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']}>
                <FileUploadDropzone 
                  label="Arrastre archivos aquí o haga click para seleccionar"
                  description="hasta 40MB, máximo 10 archivos"
                />
          
                <FileUploadList clearable />
              </FileUploadRoot>
            </Field>
            
            <DialogActionTrigger asChild>
              <Button type="submit" onClick={()=>{handleSubmit()}}>Crear</Button>
            </DialogActionTrigger>
            
          </DialogBody>
        </DialogContent>
        
      </DialogRoot>
    );
  }

export default CreateActionModal;