import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calender.scss";

const Calendar = forwardRef((props, ref) => {
  const {
    label,
    error,
    forLabel,
    required,
    ErrorLabel,
    errorMsg,
    role,
    icon,
    onChangeHandler,
    value,
    excludeDates,
  } = props;
  const handleDateChange = (date) => {
    onChangeHandler(date);
  };
  return (
    <div className={`inputRow ${error && `error-row`}`}>
      <label htmlFor={forLabel} className="mb-2" role={role}>
        {label}
        {required && <sup className="text-danger">*</sup>}
      </label>
      <div className="inputBlock">
        <DatePicker
          className="form-control"
          selected={value}
          onChange={handleDateChange}
          ref={ref}
          showIcon={true}
          excludeDates={excludeDates}
          placeholderText="DD/MM/YYYY"
        />
        {icon && icon}
      </div>

      {error && (
        <span className="error-msg" id={ErrorLabel}>
          {errorMsg}
        </span>
      )}
    </div>
  );
});

export default Calendar;
