"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListItem, Text, IconButton, HStack } from "@chakra-ui/react";
import { PenOff, Pen } from "lucide-react";
import { useState } from "react";


export default function SortableItem({ id, content, onDelete, onActivation, active }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [status, setStatus] = useState(active);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Handle deletion click by calling the parent's onDelete callback
  const handleDelete = (e) => {
    e.stopPropagation();
    console.log('Deleting item', id);
    if (onDelete) onDelete(id);
    setStatus(false);
  };

  return (
    <HStack
    justifyContent="space-between"
      p={3}
      bg="gray.100"
      borderRadius="md"
      shadow="sm"
      cursor="grab">
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      w={"100%"}
    >
        <Text>{content}</Text>
        
    </ListItem>
    {status ?
        <IconButton 
            aria-label="Delete item" 
            size="sm" 
            onClick={handleDelete} 
            variant="ghost"
            >
                <PenOff />
        </IconButton>
        :
        <IconButton
            aria-label="Edit item"
            size="sm"
            variant="ghost"
            onClick={()=> {
              onActivation(id)
              setStatus(true)
            }
            }
            >
                <Pen />
        </IconButton>}
    </HStack>
  );
}
