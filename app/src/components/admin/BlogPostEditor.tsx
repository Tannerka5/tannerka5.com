import { useState, useEffect, type FC } from 'react';
import { apiClient } from '../../lib/api';
import type { BlogPost } from '../../types/blog-post';
import { slugify } from '../../lib/slug-utils';
import FileUpload from './FileUpload';
import SimpleRichTextEditor from './SimpleRichTextEditor';

interface BlogPostEditorProps {
    post?: Partial<BlogPost> | null;
    onSave: () => void;
    onCancel: () => void;
}

const BlogPostEditor: FC<BlogPostEditorProps> = ({ post, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min read',
        tags: [],
        published: false,
        coverImage: '',
        author: 'Tanner Atkinson',
        content: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (post) {
            setFormData({
                ...post,
                content: post.content || '',
            });
        }
    }, [post]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (post?.slug) {
                await apiClient.updateBlogPost(post.slug, formData);
            } else {
                await apiClient.createBlogPost(formData);
            }
            onSave();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save blog post');
        } finally {
            setIsLoading(false);
        }
    };

    const addTag = () => {
        setFormData((prev) => ({
            ...prev,
            tags: [...(prev.tags || []), ''],
        }));
    };

    const updateTag = (index: number, value: string) => {
        setFormData((prev) => {
            const tags = [...(prev.tags || [])];
            tags[index] = value;
            return { ...prev, tags };
        });
    };

    const removeTag = (index: number) => {
        setFormData((prev) => {
            const tags = [...(prev.tags || [])];
            tags.splice(index, 1);
            return { ...prev, tags };
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold text-earth dark:text-gray-100">
                    {post ? 'Edit Blog Post' : 'New Blog Post'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="blog-title"
                            className="block text-sm font-medium text-earth dark:text-gray-300 mb-2"
                        >
                            Title *
                        </label>
                        <input
                            id="blog-title"
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
                        <label
                            htmlFor="blog-slug"
                            className="block text-sm font-medium text-earth dark:text-gray-300 mb-2"
                        >
                            Slug *
                        </label>
                        <input
                            id="blog-slug"
                            type="text"
                            value={formData.slug || ''}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, slug: event.target.value }))
                            }
                            required
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="blog-excerpt"
                        className="block text-sm font-medium text-earth dark:text-gray-300 mb-2"
                    >
                        Excerpt *
                    </label>
                    <textarea
                        id="blog-excerpt"
                        value={formData.excerpt || ''}
                        onChange={(event) =>
                            setFormData((prev) => ({ ...prev, excerpt: event.target.value }))
                        }
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                    />
                </div>

                {/* Cover Image Upload */}
                <FileUpload
                    currentUrl={formData.coverImage}
                    onUploadComplete={(url) =>
                        setFormData((prev) => ({ ...prev, coverImage: url }))
                    }
                    accept="image/*"
                    label="Cover Image"
                />

                {/* Content Editor */}
                <div>
                    <div className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                        Content
                    </div>
                    <SimpleRichTextEditor
                        value={formData.content || ''}
                        onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                        placeholder="Write your blog post content here..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            htmlFor="blog-date"
                            className="block text-sm font-medium text-earth dark:text-gray-300 mb-2"
                        >
                            Date *
                        </label>
                        <input
                            id="blog-date"
                            type="date"
                            value={formData.date || ''}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, date: event.target.value }))
                            }
                            required
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="blog-read-time"
                            className="block text-sm font-medium text-earth dark:text-gray-300 mb-2"
                        >
                            Read Time
                        </label>
                        <input
                            id="blog-read-time"
                            type="text"
                            value={formData.readTime || ''}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, readTime: event.target.value }))
                            }
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="blog-author"
                            className="block text-sm font-medium text-earth dark:text-gray-300 mb-2"
                        >
                            Author
                        </label>
                        <input
                            id="blog-author"
                            type="text"
                            value={formData.author || ''}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, author: event.target.value }))
                            }
                            className="w-full px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                        />
                    </div>
                </div>

                <div>
                    <div className="block text-sm font-medium text-earth dark:text-gray-300 mb-2">
                        Tags
                    </div>
                    {(formData.tags || []).map((tag, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tag}
                                onChange={(event) => updateTag(index, event.target.value)}
                                className="flex-1 px-4 py-2 border border-sage/20 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-earth dark:text-gray-100"
                            />
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark"
                    >
                        + Add Tag
                    </button>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="published"
                        checked={formData.published || false}
                        onChange={(event) =>
                            setFormData((prev) => ({ ...prev, published: event.target.checked }))
                        }
                        className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <label
                        htmlFor="published"
                        className="ml-2 text-sm font-medium text-earth dark:text-gray-300"
                    >
                        Published
                    </label>
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
                        {isLoading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogPostEditor;
