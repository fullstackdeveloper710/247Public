import React from "react";
import { getItem } from "constants/localstorage";
import "./button.scss";

const Button = (props) => {
  const {
    icon,
    title,
    className,
    type,
    tabIndex,
    disabled,
    autoFocus,
    ...rest
  } = props;

  return (
    <button
      autoFocus={getItem("add") === "add" && autoFocus}
      type={type}
      disabled={disabled}
      className={`btn btn--md ${className}`}
      {...rest}
      tabIndex={tabIndex ? tabIndex:null}
    >
      {icon} {title}
    </button>
  );
};

export default Button;
