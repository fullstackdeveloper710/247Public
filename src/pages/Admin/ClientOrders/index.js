import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ClientOrdersTable from "./ClientOrdersTable";
import { useDispatch, useSelector } from "react-redux";
import {
  generateMultipleInvoices,
  getClientsOrderList,
} from "redux/asyncApi/orderApi";
import Button from "components/Button";
import CustomReactSelect from "components/CustomReactSelect";
import { getCustomUsers } from "redux/asyncApi/userApi";
import "./clientOrders.scss";
import { CLIENT_ORDER_TITLE } from "constants/title";
const ClientOrders = () => {
  document.title = CLIENT_ORDER_TITLE;
  const dispatch = useDispatch();
  const { customUsers } = useSelector((state) => state.user);
  const { clients_order_listing } = useSelector((state) => state.order) || {};
  const [selectedUser, setSelectedUser] = useState("");
  const {
    userAuth: { token },
  } = useSelector((state) => state.app) || {};
  const [ids, setIds] = useState([]);
  const handleGenerateInvoice = (event) => {
    event.preventDefault();
    if (ids.length > 0) {
      const values = { id: ids };
      dispatch(generateMultipleInvoices({ token, values }));
    }
  };

  useEffect(() => {
    if (!selectedUser) {
      dispatch(getCustomUsers(token));
    } else {
      const values = {
        selectedUserId: selectedUser,
      };
      dispatch(getClientsOrderList({ token, values }));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (customUsers?.data?.length > 0)
      setSelectedUser(customUsers?.data?.[0]?.value);
  }, [customUsers]);
  const selectOrganization = (e) => {
    setSelectedUser(e.value);
  };

  return (
    <div className="mainWrapper UM-Wrapper order-management-page">
      <div className="mainTitleWrapper ">
        <Row className="align-items-center">
          <Col sm={6} md={6} className="d-flex align-items-center">
            <h2 className="mainTitle mb-0" id="table_info">
              Order List
            </h2>
            <div className="mx-3 selectBox">
              <CustomReactSelect
                className=""
                value={
                  customUsers?.data?.filter(
                    (x) => x.value === parseInt(selectedUser)
                  )?.[0]
                }
                data={customUsers?.data}
                onSelectHandler={selectOrganization}
                showOptionBadge={true}
                isClearable={false}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className="main-content order-table">
        {/* {selectedUser && ( */}
          <ClientOrdersTable
            setIds={setIds}
            ids={ids}
            selectedUserId={selectedUser}
            GenerateInvBtn={
              ids.length > 0 && (
                <div className="me-3">
                  <Button
                    title={"Generate Invoice"}
                    className="btn btn--md button--blue"
                    onClick={handleGenerateInvoice}
                  />
                </div>
              )
            }
            orderData={clients_order_listing}
          />
        {/* )} */}
      </div>
    </div>
  );
};

export default ClientOrders;
