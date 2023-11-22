import React from "react";
import "./dlTileList.scss";

const DlTileList = ({ className, data, TileClass }) => {
  return (
    <dl className={className}>
      {data.map(({ dt, dd, Icon, progress }, index) => {
        return (
          <div key={index} className={TileClass}>
            <dt>
              {Icon && (
                <span className="dt_icon">
                  <Icon aria-hidden="true" focusable="false" />
                </span>
              )}
              {dt}
            </dt>
            <dd>
              {dd}
              {progress && dd > 0 && progress}
            </dd>
          </div>
        );
      })}
    </dl>
  );
};

export default DlTileList;
