import { useState, useEffect, useId, type FC, useRef } from 'react';
import { apiClient } from '../../lib/api';
import type { UploadProgress } from '../../types/upload';

interface FileUploadProps {
    currentUrl?: string;
    onUploadComplete: (url: string) => void;
    accept?: string;
    label?: string;
    className?: string;
    maxSize?: number; // in bytes, default 10MB
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB default

const FileUpload: FC<FileUploadProps> = ({
    currentUrl,
    onUploadComplete,
    accept = 'image/*',
    label = 'Upload File',
    className = '',
    maxSize = MAX_FILE_SIZE,
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState<UploadProgress | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const xhrRef = useRef<XMLHttpRequest | null>(null);
    const inputId = useId();

    // Check authentication status
    useEffect(() => {
        const token = apiClient.getToken();
        setIsAuthenticated(!!token);
    }, []);

    // Abort any in-flight upload if the component unmounts (e.g. the user
    // cancels the dialog this is rendered in) so its completion handler can't
    // fire afterwards and insert/report a URL nobody asked for anymore.
    useEffect(() => {
        return () => {
            xhrRef.current?.abort();
        };
    }, []);

    // Update uploadedUrl when currentUrl prop changes
    useEffect(() => {
        if (currentUrl) {
            setUploadedUrl(currentUrl);
        }
    }, [currentUrl]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check authentication
        const token = apiClient.getToken();
        if (!token) {
            setError('You must be logged in to upload files');
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            setError(
                `File size exceeds maximum allowed size of ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
            );
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setIsUploading(true);
        setError('');
        setProgress({ loaded: 0, total: file.size, percentage: 0 });

        try {
            // Get upload URL from backend (includes file size validation)
            const { uploadUrl, url } = await apiClient.getUploadUrl(
                file.name,
                file.type,
                file.size
            );

            // Upload file to S3 with progress tracking
            const xhr = new XMLHttpRequest();
            xhrRef.current = xhr;

            await new Promise<void>((resolve, reject) => {
                xhr.upload.addEventListener('progress', (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        const percentage = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                        );
                        setProgress({
                            loaded: progressEvent.loaded,
                            total: progressEvent.total,
                            percentage,
                        });
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setUploadedUrl(url);
                        onUploadComplete(url);
                        setProgress(null);
                        resolve();
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload was cancelled'));
                });

                xhr.open('PUT', uploadUrl);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            setProgress(null);
        } finally {
            xhrRef.current = null;
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={className}>
                {label && (
                    <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="p-4 border border-sage/20 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-earth/70 dark:text-gray-400">
                        Please log in to upload files
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <div className="flex items-start gap-4">
                {uploadedUrl && (
                    <div className="relative flex-shrink-0">
                        {accept.startsWith('image/') ? (
                            <img
                                src={uploadedUrl}
                                alt="Preview"
                                className="w-32 h-32 object-contain border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                            />
                        ) : (
                            <div className="w-32 h-32 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-sm text-earth/70 dark:text-gray-400">
                                    File
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        className="hidden"
                        id={inputId}
                    />
                    <label
                        htmlFor={inputId}
                        className={`inline-flex items-center px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg cursor-pointer transition-colors ${
                            isUploading
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-white dark:bg-gray-700 text-earth dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                    >
                        {isUploading ? 'Uploading...' : 'Choose File'}
                    </label>

                    {/* Upload Progress */}
                    {isUploading && progress && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-earth/70 dark:text-gray-400 mb-1">
                                <span>{progress.percentage}%</span>
                                <span>
                                    {(progress.loaded / 1024 / 1024).toFixed(2)} MB /{' '}
                                    {(progress.total / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-accent h-2 rounded-full transition-all duration-300"
                                    style={
                                        { width: `${progress.percentage}%` } as React.CSSProperties
                                    }
                                    role="progressbar"
                                    aria-valuenow={progress.percentage}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`Upload progress: ${progress.percentage}%`}
                                    title={`Upload progress: ${progress.percentage}%`}
                                />
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Uploaded URL Display */}
                    {uploadedUrl && !isUploading && (
                        <div className="mt-2">
                            <label
                                htmlFor={`uploaded-url-${inputId}`}
                                className="text-xs text-earth/70 dark:text-gray-400 mb-1 block"
                            >
                                Uploaded file URL:
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    id={`uploaded-url-${inputId}`}
                                    type="text"
                                    value={uploadedUrl}
                                    readOnly
                                    aria-label="Uploaded file URL"
                                    title="Click to select and copy the uploaded file URL"
                                    placeholder="Uploaded file URL will appear here"
                                    className="flex-1 px-2 py-1 text-xs border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100 font-mono truncate"
                                    onClick={(event) =>
                                        (event.target as HTMLInputElement).select()
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(uploadedUrl);
                                    }}
                                    className="px-2 py-1 text-xs bg-sage text-white rounded hover:bg-sage-dark"
                                    title="Copy URL"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}

                    {/* File Size Limit Info */}
                    <p className="mt-1 text-xs text-earth/50 dark:text-gray-500">
                        Max file size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
