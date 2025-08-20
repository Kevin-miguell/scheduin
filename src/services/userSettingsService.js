import { supabase } from '../lib/supabase';

export const userSettingsService = {
  async getUserSettings(userId) {
    try {
      const { data, error } = await supabase?.from('user_settings')?.select('*')?.eq('user_id', userId)?.single()
      
      if (error && error?.code === 'PGRST116') {
        // Settings don't exist, create default settings
        return await this.createDefaultSettings(userId)
      }
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async createDefaultSettings(userId) {
    try {
      const defaultSettings = {
        user_id: userId,
        optimal_posting_times: [
          { day: 'Tuesday', hour: 9 },
          { day: 'Wednesday', hour: 10 },
          { day: 'Thursday', hour: 11 }
        ],
        default_hashtags: ['#LinkedIn', '#Business', '#Professional'],
        auto_add_first_comment: false,
        default_first_comment: '',
        notification_settings: {
          scheduled_post_reminder: true,
          post_published: true,
          post_failed: true,
          weekly_analytics: true
        },
        content_templates: []
      }
      
      const { data, error } = await supabase?.from('user_settings')?.insert([defaultSettings])?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateUserSettings(userId, settings) {
    try {
      const { data, error } = await supabase?.from('user_settings')?.update({
          ...settings,
          updated_at: new Date()?.toISOString()
        })?.eq('user_id', userId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateOptimalPostingTimes(userId, optimalTimes) {
    try {
      const { data, error } = await supabase?.from('user_settings')?.update({
          optimal_posting_times: optimalTimes,
          updated_at: new Date()?.toISOString()
        })?.eq('user_id', userId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateDefaultHashtags(userId, hashtags) {
    try {
      const { data, error } = await supabase?.from('user_settings')?.update({
          default_hashtags: hashtags,
          updated_at: new Date()?.toISOString()
        })?.eq('user_id', userId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateNotificationSettings(userId, notifications) {
    try {
      const { data, error } = await supabase?.from('user_settings')?.update({
          notification_settings: notifications,
          updated_at: new Date()?.toISOString()
        })?.eq('user_id', userId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async addContentTemplate(userId, template) {
    try {
      // First get current templates
      const { data: currentSettings } = await this.getUserSettings(userId)
      const currentTemplates = currentSettings?.content_templates || []
      
      const newTemplate = {
        id: Date.now()?.toString(),
        name: template?.name,
        content: template?.content,
        hashtags: template?.hashtags || [],
        created_at: new Date()?.toISOString()
      }
      
      const updatedTemplates = [...currentTemplates, newTemplate]
      
      const { data, error } = await supabase?.from('user_settings')?.update({
          content_templates: updatedTemplates,
          updated_at: new Date()?.toISOString()
        })?.eq('user_id', userId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updateContentTemplate(userId, templateId, updates) {
    try {
      const { data: currentSettings } = await this.getUserSettings(userId)
      const currentTemplates = currentSettings?.content_templates || []
      
      const updatedTemplates = currentTemplates?.map(template => 
        template?.id === templateId 
          ? { ...template, ...updates, updated_at: new Date()?.toISOString() }
          : template
      )
      
      const { data, error } = await supabase?.from('user_settings')?.update({
          content_templates: updatedTemplates,
          updated_at: new Date()?.toISOString()
        })?.eq('user_id', userId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async deleteContentTemplate(userId, templateId) {
    try {
      const { data: currentSettings } = await this.getUserSettings(userId)
      const currentTemplates = currentSettings?.content_templates || []
      
      const updatedTemplates = currentTemplates?.filter(template => 
        template?.id !== templateId
      )
      
      const { data, error } = await supabase?.from('user_settings')?.update({
          content_templates: updatedTemplates,
          updated_at: new Date()?.toISOString()
        })?.eq('user_id', userId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}