

export interface Category {
    id: string;
    name: string;
    created_at: string;
    description: string;
}

export interface BlogComment {
    id: string;
    blog_id: string;
    user_id: string;
    content: string;
    parent_comment_id: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        name: string;
        avatar_url: string;
    };
    replies?: BlogComment[]; // Recursive structure for nested comments
}

export interface BlogLike {
    blog_id: string;
    user_id: string;
    created_at: string;
    user: {
        id: string;
        name: string;
        avatar_url: string;
    };
}

export interface Tag {
    id: string;
    name: string;
    user_id: string;
    blog_id: string;
}

export interface BlogsModel {
    id: string;
    title: string;
    main_content: string;
    cover_image: string;
    cover_image_credit: string;
    excerpt: string;
    subtitle: string;
    slug: string;
    reading_time_minutes: number;

    author_id: string;
    author: {
        id: string;
        full_name: string;
        avatar_url: string;
    };

    comments: BlogComment[];
    likes: BlogLike[];
    blog_tags: Tag[];

    tag_id: string;
    category_id: string;

    is_published: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    scheduled_at: string | null;

    like_count: number;
    comment_count: number;
}
