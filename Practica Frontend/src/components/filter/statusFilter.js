import React from 'react'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'
import { createListCollection } from '@chakra-ui/react'
import { useState } from 'react'


const StatusFilter = ({ ref, setFilter }) => {
    const states = createListCollection({
        items: [
            { label: 'Abierto', value: 'abierto' },
            { label: 'Cerrado', value: 'cerrado' },
            { label: 'En proceso', value: 'en proceso' }
        ],
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value
    });
    const [status, setStatus] = useState('');

    return(
        <SelectRoot collection={states} value={status} onValueChange={(e) => {
            setFilter('status', e.value[0]);
            setStatus(e.value)}}>
            <SelectTrigger>
                <SelectValueText placeholder='Estado'/>
            </SelectTrigger>
            <SelectContent portalRef = {ref}>
                {states.items.map((item) => (
                    <SelectItem key={item.value} item={item}>
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}

export default StatusFilter