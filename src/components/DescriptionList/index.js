import React from "react";

const DescriptionList = ({ className, dt, dd, dtClass, ddClass }) => {
  return (
    <dl className={className}>
      <dt className={dtClass}>{dt}</dt>
      <dd className={ddClass}>{dd}</dd>
    </dl>
  );
};

export default DescriptionList;
