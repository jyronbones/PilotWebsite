import React from 'react'
import './Links.css'

const Links = () => {
  const links = [
    { name: 'GLPMS Pilot Control Login', url: 'https://glpms.pilotcontrol.ca/Login.aspx' },
    { name: 'Marine Traffic', url: 'http://www.marinetraffic.com' },
    { name: 'Great Lakes Seaway', url: 'http://www.greatlakes-seaway.com' },
    { name: 'Weather Marine', url: 'http://www.weather.gc.ca/marine' },
    { name: 'Pilotage St Laurent', url: 'http://www.efiche.live.pilotagestlaurent.gc.ca' },
    { name: 'Tides Stations', url: 'http://www.tides.gc.ca/en/stations' }
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
