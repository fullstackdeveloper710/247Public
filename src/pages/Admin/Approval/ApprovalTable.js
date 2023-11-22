import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Datatable from "components/dataTable";
import moment from "moment";
import Button from "components/Button";
import {
  currencyFormatter,
  dateFormat,
  getFirstAndLast,
  notAvailable,
  usersTypes,
} from "util/helpers";
import { InfoIcon } from "assets/images";
import { ORDER_STATUS_CLASS } from "constants/job_status";
import {
  approveOrder,
  getApprovelList,
  pendingApprovalCount,
} from "redux/asyncApi/orderApi";
import TextArea from "components/inputField/TextArea";
import CustomTooltip from "components/CustomTootip";
import CustomModal from "components/CustomModal";
import RechargeWallet from "../Wallet";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { validationMsg } from "util/validationErrors";
import { getBillingDetail } from "redux/asyncApi/appApi";
import { toast } from "react-toastify";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const ApprovalTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [focus, setFocus] = useState();
  const [show, setShow] = useState(false);
  const [id, setId] = useState();
  const [parentId, setParentId] = useState();
  const [isApprove, setIsApprove] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [errros, setErrors] = useState({});
  const [amount, setAmount] = useState(0);
  const [insuficent, setInsuficent] = useState();
  const [showWallet, setShowWallet] = useState(false);
  const [parentWallet, setParentWallet] = useState();
  const [parentName, setParentName] = useState();

  //redux state
  const {
    loading,
    userAuth: {
      token,
      user: { wallet_balance, role },
    },
  } = useSelector((state) => state.app) || {};
  const { approval_list } = useSelector((state) => state.order) || {};
  const { data, status } = approval_list || {};

  //Redux action dispatcher
  const dispatch = useDispatch();

  //User roles
  const { postpaidRoot, billingAdmin } = usersTypes;

  //Ref
  const remarksRef = useRef();

  //Methods
  const handleShow = () => {
    setShow(true);
    setInsuficent();
  };
  const handleClose = () => {
    setShow(false);
    setErrors({});
    setRemarks("");
  };

  const rechargeWalletHandler = () => {
    handleClose();
    setShowWallet(true);
  };
  const handleCloseWallet = () => {
    setShowWallet(false);
  };

  useEffect(() => {
    dispatch(getApprovelList(token));
  }, []);

  const validateForm = (values) => {
    const errors = {};
    if (values.remarks === "") {
      errors.remarks = validationMsg.remarksReq;
      remarksRef?.current?.focus();
    }
    return errors;
  };

  const onConfirmHandler = () => {
    let values;
    let error;
    if (isApprove) {
      values = {
        is_approved: "Y",
        is_rejected: "N",
        order_id: id,
        parent_user_id: +parentId,
      };
    } else {
      values = {
        is_approved: "N",
        is_rejected: "Y",
        order_id: id,
        parent_user_id: +parentId,
      };
      error = validateForm({ remarks });
      if (Object.keys(error).length === 0) {
        values.remarks = remarks;
        setErrors({});
      } else {
        setErrors(error);
        return;
      }
    }
    if (!parentId) {
      delete values.parent_user_id;
    }
    dispatch(approveOrder({ token, values })).then(({ payload }) => {
      if (payload.status) {
        handleClose();
        if (payload.status) {
          dispatch(pendingApprovalCount(token));
          if (role === postpaidRoot) {
            dispatch(getBillingDetail(token));
          }
        }
      } else {
        if (payload.error) {
          setInsuficent(payload);
        }
        if (payload.message && !payload.status) {
          handleClose();
          toast.error(payload.message);
        }
      }
    });
  };

  const orderApprovalHandler = (row) => {
    setIsApprove(true);
    handleShow();
    setId(row.id);
    setAmount(row?.final_payble_amount);
    if (row?.parent_user_id) {
      setParentId(row?.parent_user_id);
      setParentWallet(row?.parent_wallet_balance);
      // setParentName(row?.parent_user_name);
    } else {
      setParentId();
      setParentWallet();
      // setParentName();
    }
  };

  const orderRejectHandler = (row) => {
    setIsApprove(false);
    handleShow();
    setId(row.id);
    if (row?.parent_user_id) {
      setParentId(row?.parent_user_id);
    } else {
      setParentId();
    }
  };

  //This array hanldle columns of datatable
  const tableHead = [
    {
      key: "name",
      title: "ORDER BY",
      sorting: true,
      searching: true,
      width: "25%",
    },
    {
      key: "email",
      title: "EMAIL",
      sorting: true,
      searching: true,
      width: "20%",
    },

    {
      key: "order_generate_date",
      title: "DATE",
      sorting: true,
      searching: true,
      width: "15%",
    },
    {
      key: "order_total_pages",
      title: "TOTAL PAGES",
      sorting: true,
      searching: false,
      width: "15%",
    },

    {
      key: "order_total_files",
      title: "TOTAL files",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "file_delivery",
      title: "DATE OF DELIVERY",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "department",
      title: "DEPARTMENT",
      sorting: true,
      searching: false,
      width: "15%",
    },

    {
      key: "final_payble_amount",
      title: "PAYABLE AMOUNT",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "approved_by",
      title: "APPROVED BY",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "order_status",
      title: "STATUS",
      sorting: true,
      searching: false,
      width: "10%",
    },
    {
      key: "action",
      title: "ACTION",
      sorting: false,
      searching: false,
      width: "20%",
      theadId: "action",
    },
  ];

  // This function hanldle columns data of datatable
  const cellRendrer = useCallback(
    (cell, row, column, index, tHeadId) => {
      if (column === "name") {
        return (
          <div className="user-group">
            {row?.profile_image ? (
              <img
                src={row?.profile_image}
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
      if (column === "order_invoice_number") {
        return (
          <div className="user-group">
            <a href="#" className="download-link">
              {row?.order_invoice_number}
            </a>
          </div>
        );
      }

      if (column === "order_generate_date") {
        return (
          <div id={row.id} className="d-flex align-items-center">
            {moment(row.order_generate_date).format(dateFormat)}
          </div>
        );
      }
      if (column === "order_total_pages") {
        return <div>{row?.order_total_pages}</div>;
      }

      if (column === "order_total_files") {
        return <div>{row?.order_total_files}</div>;
      }
      if (column === "file_delivery") {
        return (
          <div id={row.id} className="d-flex align-items-center">
            {moment(row.file_delivery).format(dateFormat)}
          </div>
        );
      }
      if (column === "department") {
        return (
          <div id={row.id} className="d-flex align-items-center">
            {row?.department ?? notAvailable}
          </div>
        );
      }
      if (column === "order_by") {
        return <div id={row.id}>{row.order_by}</div>;
      }
      if (column === "final_payble_amount") {
        return (
          <div id={row.id}>{currencyFormatter(row?.final_payble_amount)}</div>
        );
      }
      if (column === "approved_by") {
        return <div id={row.id}>{row?.approved_by ?? notAvailable}</div>;
      }

      if (column === "order_status") {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <span className={`_badge ${ORDER_STATUS_CLASS[row?.label_value]}`}>
              {row?.label_text}
            </span>
            {row?.remarks && (
              <CustomTooltip
                heading="Message"
                content={row?.remarks}
                Icon={InfoIcon}
                tooltipId="extended-alt-tooltip"
                contentclass="tip-content"
                iconClass="tooltip_icon"
                mainClass="custom_tooltip"
              />
            )}
          </div>
        );
      }

      if (column === "action") {
        const disable = row.is_approved === "Y" || row.is_rejected === "Y";
        const approvalBtnId = "approval_btn" + row?.id;
        const rejectBtnId = "reject_btn" + row?.id;
        return (
          <div className="table-button approvalBtn d-flex">
            <Button
              disabled={disable}
              title={"Approve"}
              id={approvalBtnId}
              className={"approvebtn btn-success me-2"}
              aria-labelledby={`${tHeadId} ${approvalBtnId} action`}
              onClick={() => {
                orderApprovalHandler(row);
              }}
            />
            <Button
              disabled={disable}
              id={rejectBtnId}
              title={"Reject"}
              aria-labelledby={`${tHeadId} ${rejectBtnId} action`}
              className={"button--blue button--danger"}
              onClick={() => {
                orderRejectHandler(row);
              }}
            ></Button>
          </div>
        );
      }
      return row[column];
    },
    [focus]
  );

  const insufficentBalMsg = parentId
    ? "User's wallet has insufficent balance please contact to this user to recharge his wallet."
    : "Your wallet has insufficent balance please recharge to proceed further.";
  const approvalMsg =
    role === postpaidRoot
      ? "Are you sure to Approve this order ?"
      : `You are about to approve a order of ${currencyFormatter(
          amount
        )}. Are you sure that you want to approve this order?`;
  const rejectMsg = `You are about to reject a order.Are you sure that you want to reject this order?`;
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
        type="approval"
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

      <CustomModal
        children={
          <div>
            <p tabIndex="0">
              {isApprove ? (
                insuficent?.error ? (
                  <span className="text-danger">{insufficentBalMsg}</span>
                ) : (
                  approvalMsg
                )
              ) : (
                rejectMsg
              )}
            </p>
            {isApprove &&
              role !== postpaidRoot &&
              (parentId ? (
                <p>
                  User's billing admin wallet balance is:{" "}
                  <strong>{currencyFormatter(parentWallet)}</strong>
                </p>
              ) : (
                <p>
                  Your current wallet balance is :{" "}
                  <strong>{currencyFormatter(wallet_balance)}</strong>
                </p>
              ))}
            {!isApprove && (
              <TextArea
                type="text"
                autoComplete="off"
                label={`Remarks:${remarks.length}/300`}
                placeholder="Enter message here"
                required={false}
                ref={remarksRef}
                forLabel={"Remarks"}
                name="remarks"
                value={remarks}
                maxLength="300"
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
                ErrorLabel={errros.remarks ? "Remarks_Error" : null}
                error={errros.remarks ? true : false}
                errorMsg={errros.remarks}
              />
            )}
            {isApprove &&
              insuficent?.error &&
              insuficent?.card_details &&
              role !== billingAdmin && (
                <div className="modalButtons w-100 d-flex justify-content-between">
                  <Button
                    title={"Cancel"}
                    className={"button--border"}
                    onClick={handleClose}
                  />
                  {!parentId && (
                    <Button
                      title={"Recharge wallet"}
                      className={"button--blue"}
                      onClick={rechargeWalletHandler}
                    />
                  )}
                </div>
              )}

            {isApprove &&
              insuficent?.error &&
              role === billingAdmin &&
              insuficent?.card_details && (
                <div className="modalButtons w-100 d-flex justify-content-between">
                  <Button
                    title={"Cancel"}
                    className={"button--border"}
                    onClick={handleClose}
                  />
                  <Button
                    title={"Recharge wallet"}
                    className={"button--blue"}
                    onClick={rechargeWalletHandler}
                  />
                </div>
              )}
            {!insuficent?.error && (
              <div className="modalButtons w-100 d-flex justify-content-between">
                <Button
                  title={"No"}
                  className={"button--white"}
                  onClick={handleClose}
                />
                <Button
                  title={"Yes"}
                  className={"button--danger ms-3"}
                  onClick={onConfirmHandler}
                />
              </div>
            )}
          </div>
        }
        show={show}
        handleClose={handleClose}
        modalHeading={
          isApprove
            ? insuficent?.error
              ? insuficent?.error
              : "Approve order"
            : "Reject order"
        }
        className="ApprovalModal"
      />

      <CustomModal
        children={
          <Elements stripe={stripePromise}>
            <RechargeWallet
              handleCloseWallet={handleCloseWallet}
              card_details={insuficent?.card_details}
              wallet_balance={wallet_balance}
            />
          </Elements>
        }
        show={showWallet}
        handleClose={handleCloseWallet}
        modalHeading={"Recharge wallet"}
        className="ApprovalModal"
      />
    </Fragment>
  );
};

export default ApprovalTable;
