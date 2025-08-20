import { supabase } from '../lib/supabase';

export const postsService = {
  async createPost(postData) {
    try {
      const { data, error } = await supabase?.from('linkedin_posts')?.insert([{
          user_id: postData?.user_id,
          title: postData?.title,
          content: postData?.content,
          post_type: postData?.post_type,
          status: postData?.status || 'draft',
          scheduled_for: postData?.scheduled_for,
          first_comment: postData?.first_comment,
          hashtags: postData?.hashtags || [],
          media_ids: postData?.media_ids || []
        }])?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async updatePost(postId, updates) {
    try {
      const { data, error } = await supabase?.from('linkedin_posts')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', postId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async deletePost(postId) {
    try {
      const { error } = await supabase?.from('linkedin_posts')?.delete()?.eq('id', postId)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  async getUserPosts(userId, status = null) {
    try {
      let query = supabase?.from('linkedin_posts')?.select(`
          *,
          media_library!inner(
            id,
            filename,
            file_url,
            media_type,
            thumbnail_url
          ),
          post_analytics(
            impressions,
            clicks,
            likes,
            comments,
            shares,
            engagement_rate
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false })
      
      if (status) {
        query = query?.eq('status', status)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async getScheduledPosts(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase?.from('linkedin_posts')?.select(`
          id,
          title,
          content,
          post_type,
          scheduled_for,
          hashtags,
          media_ids,
          status
        `)?.eq('user_id', userId)?.eq('status', 'scheduled')?.gte('scheduled_for', startDate)?.lte('scheduled_for', endDate)?.order('scheduled_for', { ascending: true })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async getDraftPosts(userId) {
    try {
      const { data, error } = await supabase?.from('linkedin_posts')?.select('*')?.eq('user_id', userId)?.eq('status', 'draft')?.order('updated_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async reschedulePost(postId, newScheduledTime) {
    try {
      const { data, error } = await supabase?.from('linkedin_posts')?.update({
          scheduled_for: newScheduledTime,
          status: 'scheduled',
          updated_at: new Date()?.toISOString()
        })?.eq('id', postId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async getPostAnalytics(postId) {
    try {
      const { data, error } = await supabase?.from('post_analytics')?.select('*')?.eq('post_id', postId)?.order('collected_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async updatePostAnalytics(postId, analyticsData) {
    try {
      const { data, error } = await supabase?.from('post_analytics')?.upsert({
          post_id: postId,
          linkedin_post_id: analyticsData?.linkedin_post_id,
          impressions: analyticsData?.impressions,
          clicks: analyticsData?.clicks,
          likes: analyticsData?.likes,
          comments: analyticsData?.comments,
          shares: analyticsData?.shares,
          engagement_rate: analyticsData?.engagement_rate,
          reach: analyticsData?.reach,
          collected_at: new Date()?.toISOString()
        })?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}