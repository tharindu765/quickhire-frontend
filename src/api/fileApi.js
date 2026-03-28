import API from './config'

export const uploadResume = (file, userId) => {
  const form = new FormData()
  form.append('file', file)
  form.append('userId', userId)
  return API.post('/api/files/resume/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const uploadLogo = (file, companyId) => {
  const form = new FormData()
  form.append('file', file)
  form.append('companyId', companyId)
  return API.post('/api/files/logo/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteFile = (url) => API.delete(`/api/files/delete?url=${encodeURIComponent(url)}`)