import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkloadListing } from "redux/asyncApi/userApi";
import _ from "lodash";
import Datatable from "components/dataTable";
import moment from "moment";
import "./workload.scss";
import {
  dateFormat,
  getFirstAndLast,
  // noRecordFound,
  notAvailable,
} from "util/helpers";
import { ORDER_STATUS_CLASS } from "constants/job_status";
import { ROUTES } from "routes/constant";

const DummyTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    loading,
    userAuth: { token },
  } = useSelector((state) => state.app) || {};
  const { workload_listing } = useSelector((state) => state.user) || {};
  const { files, status } = workload_listing;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchWorkloadListing(token));
  }, []);

  const tableHead = [
    {
      key: "name",
      title: "USER LIST",
      sorting: true,
      searching: true,
      width: "20%",
    },
    {
      key: "order_id",
      title: "ID",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "email",
      title: "EMAIL",
      sorting: true,
      searching: false,
      width: "20%",
    },
    {
      key: "original_file_name",
      title: "DOCUMENT NAME",
      sorting: true,
      searching: false,
      width: "20%",
    },
    {
      key: "file_page_count",
      title: "PAGES",
      sorting: true,
      searching: false,
      width: "5%",
    },
    {
      key: "file_deliver_date",
      title: "DELIVERY DATE",
      sorting: true,
      searching: true,
      width: "10%",
    },
    {
      key: "label_text",
      title: "STATUS",
      sorting: true,
      searching: false,
      width: "10%",
    },
  ];

  const cellRendrer = useCallback((cell, row, column, index) => {
    if (column === "name") {
      return (
        <div className="user-group">
          {row?.image === null ? (
            <span className="table_picture text-uppercase ">
              {row?.first_name && row?.last_name
                ? getFirstAndLast(row?.first_name, row?.last_name)
                : ""}
            </span>
          ) : (
            <img
              src={row?.image}
              className="img-fluid table_picture "
              alt={""}
            />
          )}
          <span className="full-name ms-2 text-capitalize">{`${row?.first_name} ${row?.last_name}`}</span>
        </div>
      );
    }

    if (column === "order_id") {
      return (
        <div id={row.id}>
          <div
            className="d-flex align-items-center"
            onClick={() =>
              navigate(ROUTES.DOCUMENT_DETAILS.replace(/:id/g, row.order_id), {
                state: {
                  id: row?.id,
                  user_id: row?.user_id,
                  order_id: row?.order_id,
                },
              })
            }
          >
            <a href={`#`} className="text_dec_none">
              {row?.order_invoice_number ?? notAvailable}
            </a>
          </div>
        </div>
      );
    }

    if (column === "email") {
      return (
        <div id={row.id} className="d-flex align-items-center">
          <a href={`mailto:${row?.email}`} className="text_dec_none">
            {row?.email}
          </a>
        </div>
      );
    }
    if (column === "original_file_name") {
      return (
        <div>
          <span>{row?.original_file_name}</span>
        </div>
      );
    }
    if (column === "file_page_count") {
      return (
        <div id={row.id}>
          <span className="role text-capitalize">{row?.file_page_count}</span>
        </div>
      );
    }
    if (column === "file_deliver_date") {
      return (
        <div id={row.id}>
          {row?.file_deliver_date
            ? moment(row.file_deliver_date).format(dateFormat)
            : "N/A"}
        </div>
      );
    }
    if (column === "label_text") {
      return (
        <span className={`_badge ${ORDER_STATUS_CLASS[row?.label_value]}`}>
          {row?.label_text}
        </span>
      );
    }
    return row[column];
  }, []);

  return (
    <Fragment>
      {/* {!loading && status && ( */}
      <Datatable
        tableHead={tableHead}
        data={files}
        renderCell={cellRendrer}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        setPageSize={setPageSize}
        pageSize={pageSize}
        type="workload"
        search={true}
        pageSizing={true}
        paginationBar={true}
        tableDescription="User List"
      />
      {/* )}
      {!loading && !status && (
        <div className="no-record-main">
          <div className="no-record">{noRecordFound}</div>
        </div>
      )} */}
    </Fragment>
  );
};

export default DummyTable;
