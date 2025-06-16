'use client'

import { useEffect, useState } from 'react';
import { css } from "../../../styled-system/css";
import { Button, Input, HStack } from "@chakra-ui/react";
import { InputGroup } from '@/components/ui/input-group';
import { Search } from 'lucide-react';
import { getEventsByCategory, getEventsByUser } from '../../app/services/api';
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from '@/components/ui/pagination';
import  CreateEventModal  from '@/components/creators/eventCreator';
import  FilterDrawer  from '@/components/filter/filterDrawer';

const pageSize = 7;



const TIC = ({selectedCategory, user, router}) => {
    const [searchText, setSearchText] = useState('');
    const [events, setEvents] = useState([]);
    const [count, setCount] = useState(0);
    const [baseEvents, setBaseEvents] = useState([]);
    const [page, setPage] = useState(1);



    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize
    const visibleEvents = events.slice(startRange, endRange)
    
    
    const fetchEvents = async (category) => {
        const events = user.role === 'Admin' ? await getEventsByCategory(category.id) : await getEventsByUser(category.id);
        setEvents(events);
        setBaseEvents(events);
        setCount(events.length);
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchEvents(selectedCategory);
        }
    }
    , [selectedCategory]);

    const handleSearch = (text) => {
        setSearchText(text);
        const filteredEvents = baseEvents.filter((event) => event.title.toLowerCase().includes(text.toLowerCase()));
        setEvents(filteredEvents);
    };



    return (
        <>
                <h1 className={css({ color: 'black', fontSize: 'lg', fontWeight:'bold', padding: '4', paddingBottom: 0 })}>
                  {selectedCategory ? `Eventos en ${selectedCategory.name}` : 'Seleccione una categoría'}
                </h1>
        
                <div className={css({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '4'})}>
                  <InputGroup startElement={<Search/>}>
                    <Input placeholder='Buscar' value={searchText} onChange={(e) => handleSearch(e.target.value)}></Input>
                  </InputGroup>
                  {selectedCategory &&
                  <FilterDrawer category={selectedCategory.id} setEvents={setEvents}/>
                  }
        
                </div>
                <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', height:'65.1%', padding: '4'})}>
                {visibleEvents && visibleEvents.map((event) => (
                  <div className={css({display: 'flex', flexDirection: 'row'})} key={event.id}>
                    <p className={css({paddingEnd: 4, width:'10%'})}>{`[${event.status}]`}</p>
                    <Button
                      key={event.id}
                      className={css({
                        padding: '10px 20px',
                        fontSize: '16px',
                        bg: 'green.500',
                        color: 'white',
                        borderRadius: 'md',
                        gap: '4',
                        _hover: { bg: 'green.600' },
                        width: '90%',
                      })}
                      onClick={() => {
                        sessionStorage.setItem('eventId', event.id)
                        console.log(event.id)
                        router.push('/binnacle/events');
                      }
                      }
                    >
                      {event.title}
                    </Button> 
                  </div>
                ))}
                
                </div>
                <PaginationRoot
                  page={page}
                  onPageChange={(e) => setPage(e.page)}
                  count={count}
                  pageSize={pageSize}
                >
                  <HStack className={css({justifyContent: 'center'})}>
                    <PaginationPrevTrigger />
                    <PaginationItems />
                    <PaginationNextTrigger />
                  </HStack>
                </PaginationRoot>
                <div className={css({borderTop: '1px solid', padding: '4', textAlign: 'center'})}>
                  <CreateEventModal user={user} category={selectedCategory} fetch={()=> fetchEvents(selectedCategory)}/>
                </div>
        </>
    )
}

export default TIC;