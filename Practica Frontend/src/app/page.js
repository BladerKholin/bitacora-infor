// app/page.js\
'use client';


import { css } from '../../styled-system/css';
import { useColorMode } from '@/components/ui/color-mode';
import { useAppContext } from './context/AppContext';
import { useRouter } from 'next/navigation';
import { Field } from '@/components/ui/field';
import { Input, Button } from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input';
import { useState } from 'react';
import {login } from './services/api';



export default function Home() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [visiblePass, setVisiblePass] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();
  colorMode === 'dark' ? toggleColorMode() : null;
  const router = useRouter();

  const handleLogin = async () => {
    const response = await login({username: user, password: password});
    console.log(response);
    if (response.status !== 200) {
      alert('Usuario o contraseña incorrectos');
      return;
    }
    router.push('/binnacle');
  }

  return (
    <div className={css({ backgroundColor: 'white',display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', padding: '20px', height: '100vh'
     })}>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: '4' })}>
        Bienvenido a Bitácora Eventos TIC
      </h1>
      <div className={css({ display: 'flex', gap: '3' })}>
        <Field label='Usuario:'>
          <Input placeholder='Ingrese su usuario' value={user} onChange={(e) => setUser(e.target.value)}/>
        </Field>
        <Field label='Contraseña:'>
          <PasswordInput placeholder='Ingrese su contraseña' value={password} onChange={(e) => setPassword(e.target.value)} visible={visiblePass} onVisibleChange={setVisiblePass}/>
        </Field>
      </div>
      <Button className={css({padding: '4', fontSize: '16px', bg: 'black', color: 'white', borderRadius: 'md',whiteSpace: 'nowrap' , _hover: { bg: 'blue.600' } })} onClick={handleLogin}>Iniciar sesion</Button>
    </div>
  );
}