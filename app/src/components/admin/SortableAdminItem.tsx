import type { FC, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableAdminItemProps {
    id: string;
    onEdit: () => void;
    onDelete: () => void;
    children: ReactNode;
}

const SortableAdminItem: FC<SortableAdminItemProps> = ({ id, onEdit, onDelete, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-sage/20 dark:border-gray-700 ${
                isDragging ? 'shadow-lg' : ''
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                    <div
                        {...attributes}
                        {...listeners}
                        role="button"
                        tabIndex={0}
                        aria-label="Reorder"
                        className="cursor-grab text-earth/50 dark:text-gray-500"
                    >
                        ☰
                    </div>
                    <div className="flex-1">{children}</div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SortableAdminItem;
