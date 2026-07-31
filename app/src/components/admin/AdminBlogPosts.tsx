import { useState, type FC } from 'react';
import { apiClient } from '../../lib/api';
import BlogPostEditor from './BlogPostEditor';
import SortableAdminItem from './SortableAdminItem';
import { useReorderableAdminList } from '../../hooks/useReorderableAdminList';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { BlogPost } from '../../types/blog-post';

type BlogPostListItem = BlogPost & { id: string };

const AdminBlogPosts: FC = () => {
    const {
        items: posts,
        isLoading,
        reload,
        handleDelete,
        sensors,
        handleDragEnd,
    } = useReorderableAdminList<BlogPostListItem>({
        load: async () => ((await apiClient.getBlogPosts()).posts || []) as BlogPostListItem[],
        remove: (slug) => apiClient.deleteBlogPost(slug),
        reorder: (items) => apiClient.reorderBlogPosts(items),
        confirmDeleteMessage: 'Are you sure you want to delete this blog post?',
        deleteErrorMessage: 'Failed to delete blog post',
        reorderErrorMessage: 'Failed to reorder blog posts',
    });

    const [editingPost, setEditingPost] = useState<BlogPostListItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    if (isLoading) {
        return <div className="text-earth dark:text-gray-100">Loading blog posts...</div>;
    }

    if (editingPost || isCreating) {
        return (
            <BlogPostEditor
                post={editingPost}
                onSave={() => {
                    setEditingPost(null);
                    setIsCreating(false);
                    reload();
                }}
                onCancel={() => {
                    setEditingPost(null);
                    setIsCreating(false);
                }}
            />
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-earth dark:text-gray-100">
                    Blog Posts ({posts.length})
                </h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
                >
                    + New Post
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={posts.map((post) => post.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {posts.map((post) => (
                            <SortableAdminItem
                                key={post.id}
                                id={post.id}
                                onEdit={() => setEditingPost(post)}
                                onDelete={() => handleDelete(post.slug)}
                            >
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-earth dark:text-gray-100">
                                        {post.title}
                                    </h3>
                                    {post.published ? (
                                        <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
                                            Draft
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-earth/70 dark:text-gray-400">
                                    /{post.slug} • {post.date}
                                </p>
                            </SortableAdminItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {posts.length === 0 && (
                <div className="text-center py-12 text-earth/70 dark:text-gray-400">
                    No blog posts yet. Create your first post!
                </div>
            )}
        </div>
    );
};

export default AdminBlogPosts;
