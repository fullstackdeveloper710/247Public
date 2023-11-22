import React from "react";

const List = ({
  focusable,
  id,
  className,
  Icon,
  stepText,
  heading,
  tabIndex,
  status,
}) => {
  return (
    <li focusable={focusable} id={id} className={className} tabIndex={tabIndex}>
      <div className="steps_icon_box" >
        <Icon aria-hidden="true" focusable="false" />
      </div>
      <p>
        <span className="visually_hidden">{stepText}</span>
        {heading}
        <span className="visually_hidden">{status}</span>
      </p>
    </li>
  );
};

export default List;
