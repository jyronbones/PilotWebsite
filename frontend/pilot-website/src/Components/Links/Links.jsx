import React from 'react'
import './Links.css'

const Links = () => {
  const links = [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'District One Pilots', url: 'https://www.districtonepilots.com' },
    { name: 'Test', url: 'https://www.test.com' }
  ]

  return (
    <div className='links-container'>
      <h2 className='links-header'>Useful Links</h2>
      <ul className='links-list'>
        {links.map((link) => (
          <li key={link.url} className='link-item'>
            <a href={link.url} className='link-anchor' target='_blank' rel='noopener noreferrer'>
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Links
// test
