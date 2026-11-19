import { useState, type FC } from 'react';
import { apiClient } from '../../lib/api';
import ProjectEditor from './ProjectEditor';
import SortableAdminItem from './SortableAdminItem';
import { useReorderableAdminList } from '../../hooks/useReorderableAdminList';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Project } from '../../types/project';

type ProjectListItem = Project & { id: string };

const AdminProjects: FC = () => {
    const {
        items: projects,
        isLoading,
        reload,
        handleDelete,
        sensors,
        handleDragEnd,
    } = useReorderableAdminList<ProjectListItem>({
        load: async () => ((await apiClient.getProjects()).projects || []) as ProjectListItem[],
        remove: (slug) => apiClient.deleteProject(slug),
        reorder: (items) => apiClient.reorderProjects(items),
        confirmDeleteMessage: 'Are you sure you want to delete this project?',
        deleteErrorMessage: 'Failed to delete project',
        reorderErrorMessage: 'Failed to reorder projects',
    });

    const [editingProject, setEditingProject] = useState<ProjectListItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    if (isLoading) {
        return <div className="text-earth dark:text-gray-100">Loading projects...</div>;
    }

    if (editingProject || isCreating) {
        return (
            <ProjectEditor
                project={editingProject}
                onSave={() => {
                    setEditingProject(null);
                    setIsCreating(false);
                    reload();
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

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={projects.map((project) => project.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {projects.map((project) => (
                            <SortableAdminItem
                                key={project.id}
                                id={project.id}
                                onEdit={() => setEditingProject(project)}
                                onDelete={() => handleDelete(project.slug)}
                            >
                                <h3 className="font-semibold text-earth dark:text-gray-100">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-earth/70 dark:text-gray-400">
                                    /{project.slug}
                                </p>
                            </SortableAdminItem>
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

export default AdminProjects;
