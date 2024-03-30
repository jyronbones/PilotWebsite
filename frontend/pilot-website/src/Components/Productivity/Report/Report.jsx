import React, { useState } from 'react'
import { REPORT_HEADER } from '../../Constants/constants'
import TabBar from '../TabBar/TabBar'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import './Report.css'
import ProductivityReport from './ProductivityReport/ProductivityReport'
import DetailAssignments from './DetailAssignments/DetailAssignments'
import Summary from './Summary/Summary'
import Availability from './Availability/Availability'

const Report = () => {
  const currentYear = new Date().getFullYear()
  const [activeTab, setActiveTab] = useState('Productivity')
  const [year, setYear] = useState(currentYear)
  const array = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3]

  return (
    <div className='report-container'>
      <h3>Report</h3>
      <div className='report-header'>
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
          getOptionLabel={(option) => option.toString()}
          onChange={(e, selectedYear) => {
            if (selectedYear !== null) setYear(selectedYear)
          }}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => <TextField {...params} label='Select Year' placeholder='Year' />}
        />
        <TabBar setActiveTab={setActiveTab} activeTab={activeTab} tabNames={REPORT_HEADER} />
      </div>

      {activeTab === 'Productivity' && <ProductivityReport year={year} />}
      {activeTab === 'Detail Assignments' && <DetailAssignments />}
      {activeTab === 'Summary' && <Summary />}
      {activeTab === 'Availability' && <Availability />}
    </div>
  )
}

export default Report
