// app/destination/layout.js
'use client';

import { css } from '../../../styled-system/css';
import { useState, useEffect } from 'react';
import {CircleUser, CircleArrowLeft} from 'lucide-react';


import {getRole, getDepartment, getEmail, updateUserEmail, getUsername} from '../services/api';
import { Field } from '@/components/ui/field';
import { Input, Button, Popover, Portal} from '@chakra-ui/react'
import XlsxButton, { xslxButton } from '@/components/exports/xlsxButton';

export default function DestinationLayout({ children }) {
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    useEffect(() => {
        getRole().then((data) => {
            setRole(data.role);
        });
        getDepartment().then((data) => {
            setDepartment(data.department);
        });
        getEmail().then((data) => {
            setEmail(data.email);
        });
        getUsername().then((data) => {
            setUsername(data.name);
        });
    }, []);
  return (
    <div>
      {/* Top Bar */}
      <div
        className={css({
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'green.500',
            color: 'white',
            padding: '4',
            textAlign: 'center',
            fontSize: 'xl',
            fontWeight: 'bold',
            borderBottom: '1px solid',
        })}
      >
        <button onClick={() => window.history.back()}><CircleArrowLeft/></button>
        Bitácora {department === 'OOPP' ? 'Oficina de partes' : 'Eventos TIC'} - {role}
        <Popover.Root lazymount unmountOnExit 
        onExitComplete={()=>{getEmail().then((data) => {
                setEmail(data.email);
            }
        )}} 
        size="lg">
          <Popover.Trigger>
              <CircleUser size={24} />
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content className={css({
                padding: '4'
                })}>
                <div className={css({display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', gap: '4'})}>
                  <XlsxButton/>
                  <h2 className={css({fontSize: 'lg', fontWeight: 'bold'})}>Información del usuario</h2>
                
                <Field label='Usuario:' orientation='horizontal'>
                  <Input value={username} readOnly />
                </Field>
                <Field label='Rol:' orientation='horizontal'>
                  <Input value={role} readOnly />
                </Field>
                <Field label='Departamento:' orientation='horizontal'>
                  <Input value={department} readOnly /> 
                </Field>
                <Field label='Correo electrónico:' orientation='horizontal'>
                  <Input value={email} readOnly />
                </Field>

                <Field label='Cambiar correo electrónico:'>
                  <Input placeholder='Ingrese el nuevo correo electrónico' onChange={(e) => setEmail(e.target.value)}/>
                </Field>
                </div>
                
                <div className={css({display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '4'})}>
                <Button onClick={() => updateUserEmail(email)}>Actualizar</Button>
                <Button background={'red'} onClick={() => {window.location.href = '/';}}>Cerrar sesión</Button>
                </div>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
        
      </div>

      {/* Page Content */}
      <div className={css()}>{children}</div>
    </div>
  );
}