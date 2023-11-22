import { CLIENT_USERS_TITLE } from "constants/title";
import React from "react";
import { Col, Row } from "react-bootstrap";
import "./clientuser.scss";
import ClientUserTable from "./ClientUserTable";

const ClientUsers = () => {
  document.title = CLIENT_USERS_TITLE;
  return (
    <div className="mainWrapper clientUser">
      <div className="mainTitleWrapper ">
        <Row className="align-items-center">
          <Col sm={6} md={6}>
            <h2 className="mainTitle mb-0" id="table_info">
              Client / Users
            </h2>
          </Col>
        </Row>
      </div>
      <div className="main-content">
        <ClientUserTable/>
      </div>
    </div>
  );
};

export default ClientUsers;
