import React  from "react";
import { Row, Col } from "react-bootstrap";
import { ORDER_MANAGEMENT } from "constants/title";
import "./order.scss";
import OrderTable from "./OrderTable";

const OrderManagement = () => {
  document.title = ORDER_MANAGEMENT;
  return (
    <div className="mainWrapper UM-Wrapper order-management-page">
      <div className="mainTitleWrapper ">
        <Row className="align-items-center">
          <Col sm={6} md={6}>
            <h2 className="mainTitle mb-0" id="table_info">
              Order List
            </h2>
          </Col>
        </Row>
      </div>
      <div className="main-content order-table">
        <OrderTable />
      </div>
    </div>
  );
};

export default OrderManagement;
