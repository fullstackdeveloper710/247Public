import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  AddUserIcon,
  EditIcon,
  EmailSentIcon,
  VerticalDotsIcon,
} from "assets/images";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserListing,
  makeInactiveUser,
  switchUser,
  resendMail,
} from "redux/asyncApi/userApi";
import { removeMessage } from "redux/Slices/userSlice";
import _ from "lodash";
import Datatable from "components/dataTable";
import moment from "moment";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  bytesToSize,
  dateFormat,
  getFirstAndLast,
  noRecordFound,
  notAvailable,
  usersTypes,
} from "util/helpers";
import Button from "components/Button";
import { ROUTES } from "routes/constant";
import "./userManagement.scss";
import ConfirmPopUp from "components/Confirm/ConfirmPopUp";
import { message } from "util/message";

const DummyTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [focus, setFocus] = useState();
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState();

  //Redux state
  const {
    loading,
    userAuth: {
      token,
      user: { role },
    },
  } = useSelector((state) => state.app) || {};
  const { user_listing, addUpdateUser, focusId } =
    useSelector((state) => state.user) || {};

  const { user_list, status } = user_listing;
  const { success: Success, message: toastMsg } = addUpdateUser || {};

  //Redux function
  const dispatch = useDispatch();

  //Router functions
  const navigate = useNavigate();
  //const location = useLocation();

  //User roles
  const {
    user,
    admin,
    superAdmin,
    postpaidRoot,
    rootAdmin,
    postpaidAdmin,
    billingAdmin,
    companyUser,
  } = usersTypes;

  //Methods
  useEffect(() => {
    dispatch(fetchUserListing(token));
  }, []);

  useEffect(() => {
    if (Success) {
      dispatch(fetchUserListing(token));
    }
  }, [Success]);

  useEffect(() => {
    toast(toastMsg, { className: Success ? "_success" : "_error" });
    return () => {
      dispatch(removeMessage());
    };
  }, [toastMsg]);

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  //This method handle make admin and active or inactive user
  const userType = (type, id) => {
    if (type === "user") {
      setFocus(id);
      const values = { user_id: id };
      dispatch(makeInactiveUser({ token, values }));
    } else {
      setFocus(id);
      const values = { id, user_type: type };
      dispatch(switchUser({ token, values }));
    }
  };

  //This method handle resend email to user when existing email is expired.
  const resendEmailHandler = () => {
    const values = {
      user_id: userId,
    };
    dispatch(resendMail({ token, values })).then(({ payload }) => {
      if (payload.status) {
        handleClose();
      }
    });
  };

  const onConfirmHandler = () => {
    resendEmailHandler();
  };

  const roleSuperAdmin = role === superAdmin;

  //This array hanldle columns of datatable
  const tableHead = [
    {
      key: "name",
      title: "USER LIST",
      sorting: true,
      searching: true,
      width: roleSuperAdmin ? "17%" : "22%",
    },
    {
      key: "email",
      title: "EMAIL",
      sorting: true,
      searching: true,
      width: roleSuperAdmin ? "15%" : "15%",
    },
    {
      key: "user_status",
      title: "STATUS",
      sorting: true,
      searching: false,
      width: roleSuperAdmin ? "8%" : "10%",
    },
    {
      key: "is_admin",
      title: "ROLE",
      sorting: true,
      searching: false,
      width: roleSuperAdmin ? "10%" : "13%",
    },
    {
      key: "department",
      title: "Department",
      sorting: true,
      searching: false,
      width: roleSuperAdmin ? "10%" : "10%",
    },
    {
      key: "total_usage",
      title: "SPACE USED",
      sorting: true,
      searching: false,
      width: roleSuperAdmin ? "10%" : "10%",
    },
    {
      key: "loggedin_time",
      title: "LAST LOGGED IN",
      sorting: true,
      searching: false,
      width: roleSuperAdmin ? "10%" : "10%",
    },
    {
      key: "action",
      title: "ACTION",
      sorting: false,
      searching: false,
      width: roleSuperAdmin ? "10%" : "10%",
      theadId: "action",
    },
  ];
  if (role === superAdmin) {
    tableHead.splice(6, 0, {
      key: "created_at",
      title: "CREATED ON",
      sorting: true,
      searching: false,
      width: roleSuperAdmin ? "10%" : "10%",
    });
  }

  // This function hanldle columns data of datatable
  const cellRendrer = useCallback(
    (cell, row, column, index, tHeadId) => {
      if (column === "name") {
        return (
          <div className="user-group">
            {row?.image ? (
              <img
                src={row?.image}
                className="img-fluid table_picture "
                alt={""}
              />
            ) : (
              <span className="table_picture text-uppercase">
                {row?.first_name && row?.last_name
                  ? getFirstAndLast(row?.first_name, row?.last_name)
                  : ""}
              </span>
            )}
            <span className="full-name ms-2 text-capitalize">{`${row?.first_name} ${row?.last_name}`}</span>
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
      if (column === "user_status") {
        return (
          <div>
            <span className={`_badge ${cell === "1" ? "active" : "inactive"}`}>
              {cell === "1" ? "Active" : "Inactive"}
            </span>
          </div>
        );
      }
      if (column === "is_admin") {
        return (
          <div id={row.id}>
            <span className="role text-capitalize">{row?.role_name}</span>
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

      if (column === "total_usage") {
        return (
          <div id={row.id}>
            <span className="role text-capitalize">
              {bytesToSize(row?.total_usage)}
            </span>
          </div>
        );
      }

      if (column === "created_at") {
        return (
          <div id={row.id}>
            {row?.created_at
              ? moment(row.created_at).format(dateFormat)
              : notAvailable}
          </div>
        );
      }
      if (column === "loggedin_time") {
        return (
          <div id={row.id}>
            {row?.loggedin_time
              ? moment(row.loggedin_time).format(dateFormat)
              : notAvailable}
          </div>
        );
      }
      if (column === "action") {
        const allowOption =
          role === postpaidRoot || role === rootAdmin || role === superAdmin;

        const resendUserId = "resend_btn" + row?.id;
        const editUserId = "edit_btn" + row?.id;
        return (
          <div className="table-button d-flex">
            <div className="action_btn_group">
              {!row?.email_verify && (
                <button
                  title="Resend-email"
                  className={`btn-table id${row.id} resend_btn`}
                  data-active={focusId === row.id ? true : false}
                  id={resendUserId}
                  aria-labelledby={`${tHeadId} ${resendUserId} action`}
                  type="button"
                  autoFocus={focusId === row.id ? true : false}
                  onClick={() => {
                    handleShow();
                    setUserId(row?.id);
                  }}
                >
                  <EmailSentIcon aria-hidden="true" focusable="false" />
                </button>
              )}
              <button
                title="Edit-user"
                className={`btn-table id${row.id}`}
                data-active={focusId === row.id ? true : false}
                id={editUserId}
                aria-labelledby={`${tHeadId} ${editUserId} action`}
                type="button"
                autoFocus={focusId === row.id ? true : false}
                onClick={() => {
                  if (row?.user_role === postpaidRoot) {
                    navigate(
                      ROUTES.UPDATE_CUSTOM_USER.replace(/:id/g, row.id),
                      {
                        state: {
                          id: row.id,
                          mode: "edit",
                          user_role: row?.user_role,
                        },
                      }
                    );
                  } else {
                    navigate(ROUTES.UPDATE_USER.replace(/:id/g, row.id), {
                      state: { id: row.id, mode: "edit", user_role: row?.user_role },
                    });
                  }
                }}
              >
                <EditIcon aria-hidden="true" focusable="false" />
              </button>
            </div>
            <Dropdown className="btn-table ms-3 ">
              <Dropdown.Toggle
                variant=""
                data-active={focus === row.id ? true : false}
                autoFocus={focus === row.id ? true : false}
                className="border-btn btn-table"
                id="dropdown-basic"
                aria-label={`Status Options ${row?.full_name}`}
              >
                <VerticalDotsIcon aria-hidden="true" focusable="false" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  aria-label={
                    row.user_status === "1" ? "Inactive User" : "Active User"
                  }
                  id={cell}
                  tp="user"
                  onKeyPress={() => userType("user", row?.id)}
                  onClick={() => userType("user", row?.id)}
                >
                  {row.user_status === "1" ? "Inactive User" : "Active User"}
                </Dropdown.Item>
                {allowOption && (
                  <>
                    {row?.user_role !== admin &&
                      row?.user_role !== postpaidAdmin &&
                      row?.user_role !== billingAdmin &&
                      row?.user_role !== postpaidRoot &&
                      row?.user_role !== rootAdmin &&
                      row?.is_admin === "N" && (
                        <Dropdown.Item
                          aria-label="make admin"
                          className="text-capitalize"
                          id={cell}
                          tp="admin"
                          onKeyDown={() => userType("admin", row?.id)}
                          onClick={() => userType("admin", row?.id)}
                        >
                          make admin
                        </Dropdown.Item>
                      )}

                    {row?.user_role === postpaidAdmin &&
                      row?.is_admin === "Y" && (
                        <Dropdown.Item
                          aria-label="company user"
                          className="text-capitalize"
                          id={cell}
                          tp="company user"
                          onKeyDown={() => userType("company", row?.id)}
                          onClick={() => userType("company", row?.id)}
                        >
                          make company user
                        </Dropdown.Item>
                      )}

                    {(row?.user_role === admin ||
                      row?.user_role === companyUser) && (
                      <Dropdown.Item
                        aria-label="make billing admin"
                        className="text-capitalize"
                        id={cell}
                        tp="admin"
                        onKeyDown={() => userType("billing_admin", row?.id)}
                        onClick={() => userType("billing_admin", row?.id)}
                      >
                        make billing admin
                      </Dropdown.Item>
                    )}
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
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
          data={user_list}
          renderCell={cellRendrer}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          type="user"
          search={true}
          pageSizing={true}
          paginationBar={true}
          tableDescription="User List"
          AddUserButton={
            role !== superAdmin ? (
              <div className="btn_group ms-4 me-2">
                <Button
                  icon={<AddUserIcon />}
                  title={"Add User"}
                  className={"button--blue ms-auto"}
                  onClick={() => navigate(ROUTES.ADD_NEW_USER)}
                  autoFocus={true}
                />
              </div>
            ) : null
          }
          AddCustomUserButton={
            role === superAdmin ? (
              <div className="btn_group ms-4 me-2">
                <Button
                  icon={<AddUserIcon />}
                  title={"Add Postpaid Account"}
                  className={"button--blue ms-auto"}
                  onClick={() => navigate(ROUTES.ADD_NEW_CUSTOM_USER)}
                  autoFocus={true}
                />
              </div>
            ) : null
          }
        />
      {/* )}
      {!loading && !status && (
        <div className="no-record-main">
          <div className="no-record">{noRecordFound}</div>
        </div>
      )} */}
      <ConfirmPopUp
        // Icon={Trash3}
        heading={"confirmation"}
        confirmMsg={message.resendMailPopUp}
        show={show}
        handleClose={handleClose}
        onConfirmHandler={onConfirmHandler}
      />
    </Fragment>
  );
};

export default DummyTable;
