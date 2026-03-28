import { useEffect, useState } from 'react'
import { getAllUsers, createUser, updateUser, deleteUser } from '../api/userApi'
import { uploadResume } from '../api/fileApi'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'CLIENT' })
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeUserId, setResumeUserId] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })

  const notify = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  const load = async () => {
    try {
      const res = await getAllUsers()
      setUsers(res.data)
    } catch {
      notify('Failed to load users', 'error')
    }
  }

  useEffect(() => { load() }, [])

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await createUser(form)
      setForm({ fullName: '', email: '', password: '', role: 'CLIENT' })
      notify('User registered!')
      load()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to register', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await deleteUser(id)
      notify('User deleted!')
      load()
    } catch {
      notify('Failed to delete user', 'error')
    }
  }

  const handleResumeUpload = async (e) => {
    e.preventDefault()
    try {
      // 1. upload file to file service
      const res = await uploadResume(resumeFile, resumeUserId)
      const resumeUrl = res.data.url

      // 2. save URL back to user service
      await updateUser(resumeUserId, { resumeUrl })

      notify('Resume uploaded and saved to profile!')
      setResumeFile(null)
      setResumeUserId('')
      load()  // reload to show updated resumeUrl in table
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to upload resume', 'error')
    }
  }

  return (
    <div style={s.page}>
      <h2>Users</h2>
      {msg.text && <div style={msg.type === 'error' ? s.error : s.success}>{msg.text}</div>}

      <div style={s.grid}>
        {/* Register */}
        <div style={s.card}>
          <h3>Register User</h3>
          <form onSubmit={handleRegister} style={s.form}>
            <input style={s.input} placeholder="Full Name" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} required />
            <input style={s.input} placeholder="Email" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input style={s.input} placeholder="Password" type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
            <select style={s.input} value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="CLIENT">Client (posts jobs)</option>
              <option value="FREELANCER">Freelancer (applies)</option>
            </select>
            <button style={s.btn} type="submit">Register</button>
          </form>
        </div>

        {/* Upload Resume */}
        <div style={s.card}>
          <h3>Upload Resume</h3>
          <p style={s.hint}>Upload CV for a Freelancer — saves URL to their profile</p>
          <form onSubmit={handleResumeUpload} style={s.form}>
            <select style={s.input} value={resumeUserId}
              onChange={e => setResumeUserId(e.target.value)} required>
              <option value="" disabled>Select Freelancer</option>
              {users.filter(u => u.role === 'FREELANCER').map(u => (
                <option key={u.id} value={u.id}>{u.fullName} — {u.email}</option>
              ))}
            </select>
            <input type="file" accept=".pdf,.doc,.docx"
              onChange={e => setResumeFile(e.target.files[0])} required />
            <button style={s.btn} type="submit">Upload Resume</button>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <h3 style={{ margin: '28px 0 12px' }}>All Users ({users.length})</h3>
      <table style={s.table}>
        <thead>
          <tr><th>ID</th><th>Full Name</th><th>Email</th><th>Role</th><th>Resume/Logo</th><th>Action</th></tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan={6} style={s.empty}>No users yet</td></tr>
          )}
          {users.map(u => (
            <tr key={u.id}>
              <td><code>{u.id}</code></td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td><span style={u.role === 'CLIENT' ? s.badgeBlue : s.badgePurple}>{u.role}</span></td>
              <td>
                {u.resumeUrl && <a href={u.resumeUrl} target="_blank" rel="noreferrer" style={s.fileLink}>📄 Resume</a>}
                {u.logoUrl && <a href={u.logoUrl} target="_blank" rel="noreferrer" style={s.fileLink}>🖼 Logo</a>}
                {!u.resumeUrl && !u.logoUrl && <span style={{ color: '#aaa', fontSize: '12px' }}>none</span>}
              </td>
              <td>
                <button style={s.deleteBtn} onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const s = {
  page: { padding: '32px' },
  grid: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  card: { background: '#f9f9f9', padding: '24px', borderRadius: '10px', flex: 1, minWidth: '280px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' },
  input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  btn: { padding: '9px 20px', background: '#7c6af7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 },
  deleteBtn: { padding: '4px 12px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  empty: { textAlign: 'center', padding: '20px', color: '#888' },
  error: { background: '#fff5f5', color: '#c53030', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px' },
  success: { background: '#f0fff4', color: '#276749', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px' },
  hint: { color: '#888', fontSize: '13px', margin: '4px 0 0' },
  badgeBlue: { background: '#ebf8ff', color: '#2b6cb0', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
  badgePurple: { background: '#faf5ff', color: '#6b46c1', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' },
  fileLink: { fontSize: '13px', marginRight: '8px', color: '#7c6af7' },
}