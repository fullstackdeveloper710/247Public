import { REQUEST_APPROVALS_TITLE } from "constants/title";
import React from "react";
import { Col, Row } from "react-bootstrap";
import ApprovalTable from "./ApprovalTable";

const Approval = () => {
  //Tab title
  document.title = REQUEST_APPROVALS_TITLE;
  
  return (
    <div className="mainWrapper clientUser">
      <div className="mainTitleWrapper ">
        <Row className="align-items-center">
          <Col sm={6} md={6}>
            <h2 className="mainTitle mb-0" id="table_info">
              Approval
            </h2>
          </Col>
        </Row>
      </div>
      <div className="main-content">
        <ApprovalTable/>
      </div>
    </div>
  );
};

export default Approval;
