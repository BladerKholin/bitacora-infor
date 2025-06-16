import { css } from '../../../styled-system/css';
import { useState, useEffect } from 'react';
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
import { Field } from '@/components/ui/field';
import { Input, Button } from '@chakra-ui/react'
import { createEvent } from '../../app/services/api';
import DatePicker from '../datePicker/datePicker';
import dayjs from 'dayjs';



const CreateEventModal = ({user, category, fetch}) => {
    const [event, setEvent] = useState({
        title : '',
        responsible: '',
        startDate: dayjs(),
        endDate: dayjs()
    });
    const handleSubmit = async () => {
        if (!event.title || !event.responsible) {
            alert('Por favor llene todos los campos');
            return;
        }
        const newEvent = await createEvent(
            {
            title: event.title,
            responsible: event.responsible,
            start_date: event.startDate.format('YYYY-MM-DD HH:mm:ss'),
            end_date: event.endDate.format('YYYY-MM-DD HH:mm:ss'),
            category_id: category.id,
            status: 'abierto'
        });
        console.log(newEvent);
        fetch();
    };
    return (
      <DialogRoot size={"lg"} onExitComplete={() => setEvent({title: '', responsible: '', startDate: dayjs(), endDate: dayjs()})}>
        {category ? <DialogTrigger className={css({padding: '4', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md',whiteSpace: 'nowrap' , _hover: { bg: 'blue.600' } })} >
          {'Crear Evento'}
        </DialogTrigger> : <></>}
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear evento</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Field label='Nombre del evento:' required>
            <Input placeholder='Ingrese el nombre del evento' value={event.title} onChange={(e) => setEvent({...event, title: e.target.value})}/>
            </Field>
            <Field label='Responsable:' required>
            <Input placeholder='Ingrese el responsable' value={event.responsible} onChange={(e) => setEvent({...event, responsible: e.target.value})}/>
            </Field>
            <div className={css({display: 'flex', flexDirection: 'row', justifyContent: 'space-between'})}>
                <div className={css({display: 'flex', flexDirection: 'column'})}>
                <Field>Fecha de inicio:</Field>
                <DatePicker
                    value={event.startDate}
                    onChange={(date) => setEvent({...event, startDate:dayjs(date)})}
                />
                
                </div>
                <div className={css({display: 'flex', flexDirection: 'column'})}>
                <Field>Fecha de fin:</Field>
                <DatePicker
                    value={event.endDate}
                    onChange={(date) => setEvent({...event, endDate: dayjs(date)})}
                />
                </div>
            </div>
            <DialogActionTrigger asChild>
                <Button type="submit" onClick={()=>{handleSubmit()}}>Crear</Button>
            </DialogActionTrigger>
          </DialogBody>
        </DialogContent>
        
      </DialogRoot>
    );
  }

export default CreateEventModal;