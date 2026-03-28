import { useEffect, useState } from 'react'
import { getAllJobs, createJob, deleteJob } from '../api/jobApi'
import { getAllUsers } from '../api/userApi'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ title: '', description: '', budget: '', postedBy: '', userId: '' })
  const [msg, setMsg] = useState({ text: '', type: '' })

  const notify = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  const load = async () => {
    try {
      const [jobsRes, usersRes] = await Promise.all([getAllJobs(), getAllUsers()])
      setJobs(jobsRes.data)
      setUsers(usersRes.data)
    } catch {
      notify('Failed to load data', 'error')
    }
  }

  useEffect(() => { load() }, [])

  const handleUserSelect = (e) => {
    const user = users.find(u => u.id === Number(e.target.value))
    if (user) setForm({ ...form, userId: user.id, postedBy: user.fullName })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createJob(form)
      setForm({ title: '', description: '', budget: '', postedBy: '', userId: '' })
      notify('Job posted!')
      load()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to post job', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return
    try {
      await deleteJob(id)
      notify('Job deleted!')
      load()
    } catch {
      notify('Failed to delete job', 'error')
    }
  }

  return (
    <div style={s.page}>
      <h2>Jobs</h2>
      {msg.text && <div style={msg.type === 'error' ? s.error : s.success}>{msg.text}</div>}

      <div style={s.card}>
        <h3>Post a Job</h3>
        <p style={s.hint}>Select a registered Client user to post a job</p>
        <form onSubmit={handleCreate} style={s.form}>
          <select style={s.input} onChange={handleUserSelect} defaultValue="" required>
            <option value="" disabled>Select User (Client)</option>
            {users.filter(u => u.role === 'CLIENT').map(u => (
              <option key={u.id} value={u.id}>{u.fullName} — {u.email}</option>
            ))}
          </select>
          <input style={s.input} placeholder="Job Title" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input style={s.input} placeholder="Budget (e.g. $500)" value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })} required />
          <input style={s.input} placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} required />
          <button style={s.btn} type="submit">Post Job</button>
        </form>
      </div>

      <h3 style={{ margin: '28px 0 12px' }}>All Jobs ({jobs.length})</h3>
      <table style={s.table}>
        <thead>
          <tr><th>Title</th><th>Description</th><th>Budget</th><th>Posted By</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {jobs.length === 0 && (
            <tr><td colSpan={6} style={s.empty}>No jobs yet</td></tr>
          )}
          {jobs.map(j => (
            <tr key={j.id}>
              <td>{j.title}</td>
              <td>{j.description}</td>
              <td>{j.budget}</td>
              <td>{j.postedBy}</td>
              <td><span style={s.badge}>{j.status}</span></td>
              <td><button style={s.deleteBtn} onClick={() => handleDelete(j.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const s = {
  page: { padding: '32px' },
  card: { background: '#f9f9f9', padding: '24px', borderRadius: '10px', maxWidth: '600px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' },
  input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  btn: { padding: '9px 20px', background: '#7c6af7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 },
  deleteBtn: { padding: '4px 12px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  empty: { textAlign: 'center', padding: '20px', color: '#888' },
  error: { background: '#fff5f5', color: '#c53030', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px' },
  success: { background: '#f0fff4', color: '#276749', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px' },
  hint: { color: '#888', fontSize: '13px', margin: '4px 0 0' },
  badge: { background: '#f0fff4', color: '#276749', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
}