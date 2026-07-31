import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useReorderableAdminList } from '../useReorderableAdminList';

interface TestItem {
    id: string;
    slug: string;
    order: number;
    title: string;
}

const ITEMS: TestItem[] = [
    { id: '1', slug: 'one', order: 0, title: 'One' },
    { id: '2', slug: 'two', order: 1, title: 'Two' },
];

describe('useReorderableAdminList', () => {
    let load: Mock<() => Promise<TestItem[]>>;
    let remove: Mock<(slug: string) => Promise<unknown>>;
    let reorder: Mock<(items: { id: string; order: number }[]) => Promise<unknown>>;

    beforeEach(() => {
        load = vi.fn().mockResolvedValue([...ITEMS]);
        remove = vi.fn().mockResolvedValue(undefined);
        reorder = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal(
            'confirm',
            vi.fn(() => true)
        );
        vi.stubGlobal('alert', vi.fn());
    });

    function setup() {
        return renderHook(() =>
            useReorderableAdminList<TestItem>({
                load,
                remove,
                reorder,
                confirmDeleteMessage: 'Delete?',
                deleteErrorMessage: 'Delete failed',
                reorderErrorMessage: 'Reorder failed',
            })
        );
    }

    it('loads items on mount', async () => {
        const { result } = setup();

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.items).toEqual(ITEMS);
        expect(load).toHaveBeenCalledTimes(1);
    });

    it('deletes an item after confirmation and reloads', async () => {
        const { result } = setup();
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        load.mockResolvedValueOnce([ITEMS[1]]);
        await act(async () => {
            await result.current.handleDelete('one');
        });

        expect(remove).toHaveBeenCalledWith('one');
        expect(load).toHaveBeenCalledTimes(2); // initial + reload after delete
    });

    it('does not delete when confirmation is declined', async () => {
        vi.stubGlobal(
            'confirm',
            vi.fn(() => false)
        );
        const { result } = setup();
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await act(async () => {
            await result.current.handleDelete('one');
        });

        expect(remove).not.toHaveBeenCalled();
    });

    it('surfaces an alert when delete fails', async () => {
        remove.mockRejectedValueOnce(new Error('boom'));
        const alertSpy = vi.fn();
        vi.stubGlobal('alert', alertSpy);
        const { result } = setup();
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await act(async () => {
            await result.current.handleDelete('one');
        });

        expect(alertSpy).toHaveBeenCalledWith('Delete failed');
    });
});
