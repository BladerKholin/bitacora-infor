// app/destination/page.js
'use client'; // Mark this as a Client Component to use hooks like useSearchParams

import { css } from '../../../styled-system/css';
import { useState, useEffect } from 'react';


import {Button, Switch} from '@chakra-ui/react'
import CreateCategoryModal from '@/components/creators/categoryCreator';
import { 
  getCategories, 
  getActiveCategories, 
  getRole, 
  reorderCategories, 
  deleteCategory,
  activateCategory, 
  getDepartment} from '../services/api';
import { useAppContext } from '../context/AppContext';
import  DragList from '@/components/draglist/DragList';

import { useRouter } from 'next/navigation';

import EventCalendar from '@/components/eventCalendar/eventCalendar';

import TIC from '@/components/departments/TIC';
import OFP from '@/components/departments/oficinaPartes';

const pageSize = 7;

export default function DestinationPage() {
  const [categories,setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState({});
  const [reorder, setReorder] = useState(false);
  const router = useRouter();
  const [department, setDepartment] = useState('');

  

  const onReorder = async (newOrder) => {
    await reorderCategories(newOrder);
    setCategories(newOrder);
  };

  const onDelete = async (categoryid) => {
    await deleteCategory(categoryid);
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
  };

  const onActivation = async (categoryid) => {
    await activateCategory(categoryid);
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
  }


  useEffect(() => {
    let role = '';
    getRole().then((data) => {
      role = data.role;
      setUser(data);
      if (role =='Admin') {
        getCategories().then((data) => {
          setCategories(data);
        });
      } else {
        getActiveCategories().then((data) => {
          setCategories(data);
        });
      }
    });
    getDepartment().then((data) => {
      setDepartment(data.department);
    });
    
    
  }, []);


  const fetchCategories = async () => {
    const categories = await getCategories();
    setCategories(categories);
  };


  return (
    <div className={css({backgroundColor: 'white', display: 'flex', flexDirection: 'row' })}>
      <div className={css({ display: 'flex', flexDirection: 'column', borderRight: '1px solid', height: '92vh', width: '15%' })}>
      
      {user.role == 'Admin' &&
        <Switch.Root
          checked={reorder}
          onCheckedChange={(e) => setReorder(e.checked)}
          className={css({ paddingTop: '4', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' })}
          >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>Reordenar</Switch.Label>
        </Switch.Root>}

      <h1 className={css({ color: 'black', fontSize: 'lg', fontWeight:'bold', padding: '4', paddingBottom: 0, whiteSpace: 'nowrap'})}>Categorias:</h1>
      
      <div className={css({ display: 'flex', flexDirection: 'column',height: '75%', gap: '4', padding: '4', overflowY: 'auto' })}>
      
      {!reorder ? categories.map((category) => (
        
          <Button
            key={category.name}
            className={css({
              padding: '4',
              fontSize: '16px',
              bg: category.active ? 'blue.500' : 'gray.500',
              color: 'white',
              borderRadius: 'md',
              gap: '4',
              overflow: 'hidden',
              width: '100%',
              textOverflow: 'ellipsis',
              _hover: { bg: 'blue.600' },
            })}
            onClick={() => {
              setSelectedCategory(category)
            }}
          >
            {category.name}
          </Button>
        
      )): <DragList items={categories} department={department}  onReorder={onReorder} onDelete={onDelete} onActivation={onActivation} />}
      </div>
        {user.role =='Admin' && 
        <div className={css({borderTop: '1px solid', padding: '4', justifyContent: 'space-between', display: 'flex', flexDirection: 'column'})}> 
          {!reorder ? <CreateCategoryModal user={user} fetch={fetchCategories}/> : <></>}
        </div>}
      </div>
      <div className={css({ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent:'space-between', width: '100%', height: '87vh' })}>

      <EventCalendar/>
      {user && department == 'TIC' && selectedCategory &&
      <TIC selectedCategory={selectedCategory} user={user} router={router}/>
      }
      {user && department == 'OOPP' && selectedCategory &&
      <OFP selectedCategory={selectedCategory} user={user} router={router}/>
      }
      </div>
    </div>
  );
}