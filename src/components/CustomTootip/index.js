import React, { useEffect, useState } from "react";
// import "./CustomTooltip.css"; // Import your CSS for styling
function CustomTooltip({
  mainClass,
  iconClass,
  tooltipId,
  heading,
  content,
  Icon,
  contentclass,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const onClickHandler = () => {
    setShowTooltip(true);
  };
  const onBlurHandler =()=>{
    setShowTooltip(false)
  }
  const onFocusHandler =()=>{
    setShowTooltip(true)
  }
  const onKeyDownHandler =(e) => {
    const { key } = e;
    if (key === "Escape") {
      setShowTooltip(false);
    }
  }
  return (
    <div
      className={mainClass}
      onKeyDown={onKeyDownHandler}
    >
      <button
        className={iconClass}
        type="button"
        aria-describedby={tooltipId}
        onClick={onClickHandler}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      >
        <Icon
          focusable="false"
          aria-label="info"
          role="img"
        />
      </button>
      {showTooltip && (
        <div
          className={contentclass}
          id={tooltipId}
          role="alert"
        >
          <h3>{heading} </h3>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
}
export default CustomTooltip;