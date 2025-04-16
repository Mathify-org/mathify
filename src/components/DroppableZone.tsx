
import { useDroppable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

interface DroppableZoneProps {
  id: string;
}

const DroppableZone = ({ id, children }: PropsWithChildren<DroppableZoneProps>) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`${isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} rounded-lg`}
    >
      {children}
    </div>
  );
};

export default DroppableZone;
