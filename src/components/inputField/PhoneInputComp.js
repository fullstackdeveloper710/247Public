import React from "react";
import "./input.scss";
// import "react-phone-input-2/lib/style.css";
// import PhoneInput from "react-phone-input-2";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
const PhoneInputComp = React.forwardRef((props, ref) => {
  const {
    type,
    value,
    label,
    forLabel,
    name,
    error,
    errorMsg,
    onChange,
    placeholder,
    accept,
    role,
    autoComplete,
    required,
    ErrorLabel,
    country,
    ...rest
  } = props || {};

  return (
    <div className={`inputRow ${error && `error-row`}`}>
      <label htmlFor={forLabel} className="mb-2" role={role}>
        {label}
        {required && <sup className="text-danger">*</sup>}{" "}
      </label>
      <div className="inputBlock">
        <PhoneInput
          international
          countryCallingCodeEditable={true}
          defaultCountry="US"
          value={value}
          country={country}
          countrySelectProps={{ "aria-label": "country-code" }}
          className="phoneInput"
          aria-describedby={error ? ErrorLabel : "format"}
          id={forLabel}
          autoComplete={autoComplete}
          ref={ref}
          type={type}
          accept={accept}
          placeholder={placeholder}
          onChange={onChange}
          {...rest}
        />
      </div>
      <span className="formatInput" id="format">
        Select the country code or enter the number along with the country code.
        For e.g.,<b>+1 (123) 456-7890</b>
      </span>
      {error && (
        <span className="error-msg" id={ErrorLabel}>
          {errorMsg}
        </span>
      )}
    </div>
  );
});

export default PhoneInputComp;
