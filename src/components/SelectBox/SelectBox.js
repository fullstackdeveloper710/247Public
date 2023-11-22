import React from "react";
import "./SelectBox.scss";

const SelectBox = React.forwardRef((props, ref) => {
  const { label, options, error, ErrorLabel, errorMsg, required,forLabel, ...rest } =
    props || {};

  return (
    <div className={`inputRow ${error && `error-row`}`}>
      <label  htmlFor={forLabel} className="mb-2">
        {label}
        {required && <sup className="text-danger">*</sup>}{" "}
      </label>
      <select id={forLabel} ref={ref} {...rest} aria-describedby={ErrorLabel}>
        <option value="">Select Option</option>
        {options.map((value) => {
          return (
            <option key={value.value} value={value.type || value.value}>
              {value.type || value.label}
            </option>
          );
        })}
      </select>
      {error && (
        <span className="error-msg" id={ErrorLabel}>
          {errorMsg}
        </span>
      )}
    </div>
  );
});

export default SelectBox;
