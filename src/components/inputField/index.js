import React from "react";
import "./input.scss";
const Input = React.forwardRef((props, ref) => {
  const {
    type,
    value,
    label,
    forLabel,
    name,
    error,
    errorMsg,
    onInputChange,
    placeholder,
    accept,
    role,
    autoComplete,
    required,
    ErrorLabel,
    icon,
    ...rest
  } = props || {};

  const onFocus = (event) => {
    event.target.click();
  };

  return (
    <div className={`inputRow ${error && `error-row`}`}>
      <label htmlFor={forLabel} className="mb-2" role={role}>
        {label}
        {required && <sup className="text-danger">*</sup>}{" "}
      </label>
      <div className="inputBlock">
        <input
          aria-describedby={error ? ErrorLabel : null}
          id={forLabel}
          autoComplete={autoComplete}
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onInputChange(e, name)}
          accept={accept}
          placeholder={placeholder}
          className="form-control"
          name={name}
          onFocus={onFocus}
          {...rest}
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

export default Input;
