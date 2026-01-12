import { useState, useEffect, type FC } from 'react';
import { apiClient } from '../../lib/api';
import ProjectEditor from './ProjectEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Project {
  id: string;
  slug: string;
  title: string;
  [key: string]: any;
}

const AdminProjects: FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await apiClient.getProjects();
      setProjects(response.projects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await apiClient.deleteProject(slug);
      await loadProjects();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((item) => item.id === active.id);
    const newIndex = projects.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(projects, oldIndex, newIndex);

    // Update order values
    const updatedItems = newItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    try {
      await apiClient.reorderProjects(updatedItems);
      setProjects(newItems.map((item, index) => ({ ...item, order: index })));
    } catch (error) {
      alert('Failed to reorder projects');
      loadProjects();
    }
  };

  if (loading) {
    return <div className="text-earth dark:text-gray-100">Loading projects...</div>;
  }

  if (editingProject || isCreating) {
    return (
      <ProjectEditor
        project={editingProject}
        onSave={() => {
          setEditingProject(null);
          setIsCreating(false);
          loadProjects();
        }}
        onCancel={() => {
          setEditingProject(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-earth dark:text-gray-100">
          Projects ({projects.length})
        </h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
        >
          + New Project
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {projects.map((project) => (
              <SortableProjectItem
                key={project.id}
                project={project}
                onEdit={() => setEditingProject(project)}
                onDelete={() => handleDelete(project.slug)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {projects.length === 0 && (
        <div className="text-center py-12 text-earth/70 dark:text-gray-400">
          No projects yet. Create your first project!
        </div>
      )}
    </div>
  );
};

interface SortableProjectItemProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableProjectItem: FC<SortableProjectItemProps> = ({ project, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
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
          <div {...attributes} {...listeners} className="cursor-grab text-earth/50 dark:text-gray-500">
            ☰
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-earth dark:text-gray-100">{project.title}</h3>
            <p className="text-sm text-earth/70 dark:text-gray-400">/{project.slug}</p>
          </div>
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

export default AdminProjects;