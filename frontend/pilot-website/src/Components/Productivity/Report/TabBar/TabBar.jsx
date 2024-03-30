import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import './TabBar.css'

const TabBar = ({ tabNames, activeTab, setActiveTab }) => {
  TabBar.propTypes = {
    tabNames: PropTypes.array.isRequired,
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired
  }

  const [year, setYear] = useState('2024')
  const array = ['2024', '2025', '2026', '2027']

  return (
    <>
      <div className='tab-container'>
        <div className='tab-section'>
          <div className='tab'>
            {/* <select value={year} onChange={(e) => setYear(e.target.value)} style={{ width: 'auto' }}>
              {array.map((year, key) => (
                <option value={key} key={key}>
                  {year}
                </option>
              ))}
            </select> */}
            <Autocomplete
              id='size-small-outlined'
              size='small'
              sx={{ width: 150, height: 30 }}
              value={year}
              options={array}
              getOptionLabel={(option) => option}
              onChange={(e, selectedYear) => setYear(selectedYear)}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => <TextField {...params} label='Select User' placeholder='User Name' />}
            />
          </div>
        </div>
        {tabNames.map((tabName, key) => (
          <div key={key} className={`tab-section ${activeTab == tabName ? 'active' : ''}`}>
            <div
              className={`tab ${activeTab == tabName ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tabName)
              }}
            >
              {tabName}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default TabBar
