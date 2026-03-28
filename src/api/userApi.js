import API from './config'

export const getAllUsers = () => API.get('/api/users')
export const getUserById = (id) => API.get(`/api/users/${id}`)
export const createUser = (data) => API.post('/api/users/register', data)
export const updateUser = (id, data) => API.patch(`/api/users/${id}`, data)
export const deleteUser = (id) => API.delete(`/api/users/${id}`)