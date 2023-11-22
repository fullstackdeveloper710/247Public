import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { usersTypes } from "util/helpers";
import List from "./List";

import {
  UploadIcon,
  ConfirmFile,
  AccessibilityIcon,
  OrderStepIcon,
  PaymentIcon,
  InvoiceIcon1,
  SlaIcon,
} from "assets/images";

const UploadSteps = ({ pageNo, role }) => {
  // ... (rest of the component remains the same)

  const pageVisited = Array.from(
    { length: Math.min(pageNo, 7) },
    (_, index) => index + 1
  );

  const { loading } = useSelector((state) => state.app);
  useEffect(() => {
    if (pageVisited.includes(pageNo) && !loading) {
      document?.getElementById(pageNo)?.focus();
    }
  }, [pageNo, loading]);
  const {
    companyUser,
    user,
    admin,
    superAdmin,
    rootAdmin,
    postpaidRoot,
    postpaidAdmin,
    postpaidUser,
    billingAdmin
  } = usersTypes;

  //allow payment Tab in steps
  const allowPaymentTab =
    role !== companyUser &&
    role !== admin &&
    role !== superAdmin &&
    role !== postpaidRoot &&
    role !== postpaidAdmin &&
    role !== postpaidUser;

  //allow invoice Tab in steps
  const allowOrderPlacedTab =
    role === companyUser ||
    role === admin ||
    role === postpaidAdmin ||
    role === postpaidUser;

  //allow Invoice tab in steps
  const allowInvoiceTab = role === superAdmin || role === postpaidRoot;

  //allow invoice for specific users in steps
  const allowInvoiceForUsers = role === user||role===billingAdmin || role === rootAdmin;

  const steps = [
    {
      id: 1,
      Icon: UploadIcon,
      stepText: "Step 1",
      heading: "Upload",
      show: true,
    },
    {
      id: 2,
      Icon: ConfirmFile,
      stepText: "Step 2",
      heading: "Confirm File",
      show: true,
    },
    {
      id: 3,
      Icon: AccessibilityIcon,
      stepText: "Step 3",
      heading: "Accessibility",
      show: true,
    },
    {
      id: 4,
      Icon: SlaIcon,
      stepText: "Step 4",
      heading: "Delivery",
      show: true,
    },
    {
      id: 5,
      Icon: OrderStepIcon,
      stepText: "Step 5",
      heading: "Order",
      show: true,
    },
    {
      id: 6,
      Icon: PaymentIcon,
      stepText: "Step 6",
      heading: "Payment",
      show: allowPaymentTab,
    },
    {
      id: 6,
      Icon: InvoiceIcon1,
      stepText: "Step 6",
      heading: "Order Placed",
      show: allowOrderPlacedTab,
    },
    {
      id: 6,
      Icon: InvoiceIcon1,
      stepText: "Step 6",
      heading: "Invoice",
      show: allowInvoiceTab,
    },
    {
      id: 7,
      Icon: InvoiceIcon1,
      stepText: "Step 7",
      heading: "Invoice",
      show: allowInvoiceForUsers,
    },
  ];

  return (
    <nav
      aria-label="Upload Steps"
      className="upload_steps_wrapper d-table mx-auto"
    >
      <ol className="upload_steps">
        {steps.map((step) => {
          if (!step.show) return null;
          const isCompleted = pageVisited.includes(step.id) && pageNo > step.id;
          const isCurrent = pageVisited.includes(step.id) && pageNo === step.id;
          const className = isCompleted
            ? "fill_active_step"
            : isCurrent
            ? "active_step"
            : "";

          return (
            <List
              key={step.id}
              focusable={true}
              id={step.id}
              className={className}
              Icon={step.Icon}
              stepText={step.stepText}
              heading={step.heading}
              tabIndex={pageNo === step.id ? "-1" : null}
              status={isCompleted ? "Completed" : isCurrent ? "Current" : ""}
            />
          );
        })}
      </ol>
    </nav>
  );
};

export default UploadSteps;