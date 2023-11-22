import React, { useEffect } from "react";
import "./update.scss";
import { useState } from "react";
import UploadFile from "./Sections/UploadFile/UploadFile";
import ConfirmUploadFile from "./Sections/confirm/ConfirmUploadFile";
import AccessibilityFile from "./Sections/Accessibility/AccessibilityFile";
import OrderInformationFile from "./Sections/order/OrderInformationFile";
import PaymentFile from "./Sections/payment/PaymentFile";
import InvoiceFile from "./Sections/Invoice/InvoiceFile";
import UploadSteps from "./Uploadsteps/UploadSteps";
import { UPLOAD_TITLE } from "constants/title";
import SlaFile from "./Sections/SLA/SlaFile";
import { clearState } from "redux/Slices/uploadSlice";
import { useDispatch, useSelector } from "react-redux";
import { usersTypes } from "util/helpers";
import OrderPlaced from "./Sections/orderPlaced";

const Update = () => {
  document.title = UPLOAD_TITLE;
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const {
    userAuth: {
      user: { role },
    },
  } = useSelector((state) => state.app);

  const {
    companyUser,
    user,
    admin,
    superAdmin,
    rootAdmin,
    postpaidRoot,
    postpaidUser,
    postpaidAdmin,
    billingAdmin
  } = usersTypes;

  const handleBack = () => {
    if (pageNo > 1) {
      setPageNo((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setPageNo((prev) => prev + 1);
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  //allow payment section condition
  const allowPayment = role === user || role === billingAdmin || role === rootAdmin;

  //allow order placed  section condition
  const allowOrderPlaced =
    role === companyUser ||
    role === admin ||
    role === postpaidUser ||
    role === postpaidAdmin;

  //allow Invoice section condition
  const allowInvoice = role === superAdmin || role === postpaidRoot;

  //allow Invoice sectiopn for specific users
  const allowInvoiceFor = role === user || role === billingAdmin || role === rootAdmin;
  return (
    <>
      <UploadSteps pageNo={pageNo} role={role} />
      {pageNo === 1 ? (
        <UploadFile handleBack={handleBack} handleNext={handleNext} />
      ) : pageNo === 2 ? (
        <ConfirmUploadFile handleBack={handleBack} handleNext={handleNext} />
      ) : pageNo === 3 ? (
        <AccessibilityFile handleBack={handleBack} handleNext={handleNext} />
      ) : pageNo === 4 ? (
        <SlaFile handleBack={handleBack} handleNext={handleNext} />
      ) : pageNo === 5 ? (
        <OrderInformationFile handleBack={handleBack} handleNext={handleNext} />
      ) : pageNo === 6 && allowPayment ? (
        <PaymentFile handleBack={handleBack} handleNext={handleNext} />
      ) : pageNo === 6 && allowOrderPlaced ? (
        <OrderPlaced handleBack={handleBack} handleNext={handleNext} />
      ) : pageNo === 6 && allowInvoice ? (
        <InvoiceFile handleBack={handleBack} handleNext={handleNext} />
      ) : (
        pageNo > 6 &&
        allowInvoiceFor && (
          <InvoiceFile handleBack={handleBack} handleNext={handleNext} />
        )
      )}
    </>
  );
};
export default Update;