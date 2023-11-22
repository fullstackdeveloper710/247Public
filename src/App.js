import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { clearItem, getItem } from "constants/localstorage";
import Loader from "components/loader";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "redux/store";
import { Routes } from "routes";
import { useDispatch } from "react-redux";
import { hideLoader } from "redux/Slices/appSlice";
import "styles/global.scss";

function App() {

  //redux action dispatcher
  const dispatch=useDispatch();
  
  //methods

  const handleClick = (event) => {
    if (event.keyCode === 13) {
    } else {
      if (!event.target.id) {
        clearItem("add", "");
        clearItem("id");
      } else if (event.target.id !== getItem("id")) {
        clearItem("id");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleClick);
    document.addEventListener("keyup", handleClick);
    if (window.performance.navigation.type == 1) {
      clearItem("id");
      clearItem("add");
    }
    if(window.location.reload){
      dispatch(hideLoader())
    }
  }, []);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={Routes} />
      <ToastContainer
        aria-describedby="message"
        aria-live="assertive"
        aria-atomic="true"
        aria-label="Toast Notifications"
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={true}
        theme="light"
        className={"toastify-position"}
        role="alert"
      />
      <Loader />
    </PersistGate>
  );
}

export default App;
