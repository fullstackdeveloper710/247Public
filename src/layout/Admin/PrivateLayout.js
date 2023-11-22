import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Header from "components/header";
import Sidebar from "components/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "routes/constant";
import { isExpired, decodeToken } from "react-jwt";
import { reset } from "redux/Slices/appSlice";
import { useIdleTimer } from "react-idle-timer";
import CustomModal from "components/CustomModal";
import Button from "components/Button";
import { getUserRole, signOut } from "redux/asyncApi/appApi";
const timeout = 1000 * 60 * 60; // 1 hour
const promptBeforeIdle = 1000 * 20; // 20 seconds

const PrivateLayout = ({ children, title, roles }) => {
  const [isToggle, setIsToggle] = useState(false);
  const [remaining, setRemaining] = useState(timeout);
  const [open, setOpen] = useState(false);

  //Redux state
  const { userAuth } = useSelector((state) => state.app);
  const {
    token,
    user: { role, is_subscribe, keep_me_login },
  } = userAuth;

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Router functions
  const { pathname } = useLocation();

  //Ref
  const skipRef = useRef();
  const mainRef = useRef();

  //Methods

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    if (token) {
      dispatch(getUserRole({ token })).then(({ payload }) => {
        if (payload.status && payload.role !== role) {
          dispatch(signOut({ token, message: "Your Role is updated now" }));
        }
      });
    }
  }, [pathname]);

  useEffect(() => {
    const decoded = decodeToken(token);
    const targetTimestamp = decoded?.exp;
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const timeDifference = targetTimestamp - currentTimestamp; // Difference in seconds
    const timeoutId = setTimeout(() => {
      dispatch(reset("Session Expired please login"));
    }, timeDifference * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Check idle time of website
  const onIdle = () => {
    setOpen(false);
    dispatch(signOut({ token }));
  };

  //Check website active or not
  const onActive = () => {
    setOpen(false);
  };

  //Show popup message for idle time reminder
  const onPrompt = () => {
    setOpen(true);
  };

  //Re-active user when click Still here button in popup
  const handleStillHere = () => {
    activate();
  };

  //Handle website idle time function
  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500,
    crossTab: true,
    leaderElection: true,
    syncTimers: 100,
    disabled: keep_me_login,
  });

  //This function handle accessibility focus
  const skipContent = () => {
    mainRef.current.classList.add("skip_content");
    skipRef?.current?.focus();
  };

  //Check token is expired or not from Jwt-token
  const isMyTokenExpired = isExpired(token);

  //Condition to check route includes role or not
  const userHasRequiredRole = role && roles.includes(role) ? true : false;

  // const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0);
  // const seconds = timeTillPrompt > 1 ? "seconds" : "second";
  if (isMyTokenExpired) {
    return (
      <Navigate to={ROUTES.SIGN_IN} state={{ url: pathname }} replace={true} />
    );
  } else if (!isMyTokenExpired && userHasRequiredRole) {
    return (
      <Fragment>
        <Link
          className="focus_on_hover"
          ref={mainRef}
          onClick={skipContent}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              mainRef.current.classList.add("skip_content");
              skipRef?.current?.focus();
            }
          }}
        >
          Skip to main content
        </Link>
        <div className="dashboardWrapper">
          <Sidebar isToggle={isToggle} setIsToggle={setIsToggle} />
          <main className="mainContentWrapper">
            <Header
              title={title}
              ref={skipRef}
              setIsToggle={setIsToggle}
              isToggle={isToggle}
              isSubscribed={is_subscribe}
            />
            <div className="mainContent">
              {/* {timeTillPrompt > 0 && (
                <p>
                  {timeTillPrompt} {seconds} until prompt
                </p>
              )} */}
              <div className="mainContentInner">{children}</div>
            </div>
          </main>
          {isToggle && <div className="sidebar-ovrly"></div>}
        </div>

        <CustomModal
          show={open}
          hideHeader={true}
          modalHeading="Update billing address"
          className="updatePaymentDetail"
        >
          <div className="promptBody">
            <h3>Are you still here?</h3>
            <p>Logging out in {remaining} seconds</p>
            <Button
              title={"Yes"}
              className={"button--blue"}
              onClick={handleStillHere}
            />
          </div>
        </CustomModal>
      </Fragment>
    );
  } else {
    return <Navigate to={ROUTES.DASHBOARD} replace={true} />;
  }
};
export default PrivateLayout;
