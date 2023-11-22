import React, { useEffect } from "react";
import OrderInformationFileTable from "./OrderInformationFileTable";
import Button from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  customOrderPlaced,
  getOrderInformation,
  orderPlaced,
} from "redux/asyncApi/uploadApi";
import { usersTypes } from "util/helpers";
import { orderInProcess } from "redux/asyncApi/orderApi";
import { getUsedMemory } from "redux/asyncApi/appApi";

const OrderInformationFile = ({ handleBack, handleNext }) => {
  const { orderInformationList, uploadedFiles, selectedUser } =
    useSelector((state) => state.upload) || {};
  const {
    userAuth: {
      token,
      user: { role },
    },
  } = useSelector((state) => state.app) || {};
  const { data, total, balance_payable, total_discount, coupon_name } =
    orderInformationList || {};
  const { order_temp_id } = uploadedFiles || {};
  const dispatch = useDispatch();
  useEffect(() => {
    const values = {
      order_temp_id: order_temp_id,
      user_id: selectedUser?.value,
    };
    dispatch(getOrderInformation({ token, values }));
  }, [dispatch]);
  const {
    companyUser,
    user,
    admin,
    superAdmin,
    rootAdmin,
    postpaidRoot,
    postpaidAdmin,
    postpaidUser,
  } = usersTypes;

  const onSubmitHandler = () => {
    if (
      role === companyUser ||
      role === admin ||
      role === postpaidAdmin ||
      role === postpaidUser
    ) {
      const values = {
        order_temp_id: order_temp_id,
      };
      dispatch(orderPlaced({ token, values })).then(({ payload }) => {
        if (payload.status) {
          handleNext();
          dispatch(orderInProcess(token));
          dispatch(getUsedMemory(token));
        }
      });
    } else if (role === superAdmin || role === postpaidRoot) {
      const values = {
        order_temp_id: order_temp_id,
        user_id: selectedUser?.value,
      };
      dispatch(customOrderPlaced({ token, values })).then(({ payload }) => {
        if (payload.status) {
          handleNext();
          dispatch(orderInProcess(token));
          dispatch(getUsedMemory(token));
        }
      });
    } else {
      handleNext();
    }
  };

  return (
    <div className="customCard orderInfo_File_Block">
      <h2 className="mainTitle">Order Summary</h2>
      <div className="order-info-table">
        <OrderInformationFileTable
          orderData={data}
          total={total}
          balance_payable={balance_payable}
          total_discount={total_discount}
          coupon_name={coupon_name}
        />
      </div>

      <div className="orderInfoFooter">
        <div className="acc_note">
          <h3>Note:</h3>
          <p>Based on Type of user and volume - Rates will vary.</p>
          <p>
            If you have opted for any Additional Services, this cost will be
            added at the time of the delivery based on number of extended alt
            text and table summaries needed.
          </p>
        </div>

        <div className="form-buttons d-flex align-items-center justify-content-end pt-4">
          <Button
            title={"Back"}
            className={"button--border"}
            onClick={() => handleBack()}
          />
          <Button
            title={"Next"}
            className={"button--blue ms-3"}
            onClick={onSubmitHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderInformationFile;
