import React from "react";

const Checkbox = React.forwardRef((props, ref) => {
  const {
    type,
    id,
    name,
    checked,
    onChange,
    label,
    ErrorLabel,
    error,
    link,
    ...rest
  } = props;
  return (
    <div className="customCheckbox">
      <input
        type={type}
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        ref={ref}
        aria-describedby={error?ErrorLabel:null}
        {...rest}
      />
      {label && (
        <label htmlFor="contrast_Checkbox" className="mt-0 mb-0">
          {link ? link : label}
        </label>
      )}
      {error && (
        <span id={ErrorLabel} className="error-msg">
          {error}
        </span>
      )}
    </div>
  );
});

export default Checkbox;
