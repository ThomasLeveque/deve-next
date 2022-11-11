export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          id: number;
          createdAt: string;
          userId: string;
          linkId: number;
          updatedAt: string;
          text: string;
        };
        Insert: {
          id?: number;
          createdAt?: string;
          userId: string;
          linkId: number;
          updatedAt?: string;
          text: string;
        };
        Update: {
          id?: number;
          createdAt?: string;
          userId?: string;
          linkId?: number;
          updatedAt?: string;
          text?: string;
        };
      };
      links: {
        Row: {
          id: number;
          createdAt: string;
          updatedAt: string;
          url: string;
          description: string;
          userId: string;
          votesCount: number;
          commentsCount: number;
        };
        Insert: {
          id?: number;
          createdAt?: string;
          updatedAt?: string;
          url: string;
          description: string;
          userId: string;
          votesCount?: number;
          commentsCount?: number;
        };
        Update: {
          id?: number;
          createdAt?: string;
          updatedAt?: string;
          url?: string;
          description?: string;
          userId?: string;
          votesCount?: number;
          commentsCount?: number;
        };
      };
      links_tags: {
        Row: {
          id: number;
          createdAt: string;
          linkId: number;
          tagId: number;
        };
        Insert: {
          id?: number;
          createdAt?: string;
          linkId: number;
          tagId: number;
        };
        Update: {
          id?: number;
          createdAt?: string;
          linkId?: number;
          tagId?: number;
        };
      };
      migrations: {
        Row: {
          id: string;
          createdAt: string | null;
        };
        Insert: {
          id: string;
          createdAt?: string | null;
        };
        Update: {
          id?: string;
          createdAt?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          updatedAt: string;
          username: string;
          avatarUrl: string;
          createdAt: string;
          email: string;
          role: string;
        };
        Insert: {
          id: string;
          updatedAt?: string;
          username: string;
          avatarUrl: string;
          createdAt?: string;
          email: string;
          role?: string;
        };
        Update: {
          id?: string;
          updatedAt?: string;
          username?: string;
          avatarUrl?: string;
          createdAt?: string;
          email?: string;
          role?: string;
        };
      };
      tags: {
        Row: {
          id: number;
          createdAt: string;
          updatedAt: string;
          name: string;
          slug: string | null;
        };
        Insert: {
          id?: number;
          createdAt?: string;
          updatedAt?: string;
          name: string;
          slug?: string | null;
        };
        Update: {
          id?: number;
          createdAt?: string;
          updatedAt?: string;
          name?: string;
          slug?: string | null;
        };
      };
      votes: {
        Row: {
          id: number;
          createdAt: string;
          userId: string;
          linkId: number;
        };
        Insert: {
          id?: number;
          createdAt?: string;
          userId: string;
          linkId: number;
        };
        Update: {
          id?: number;
          createdAt?: string;
          userId?: string;
          linkId?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
