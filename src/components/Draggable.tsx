
import { useDraggable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

interface DraggableProps {
  id: string;
}

const Draggable = ({ id, children }: PropsWithChildren<DraggableProps>) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.8 : 1,
      }
    : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="touch-none"
    >
      {children}
    </div>
  );
};

export default Draggable;
