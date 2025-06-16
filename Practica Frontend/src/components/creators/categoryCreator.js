import { css } from '../../../styled-system/css';
import { useState, useEffect } from 'react';
import {
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
import { createCategory } from '../../app/services/api';


const CreateCategoryModal = ({user, fetch}) => {
    const [category, setCategory] = useState('');

    const handleSubmit = async () => {
        if (!category) {
            alert('Por favor llene todos los campos');
            return;
        }
        const newCategory = await createCategory(
            { 
            name: category,
            created_by: user.id
        });
        if (newCategory) {
          newCategory.error && newCategory.error.includes('Duplicate entry') ? alert('La categoría ya existe') : null; 
          setCategory('');
          fetch();
        }
    };

    return (
      <DialogRoot onExitComplete={() => setCategory('')} >
        <DialogTrigger className={css({padding: '4', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md',whiteSpace: 'nowrap' , _hover: { bg: 'blue.600' } })} >
          {'Crear categoria'}
        </DialogTrigger>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear categoria</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody className={css({ display: 'flex', flexDirection: 'column', padding:'4', alignContent: 'center', gap: '4'})}>
              <Field label='Nombre de la categoría:' required>
                <Input border={'1px solid'} borderColor='gray.300' variant={'Outline'} placeholder='Ingrese el nombre de la categoría' value={category} onChange={(e) => setCategory(e.target.value)}/>
              </Field>
              <Button className={css({padding: '4', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md',whiteSpace: 'nowrap' , _hover: { bg: 'blue.600' } })}
              onClick={()=>{handleSubmit()}}>Crear</Button>
          </DialogBody>
        </DialogContent>
        
      </DialogRoot>
    );
  }

export default CreateCategoryModal;