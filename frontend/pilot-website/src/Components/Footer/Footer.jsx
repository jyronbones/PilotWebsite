import React from 'react'
import './Footer.css'

const FooterComponent = () => {
  return (
    <div className='footer'>
      <div className='footer-container'>
        <div className='footer-links'>
          <a href='https://glpms.pilotcontrol.ca/Login.aspx'>
            <div>
              <p>GLPMS Pilot Control Login</p>
            </div>
          </a>
          <a href='http://www.marinetraffic.com'>
            <div>
              <p>Marine Traffic</p>
            </div>
          </a>
          <a href='http://www.greatlakes-seaway.com'>
            <div>
              <p>Great Lakes Seaway</p>
            </div>
          </a>
          <a href='http://www.weather.gc.ca/marine'>
            <div>
              <p>Weather Marine</p>
            </div>
          </a>
          <a href='https://efiche.live.pilotagestlaurent.gc.ca/'>
            <div>
              <p>Pilotage St Laurent</p>
            </div>
          </a>
          <a href='http://www.tides.gc.ca/en/stations'>
            <div>
              <p>Tides Stations</p>
            </div>
          </a>
        </div>
      </div>
      <hr></hr>

      <div className='footer-container'>
        <div className='footer-copyright'>
          <p>@{new Date().getFullYear()} Team BEAM. All right reserved</p>
        </div>
      </div>
    </div>
  )
}

export default FooterComponent
