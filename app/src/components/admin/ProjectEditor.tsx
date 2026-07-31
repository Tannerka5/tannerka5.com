import { useState, useEffect, type FC } from 'react';
import { apiClient } from '../../lib/api';
import type { Project, ProjectDetails, Challenge } from '../../types/project';
import { slugify } from '../../lib/slug-utils';
import FileUpload from './FileUpload';
import GradientPicker from './GradientPicker';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type SensorDescriptor,
    type SensorOptions,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectEditorProps {
    project?: Partial<Project> | null;
    onSave: () => void;
    onCancel: () => void;
}

const EMPTY_DETAILED: ProjectDetails = {
    overview: '',
    problem: '',
    solution: '',
    challenges: [],
    learnings: [],
    features: [],
    media: [],
    metrics: [],
};

const ProjectEditor: FC<ProjectEditorProps> = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        role: '',
        timeline: '',
        techStack: [],
        gradientFrom: 'from-pink-100 dark:from-pink-900/40',
        gradientVia: 'via-pink-200 dark:via-purple-900/40',
        gradientTo: 'to-purple-100 dark:to-purple-900/40',
        logo: '',
        icon: '',
        links: { live: '', github: '', demo: '' },
        detailed: { ...EMPTY_DETAILED },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (project) {
            setFormData({
                ...project,
                gradientFrom: project.gradientFrom || 'from-pink-100 dark:from-pink-900/40',
                gradientVia: project.gradientVia || 'via-pink-200 dark:via-purple-900/40',
                gradientTo: project.gradientTo || 'to-purple-100 dark:to-purple-900/40',
                detailed: {
                    ...EMPTY_DETAILED,
                    ...project.detailed,
                },
            });
        }
    }, [project]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (project?.slug) {
                await apiClient.updateProject(project.slug, formData);
            } else {
                await apiClient.createProject(formData);
            }
            onSave();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save project');
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: string, value: unknown) => {
        setFormData((prev) => {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...(prev[parent as keyof typeof prev] as object),
                        [child]: value,
                    },
                };
            }
            return { ...prev, [field]: value };
        });
    };

    const updateDetailedField = (field: string, value: unknown) => {
        setFormData((prev) => ({
            ...prev,
            detailed: {
                ...EMPTY_DETAILED,
                ...prev.detailed,
                [field]: value,
            },
        }));
    };

    const addArrayItem = (field: string, initialValue: unknown = '') => {
        setFormData((prev) => {
            const current = (prev[field as keyof typeof prev] as unknown[]) || [];
            return { ...prev, [field]: [...current, initialValue] };
        });
    };

    const updateArrayItem = (field: string, index: number, value: unknown) => {
        setFormData((prev) => {
            const current = [...((prev[field as keyof typeof prev] as unknown[]) || [])];
            current[index] = value;
            return { ...prev, [field]: current };
        });
    };

    const removeArrayItem = (field: string, index: number) => {
        setFormData((prev) => {
            const current = [...((prev[field as keyof typeof prev] as unknown[]) || [])];
            current.splice(index, 1);
            return { ...prev, [field]: current };
        });
    };

    // Mirrors addArrayItem/updateArrayItem/removeArrayItem above, but for
    // array fields nested under `detailed` (challenges/media/metrics), so
    // those sections don't each hand-roll their own splice-by-index logic.
    const addDetailedArrayItem = (field: keyof ProjectDetails, initialValue: unknown) => {
        const current = (formData.detailed?.[field] as unknown[]) || [];
        updateDetailedField(field, [...current, initialValue]);
    };

    const updateDetailedArrayItem = (field: keyof ProjectDetails, index: number, value: unknown) => {
        const current = [...((formData.detailed?.[field] as unknown[]) || [])];
        current[index] = value;
        updateDetailedField(field, current);
    };

    const removeDetailedArrayItem = (field: keyof ProjectDetails, index: number) => {
        const current = [...((formData.detailed?.[field] as unknown[]) || [])];
        current.splice(index, 1);
        updateDetailedField(field, current);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-earth dark:text-gray-100">
                    {project ? 'Edit Project' : 'New Project'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-earth/70 dark:text-gray-400 hover:text-earth dark:hover:text-gray-100"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(event) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    title: event.target.value,
                                    slug: prev.slug || slugify(event.target.value),
                                }));
                            }}
                            required
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Slug *
                        </label>
                        <input
                            type="text"
                            value={formData.slug || ''}
                            onChange={(event) => updateField('slug', event.target.value)}
                            required
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                        Short Description *
                    </label>
                    <textarea
                        value={formData.shortDescription || ''}
                        onChange={(event) => updateField('shortDescription', event.target.value)}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                        Full Description *
                    </label>
                    <textarea
                        value={formData.fullDescription || ''}
                        onChange={(event) => updateField('fullDescription', event.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            value={formData.role || ''}
                            onChange={(event) => updateField('role', event.target.value)}
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Timeline
                        </label>
                        <input
                            type="text"
                            value={formData.timeline || ''}
                            onChange={(event) => updateField('timeline', event.target.value)}
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>
                </div>

                {/* Logo Upload */}
                <FileUpload
                    currentUrl={formData.logo}
                    onUploadComplete={(url) => updateField('logo', url)}
                    accept="image/*"
                    label="Project Logo"
                />

                {/* Gradient Picker */}
                <GradientPicker
                    gradient={{
                        from: formData.gradientFrom || '',
                        via: formData.gradientVia || '',
                        to: formData.gradientTo || '',
                    }}
                    onGradientChange={(from, via, to) => {
                        updateField('gradientFrom', from);
                        updateField('gradientVia', via);
                        updateField('gradientTo', to);
                    }}
                />

                {/* Tech Stack */}
                <div>
                    <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                        Tech Stack
                    </label>
                    {(formData.techStack || []).map((tech, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tech}
                                onChange={(event) =>
                                    updateArrayItem('techStack', index, event.target.value)
                                }
                                className="flex-1 px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('techStack', index)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('techStack')}
                        className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark"
                    >
                        + Add Tech
                    </button>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Live URL
                        </label>
                        <input
                            type="url"
                            value={formData.links?.live || ''}
                            onChange={(event) =>
                                updateField('links', { ...formData.links, live: event.target.value })
                            }
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            value={formData.links?.github || ''}
                            onChange={(event) =>
                                updateField('links', { ...formData.links, github: event.target.value })
                            }
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Demo URL
                        </label>
                        <input
                            type="url"
                            value={formData.links?.demo || ''}
                            onChange={(event) =>
                                updateField('links', { ...formData.links, demo: event.target.value })
                            }
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>
                </div>

                {/* Detailed Section */}
                <div className="border-t border-sage/20 dark:border-gray-700 pt-6 space-y-6">
                    <h3 className="text-lg font-semibold text-earth dark:text-gray-100">
                        Detailed Information
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Overview
                        </label>
                        <textarea
                            value={formData.detailed?.overview || ''}
                            onChange={(event) => updateDetailedField('overview', event.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Problem
                        </label>
                        <textarea
                            value={formData.detailed?.problem || ''}
                            onChange={(event) => updateDetailedField('problem', event.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                            Solution
                        </label>
                        <textarea
                            value={formData.detailed?.solution || ''}
                            onChange={(event) => updateDetailedField('solution', event.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    {/* Challenges */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-earth dark:text-gray-300">
                                Challenges
                            </label>
                            <button
                                type="button"
                                onClick={() =>
                                    addDetailedArrayItem('challenges', {
                                        title: '',
                                        description: '',
                                        solution: '',
                                    })
                                }
                                className="px-3 py-1 text-sm bg-sage text-white rounded hover:bg-sage-dark"
                            >
                                + Add Challenge
                            </button>
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => {
                                const items = formData.detailed?.challenges || [];
                                const oldIndex = items.findIndex(
                                    (_, itemIndex) => `challenge-${itemIndex}` === event.active.id
                                );
                                const newIndex = items.findIndex(
                                    (_, itemIndex) => `challenge-${itemIndex}` === event.over?.id
                                );
                                if (oldIndex !== -1 && newIndex !== -1) {
                                    const newItems = arrayMove(items, oldIndex, newIndex);
                                    updateDetailedField('challenges', newItems);
                                }
                            }}
                        >
                            <SortableContext
                                items={(formData.detailed?.challenges || []).map(
                                    (_, index) => `challenge-${index}`
                                )}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {(formData.detailed?.challenges || []).map(
                                        (challenge, index) => (
                                            <SortableChallengeItem
                                                key={index}
                                                id={`challenge-${index}`}
                                                item={{
                                                    challenge,
                                                    onUpdate: (updated) =>
                                                        updateDetailedArrayItem(
                                                            'challenges',
                                                            index,
                                                            updated
                                                        ),
                                                    onRemove: () =>
                                                        removeDetailedArrayItem('challenges', index),
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Learnings */}
                    <SortableListSection
                        title="Learnings"
                        sensors={sensors}
                        field={{
                            items: formData.detailed?.learnings || [],
                            fieldPrefix: 'learning',
                            onItemsChange: (items) => updateDetailedField('learnings', items),
                            renderItem: (item, _index, onUpdate) => (
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(event) => onUpdate(event.target.value)}
                                    className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                                />
                            ),
                            onAdd: () => addDetailedArrayItem('learnings', ''),
                        }}
                    />

                    {/* Features */}
                    <SortableListSection
                        title="Features"
                        sensors={sensors}
                        field={{
                            items: formData.detailed?.features || [],
                            fieldPrefix: 'feature',
                            onItemsChange: (items) => updateDetailedField('features', items),
                            renderItem: (item, _index, onUpdate) => (
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(event) => onUpdate(event.target.value)}
                                    className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                                />
                            ),
                            onAdd: () => addDetailedArrayItem('features', ''),
                        }}
                    />

                    {/* Media */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-earth dark:text-gray-300">
                                Media
                            </label>
                            <button
                                type="button"
                                onClick={() =>
                                    addDetailedArrayItem('media', {
                                        type: 'image',
                                        url: '',
                                        caption: '',
                                    })
                                }
                                className="px-3 py-1 text-sm bg-sage text-white rounded hover:bg-sage-dark"
                            >
                                + Add Media
                            </button>
                        </div>
                        <div className="space-y-4">
                            {(formData.detailed?.media || []).map((mediaItem, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-sage/20 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs text-earth/70 dark:text-gray-400 mb-1">
                                                Type
                                            </label>
                                            <select
                                                value={mediaItem.type || 'image'}
                                                onChange={(event) =>
                                                    updateDetailedArrayItem('media', index, {
                                                        ...mediaItem,
                                                        type: event.target.value as
                                                            | 'image'
                                                            | 'video'
                                                            | 'embed',
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                                            >
                                                <option value="image">Image</option>
                                                <option value="video">Video</option>
                                                <option value="embed">Embed</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs text-earth/70 dark:text-gray-400 mb-1">
                                                {mediaItem.type === 'image' ||
                                                mediaItem.type === 'video'
                                                    ? 'Upload File'
                                                    : 'URL'}
                                            </label>
                                            {mediaItem.type === 'image' ||
                                            mediaItem.type === 'video' ? (
                                                <FileUpload
                                                    currentUrl={mediaItem.url}
                                                    onUploadComplete={(url) =>
                                                        updateDetailedArrayItem('media', index, {
                                                            ...mediaItem,
                                                            url,
                                                        })
                                                    }
                                                    accept={
                                                        mediaItem.type === 'image'
                                                            ? 'image/*'
                                                            : 'video/*'
                                                    }
                                                    label={
                                                        mediaItem.type === 'image'
                                                            ? 'Upload Image'
                                                            : 'Upload Video'
                                                    }
                                                    className=""
                                                />
                                            ) : (
                                                <input
                                                    type="url"
                                                    value={mediaItem.url || ''}
                                                    onChange={(event) =>
                                                        updateDetailedArrayItem('media', index, {
                                                            ...mediaItem,
                                                            url: event.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-earth/70 dark:text-gray-400 mb-1">
                                            Caption
                                        </label>
                                        <input
                                            type="text"
                                            value={mediaItem.caption || ''}
                                            onChange={(event) =>
                                                updateDetailedArrayItem('media', index, {
                                                    ...mediaItem,
                                                    caption: event.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeDetailedArrayItem('media', index)}
                                        className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metrics */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-earth dark:text-gray-300">
                                Metrics
                            </label>
                            <button
                                type="button"
                                onClick={() =>
                                    addDetailedArrayItem('metrics', { label: '', value: '' })
                                }
                                className="px-3 py-1 text-sm bg-sage text-white rounded hover:bg-sage-dark"
                            >
                                + Add Metric
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(formData.detailed?.metrics || []).map((metric, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={metric.label || ''}
                                        onChange={(event) =>
                                            updateDetailedArrayItem('metrics', index, {
                                                ...metric,
                                                label: event.target.value,
                                            })
                                        }
                                        placeholder="Label"
                                        className="flex-1 px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                                    />
                                    <input
                                        type="text"
                                        value={metric.value || ''}
                                        onChange={(event) =>
                                            updateDetailedArrayItem('metrics', index, {
                                                ...metric,
                                                value: event.target.value,
                                            })
                                        }
                                        placeholder="Value"
                                        className="flex-1 px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeDetailedArrayItem('metrics', index)}
                                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-sage/20 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-sage/20 dark:border-gray-600 text-earth dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Sortable Challenge Item Component
interface SortableChallengeItemProps {
    id: string;
    item: {
        challenge: Challenge;
        onUpdate: (challenge: Challenge) => void;
        onRemove: () => void;
    };
}

const SortableChallengeItem: FC<SortableChallengeItemProps> = ({ id, item }) => {
    const { challenge, onUpdate, onRemove } = item;
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
            className="p-4 border border-sage/20 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50"
        >
            <div className="flex items-start gap-2 mb-3">
                <div
                    {...attributes}
                    {...listeners}
                    role="button"
                    tabIndex={0}
                    aria-label="Reorder"
                    className="cursor-grab text-earth/50 dark:text-gray-500 mt-2"
                >
                    ☰
                </div>
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={challenge.title}
                        onChange={(event) => onUpdate({ ...challenge, title: event.target.value })}
                        placeholder="Challenge Title"
                        className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                    />
                    <textarea
                        value={challenge.description}
                        onChange={(event) =>
                            onUpdate({ ...challenge, description: event.target.value })
                        }
                        placeholder="Description"
                        rows={2}
                        className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                    />
                    <textarea
                        value={challenge.solution}
                        onChange={(event) =>
                            onUpdate({ ...challenge, solution: event.target.value })
                        }
                        placeholder="Solution"
                        rows={2}
                        className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                    />
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

// Generic Sortable List Section Component
interface SortableListSectionField {
    items: string[];
    fieldPrefix: string;
    onItemsChange: (items: string[]) => void;
    renderItem: (
        item: string,
        index: number,
        onUpdate: (value: string) => void,
        onRemove: () => void
    ) => React.ReactNode;
    onAdd: () => void;
}

interface SortableListSectionProps {
    title: string;
    sensors: SensorDescriptor<SensorOptions>[];
    field: SortableListSectionField;
}

const SortableListSection: FC<SortableListSectionProps> = ({ title, sensors, field }) => {
    const { items, fieldPrefix, onItemsChange, renderItem, onAdd } = field;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((_, index) => `${fieldPrefix}-${index}` === active.id);
        const newIndex = items.findIndex((_, index) => `${fieldPrefix}-${index}` === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newItems = arrayMove(items, oldIndex, newIndex);
            onItemsChange(newItems);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-earth dark:text-gray-300">
                    {title}
                </label>
                <button
                    type="button"
                    onClick={onAdd}
                    className="px-3 py-1 text-sm bg-sage text-white rounded hover:bg-sage-dark"
                >
                    + Add {title.slice(0, -1)}
                </button>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((_, index) => `${fieldPrefix}-${index}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <SortableListItem
                                key={index}
                                id={`${fieldPrefix}-${index}`}
                                index={index}
                                field={{
                                    item,
                                    onUpdate: (value) => {
                                        const newItems = [...items];
                                        newItems[index] = value;
                                        onItemsChange(newItems);
                                    },
                                    onRemove: () => {
                                        const newItems = [...items];
                                        newItems.splice(index, 1);
                                        onItemsChange(newItems);
                                    },
                                    renderItem,
                                }}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

interface SortableListItemField {
    item: string;
    onUpdate: (value: string) => void;
    onRemove: () => void;
    renderItem: (
        item: string,
        index: number,
        onUpdate: (value: string) => void,
        onRemove: () => void
    ) => React.ReactNode;
}

interface SortableListItemProps {
    id: string;
    index: number;
    field: SortableListItemField;
}

const SortableListItem: FC<SortableListItemProps> = ({ id, index, field }) => {
    const { item, onUpdate, onRemove, renderItem } = field;
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
            className="flex items-center gap-2 p-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50"
        >
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
            <div className="flex-1">{renderItem(item, index, onUpdate, onRemove)}</div>
            <button
                type="button"
                onClick={onRemove}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
                Remove
            </button>
        </div>
    );
};

export default ProjectEditor;
