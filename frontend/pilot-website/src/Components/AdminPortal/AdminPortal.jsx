import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import moment from 'moment'
import './AdminPortal.css'

const API_URL = process.env.REACT_APP_API_URL

const AdminPortal = () => {
  const [list, setList] = useState([])
  const [editUserData, setEditUserData] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleClose = () => {
    setIsModalOpen(false)
    setName('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = () => {
    if (Object.keys(editUserData).length > 0) {
      updateUser({ name, email, password })
    } else {
      createUser({ name, email, password })
    }
    handleClose()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setList(data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const createUser = async ({ name, email, password }) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ full_name: name, email, password })
      })

      if (response.ok) {
        fetchUsers()
      } else {
        alert('Error')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const updateUser = async ({ name, email, password }) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ user_id: editUserData.id, full_name: name, email, password })
      })

      if (response.ok) {
        fetchUsers()
      } else {
        alert('Error')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const changeUserStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/user?user_id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        }
      })

      if (response.ok) {
        fetchUsers()
        alert('User deleted')
      } else {
        const errorMessage = await response.text()
        alert(`Error: ${errorMessage}`)
      }
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  useEffect(() => {
    setName(editUserData?.full_name)
    setEmail(editUserData?.email)
    setPassword(editUserData.password)
  }, [editUserData])

  return (
    <>
      <div className='admin-container'>
        <h2>Users List</h2>

        <div className='p-2 p-md-4'>
          <div className='create-btn'>
            <Button variant='primary' className='ml-1 pr-0 w-100 fs-12' onClick={() => setIsModalOpen(true)}>
              <span className='fs-12'>Create User</span>
            </Button>
          </div>

          <div className='user-table-container'>
            <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
              <table className='custom-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list?.length > 0 ? (
                    <>
                      {list?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.full_name}</td>
                          <td>{item?.email}</td>
                          <td>{moment(item?.created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
                          <td>{moment(item?.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
                          <td>
                            <div className='action-container'>
                              <button className='delete-button' onClick={() => changeUserStatus(item.id)}>
                                Delete
                              </button>
                              <button
                                className='edit-button'
                                onClick={() => {
                                  setEditUserData(item)
                                  setIsModalOpen(true)
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5}>Not found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <span className='close-button' onClick={handleClose}>
              &times;
            </span>
            <div className='modal-body'>
              <label>
                Name:
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Email:
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              {Object.keys(editUserData).length === 0 && (
                <label>
                  Password:
                  <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
              )}
              <button onClick={handleSubmit}>{Object.keys(editUserData).length > 0 ? 'Edit' : 'Create'} user</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminPortal
