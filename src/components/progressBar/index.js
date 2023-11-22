import React from "react";
import "./progressBar.scss";
const ProgressBar = ({ min, max, current, color,status }) => {
  return (
    <div className="progress">
      {current ? <div
        className="progress-bar"
        style={{
          width: `${current}%`,
          backgroundColor: color ? color : "#0074B2",
          opacity:status?"1":"0.8"
        }}
        role="progressbar"
        aria-label="progressbar"
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
        focusable="true"
      >
        {current}%
      </div> : null}
    </div>
  );
};

export default ProgressBar;
