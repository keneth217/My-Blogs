import {supabase} from "@/services/UseSupabase.ts";
import type {PostgrestResponse} from "@supabase/supabase-js";
import type {Blogs} from "@/modell/Blogs.ts"; // Using PostgrestResponse instead of PostgrestSingleResponse

export const BlogsServices = {
    async getBlogs(): Promise<Blogs[][]> {
        try {
            const {data, error}: PostgrestResponse<Blogs[]> = await supabase
                .from('blogs')
                .select('*');

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
    async getBlogById(id: string): Promise<Blogs[]> {
        try {
            const {data, error}: PostgrestResponse<Blogs> = await supabase
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
    async createBlog(blogData: Omit<Blogs, 'id' | 'created_at'>): Promise<Blogs[]> {
        try {
            const {data, error}: PostgrestResponse<Blogs> = await supabase
                .from('blogs')
                .insert(blogData)
                .select()
                .single();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('Failed to create blog');
            }

            return data;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw new Error(error instanceof Error ? error.message : 'Failed to create blog');
        }
    },
    async updateBlog(id: string, updates: Partial<Blogs>): Promise<Blogs[]> {
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
    }
};