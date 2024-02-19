import React, { useState, useEffect } from 'react'
import './UnionAgreement.css'
import UploadPDF from './UploadComponents/UploadPDF'
// import EditPDF from './UploadComponents/EditPDF'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

//const bucketName = 'awsbucket-files' //change this

// const listFilesFromS3 = async () => {
//   try {
//     const params = {
//       Bucket: bucketName
//     }
//     const data = await s3.listObjectsV2(params).promise()
//     const filePromises = data.Contents.map(async (object) => {
//       const tagsParams = {
//         Bucket: bucketName,
//         Key: object.Key
//       }
//       const tagsData = await s3.getObjectTagging(tagsParams).promise()
//       const fileTypeTag = tagsData.TagSet.find((tag) => tag.Key === 'filetype')
//       const fileType = fileTypeTag ? fileTypeTag.Value : 'Unknown'
//       return {
//         filename: object.Key,
//         dateAdded: new Date(object.LastModified).toLocaleDateString(),
//         fileType: fileType
//       }
//     })
//     return Promise.all(filePromises)
//   } catch (error) {
//     console.error('Error listing files from S3:', error)
//     return []
//   }
// }

const UnionAgreement = () => {
  const [files, setFiles] = useState([])
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/list-files`)
        setFiles(response.data.files)
      } catch (error) {
        console.error('Error listing files from S3:', error)
        setFiles([])
      }
    }
    fetchFiles()
  }, [])

  // const handleDownload = async (filename) => {
  //   try {
  //     const params = {
  //       Bucket: bucketName,
  //       Key: filename
  //     }
  //     const data = await s3.getObject(params).promise()
  //     const blob = new Blob([data.Body], { type: data.ContentType })
  //     const url = URL.createObjectURL(blob)
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.setAttribute('download', filename)
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //   } catch (error) {
  //     console.error('Error downloading file from S3:', error)
  //   }
  // }

  // const deleteFileFromS3 = async (filename) => {
  //   try {
  //     const params = {
  //       Bucket: bucketName,
  //       Key: filename
  //     }
  //     await s3.deleteObject(params).promise()
  //     console.log('File deleted successfully:', filename)
  //   } catch (error) {
  //     console.error('Error deleting file from S3:', error)
  //   }
  // }

  // const handleDelete = async (filename) => {
  //   if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
  //     await deleteFileFromS3(filename)
  //     // Refresh file list after filename
  //     const updatedFiles = await listFilesFromS3()
  //     setFiles(updatedFiles)
  //   }
  // }

  // const handleEdit = (index) => {
  //   setEditIndex(index)
  // }

  // const handleSaveEdit = (index, newFilename, newDate) => {
  //   const updatedFiles = [...agreements]
  //   updatedFiles[index].filename = newFilename
  //   updatedFiles[index].date = newDate
  //   setAgreements(updatedFiles)
  //   setEditIndex(-1)
  // }

  // const handleCancelEdit = () => {
  //   setEditIndex(-1)
  // }

  return (
    <>
      <div className='union-container'>
        <h2>Union Agreements</h2>
        <div className='p-2 p-md-4'>
          <div className='create-btn'>
            <UploadPDF onUpload={() => {}} />
          </div>

          <div className='union-table-container'>
            <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
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
                  {files?.length > 0 ? (
                    <>
                      {files.map((file, index) => (
                        <tr key={index}>
                          <td>{file.filename}</td>
                          <td>{file.dateAdded}</td>
                          <td>{file.category}</td>
                          <td>
                            <div className='action-container'>
                              <button className='action-button'>Edit</button> {/*TODO*/}
                              {/* <button className='action-button' onClick={() => handleDelete(file.filename)}>
                                Delete
                              </button> */}
                              {/* <button className='action-button' onClick={() => handleDownload(file.filename)}>
                                Download
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5}>No File</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default UnionAgreement
