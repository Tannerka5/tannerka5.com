import { useState, useEffect, type FC } from 'react';
import { apiClient } from '../../lib/api';
import type { Project } from '../../../data/projects';

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
    gradientFrom: '',
    gradientVia: '',
    gradientTo: '',
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
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData(project);
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

  const addArrayItem = (field: string) => {
    setFormData((prev) => {
      const current = (prev[field as keyof typeof prev] as any[]) || [];
      return { ...prev, [field]: [...current, ''] };
    });
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
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
        <div className="border-t border-sage/20 dark:border-gray-700 pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-earth dark:text-gray-100">Detailed Information</h3>

          <div>
            <label className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
              Overview
            </label>
            <textarea
              value={formData.detailed?.overview || ''}
              onChange={(e) => updateField('detailed', { ...formData.detailed, overview: e.target.value })}
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
              onChange={(e) => updateField('detailed', { ...formData.detailed, problem: e.target.value })}
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
              onChange={(e) => updateField('detailed', { ...formData.detailed, solution: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
            />
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

export default ProjectEditor;