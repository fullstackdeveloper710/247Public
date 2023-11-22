import React, { Fragment, useCallback, useEffect, useState } from "react";
import { EditIcon } from "assets/images";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchHolidayList, removeHoliday } from "redux/asyncApi/userApi";
import _ from "lodash";
import Datatable from "components/dataTable";
import moment from "moment";
import { Trash3 } from "assets/images";
import "./ManageHolidays.scss";
import ConfirmPopUp from "components/Confirm/ConfirmPopUp";
import { HOLIDAY_STATUS_CLASS } from "constants/job_status";
import { dateFormat } from "util/helpers";

const ManageHolidaysTable = ({ setLabel, setDataById }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    loading,
    userAuth: { token },
  } = useSelector((state) => state.app) || {};
  const { get_holidays, focusId } = useSelector((state) => state.user) || {};
  const { data, status } = get_holidays || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [focus, setFocus] = useState();
  const [id, setId] = useState({});

  // Modal Constants
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    dispatch(fetchHolidayList(token));
  }, []);

  // remove holidays
  const onConfirmHandler = () => {
    handleClose();
    const values = {
      ...id,
    };
    dispatch(removeHoliday({ token, values }));
  };

  const tableHead = [
    {
      key: "holiday_name",
      title: "HOLIDAY",
      sorting: true,
      searching: true,
      width: "20%",
    },
    {
      key: "day",
      title: "DAY",
      sorting: true,
      searching: true,
      width: "15%",
    },
    {
      key: "user_status",
      title: "STATUS",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "date",
      title: "DATE",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "user_id",
      title: "ACTION",
      sorting: false,
      searching: false,
      width: "15%",
    },
  ];

  const cellRendrer = useCallback(
    (cell, row, column, index) => {
      if (column === "holiday_name") {
        return (
          <div className="user-group">
            <span className="full-name ms-2">{row?.holiday_name}</span>
          </div>
        );
      }

      if (column === "day") {
        return (
          <div id={row.id} className="d-flex align-items-center">
            <span className="text_dec_none">{row?.day}</span>
          </div>
        );
      }

      if (column === "date") {
        return (
          <div id={row.id} className="d-flex align-items-center">
            <span className="text_dec_none">
              {moment(row?.date).format(dateFormat)}
            </span>
          </div>
        );
      }
      if (column === "user_status") {
        return (
          <div>
            <span
              className={`_badge ${
                HOLIDAY_STATUS_CLASS[row?.status]
              } text-capitalize`}
            >
              {row?.status}
            </span>
          </div>
        );
      }
      if (column === "is_admin") {
        return (
          <div id={row.id}>
            <span className="role">{row?.is_admin ? "Admin" : ""}</span>
          </div>
        );
      }
      if (column === "loggedin_time") {
        return <div id={row.id}>{moment(cell).format(dateFormat)}</div>;
      }
      if (column === "user_id") {
        return (
          <div className="table-button d-flex">
            <button
              className={`btn-table id${row.id}`}
              data-active={focusId === row.id ? true : false}
              id={row.id}
              aria-label={`Edit ${row?.holiday_name}`}
              type="button"
              autoFocus={focusId === row.id ? true : false}
              onClick={() => {
                setLabel("update");
                setDataById(row);
              }}
            >
              <EditIcon aria-hidden="true" focusable="false" />{" "}
            </button>
            <button
              className="trashicon mx-3"
              aria-labelledby={row.holiday_name}
              onClick={() => setId({ id: row?.id }) & handleShow()}
            >
              <Trash3 id={row.holiday_name} role="img" aria-label="Delete" />
            </button>
          </div>
        );
      }
      return row[column];
    },
    [focus]
  );

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
          type="holiday"
          search={false}
          pageSizing={true}
          paginationBar={true}
          tableDescription="Holiday List"
          filterSearch={true}
        />
      {/* )} */}
      {/* {!loading && !status && (
        <div className="no-record-main">
          <div className="no-record">{"No Record Found"}</div>
        </div>
      )} */}
      <ConfirmPopUp
        Icon={Trash3}
        heading="Delete holiday"
        confirmMsg="You are about to delete a holiday.Are you sure that you want to
        delete this holiday?"
        show={show}
        handleClose={handleClose}
        onConfirmHandler={onConfirmHandler}
      />
    </Fragment>
  );
};

export default ManageHolidaysTable;
