"use client";

import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { List } from "@chakra-ui/react";
import { useState } from "react";
import SortableItem from "./SortableItem";

export default function DragList({ items, department = null, onReorder, onDelete, onActivation }) {
  const [internalItems, setInternalItems] = useState(items);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = internalItems.findIndex((item) => item.id === active.id);
      const newIndex = internalItems.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(internalItems, oldIndex, newIndex);
      setInternalItems(newOrder);
      if (onReorder) onReorder(newOrder); // Notify parent of changes
    }
  };
  const handleDelete = (id) => {
    if (onDelete) onDelete(id); // Notify parent of deletion
    }
  

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={internalItems} strategy={verticalListSortingStrategy}>
        <List.Root spacing={2}>
          {internalItems.map((item) => (
            department == 'OP' && (item.name == 'Recibidos' || item.name == 'Enviados') ?
            <></>
            : 
            <SortableItem 
                key={item.id} 
                id={item.id} 
                content={item.name} 
                onDelete={handleDelete}
                onActivation={onActivation}
                active={item.active}
            />
          ))}
        </List.Root>
      </SortableContext>
    </DndContext>
  );
}
