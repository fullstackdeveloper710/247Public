import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTablesComp from "components/dataTable";
import { orderListing } from "redux/asyncApi/orderApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "routes/constant";
import moment from "moment";
import { ORDER_STATUS_CLASS } from "constants/job_status";
import { dateFormat, notAvailable, usersTypes } from "util/helpers";
const OrderTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order_listing } = useSelector((state) => state.order) || {};
  const {
    loading,
    userAuth: {
      user: { id },
    },
  } = useSelector((state) => state.app);
  const { message, status } = order_listing || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { token, user: userDetails } = useSelector(
    (state) => state.app.userAuth
  );

  const { admin, superAdmin, rootAdmin, postpaidRoot, postpaidAdmin } =
    usersTypes;

  useEffect(() => {
    dispatch(orderListing(token));
  }, []);

  const cellRendrer = useCallback((cell, row, column, index) => {
    if (column === "id") {
      return (
        <div id={row.id} className="clientOrderCol">
          <a
            href="#"
            className="download-link"
            onClick={() =>
              navigate(ROUTES.ORDER_DETAILS + "/" + row.id, {
                state: {
                  id: row.id,
                  row,
                },
              })
            }
          >
            {"PORD-" + row?.id}
          </a>
        </div>
      );
    }

    if (column === "order_invoice_number") {
      return (
        <div id={row.id}>
          {row?.order_invoice_number ? (
            <div
              onClick={() =>
                navigate(ROUTES.ORDER_DETAILS + "/" + row.id, {
                  state: {
                    id: row.id,
                    row,
                  },
                })
              }
            >
              <a href="#" className="download-link">
                {row?.order_invoice_number}
              </a>
            </div>
          ) : (
            <span>{notAvailable}</span>
          )}
        </div>
      );
    }

    if (column === "order_generate_date") {
      return (
        <div id={row.id}>
          <span className="role">
            {moment(row.order_generate_date).format(dateFormat)}
          </span>
        </div>
      );
    }
    if (column === "order_total_pages") {
      return <div>{row?.order_total_pages}</div>;
    }
    if (column === "order_delivery_date") {
      return (
        <div id={row.id}>
          <span className="role">
            {moment(row?.order_delivery_date).format(dateFormat)}
          </span>
        </div>
      );
    }

    if (column === "department") {
      return (
        <div id={row.id}>
          <span className="role text-capitalize">
            {row?.department ?? notAvailable}
          </span>
        </div>
      );
    }

    if (column === "user") {
      return (
        <div id={row.id}>
          <span className="role text-capitalize">
            {id === row?.user?.id ? "Self" : row?.user?.name}
          </span>
        </div>
      );
    }

    if (column === "label_text") {
      return (
        <div>
          <span className={`_badge ${ORDER_STATUS_CLASS[row?.label_value]}`}>
            {row?.label_text}
          </span>
        </div>
      );
    }

    return row[column];
  }, []);

  const userWiseCondition =
    userDetails?.role === rootAdmin ||
    userDetails?.role === admin ||
    userDetails?.role === superAdmin ||
    userDetails?.role === postpaidRoot ||
    userDetails?.role === postpaidAdmin;

  const tableHead = [
    {
      key: "id",
      title: "ORDER NUMBER",
      sorting: true,
      searching: true,
      width: "15%",
    },
    {
      key: "order_invoice_number",
      title: "INVOICE NUMBER",
      sorting: true,
      searching: true,
      width: userWiseCondition ? "20%" : "25%",
    },
    {
      key: "order_generate_date",
      title: "DATE",
      sorting: true,
      searching: false,
      width: userWiseCondition ? "10%" : "20%",
    },
    {
      key: "order_total_pages",
      title: "TOTAL PAGES",
      sorting: true,
      searching: false,
      width: userWiseCondition ? "10%" : "20%",
    },
    {
      key: "order_delivery_date",
      title: "DATE OF DELIVERY",
      sorting: true,
      searching: false,
      width: userWiseCondition ? "15%" : "20%",
    },
    userWiseCondition && {
      key: "department",
      title: "DEPARTMENT",
      sorting: true,
      searching: false,
      width: "15%",
    },
    userWiseCondition && {
      key: "user",
      title: "ORDER BY",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "label_text",
      title: "STATUS",
      sorting: true,
      searching: false,
      width: "10%",
    },
  ];

  return (
    <div className="dt-responsive">
      {/* {!loading && status && ( */}
        <DataTablesComp
          tableHead={tableHead}
          data={order_listing?.order_list}
          renderCell={cellRendrer}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          type="order"
          search={true}
          pageSizing={true}
          paginationBar={true}
          // pageSize={true}
          tableDescription="Order List"
        />
      {/* )} */}
      {/* {!loading && !status && (
        <div className="no-record-main">
          <div className="no-record">{message ?? "No Record Found"}</div>
        </div>
      )} */}
    </div>
  );
};
export default OrderTable;
