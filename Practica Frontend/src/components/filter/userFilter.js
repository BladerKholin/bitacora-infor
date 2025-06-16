import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "@/components/ui/select"

import { getUsers } from "@/app/services/api"
import { useState, useEffect, useMemo } from "react"
import {useAsync} from "react-use"
import { createListCollection, Button } from "@chakra-ui/react";

const UserFilter = ({ref, setFilter}) => {
    const state = useAsync(getUsers);
   
    const users = useMemo(() => {
        return createListCollection({
            items: state.value || [],
            itemToString: (item) => item.name,
            itemToValue: (item) => item.id,
        });
    }, [state.value]);

    const [selectedUser, setSelectedUser] = useState('');

    return (
        <>
        {users && (
        <SelectRoot collection={users} value={selectedUser} onValueChange={(e) => {
            setSelectedUser(e.value);
            setFilter('user', e.value[0]);
        }}>
            <SelectTrigger >
                <SelectValueText placeholder='Seleccione un usuario' />
            </SelectTrigger>
            <SelectContent portalRef={ref}>
                {users.items.map((user) => (
                    <SelectItem key={user.id} item={user}>
                        {user.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )}
    </>
    )
}

export default UserFilter