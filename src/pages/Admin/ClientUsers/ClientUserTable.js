import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import Datatable from "components/dataTable";
import moment from "moment";
import "./clientuser.scss";
import { dateFormat, getFirstAndLast, notAvailable } from "util/helpers";
import { ROUTES } from "routes/constant";
import { getClientUsersList } from "redux/asyncApi/userApi";

const ClientUserTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    loading,
    userAuth: { token },
  } = useSelector((state) => state.app) || {};
  const {
    clientUsers: { data, status },
  } = useSelector((state) => state.user) || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [focus, setFocus] = useState();

  useEffect(() => {
    dispatch(getClientUsersList(token));
  }, []);

  const cellRendrer = useCallback(
    (cell, row, column, index) => {
      if (column === "first_name") {
        return (
          <div className="user-group">
            {!row?.image ? (
              <span className="table_picture text-uppercase">
                {getFirstAndLast(row?.first_name, row?.last_name)}
              </span>
            ) : (
              <img
                src={row?.image}
                className="img-fluid table_picture "
                alt={""}
              />
            )}
            <span className="full-name ms-2 text-capitalize">{row?.name}</span>
          </div>
        );
      }

      if (column === "email") {
        return (
          <div id={row.id} className="d-flex align-items-center">
            <a
              className="text_dec_none"
              onClick={() => {
                navigate(ROUTES.USERS_FILE_DETAILS.replace(/:id/g, row.id));
              }}
            >
              {row?.email}
            </a>
          </div>
        );
      }
      if (column === "country") {
        return (
          <div>
            <span className="text-uppercase">{row.country}</span>
          </div>
        );
      }

      if (column === "created_at") {
        return (
          <div id={row.id}>{moment(row.created_at).format(dateFormat)}</div>
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
      if (column === "activity_status") {
        return (
          <div className="table-button d-flex text-capitalize">
            {row?.activity_status ?? notAvailable}
          </div>
        );
      }
      if (column === "user") {
        return (
          <div className="table-button d-flex text-capitalize">
            {row?.user ?? notAvailable}
          </div>
        );
      }
      if (column === "plan") {
        return (
          <div className="table-button d-flex text-capitalize">
            {row?.plan ?? notAvailable}
          </div>
        );
      }
      if (column === "user_status") {
        return (
          <div id={row.id}>
            <span className="role">{row.user_status}</span>
          </div>
        );
      }
      return row[column];
    },
    [focus]
  );

  const tableHead = [
    {
      key: "first_name",
      title: "USER LIST",
      sorting: true,
      searching: true,
      width: "20%",
    },
    {
      key: "email",
      title: "EMAIL",
      sorting: true,
      searching: true,
      width: "15%",
    },
    {
      key: "country",
      title: "COUNTRY",
      sorting: true,
      searching: false,
      width: "10%",
    },
    {
      key: "created_at",
      title: "CREATED ON",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "department",
      title: "DEPARTMENT",
      sorting: true,
      searching: false,
      width: "10%",
    },
    {
      key: "activity_status",
      title: "ACTIVITY STATUS",
      sorting: true,
      searching: false,
      width: "10%",
    },
    {
      key: "user",
      title: "USER",
      sorting: true,
      searching: false,
      width: "10%",
    },
    {
      key: "plan",
      title: "PLAN",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "user_status",
      title: "STATUS",
      sorting: true,
      searching: false,
      width: "10%",
    },
  ];
  return (
    <Fragment>
      {/* {!loading && status && ( */}
        <Datatable
          tableHead={tableHead}
          data={data}
          renderCell={cellRendrer}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          type="client-user"
          search={true}
          pageSizing={true}
          paginationBar={true}
          tableDescription="User List"
        />
      {/* )} */}
      {/* {!loading && !status && (
        <div className="no-record-main">
          <div className="no-record">No Record Found</div>
        </div>
      )} */}
    </Fragment>
  );
};

export default ClientUserTable;
