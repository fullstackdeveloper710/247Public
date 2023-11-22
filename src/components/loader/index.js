import React, { useEffect, useRef } from "react";
import { Bars } from "react-loader-spinner";
import "./loader.scss";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
const Loader = () => {
  const { loading } = useSelector((state) => state.app);
  const loaderRef = useRef();
  useEffect(() => {
    if (loaderRef) {
      loaderRef?.current?.click();
      loaderRef?.current?.focus();
    }
  }, [loading]);
  return createPortal(
    loading ? (
      <div className="loader-global" id="loader-global_id">
        <div
          ref={loaderRef}
          focusable={loading ? true : false}
          tabIndex={loading ? "0" : null}
          role="status"
          aria-busy={loading ? true : false}
        >
          <Bars
            height="80"
            width="80"
            color="#0074B2"
            ariaLabel="Loading"
            wrapperClass=""
            visible={true}
          />
        </div>
      </div>
    ) : null,
    document.getElementById("loader-root")
  );
};

export default Loader;
