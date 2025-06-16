import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

  import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
  } from "@/components/ui/accordion"

import { Button } from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'


import UserFilter from "./userFilter"
import StatusFilter from "./statusFilter"
import DateFilter from "./dateFilter"

import { getEventsFiltered, getEventsByCategory, getRole, getEventsByUser } from "@/app/services/api"
import { useAppContext } from "@/app/context/AppContext"


const FilterDrawer = ({category, setEvents}) => {
    const drawerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [accordionValue, setAccordionValue] = useState('');
    const [user, setUser] = useState({});
    useEffect(() => {
        getRole().then((data) => {
            setUser(data);
        });
    }, []);
    const baseFilters = user.role === 'Admin' ? [
        {label: 'Fecha de inicio', value: 'startDate'},
        {label: 'Fecha de fin', value: 'endDate'},
        {label: 'Estado', value: 'status'},
        {label: 'Usuario', value: 'user'}
    ] : [
        {label: 'Fecha de inicio', value: 'startDate'},
        {label: 'Fecha de fin', value: 'endDate'},
        {label: 'Estado', value: 'status'},
    ]
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: '',
        user: user.role ==='Admin' ? '' : null
    });
    const handleIncomingFilter = (filter, value) => {
        console.log(filter, value);
        setFilters({...filters, [filter]: value});
    }

    return (
        <DrawerRoot size={'sm'} open={open} onOpenChange={(e)=>setOpen(e.open) }>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
                <Button variant='outline'>
                    Filtrar
                </Button>
            </DrawerTrigger>
            <DrawerContent ref={drawerRef}>
                <DrawerHeader>
                    <DrawerTitle>
                        Filtrar eventos
                    </DrawerTitle>
                    <DrawerCloseTrigger />
                </DrawerHeader>
                <DrawerBody>
                    
                    <AccordionRoot value={accordionValue} onValueChange={(e) => setAccordionValue(e.value)} collapsible >
                        {baseFilters.map((f, index) => (
                            <AccordionItem key={index} value={f.value}>
                                <AccordionItemTrigger>
                                    {f.label}
                                </AccordionItemTrigger>
                                <AccordionItemContent>
                                    { (()=> {
                                       
                                        switch(f.value) {
                                        case 'startDate':
                                            return <DateFilter ref={drawerRef} setFilter={handleIncomingFilter} mode={'startDate'} />
                                        case 'endDate':
                                            return <DateFilter ref={drawerRef} setFilter={handleIncomingFilter} mode={'endDate'} />
                                        case 'status':
                                            return <StatusFilter ref={drawerRef} setFilter={handleIncomingFilter}/>
                                        
                                        case 'user':
                                            return <UserFilter ref={drawerRef} setFilter={handleIncomingFilter}/>
                                    }})()}
                                </AccordionItemContent>
                            </AccordionItem>
                        ))}
                    </AccordionRoot>
                    <DrawerFooter>
                        <Button onClick={() => {
                            console.log(filters);
                            getEventsFiltered(category,filters).then((data) => {
                                setEvents(data);
                            } )
                        }}>
                            Aplicar filtros
                        </Button>
                        <Button onClick={() => {
                            setFilters({
                                startDate: '',
                                endDate: '',
                                status: '',
                                user: user.role ==='Admin' ? '' : user.id
                            })
                            user.role === 'Admin' ?
                            getEventsByCategory(category).then((data) => {
                                setEvents(data);
                            } )
                            :
                            getEventsByUser(user.id, category).then((data) => {
                                setEvents(data);
                            } )
                        }
                        }>
                            Limpiar filtros
                        </Button>
                    </DrawerFooter>
                </DrawerBody>
            </DrawerContent>

        </DrawerRoot>
    )
}




export default FilterDrawer