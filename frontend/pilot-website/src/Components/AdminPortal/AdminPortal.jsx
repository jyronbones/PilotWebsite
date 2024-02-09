import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './AdminPortal.css'

const API_URL = process.env.REACT_APP_API_URL

const AdminPortal = () => {
  const [list, setList] = useState([])
  const [editUserData, setEditUserData] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [userType, setUserType] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleClose = () => {
    setIsModalOpen(false)
    setName('')
    setEmail('')
    setPassword('')
    setUserType('')
    setEditUserData({})
  }

  const handleSubmit = () => {
    if (Object.keys(editUserData).length > 0) {
      updateUser({ name, email, password, user_type: userType })
    } else {
      createUser({ name, email, password, user_type: userType })
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
        setEditUserData({})
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
        setEditUserData({})
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
    setUserType(editUserData.user_type)
  }, [editUserData])

  return (
    <div className='user'>
      <Link to='/home' className='btn back'>
        Back to Home
      </Link>
      <div className='user-container'>
        <div className='user-header'>
          <div className='user-title'>
            <h1>Directory</h1>
            <p>{list?.length}</p>
          </div>
        </div>

        <div>
          <div className='create-btn'>
            <button className='btn create' onClick={() => setIsModalOpen(true)}>
              Create User
            </button>
          </div>

          <div className='user-table-container'>
            <section className='scroll-section pt-4 table-main table-responsive' id='hoverableRows'>
              <table className='user-table'>
                <thead>
                  <tr>
                    <th>User Information</th>
                    <th>User Type</th>
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
                          <td>
                            {item?.full_name}
                            <br />
                            {item?.email}
                          </td>
                          <td>{item?.user_type == 1 ? 'Admin' : 'User'}</td>
                          <td>{moment(item?.created_at).format('MM/DD/YYYY, h:mma')}</td>
                          <td>{moment(item?.updated_at).format('MM/DD/YYYY, h:mma')}</td>
                          <td>
                            <div className='action-container'>
                              <button
                                className='btn edit'
                                title='Edit User'
                                onClick={() => {
                                  setEditUserData(item)
                                  setIsModalOpen(true)
                                }}
                              >
                                Edit
                              </button>
                              <button className='btn delete' title='Delete User' onClick={() => changeUserStatus(item.id)}>
                                Delete
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
            <div className='modal-body admin'>
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
                  <span>Password:</span>
                  <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
              )}
              <label>
                User Type
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <option disabled selected>
                    Select user type
                  </option>
                  <option value='1'>Admin</option>
                  <option value='2'>User</option>
                </select>
              </label>
              <button className='btn create' onClick={handleSubmit}>
                {Object.keys(editUserData).length > 0 ? 'Edit' : 'Create'} user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPortal
