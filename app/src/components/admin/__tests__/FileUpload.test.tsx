import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from '../FileUpload';
import { apiClient } from '../../../lib/api';

// A controllable fake XHR so the test can decide exactly when the upload
// "completes" -- this is what lets us assert the uploading state doesn't
// reset until settlement, and that a failure surfaces a visible error.
class FakeXHR {
    static instances: FakeXHR[] = [];
    upload = { addEventListener: vi.fn() };
    listeners: Record<string, () => void> = {};
    status = 200;

    addEventListener(event: string, handler: () => void) {
        this.listeners[event] = handler;
    }
    open() {}
    setRequestHeader() {}
    send() {
        FakeXHR.instances.push(this);
    }
    fireLoad(status: number) {
        this.status = status;
        this.listeners.load?.();
    }
    fireError() {
        this.listeners.error?.();
    }
}

describe('FileUpload', () => {
    beforeEach(() => {
        FakeXHR.instances = [];
        vi.stubGlobal('XMLHttpRequest', FakeXHR as unknown as typeof XMLHttpRequest);
        vi.spyOn(apiClient, 'getToken').mockReturnValue('fake-token');
        vi.spyOn(apiClient, 'getUploadUrl').mockResolvedValue({
            uploadUrl: 'https://s3.example.com/upload',
            url: 'https://cdn.example.com/file.png',
            key: 'uploads/file.png',
            expiresIn: 900,
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    function selectFile() {
        const file = new File(['contents'], 'photo.png', { type: 'image/png' });
        const input = screen.getByLabelText(/choose file/i, {
            selector: 'input',
        }) as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });
    }

    it('keeps the uploading state until the XHR settles, not immediately after firing', async () => {
        const onUploadComplete = vi.fn();
        render(<FileUpload onUploadComplete={onUploadComplete} />);

        selectFile();

        await waitFor(() => expect(FakeXHR.instances).toHaveLength(1));
        // The upload has been fired but not yet completed -- button must still read "Uploading...".
        expect(await screen.findByText('Uploading...')).toBeInTheDocument();

        FakeXHR.instances[0].fireLoad(200);

        await waitFor(() =>
            expect(onUploadComplete).toHaveBeenCalledWith('https://cdn.example.com/file.png')
        );
        expect(screen.queryByText('Uploading...')).not.toBeInTheDocument();
    });

    it('surfaces a visible error when the upload fails (regression: was previously silent)', async () => {
        const onUploadComplete = vi.fn();
        render(<FileUpload onUploadComplete={onUploadComplete} />);

        selectFile();

        await waitFor(() => expect(FakeXHR.instances).toHaveLength(1));
        FakeXHR.instances[0].fireError();

        expect(await screen.findByText('Network error during upload')).toBeInTheDocument();
        expect(onUploadComplete).not.toHaveBeenCalled();
        expect(screen.queryByText('Uploading...')).not.toBeInTheDocument();
    });

    it('surfaces a visible error on a non-2xx response', async () => {
        render(<FileUpload onUploadComplete={vi.fn()} />);

        selectFile();

        await waitFor(() => expect(FakeXHR.instances).toHaveLength(1));
        FakeXHR.instances[0].fireLoad(500);

        expect(await screen.findByText(/upload failed with status 500/i)).toBeInTheDocument();
    });
});
