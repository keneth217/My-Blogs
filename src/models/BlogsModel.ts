export interface BlogSubtitle {
    id: string;
    blog_id: string;
    subtitle: string;
    content: string;
    order_index: number;
    created_at: string;
}

export interface category {

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
    replies?: BlogComment[];
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

export interface Tags {
    id: string;
    name: string;
    created_at: string;
    description: string;
}

export interface BlogsModel {
    id: string;
    title: string;
    main_content: string;
    cover_image: string;
    author_id: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    subtitle: string;
    slug: string;
    excerpt: string;
    reading_time_minutes: number;
    status: string;
    published_at: string | null;
    scheduled_at: string | null;
    cover_image_credit: string;
    blog_subtitles: BlogSubtitle[];
    comments: BlogComment[];
    likes: BlogLike[];
    author: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
    like_count: number;
    comment_count: number;
    tag_id: string;
    category_id: string;
    blog_tags: Tags[];
}