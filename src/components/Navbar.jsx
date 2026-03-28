import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const linkStyle = (path) => ({
    ...styles.link,
    color: pathname === path ? '#a78bfa' : '#cdd6f4',
    fontWeight: pathname === path ? '600' : '400',
  })

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>⚡ QuickHire</span>
      <div style={styles.links}>
        <Link to="/" style={linkStyle('/')}>Users</Link>
        <Link to="/jobs" style={linkStyle('/jobs')}>Jobs</Link>
        <Link to="/files" style={linkStyle('/files')}>Files</Link>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 32px', background: '#1e1e2e', color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  brand: { fontWeight: 700, fontSize: '20px', color: '#a78bfa' },
  links: { display: 'flex', gap: '28px' },
  link: { textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }
}