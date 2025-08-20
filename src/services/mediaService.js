import { supabase } from '../lib/supabase';

export const mediaService = {
  async uploadFile(file, userId, folderPath = 'uploads') {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${userId}/${folderPath}/${Date.now()}.${fileExt}`
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('media-library')?.upload(fileName, file, {
          upsert: true,
          cacheControl: '3600'
        })
      
      if (uploadError) throw uploadError
      
      // Get file URL
      const { data: urlData } = supabase?.storage?.from('media-library')?.getPublicUrl(fileName)
      
      // Determine media type
      const mediaType = this.getMediaType(file?.type)
      
      // Save to database
      const { data, error } = await supabase?.from('media_library')?.insert([{
          user_id: userId,
          filename: fileName,
          original_filename: file?.name,
          file_size: file?.size,
          media_type: mediaType,
          file_url: urlData?.publicUrl,
          folder_path: folderPath,
          metadata: {
            content_type: file?.type,
            last_modified: file?.lastModified
          }
        }])?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async getUserMedia(userId, mediaType = null, folderPath = null) {
    try {
      let query = supabase?.from('media_library')?.select('*')?.eq('user_id', userId)?.order('uploaded_at', { ascending: false })
      
      if (mediaType) {
        query = query?.eq('media_type', mediaType)
      }
      
      if (folderPath) {
        query = query?.eq('folder_path', folderPath)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  async deleteMedia(mediaId, userId) {
    try {
      // First get the file info
      const { data: mediaData, error: fetchError } = await supabase?.from('media_library')?.select('filename')?.eq('id', mediaId)?.eq('user_id', userId)?.single()
      
      if (fetchError) throw fetchError
      
      // Delete from storage
      const { error: storageError } = await supabase?.storage?.from('media-library')?.remove([mediaData?.filename])
      
      if (storageError) throw storageError
      
      // Delete from database
      const { error: dbError } = await supabase?.from('media_library')?.delete()?.eq('id', mediaId)?.eq('user_id', userId)
      
      if (dbError) throw dbError
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  async updateMediaTags(mediaId, tags) {
    try {
      const { data, error } = await supabase?.from('media_library')?.update({ tags })?.eq('id', mediaId)?.select()?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async getSignedUrl(fileName, expiresIn = 3600) {
    try {
      const { data, error } = await supabase?.storage?.from('media-library')?.createSignedUrl(fileName, expiresIn)
      
      if (error) throw error
      return { url: data?.signedUrl, error: null };
    } catch (error) {
      return { url: null, error }
    }
  },

  async searchMedia(userId, searchTerm) {
    try {
      const { data, error } = await supabase?.from('media_library')?.select('*')?.eq('user_id', userId)?.or(`original_filename.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)?.order('uploaded_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  getMediaType(mimeType) {
    if (mimeType?.startsWith('image/')) return 'image'
    if (mimeType?.startsWith('video/')) return 'video'
    if (mimeType === 'application/pdf') return 'pdf'
    return 'document'
  },

  async createFolder(userId, folderName, parentPath = '') {
    const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName
    
    try {
      // Create a dummy file to establish the folder structure
      const dummyFile = new Blob([''], { type: 'text/plain' })
      const fileName = `${userId}/${folderPath}/.keep`
      
      const { error } = await supabase?.storage?.from('media-library')?.upload(fileName, dummyFile)
      
      if (error) throw error
      return { folderPath, error: null }
    } catch (error) {
      return { folderPath: null, error }
    }
  }
}