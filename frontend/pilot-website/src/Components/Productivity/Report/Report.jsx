import React, { useState, useEffect } from 'react'
import { REPORT_HEADER } from '../../Constants/constants'
import { PropTypes } from 'prop-types'
import TabBar from '../TabBar/TabBar'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import './Report.css'
import ProductivityReport from './ProductivityReport/ProductivityReport'
import Assignments from './Assignments/Assignments'
import Summary from './Summary/Summary'
import Availability from './Availability/Availability'

const Report = ({ array, year, setYear }) => {
  Report.propTypes = {
    array: PropTypes.array.isRequired,
    year: PropTypes.number.isRequired,
    setYear: PropTypes.func.isRequired
  }
  const [activeTab, setActiveTab] = useState('Productivity')

  useEffect(() => {}, [year])

  return (
    <div className='report-container'>
      <h3>Report</h3>
      <div className='report-header'>
        <Autocomplete
          className='dropdown year'
          id='size-small-outlined'
          size='small'
          sx={{ width: 150, height: 30 }}
          value={year}
          options={array}
          getOptionLabel={(option) => option.toString()}
          onChange={(e, selectedYear) => {
            if (selectedYear !== null) {
              setYear(selectedYear)
            }
          }}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => <TextField {...params} label='Select Year' placeholder='Year' />}
        />
        <TabBar setActiveTab={setActiveTab} activeTab={activeTab} tabNames={REPORT_HEADER} />
      </div>

      {activeTab === 'Productivity' && <ProductivityReport key={year} year={year} />}
      {activeTab === 'Assignments' && <Assignments key={year} year={year} />}
      {activeTab === 'Summary' && <Summary key={year} year={year} />}
      {activeTab === 'Availability' && <Availability key={year} year={year} />}
    </div>
  )
}

export default Report
