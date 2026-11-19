import { useState, useEffect, useCallback, useRef } from 'react';
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
    // Kept in sync with `items` but updated synchronously (unlike state) so
    // a second drag started before the first's setItems/re-render has
    // committed still computes from the first drag's result instead of the
    // stale pre-drag order.
    const itemsRef = useRef<T[]>(items);
    // Chains reorder() calls so their network responses can't land out of
    // order and overwrite a more recent drag's result with a stale one.
    const pendingReorderRef = useRef<Promise<unknown>>(Promise.resolve());

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

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

        const currentItems = itemsRef.current;
        const oldIndex = currentItems.findIndex((item) => item.id === active.id);
        const newIndex = currentItems.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(currentItems, oldIndex, newIndex).map((item, index) => ({
            ...item,
            order: index,
        }));

        // Apply optimistically and update the ref synchronously, before the
        // network call, so an overlapping second drag reads this result
        // instead of the pre-drag order.
        itemsRef.current = newItems;
        setItems(newItems);

        const reorderCall = pendingReorderRef.current.then(() =>
            reorder(newItems.map((item, index) => ({ id: item.id, order: index })))
        );
        pendingReorderRef.current = reorderCall.catch(() => undefined);

        try {
            await reorderCall;
        } catch {
            alert(reorderErrorMessage);
            reload();
        }
    };

    return { items, isLoading, reload, handleDelete, sensors, handleDragEnd };
}
