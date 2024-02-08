export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          createdAt: string;
          id: number;
          linkId: number;
          text: string;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          id?: number;
          linkId: number;
          text: string;
          updatedAt?: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          id?: number;
          linkId?: number;
          text?: string;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_linkId_fkey';
            columns: ['linkId'];
            isOneToOne: false;
            referencedRelation: 'links';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      links: {
        Row: {
          createdAt: string;
          description: string;
          id: number;
          updatedAt: string;
          url: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          description: string;
          id?: number;
          updatedAt?: string;
          url: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          description?: string;
          id?: number;
          updatedAt?: string;
          url?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'links_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      links_tags: {
        Row: {
          createdAt: string;
          id: number;
          linkId: number;
          tagId: number;
        };
        Insert: {
          createdAt?: string;
          id?: number;
          linkId: number;
          tagId: number;
        };
        Update: {
          createdAt?: string;
          id?: number;
          linkId?: number;
          tagId?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'links_tags_linkId_fkey';
            columns: ['linkId'];
            isOneToOne: false;
            referencedRelation: 'links';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'links_tags_tagId_fkey';
            columns: ['tagId'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      migrations: {
        Row: {
          createdAt: string | null;
          id: string;
        };
        Insert: {
          createdAt?: string | null;
          id: string;
        };
        Update: {
          createdAt?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatarUrl: string;
          createdAt: string;
          email: string;
          id: string;
          role: string;
          updatedAt: string;
          username: string;
        };
        Insert: {
          avatarUrl: string;
          createdAt?: string;
          email: string;
          id: string;
          role?: string;
          updatedAt?: string;
          username: string;
        };
        Update: {
          avatarUrl?: string;
          createdAt?: string;
          email?: string;
          id?: string;
          role?: string;
          updatedAt?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      tags: {
        Row: {
          createdAt: string;
          id: number;
          name: string;
          slug: string | null;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          id?: number;
          name: string;
          slug?: string | null;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          id?: number;
          name?: string;
          slug?: string | null;
          updatedAt?: string;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          createdAt: string;
          id: number;
          linkId: number;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          id?: number;
          linkId: number;
          userId: string;
        };
        Update: {
          createdAt?: string;
          id?: number;
          linkId?: number;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'votes_linkId_fkey';
            columns: ['linkId'];
            isOneToOne: false;
            referencedRelation: 'links';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'votes_userId_fkey';
            columns: ['userId'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
