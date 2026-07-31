import { useState, useEffect, useCallback } from 'react';
import {
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

interface ReorderableItem {
    id: string;
    slug: string;
    order?: number;
}

interface UseReorderableAdminListOptions<T extends ReorderableItem> {
    load: () => Promise<T[]>;
    remove: (slug: string) => Promise<unknown>;
    reorder: (items: { id: string; order: number }[]) => Promise<unknown>;
    confirmDeleteMessage: string;
    deleteErrorMessage: string;
    reorderErrorMessage: string;
}

export function useReorderableAdminList<T extends ReorderableItem>({
    load,
    remove,
    reorder,
    confirmDeleteMessage,
    deleteErrorMessage,
    reorderErrorMessage,
}: UseReorderableAdminListOptions<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const reload = useCallback(async () => {
        try {
            setItems(await load());
        } catch (error) {
            console.error('Failed to load items:', error);
        } finally {
            setIsLoading(false);
        }
    }, [load]);

    useEffect(() => {
        reload();
    }, [reload]);

    const handleDelete = async (slug: string) => {
        if (!confirm(confirmDeleteMessage)) return;

        try {
            await remove(slug);
            await reload();
        } catch {
            alert(deleteErrorMessage);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
            ...item,
            order: index,
        }));

        try {
            await reorder(newItems.map((item, index) => ({ id: item.id, order: index })));
            setItems(newItems);
        } catch {
            alert(reorderErrorMessage);
            reload();
        }
    };

    return { items, isLoading, reload, handleDelete, sensors, handleDragEnd };
}
