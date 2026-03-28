import API from './config'

export const getAllJobs = () => API.get('/api/jobs')
export const getJobsByUser = (postedBy) => API.get(`/api/jobs/user/${postedBy}`)
export const createJob = (data) => API.post('/api/jobs', data)
export const deleteJob = (id) => API.delete(`/api/jobs/${id}`)