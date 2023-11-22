import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { MANAGE_USERS } from 'constants/title';
import './userManagement.scss'
import Table from './userTable';


const UserManagement = () => {
  document.title = MANAGE_USERS
  return (
    <div className='mainWrapper UM-Wrapper'>
      <div className='mainTitleWrapper '>
        <Row className='align-items-center'>
          <Col sm={6} md={6}>
            <h2 className='mainTitle mb-0' id="table_desc">User List</h2>
          </Col>
        </Row>
      </div>
      <div className='main-content'>
        <Table />
      </div>
    </div>
  )
}

export default UserManagement