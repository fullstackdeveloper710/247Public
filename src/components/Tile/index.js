import React from "react";

const Tile = ({
  mainClass,
  iconClass,
  dlClass,
  ddClass,
  Icon,
  label,
  value,
}) => {
  return (
    <div className={mainClass}>
      <span className={iconClass}>
        <Icon aria-hidden="true" focusable="false" />
      </span>
      <dl className={dlClass}>
        <dt>{label}</dt>
        <dd className={ddClass}>{value}</dd>
      </dl>
    </div>
  );
};

export default Tile;
