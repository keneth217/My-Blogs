import {supabase} from "@/services/UseSupabase.ts";
import type {PostgrestResponse} from "@supabase/supabase-js";
import type {BlogsModel} from "@/models/BlogsModel.ts";
interface LikeParams {
    blog_id: string;
    user_id: string;
}

interface CommentParams {
    blog_id: string;
    user_id: string;
    content: string;
}

export const BlogsServices = {
    async getBlogs(): Promise<BlogsModel[]> {
        try {
            const {data, error}: PostgrestResponse<BlogsModel[]> = await supabase
                .from('blogs')
                .select(`
                *,
                author:author_id(*),
                blog_subtitles(*),
                comments(*),
                likes(*)
            `);

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('No blogs found');
            }

            console.log('Blogs data in service.ts:', data);
            return data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch blogs');
        }
    },

    async getBlogById(id: string): Promise<BlogsModel[]> {
        try {
            const {data, error}: PostgrestResponse<BlogsModel> = await supabase
                .from('blogs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('Blog not found');
            }

            return data;
        } catch (error) {
            console.error(`Error fetching blog with ID ${id}:`, error);
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch blog');
        }

    },
    async createBlog(blogData: Omit<BlogsModel, 'id' | 'created_at' | 'updated_at'>): Promise<BlogsModel> {
        try {
            // Validate required fields
            if (!blogData.title || !blogData.content || !blogData.author_id) {
                throw new Error('Title, content, and author ID are required');
            }

            // Validate author_id is a valid UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(blogData.author_id)) {
                throw new Error('Invalid author ID format');
            }

            const {data, error} = await supabase
                .from('blogs')
                .insert({
                    ...blogData,
                    is_published: blogData.is_published || false,
                    cover_image: blogData.cover_image || null
                })
                .select()
                .single();

            if (error) {
                console.error('Supabase error details:', error);
                throw error;
            }

            if (!data) {
                throw new Error('No data returned from blog creation');
            }

            return data;
        } catch (error) {
            console.error('Error in createBlog:', error);
            throw new Error(
                error instanceof Error ? error.message : 'An unknown error occurred while creating blog'
            );
        }
    },
    async updateBlog(id: string, updates: Partial<BlogsModel>): Promise<BlogsModel[]> {
        try {
            const {data, error}: PostgrestResponse<Blogs> = await supabase
                .from('blogs')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('Blog not found');
            }

            return data;
        } catch (error) {
            console.error(`Error updating blog with ID ${id}:`, error);
            throw new Error(error instanceof Error ? error.message : 'Failed to update blog');
        }
    },
    async deleteBlog(id: string): Promise<void> {
        try {
            const {error} = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error(`Error deleting blog with ID ${id}:`, error);
            throw new Error(error instanceof Error ? error.message : 'Failed to delete blog');
        }
    },
    async getBlogBySlug(slug: string): Promise<BlogsModel> {
        try {
            const {data, error}: PostgrestResponse<BlogsModel> = await supabase
                .from('blogs')
                .select(`
                *,
                author:author_id(id, full_name, avatar_url),
                subtitles:blog_subtitles(*),
                comments(*),
                likes(*)
            `)
                .eq('slug', slug)
                .single();  // Use single() since we're fetching one record

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('Blog not found');
            }

            // Transform the data to match your model if needed
            const blogData = {
                ...data,
                like_count: data.likes?.length || 0,
                comment_count: data.comments?.length || 0
            };

            return blogData;
        } catch (error) {
            console.error(`Error fetching blog with slug ${slug}:`, error);
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch blog');
        }
    },
    async checkUserLike({ blog_id, user_id }: LikeParams) {
        try {
            const { data, error } = await supabase
                .from('likes')
                .select('*')
                .eq('blog_id', blog_id)
                .eq('user_id', user_id)
                .maybeSingle()

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error checking user like:', error);
            throw new Error('Failed to check user like');
        }
    },
    async unlikeBlog({ blog_id, user_id }: LikeParams) {
        try {
            const { data, error } = await supabase
                .from('likes')
                .delete()
                .eq('blog_id', blog_id)
                .eq('user_id', user_id);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error unliking blog:', error);
            throw new Error('Failed to unlike blog');
        }
    },
    async likeBlog({ blog_id, user_id }: LikeParams) {
        try {
            const { data, error } = await supabase
                .from('likes')
                .insert({ blog_id, user_id });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error liking blog:', error);
            throw new Error('Failed to like blog');
        }
    },
    async addComment({ blog_id, user_id, content }: CommentParams) {
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({ blog_id, user_id, content })
                .select(); // Include .select() to return the inserted record

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw new Error('Failed to add comment');
        }
    },
    async fetchBlogsByCategory(categoryId: string) {
        try {
            const { data, error }: PostgrestResponse<BlogsModel[]> = await supabase
                .from('blogs')
                .select('*')
                .eq('category_id', categoryId);

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('No blogs found for this category');
            }

            return data;
        } catch (error) {
            console.error('Error fetching blogs by category:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch blogs by category');
        }
    },
    async fetchAllCategories() {
        try {
            const { data, error }: PostgrestResponse<{ id: string; name: string }[]> = await supabase
                .from('category')
                .select('*');


            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('No categories found');
            }

            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
        }
    },

    async publishBlog(id: string) {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .update({ is_published: true, published_at: Date.now() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error publishing blog:', error);
            throw error;
        }


    },
    async unpublishBlog(id: string) {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .update({
                    is_published: false,
                    published_at: null,
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error unpublishing blog:', error);
            throw error;
        }
    },

    async getPublishedBlogs() {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching published blogs:', error);
            throw error;
        }
    },

     async fetchPublishedBlogsByCategory(categoryId: string) {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('category_id', categoryId)
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching blogs by category:', error);
            throw error;
        }
    }



}