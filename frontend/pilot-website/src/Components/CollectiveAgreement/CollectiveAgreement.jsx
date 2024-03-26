import React, { useState, useEffect } from 'react'
import './CollectiveAgreement.css'
//import { Link } from 'react-router-dom'
import UploadPDF from './UploadComponents/UploadPDF'
// import EditPDF from './UploadComponents/EditPDF'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const UnionAgreement = () => {
  const [files, setFiles] = useState([])
  const [tab, setTab] = useState(0)
  useEffect(() => {
    fetchFiles()
  }, []) //files

  const handleTabChange = (event, newTab) => {
    setTab(newTab)
  }

  const handleDelete = async (filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        await axios.delete(`${API_URL}/delete-file/${filename}`)
        setFiles(files.filter((file) => file.filename !== filename))
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }
  }

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`${API_URL}/download-file/${filename}`, {
        responseType: 'blob' // Important: responseType must be 'blob' for file download
      })

      // Create a temporary URL for the file blob
      const url = window.URL.createObjectURL(new Blob([response.data]))

      // Create a temporary link element and click it to trigger the download
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      // Clean up the temporary URL and link element
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const handleUpload = () => {
    // Call fetchFiles after successful upload
    fetchFiles()
  }

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/list-files`)
      setFiles(response.data.files)
    } catch (error) {
      console.error('Error listing files from S3:', error)
      setFiles([])
    }
  }

  const hasUnionFiles = files?.some((file) => file.category === 'Union Agreement')
  const hasCorportateFiles = files?.some((file) => file.category === 'Corporate Bylaw')
  const hasRulesFiles = files?.some((file) => file.category === 'Working Rules')
  const hasOtherFiles = files?.some((file) => file.category === 'Other')

  return (
    <>
      <div className='union-container'>
        <h2>Collective Agreements</h2>
        <div className='p-2 p-md-4'>
          {sessionStorage.getItem('user_type') == 1 && (
            <div className='create-btn'>
              <UploadPDF onUpload={handleUpload} />
            </div>
          )}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={handleTabChange} aria-label='basic tabs example'>
                <Tab label='Union Agreements' {...a11yProps(0)} />
                <Tab label='Corportate Bylaws' {...a11yProps(1)} />
                <Tab label='Working Rules' {...a11yProps(2)} />
                <Tab label='Other Files' {...a11yProps(3)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
              {/* UNION AGREEMENTS */}
              <div className='union-table-container'>
                <section className='scroll-section pt-3 table-main table-responsive' id='hoverableRows'>
                  <table className='custom-union-table'>
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Date Uploaded</th>
                        <th>Category</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files?.length > 0 && hasUnionFiles ? (
                        <>
                          {files
                            .filter((file) => file.category === 'Union Agreement')
                            .map((file, index) => (
                              <tr key={index}>
                                <td>{file.filename.split('.').slice(0, -1).join('.')}</td>
                                <td>{file.dateAdded}</td>
                                <td>{file.category}</td>
                                <td>
                                  <div className='action-container'>
                                    {sessionStorage.getItem('user_type') == 1 && (
                                      <button className='action-button' onClick={() => handleDelete(file.filename)}>
                                        Delete
                                      </button>
                                    )}
                                    <button className='action-button' onClick={() => handleDownload(file.filename)}>
                                      Download
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={4}>No Union Agreement File</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
              {/* CORPORATE BYLAWS */}
              <div className='union-table-container'>
                <section className='scroll-section pt-3 table-main table-responsive' id='hoverableRows'>
                  <table className='custom-union-table'>
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Date Uploaded</th>
                        <th>Category</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files?.length > 0 && hasCorportateFiles ? (
                        <>
                          {files
                            .filter((file) => file.category === 'Corporate Bylaw')
                            .map((file, index) => (
                              <tr key={index}>
                                <td>{file.filename.split('.').slice(0, -1).join('.')}</td>
                                <td>{file.dateAdded}</td>
                                <td>{file.category}</td>
                                <td>
                                  <div className='action-container'>
                                    {sessionStorage.getItem('user_type') == 1 && (
                                      <button className='action-button' onClick={() => handleDelete(file.filename)}>
                                        Delete
                                      </button>
                                    )}
                                    <button className='action-button' onClick={() => handleDownload(file.filename)}>
                                      Download
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={4}>No Corporate Bylaw File</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={2}>
              {/* WORKING RULES */}
              <div className='union-table-container'>
                <section className='scroll-section pt-3 table-main table-responsive' id='hoverableRows'>
                  <table className='custom-union-table'>
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Date Uploaded</th>
                        <th>Category</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files?.length > 0 && hasRulesFiles ? (
                        <>
                          {files
                            .filter((file) => file.category === 'Working Rules')
                            .map((file, index) => (
                              <tr key={index}>
                                <td>{file.filename.split('.').slice(0, -1).join('.')}</td>
                                <td>{file.dateAdded}</td>
                                <td>{file.category}</td>
                                <td>
                                  <div className='action-container'>
                                    {sessionStorage.getItem('user_type') == 1 && (
                                      <button className='action-button' onClick={() => handleDelete(file.filename)}>
                                        Delete
                                      </button>
                                    )}
                                    <button className='action-button' onClick={() => handleDownload(file.filename)}>
                                      Download
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={4}>No Working Rules File</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={3}>
              {/* OTHER FILES */}
              <div className='union-table-container'>
                <section className='scroll-section pt-3 table-main table-responsive' id='hoverableRows'>
                  <table className='custom-union-table'>
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Date Uploaded</th>
                        <th>Category</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files?.length > 0 && hasOtherFiles ? (
                        <>
                          {files
                            .filter((file) => file.category === 'Other')
                            .map((file, index) => (
                              <tr key={index}>
                                <td>{file.filename.split('.').slice(0, -1).join('.')}</td>
                                <td>{file.dateAdded}</td>
                                <td>{file.category}</td>
                                <td>
                                  <div className='action-container'>
                                    {sessionStorage.getItem('user_type') == 1 && (
                                      <button className='action-button' onClick={() => handleDelete(file.filename)}>
                                        Delete
                                      </button>
                                    )}
                                    <button className='action-button' onClick={() => handleDownload(file.filename)}>
                                      Download
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={4}>No Other Files</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </div>
            </CustomTabPanel>
          </Box>
        </div>
      </div>
    </>
  )
}

export default UnionAgreement
