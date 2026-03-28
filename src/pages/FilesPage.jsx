import { useEffect, useState } from 'react'
import { uploadLogo } from '../api/fileApi'
import { getAllUsers, updateUser } from '../api/userApi'

export default function FilesPage() {
  const [users, setUsers] = useState([])
  const [logoFile, setLogoFile] = useState(null)
  const [companyId, setCompanyId] = useState('')
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

  const handleLogoUpload = async (e) => {
    e.preventDefault()
    try {
      // 1. upload logo to file service
      const res = await uploadLogo(logoFile, companyId)
      const logoUrl = res.data.url

      // 2. save URL back to user service
      await updateUser(companyId, { logoUrl })

      notify('Logo uploaded and saved to company profile!')
      setLogoFile(null)
      setCompanyId('')
      load()
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to upload logo', 'error')
    }
  }

  const clients = users.filter(u => u.role === 'CLIENT')
  const freelancers = users.filter(u => u.role === 'FREELANCER')

  return (
    <div style={s.page}>
      <h2>Files</h2>
      {msg.text && <div style={msg.type === 'error' ? s.error : s.success}>{msg.text}</div>}

      <div style={s.card}>
        <h3>Upload Company Logo</h3>
        <p style={s.hint}>Logo will be saved to the client's profile</p>
        <form onSubmit={handleLogoUpload} style={s.form}>
          <select style={s.input} value={companyId}
            onChange={e => setCompanyId(e.target.value)} required>
            <option value="" disabled>Select Client (Company)</option>
            {clients.map(u => (
              <option key={u.id} value={u.id}>{u.fullName} — {u.email}</option>
            ))}
          </select>
          <input type="file" accept="image/png,image/jpeg,image/webp"
            onChange={e => setLogoFile(e.target.files[0])} required />
          <button style={s.btn} type="submit">Upload Logo</button>
        </form>
      </div>

      {/* Clients with logos */}
      <h3 style={{ margin: '28px 0 12px' }}>Company Logos</h3>
      <div style={s.logoGrid}>
        {clients.length === 0 && <p style={s.empty}>No clients yet</p>}
        {clients.map(u => (
          <div key={u.id} style={s.logoCard}>
            {u.logoUrl
              ? <img src={u.logoUrl} alt={u.fullName} style={s.logo} />
              : <div style={s.logoPlaceholder}>No Logo</div>}
            <p style={s.logoName}>{u.fullName}</p>
            <p style={s.logoEmail}>{u.email}</p>
          </div>
        ))}
      </div>

      {/* Freelancers with resumes */}
      <h3 style={{ margin: '28px 0 12px' }}>Freelancer Resumes</h3>
      <table style={s.table}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Resume</th></tr>
        </thead>
        <tbody>
          {freelancers.length === 0 && (
            <tr><td colSpan={3} style={s.empty}>No freelancers yet</td></tr>
          )}
          {freelancers.map(u => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>
                {u.resumeUrl
                  ? <a href={u.resumeUrl} target="_blank" rel="noreferrer" style={s.link}>📄 View Resume</a>
                  : <span style={{ color: '#aaa', fontSize: '13px' }}>Not uploaded</span>}
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
  card: { background: '#f9f9f9', padding: '24px', borderRadius: '10px', maxWidth: '500px', marginBottom: '28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' },
  input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  btn: { padding: '9px 20px', background: '#7c6af7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 },
  table: { width: '100%', borderCollapse: 'collapse' },
  logoGrid: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' },
  logoCard: { background: '#f9f9f9', borderRadius: '10px', padding: '16px', textAlign: 'center', minWidth: '140px' },
  logo: { width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px' },
  logoPlaceholder: { width: '80px', height: '80px', background: '#e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#888', margin: '0 auto' },
  logoName: { fontWeight: 500, marginTop: '8px', fontSize: '14px' },
  logoEmail: { fontSize: '12px', color: '#888' },
  empty: { color: '#888', padding: '16px 0' },
  error: { background: '#fff5f5', color: '#c53030', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px' },
  success: { background: '#f0fff4', color: '#276749', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px' },
  hint: { color: '#888', fontSize: '13px', margin: '4px 0 0' },
  link: { color: '#7c6af7', fontSize: '13px' },
}