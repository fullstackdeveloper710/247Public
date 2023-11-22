import { WORKLOAD_TITLE } from "constants/title";
import React from "react";
import "./workload.scss";
import { Col, Row } from "react-bootstrap";
import WorkloadTable from "./WorkloadTable";

const Workload = () => {
  document.title = WORKLOAD_TITLE;
  return (
    <div className="mainWrapper workload">
      <div className="mainTitleWrapper ">
        <Row className="align-items-center">
          <Col sm={6} md={6}>
            <h2 className="mainTitle mb-0" id="table_info">
              Workload
            </h2>
          </Col>
        </Row>
      </div>
      <div className="main-content">
        <WorkloadTable />
      </div>
    </div>
  );
};

export default Workload;
