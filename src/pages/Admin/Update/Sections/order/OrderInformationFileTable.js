import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTablesComp from "components/dataTable";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "components/Button";
import Input from "components/inputField";
import "./OrderInformationFileTable.scss";
import { Col, Row } from "react-bootstrap";
import { applyCouponCode } from "redux/asyncApi/uploadApi";
import { clearUploadErrors } from "redux/Slices/uploadSlice";
import {
  currencyFormatter,
  dateFormat,
  noRecordFound,
  removeUnderScore,
} from "util/helpers";
import { validationMsg } from "util/validationErrors";

const OrderInformationFileTable = ({
  orderData,
  balance_payable,
  total,
  total_discount,
  coupon_name,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState({
    apply_coupon: coupon_name,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  //redux state
  const {
    loading,
    userAuth: { token },
  } = useSelector((state) => state.app) || {};
  const {
    uploadedFiles,
    error: { message },
    selectedUser,
  } = useSelector((state) => state.upload);

  //redux action dispatcher
  const dispatch = useDispatch();

  //router navigate function
  const navigate = useNavigate();

  // ref
  const couponRef = useRef();

  //methods

  useEffect(() => {
    if (coupon_name) {
      setData({ ...data, apply_coupon: coupon_name });
    } else {
      setData({ ...data, apply_coupon: "" });
    }
  }, [coupon_name]);

  const onCouponChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    couponRef?.current?.focus();
    if (message) {
      setFormErrors({ ...formErrors, apply_coupon: message });
      couponRef?.current?.focus();
    }
    return () => {
      dispatch(clearUploadErrors());
    };
  }, [message]);

  useEffect(() => {
    if (isSubmit) {
      const values = {
        order_temp_id: uploadedFiles?.order_temp_id,
        coupon_code: data.apply_coupon,
        user_id: selectedUser?.value,
      };
      dispatch(
        applyCouponCode({
          token,
          values,
        })
      );
    }
    setIsSubmit(false);
  }, [isSubmit, dispatch, data.apply_coupon, token]);

  const validateForm = (values) => {
    const errors = {};
    if (values.apply_coupon === "") {
      errors.apply_coupon = validationMsg.couponReq;
      couponRef?.current?.focus();
      couponRef?.current?.click();
    }
    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
    }
    return errors;
  };

  const applyCouponHandler = () => {
    setFormErrors(validateForm(data));
  };

  const cellRendrer = useCallback(
    (cell, row, column, index) => {
      if (column === "original_file_name") {
        return (
          <div id={row.id} className="file_name_head">
            {row?.original_file_name}
          </div>
        );
      }

      if (column === "file_type") {
        return (
          <div id={row.id}>
            <span className="role text-uppercase">
              {removeUnderScore(row?.file_type ?? "")}
            </span>
          </div>
        );
      }
      if (column === "file_deliver_date") {
        return (
          <div>
            <span className="role">
              {moment(row.file_deliver_date).format(dateFormat)}
            </span>
          </div>
        );
      }

      if (column === "file_page_count") {
        return (
          <div id={row.id}>
            <span className="role">{row.file_page_count}</span>
          </div>
        );
      }
      if (column === "sla_type") {
        return (
          <div id={row.id}>
            <span className="role text-uppercase">{row.sla_type}</span>
          </div>
        );
      }
      if (column === "file_estimate_cost") {
        return (
          <div>
            <span className="role">
              {currencyFormatter(row.file_estimate_cost)}
            </span>
          </div>
        );
      }

      return row[column];
    },
    [navigate]
  );

  const tableHead = [
    {
      key: "original_file_name",
      title: "FILE NAME",
      sorting: true,
      searching: true,
      width: "30%",
    },
    {
      key: "file_type",
      title: "Type",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "file_deliver_date",
      title: "Date of Delivery",
      sorting: true,
      searching: false,
      width: "15%",
    },

    {
      key: "file_page_count",
      title: "Number Of Pages",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "sla_type",
      title: "Delivery Type",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "file_estimate_cost",
      title: "Total Cost",
      sorting: true,
      searching: false,
      width: "10%",
    },
  ];

  return (
    <>
      <div className="dt-responsive">
        {/* {!loading && orderData.length > 0 && ( */}
        <>
          <DataTablesComp
            tableHead={tableHead}
            data={orderData}
            renderCell={cellRendrer}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
            type="order"
            search={false}
            pageSizing={true}
            paginationBar={true}
            // pageSize={true}
            tableDescription="Order Information List"
          />
          <div className="couponcode-block">
            <Row>
              <Col md={"12"} lg="7" xl={"8"}>
                <div className="couponCode">
                  <div className="coupon-input">
                    <Input
                      type="text"
                      label="Add Discount Coupon Code (optional)"
                      required={false}
                      autoComplete="off"
                      ErrorLabel={
                        formErrors.apply_coupon ? "apply_coupon_error" : null
                      }
                      name="apply_coupon"
                      value={data.apply_coupon}
                      onInputChange={onCouponChangeHandler}
                      ref={couponRef}
                      error={formErrors?.apply_coupon ? true : false}
                      errorMsg={formErrors?.apply_coupon}
                      forLabel={"Add Discount Coupon Code (optional)"}
                    />

                    <Button
                      title={"Apply Coupon"}
                      className={"button--blue apply-btn"}
                      onClick={applyCouponHandler}
                    />
                  </div>
                </div>
              </Col>
              <Col md={"12"} lg="5" xl={"4"}>
                <div className="total-discount-table">
                  <table className="discountTable">
                    <caption className="visually_hidden">
                      Payable Amount
                    </caption>
                    <tbody>
                      <tr>
                        <th>
                          <strong>Total</strong>
                        </th>
                        <td>
                          <strong>{currencyFormatter(total)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <strong>Total Discount</strong>
                        </th>
                        <td>
                          <strong>{currencyFormatter(total_discount)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <strong>Balance Payable</strong>
                        </th>
                        <td>
                          <strong>{currencyFormatter(balance_payable)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </div>
        </>
        {/* )}
        {!loading && orderData?.length <= 0 && (
          <div className="no-record-main">
            <div className="no-record">{noRecordFound}</div>
          </div>
        )} */}
      </div>
    </>
  );
};
export default OrderInformationFileTable;
