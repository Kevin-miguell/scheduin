import { supabase } from '../lib/supabase';

export const analyticsService = {
  async getUserAnalytics(userId, dateRange = '30d') {
    try {
      let dateFilter = new Date()
      
      switch (dateRange) {
        case '7d':
          dateFilter?.setDate(dateFilter?.getDate() - 7)
          break
        case '30d':
          dateFilter?.setDate(dateFilter?.getDate() - 30)
          break
        case '90d':
          dateFilter?.setDate(dateFilter?.getDate() - 90)
          break
        default:
          dateFilter?.setDate(dateFilter?.getDate() - 30)
      }
      
      const { data, error } = await supabase?.from('linkedin_posts')?.select(`
          id,
          title,
          content,
          post_type,
          published_at,
          hashtags,
          post_analytics (
            impressions,
            clicks,
            likes,
            comments,
            shares,
            engagement_rate,
            reach,
            collected_at
          )
        `)?.eq('user_id', userId)?.eq('status', 'published')?.gte('published_at', dateFilter?.toISOString())?.order('published_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async getEngagementStats(userId, dateRange = '30d') {
    try {
      const { data: posts, error } = await this.getUserAnalytics(userId, dateRange)
      if (error) throw error
      
      // Calculate aggregate statistics
      const stats = posts?.reduce((acc, post) => {
        const analytics = post?.post_analytics?.[0]
        if (analytics) {
          acc.totalImpressions += analytics?.impressions || 0
          acc.totalClicks += analytics?.clicks || 0
          acc.totalLikes += analytics?.likes || 0
          acc.totalComments += analytics?.comments || 0
          acc.totalShares += analytics?.shares || 0
          acc.totalReach += analytics?.reach || 0
          acc.postCount += 1
        }
        return acc
      }, {
        totalImpressions: 0,
        totalClicks: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalReach: 0,
        postCount: 0
      })
      
      // Calculate averages
      const avgEngagementRate = stats?.postCount > 0 
        ? (stats?.totalLikes + stats?.totalComments + stats?.totalShares) / stats?.totalImpressions * 100 
        : 0
      
      return {
        data: {
          ...stats,
          avgEngagementRate: parseFloat(avgEngagementRate?.toFixed(2)),
          avgImpressionsPerPost: stats?.postCount > 0 ? Math.round(stats?.totalImpressions / stats?.postCount) : 0,
          clickThroughRate: stats?.totalImpressions > 0 ? parseFloat((stats?.totalClicks / stats?.totalImpressions * 100)?.toFixed(2)) : 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error }
    }
  },

  async getTopPerformingPosts(userId, limit = 10) {
    try {
      const { data, error } = await supabase?.from('linkedin_posts')?.select(`
          id,
          title,
          content,
          post_type,
          published_at,
          hashtags,
          post_analytics (
            impressions,
            clicks,
            likes,
            comments,
            shares,
            engagement_rate
          )
        `)?.eq('user_id', userId)?.eq('status', 'published')?.not('post_analytics', 'is', null)?.order('post_analytics(engagement_rate)', { ascending: false })?.limit(limit)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async getEngagementTrends(userId, dateRange = '30d') {
    try {
      let dateFilter = new Date()
      
      switch (dateRange) {
        case '7d':
          dateFilter?.setDate(dateFilter?.getDate() - 7)
          break
        case '30d':
          dateFilter?.setDate(dateFilter?.getDate() - 30)
          break
        case '90d':
          dateFilter?.setDate(dateFilter?.getDate() - 90)
          break
        default:
          dateFilter?.setDate(dateFilter?.getDate() - 30)
      }
      
      const { data, error } = await supabase?.from('post_analytics')?.select(`
          impressions,
          clicks,
          likes,
          comments,
          shares,
          engagement_rate,
          collected_at,
          linkedin_posts!inner (
            user_id,
            published_at
          )
        `)?.eq('linkedin_posts.user_id', userId)?.gte('collected_at', dateFilter?.toISOString())?.order('collected_at', { ascending: true })
      
      if (error) throw error
      
      // Group by date for trends
      const trendData = data?.reduce((acc, item) => {
        const date = new Date(item.collected_at)?.toISOString()?.split('T')?.[0]
        if (!acc?.[date]) {
          acc[date] = {
            date,
            impressions: 0,
            clicks: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            engagement_rate: 0,
            count: 0
          }
        }
        
        acc[date].impressions += item?.impressions || 0
        acc[date].clicks += item?.clicks || 0
        acc[date].likes += item?.likes || 0
        acc[date].comments += item?.comments || 0
        acc[date].shares += item?.shares || 0
        acc[date].engagement_rate += item?.engagement_rate || 0
        acc[date].count += 1
        
        return acc
      }, {})
      
      // Convert to array and calculate averages
      const trends = Object.values(trendData)?.map(item => ({
        ...item,
        engagement_rate: item?.count > 0 ? item?.engagement_rate / item?.count : 0
      }))
      
      return { data: trends, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async getHashtagPerformance(userId, limit = 20) {
    try {
      const { data, error } = await supabase?.from('linkedin_posts')?.select(`
          hashtags,
          post_analytics (
            impressions,
            likes,
            comments,
            shares,
            engagement_rate
          )
        `)?.eq('user_id', userId)?.eq('status', 'published')?.not('post_analytics', 'is', null)?.not('hashtags', 'is', null)
      
      if (error) throw error
      
      // Process hashtag performance
      const hashtagStats = {}
      
      data?.forEach(post => {
        const analytics = post?.post_analytics?.[0]
        if (analytics && post?.hashtags) {
          post?.hashtags?.forEach(hashtag => {
            if (!hashtagStats?.[hashtag]) {
              hashtagStats[hashtag] = {
                hashtag,
                totalImpressions: 0,
                totalLikes: 0,
                totalComments: 0,
                totalShares: 0,
                totalEngagement: 0,
                postCount: 0,
                avgEngagementRate: 0
              }
            }
            
            const stats = hashtagStats?.[hashtag]
            stats.totalImpressions += analytics?.impressions || 0
            stats.totalLikes += analytics?.likes || 0
            stats.totalComments += analytics?.comments || 0
            stats.totalShares += analytics?.shares || 0
            stats.totalEngagement += (analytics?.likes || 0) + (analytics?.comments || 0) + (analytics?.shares || 0)
            stats.postCount += 1
          })
        }
      })
      
      // Calculate averages and sort
      const hashtagPerformance = Object.values(hashtagStats)?.map(stats => ({
          ...stats,
          avgEngagementRate: stats?.totalImpressions > 0 
            ? (stats?.totalEngagement / stats?.totalImpressions * 100)
            : 0,
          avgImpressionsPerPost: stats?.postCount > 0 
            ? Math.round(stats?.totalImpressions / stats?.postCount)
            : 0
        }))?.sort((a, b) => b?.avgEngagementRate - a?.avgEngagementRate)?.slice(0, limit)
      
      return { data: hashtagPerformance, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async getOptimalPostingTimes(userId) {
    try {
      const { data, error } = await supabase?.from('linkedin_posts')?.select(`
          published_at,
          post_analytics (
            engagement_rate,
            likes,
            comments,
            shares
          )
        `)?.eq('user_id', userId)?.eq('status', 'published')?.not('post_analytics', 'is', null)?.not('published_at', 'is', null)
      
      if (error) throw error
      
      // Analyze posting times
      const timeSlots = {}
      
      data?.forEach(post => {
        const publishedDate = new Date(post.published_at)
        const hour = publishedDate?.getHours()
        const dayOfWeek = publishedDate?.getDay()
        const analytics = post?.post_analytics?.[0]
        
        if (analytics) {
          const key = `${dayOfWeek}-${hour}`
          if (!timeSlots?.[key]) {
            timeSlots[key] = {
              dayOfWeek,
              hour,
              totalEngagement: 0,
              postCount: 0,
              avgEngagementRate: 0
            }
          }
          
          const slot = timeSlots?.[key]
          slot.totalEngagement += (analytics?.likes || 0) + (analytics?.comments || 0) + (analytics?.shares || 0)
          slot.postCount += 1
          slot.avgEngagementRate += analytics?.engagement_rate || 0
        }
      })
      
      // Calculate averages and find optimal times
      const optimalTimes = // Only include slots with at least 2 posts
      Object.values(timeSlots)?.map(slot => ({
          ...slot,
          avgEngagementRate: slot?.postCount > 0 ? slot?.avgEngagementRate / slot?.postCount : 0,
          avgEngagement: slot?.postCount > 0 ? slot?.totalEngagement / slot?.postCount : 0
        }))?.filter(slot => slot?.postCount >= 2)?.sort((a, b) => b?.avgEngagementRate - a?.avgEngagementRate)?.slice(0, 10)
      
      return { data: optimalTimes, error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}