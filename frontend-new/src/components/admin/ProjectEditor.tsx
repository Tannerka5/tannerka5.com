import { useState, useEffect, type FC } from 'react';
import { apiClient } from '../../lib/api';
import type { Project } from '../../../data/projects';
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
    detailed: {
      overview: '',
      problem: '',
      solution: '',
      challenges: [],
      learnings: [],
      features: [],
      media: [],
      metrics: [],
    },
  });
  const [loading, setLoading] = useState(false);
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
          overview: '',
          problem: '',
          solution: '',
          challenges: [],
          learnings: [],
          features: [],
          media: [],
          metrics: [],
          ...project.detailed,
        },
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
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

  const updateDetailedField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      detailed: {
        overview: '',
        problem: '',
        solution: '',
        challenges: [],
        learnings: [],
        features: [],
        media: [],
        metrics: [],
        ...prev.detailed,
        [field]: value,
      },
    }));
  };

  const addArrayItem = (field: string, initialValue: any = '') => {
    setFormData((prev) => {
      const current = (prev[field as keyof typeof prev] as any[]) || [];
      return { ...prev, [field]: [...current, initialValue] };
    });
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    setFormData((prev) => {
      const current = [...((prev[field as keyof typeof prev] as any[]) || [])];
      current[index] = value;
      return { ...prev, [field]: current };
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => {
      const current = [...((prev[field as keyof typeof prev] as any[]) || [])];
      current.splice(index, 1);
      return { ...prev, [field]: current };
    });
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
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: prev.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
              onChange={(e) => updateField('slug', e.target.value)}
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
            onChange={(e) => updateField('shortDescription', e.target.value)}
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
            onChange={(e) => updateField('fullDescription', e.target.value)}
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
              onChange={(e) => updateField('role', e.target.value)}
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
              onChange={(e) => updateField('timeline', e.target.value)}
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
          gradientFrom={formData.gradientFrom || ''}
          gradientVia={formData.gradientVia || ''}
          gradientTo={formData.gradientTo || ''}
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
                onChange={(e) => updateArrayItem('techStack', index, e.target.value)}
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
              onChange={(e) => updateField('links', { ...formData.links, live: e.target.value })}
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
              onChange={(e) => updateField('links', { ...formData.links, github: e.target.value })}
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
              onChange={(e) => updateField('links', { ...formData.links, demo: e.target.value })}
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
              onChange={(e) => updateDetailedField('overview', e.target.value)}
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
              onChange={(e) => updateDetailedField('problem', e.target.value)}
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
              onChange={(e) => updateDetailedField('solution', e.target.value)}
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
                onClick={() => {
                  const challenges = formData.detailed?.challenges || [];
                  updateDetailedField('challenges', [...challenges, { title: '', description: '', solution: '' }]);
                }}
                className="px-3 py-1 text-sm bg-sage text-white rounded hover:bg-sage-dark"
              >
                + Add Challenge
              </button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => {
                const items = formData.detailed?.challenges || [];
                const oldIndex = items.findIndex((_, i) => `challenge-${i}` === e.active.id);
                const newIndex = items.findIndex((_, i) => `challenge-${i}` === e.over?.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                  const newItems = arrayMove(items, oldIndex, newIndex);
                  updateDetailedField('challenges', newItems);
                }
              }}
            >
              <SortableContext
                items={(formData.detailed?.challenges || []).map((_, i) => `challenge-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {(formData.detailed?.challenges || []).map((challenge, index) => (
                    <SortableChallengeItem
                      key={index}
                      id={`challenge-${index}`}
                      challenge={challenge}
                      index={index}
                      onUpdate={(updated) => {
                        const challenges = [...(formData.detailed?.challenges || [])];
                        challenges[index] = updated;
                        updateDetailedField('challenges', challenges);
                      }}
                      onRemove={() => {
                        const challenges = [...(formData.detailed?.challenges || [])];
                        challenges.splice(index, 1);
                        updateDetailedField('challenges', challenges);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Learnings */}
          <SortableListSection
            title="Learnings"
            items={formData.detailed?.learnings || []}
            onItemsChange={(items) => updateDetailedField('learnings', items)}
            sensors={sensors}
            fieldPrefix="learning"
            renderItem={(item, _index, onUpdate) => (
              <input
                type="text"
                value={item}
                onChange={(e) => onUpdate(e.target.value)}
                className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
              />
            )}
            onAdd={() => {
              const learnings = formData.detailed?.learnings || [];
              updateDetailedField('learnings', [...learnings, '']);
            }}
          />

          {/* Features */}
          <SortableListSection
            title="Features"
            items={formData.detailed?.features || []}
            onItemsChange={(items) => updateDetailedField('features', items)}
            sensors={sensors}
            fieldPrefix="feature"
            renderItem={(item, _index, onUpdate) => (
              <input
                type="text"
                value={item}
                onChange={(e) => onUpdate(e.target.value)}
                className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
              />
            )}
            onAdd={() => {
              const features = formData.detailed?.features || [];
              updateDetailedField('features', [...features, '']);
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
                onClick={() => {
                  const media = formData.detailed?.media || [];
                  updateDetailedField('media', [...media, { type: 'image', url: '', caption: '' }]);
                }}
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
                        onChange={(e) => {
                          const media = [...(formData.detailed?.media || [])];
                          media[index] = { ...mediaItem, type: e.target.value as 'image' | 'video' | 'embed' };
                          updateDetailedField('media', media);
                        }}
                        className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="embed">Embed</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-earth/70 dark:text-gray-400 mb-1">
                        {mediaItem.type === 'image' || mediaItem.type === 'video' ? 'Upload File' : 'URL'}
                      </label>
                      {mediaItem.type === 'image' || mediaItem.type === 'video' ? (
                        <FileUpload
                          currentUrl={mediaItem.url}
                          onUploadComplete={(url) => {
                            const media = [...(formData.detailed?.media || [])];
                            media[index] = { ...mediaItem, url };
                            updateDetailedField('media', media);
                          }}
                          accept={mediaItem.type === 'image' ? 'image/*' : 'video/*'}
                          label={mediaItem.type === 'image' ? 'Upload Image' : 'Upload Video'}
                          className=""
                        />
                      ) : (
                        <input
                          type="url"
                          value={mediaItem.url || ''}
                          onChange={(e) => {
                            const media = [...(formData.detailed?.media || [])];
                            media[index] = { ...mediaItem, url: e.target.value };
                            updateDetailedField('media', media);
                          }}
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
                      onChange={(e) => {
                        const media = [...(formData.detailed?.media || [])];
                        media[index] = { ...mediaItem, caption: e.target.value };
                        updateDetailedField('media', media);
                      }}
                      className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const media = [...(formData.detailed?.media || [])];
                      media.splice(index, 1);
                      updateDetailedField('media', media);
                    }}
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
                onClick={() => {
                  const metrics = formData.detailed?.metrics || [];
                  updateDetailedField('metrics', [...metrics, { label: '', value: '' }]);
                }}
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
                    onChange={(e) => {
                      const metrics = [...(formData.detailed?.metrics || [])];
                      metrics[index] = { ...metric, label: e.target.value };
                      updateDetailedField('metrics', metrics);
                    }}
                    placeholder="Label"
                    className="flex-1 px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                  />
                  <input
                    type="text"
                    value={metric.value || ''}
                    onChange={(e) => {
                      const metrics = [...(formData.detailed?.metrics || [])];
                      metrics[index] = { ...metric, value: e.target.value };
                      updateDetailedField('metrics', metrics);
                    }}
                    placeholder="Value"
                    className="flex-1 px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const metrics = [...(formData.detailed?.metrics || [])];
                      metrics.splice(index, 1);
                      updateDetailedField('metrics', metrics);
                    }}
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
            disabled={loading}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Sortable Challenge Item Component
interface SortableChallengeItemProps {
  id: string;
  challenge: { title: string; description: string; solution: string };
  index: number;
  onUpdate: (challenge: { title: string; description: string; solution: string }) => void;
  onRemove: () => void;
}

const SortableChallengeItem: FC<SortableChallengeItemProps> = ({
  id,
  challenge,
  onUpdate,
  onRemove,
}) => {
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
          className="cursor-grab text-earth/50 dark:text-gray-500 mt-2"
        >
          ☰
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={challenge.title}
            onChange={(e) => onUpdate({ ...challenge, title: e.target.value })}
            placeholder="Challenge Title"
            className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
          />
          <textarea
            value={challenge.description}
            onChange={(e) => onUpdate({ ...challenge, description: e.target.value })}
            placeholder="Description"
            rows={2}
            className="w-full px-3 py-2 border border-sage/20 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
          />
          <textarea
            value={challenge.solution}
            onChange={(e) => onUpdate({ ...challenge, solution: e.target.value })}
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
interface SortableListSectionProps {
  title: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  sensors: any;
  fieldPrefix: string;
  renderItem: (
    item: string,
    index: number,
    onUpdate: (value: string) => void,
    onRemove: () => void
  ) => React.ReactNode;
  onAdd: () => void;
}

const SortableListSection: FC<SortableListSectionProps> = ({
  title,
  items,
  onItemsChange,
  sensors,
  fieldPrefix,
  renderItem,
  onAdd,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((_, i) => `${fieldPrefix}-${i}` === active.id);
    const newIndex = items.findIndex((_, i) => `${fieldPrefix}-${i}` === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(items, oldIndex, newIndex);
      onItemsChange(newItems);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-earth dark:text-gray-300">{title}</label>
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-1 text-sm bg-sage text-white rounded hover:bg-sage-dark"
        >
          + Add {title.slice(0, -1)}
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((_, i) => `${fieldPrefix}-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item, index) => (
              <SortableListItem
                key={index}
                id={`${fieldPrefix}-${index}`}
                item={item}
                index={index}
                onUpdate={(value) => {
                  const newItems = [...items];
                  newItems[index] = value;
                  onItemsChange(newItems);
                }}
                onRemove={() => {
                  const newItems = [...items];
                  newItems.splice(index, 1);
                  onItemsChange(newItems);
                }}
                renderItem={renderItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

interface SortableListItemProps {
  id: string;
  item: string;
  index: number;
  onUpdate: (value: string) => void;
  onRemove: () => void;
  renderItem: (
    item: string,
    index: number,
    onUpdate: (value: string) => void,
    onRemove: () => void
  ) => React.ReactNode;
}

const SortableListItem: FC<SortableListItemProps> = ({
  id,
  item,
  onUpdate,
  onRemove,
  renderItem,
}) => {
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
      <div {...attributes} {...listeners} className="cursor-grab text-earth/50 dark:text-gray-500">
        ☰
      </div>
      <div className="flex-1">{renderItem(item, 0, onUpdate, onRemove)}</div>
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
