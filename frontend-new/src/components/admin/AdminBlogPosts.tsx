import { useState, useEffect, type FC } from 'react';
import { apiClient } from '../../lib/api';
import BlogPostEditor from './BlogPostEditor';
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

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  [key: string]: any;
}

const AdminBlogPosts: FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await apiClient.getBlogPosts();
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await apiClient.deleteBlogPost(slug);
      await loadPosts();
    } catch (error) {
      alert('Failed to delete blog post');
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

    const oldIndex = posts.findIndex((item) => item.id === active.id);
    const newIndex = posts.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(posts, oldIndex, newIndex);

    const updatedItems = newItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    try {
      await apiClient.reorderBlogPosts(updatedItems);
      setPosts(newItems.map((item, index) => ({ ...item, order: index })));
    } catch (error) {
      alert('Failed to reorder blog posts');
      loadPosts();
    }
  };

  if (loading) {
    return <div className="text-earth dark:text-gray-100">Loading blog posts...</div>;
  }

  if (editingPost || isCreating) {
    return (
      <BlogPostEditor
        post={editingPost}
        onSave={() => {
          setEditingPost(null);
          setIsCreating(false);
          loadPosts();
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={posts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {posts.map((post) => (
              <SortableBlogPostItem
                key={post.id}
                post={post}
                onEdit={() => setEditingPost(post)}
                onDelete={() => handleDelete(post.slug)}
              />
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

interface SortableBlogPostItemProps {
  post: BlogPost;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableBlogPostItem: FC<SortableBlogPostItemProps> = ({ post, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: post.id,
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
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-earth dark:text-gray-100">{post.title}</h3>
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

export default AdminBlogPosts;