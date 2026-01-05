// TypeScript definitions for Supabase database schema
// Note: Using snake_case column names to match actual database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          email_verified: string | null
          image: string | null
          password: string | null
          role: 'USER' | 'ADMIN'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email: string
          email_verified?: string | null
          image?: string | null
          password?: string | null
          role?: 'USER' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          email_verified?: string | null
          image?: string | null
          password?: string | null
          role?: 'USER' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          public_id: string
          style: string
          tags: string[]
          is_active: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          public_id: string
          style: string
          tags?: string[]
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          public_id?: string
          style?: string
          tags?: string[]
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      pricing: {
        Row: {
          id: string
          style: string
          size: string
          number_of_faces: number
          base_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          style: string
          size: string
          number_of_faces: number
          base_price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          style?: string
          size?: string
          number_of_faces?: number
          base_price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'FLAT_DISCOUNT' | 'PERCENTAGE_DISCOUNT' | 'FIRST_ORDER_DISCOUNT'
          value: number
          max_discount: number | null
          coupon_code: string | null
          is_active: boolean
          priority: number
          start_date: string | null
          end_date: string | null
          min_order_value: number | null
          applicable_styles: string[]
          first_order_only: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'FLAT_DISCOUNT' | 'PERCENTAGE_DISCOUNT' | 'FIRST_ORDER_DISCOUNT'
          value: number
          max_discount?: number | null
          coupon_code?: string | null
          is_active?: boolean
          priority?: number
          start_date?: string | null
          end_date?: string | null
          min_order_value?: number | null
          applicable_styles?: string[]
          first_order_only?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'FLAT_DISCOUNT' | 'PERCENTAGE_DISCOUNT' | 'FIRST_ORDER_DISCOUNT'
          value?: number
          max_discount?: number | null
          coupon_code?: string | null
          is_active?: boolean
          priority?: number
          start_date?: string | null
          end_date?: string | null
          min_order_value?: number | null
          applicable_styles?: string[]
          first_order_only?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          style: string
          size: string
          number_of_faces: number
          special_notes: string | null
          base_price: number
          discount_amount: number
          final_price: number
          status: 'PENDING' | 'PREVIEW_SENT' | 'REVISION' | 'APPROVED' | 'COMPLETED'
          payment_status: 'PENDING' | 'PAID' | 'REFUNDED'
          offer_id: string | null
          coupon_code: string | null
          preview_url: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          style: string
          size: string
          number_of_faces: number
          special_notes?: string | null
          base_price: number
          discount_amount?: number
          final_price: number
          status?: 'PENDING' | 'PREVIEW_SENT' | 'REVISION' | 'APPROVED' | 'COMPLETED'
          payment_status?: 'PENDING' | 'PAID' | 'REFUNDED'
          offer_id?: string | null
          coupon_code?: string | null
          preview_url?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          style?: string
          size?: string
          number_of_faces?: number
          special_notes?: string | null
          base_price?: number
          discount_amount?: number
          final_price?: number
          status?: 'PENDING' | 'PREVIEW_SENT' | 'REVISION' | 'APPROVED' | 'COMPLETED'
          payment_status?: 'PENDING' | 'PAID' | 'REFUNDED'
          offer_id?: string | null
          coupon_code?: string | null
          preview_url?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_images: {
        Row: {
          id: string
          order_id: string
          image_url: string
          public_id: string
        }
        Insert: {
          id?: string
          order_id: string
          image_url: string
          public_id: string
        }
        Update: {
          id?: string
          order_id?: string
          image_url?: string
          public_id?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          image_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_id?: string
          created_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          whatsapp_number: string
          banner_title: string | null
          banner_text: string | null
          banner_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whatsapp_number: string
          banner_title?: string | null
          banner_text?: string | null
          banner_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whatsapp_number?: string
          banner_title?: string | null
          banner_text?: string | null
          banner_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Role: 'USER' | 'ADMIN'
      OfferType: 'FLAT_DISCOUNT' | 'PERCENTAGE_DISCOUNT' | 'FIRST_ORDER_DISCOUNT'
      OrderStatus: 'PENDING' | 'PREVIEW_SENT' | 'REVISION' | 'APPROVED' | 'COMPLETED'
      PaymentStatus: 'PENDING' | 'PAID' | 'REFUNDED'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type GalleryImage = Database['public']['Tables']['gallery_images']['Row']
export type GalleryImageInsert = Database['public']['Tables']['gallery_images']['Insert']
export type GalleryImageUpdate = Database['public']['Tables']['gallery_images']['Update']

export type Pricing = Database['public']['Tables']['pricing']['Row']
export type PricingInsert = Database['public']['Tables']['pricing']['Insert']
export type PricingUpdate = Database['public']['Tables']['pricing']['Update']

export type Offer = Database['public']['Tables']['offers']['Row']
export type OfferInsert = Database['public']['Tables']['offers']['Insert']
export type OfferUpdate = Database['public']['Tables']['offers']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderImage = Database['public']['Tables']['order_images']['Row']
export type OrderImageInsert = Database['public']['Tables']['order_images']['Insert']
export type OrderImageUpdate = Database['public']['Tables']['order_images']['Update']

export type UserFavorite = Database['public']['Tables']['user_favorites']['Row']
export type UserFavoriteInsert = Database['public']['Tables']['user_favorites']['Insert']
export type UserFavoriteUpdate = Database['public']['Tables']['user_favorites']['Update']

export type AdminSettings = Database['public']['Tables']['admin_settings']['Row']
export type AdminSettingsInsert = Database['public']['Tables']['admin_settings']['Insert']
export type AdminSettingsUpdate = Database['public']['Tables']['admin_settings']['Update']

// Enum types
export type Role = Database['public']['Enums']['Role']
export type OfferType = Database['public']['Enums']['OfferType']
export type OrderStatus = Database['public']['Enums']['OrderStatus']
export type PaymentStatus = Database['public']['Enums']['PaymentStatus']