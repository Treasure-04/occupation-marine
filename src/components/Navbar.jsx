function Navbar() {
  return (
    <nav style={{backgroundColor: '#1e3a5f', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100}}>
      <div style={{color: 'white', fontSize: '1.2rem', fontWeight: 'bold'}}>
        ⚓ OCCUPATION MARINE SERVICES LTD
      </div>
      <div style={{display: 'flex', gap: '25px'}}>
        {['Home', 'About', 'Services', 'Contact'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} style={{color: 'white', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500'}}>
            {item}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Navbar