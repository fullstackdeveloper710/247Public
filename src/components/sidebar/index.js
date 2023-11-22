import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MainLogo,
  UserIcon,
  SpaceUsageIcon,
  LogoutIcon,
  CloseMenu,
  Mobilemenu,
  Help,
} from "assets/images";
import {
  getPostpaidOrdersCount,
  orderInProcess,
  pendingApprovalCount,
} from "redux/asyncApi/orderApi";
import { ROUTES } from "routes/constant";
import { Col, Row } from "react-bootstrap";
import {
  bytesToSize,
  currencyFormatter,
  notAvailable,
  usersTypes,
} from "util/helpers";
import {
  getBillingDetail,
  getUsedMemory,
  signOut,
} from "redux/asyncApi/appApi";
import { help } from "util/links";
import { navList } from "./sidebarList";
import "./sidebar.scss";

const Sidebar = ({ isToggle, setIsToggle }) => {
  const [route, setRoute] = useState("");

  //Redux state
  const orderCount = useSelector(
    (state) => state.order?.order_In_Process?.order_count
  );
  const { approval_count, postpaid_orders_count } = useSelector(
    (state) => state.order
  );
  const {
    usedMemory,
    userAuth: {
      token,
      user: { name, role, is_subscribe },
      details: { image },
    },
    billingDetails,
  } = useSelector((state) => state.app);

  //Redux action dispatcher
  const dispatch = useDispatch();

  //Ref
  const divRef = useRef(null);
  const buttonRef = useRef(null);

  //Router functions
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  //User roles
  const {
    companyUser,
    user,
    admin,
    superAdmin,
    rootAdmin,
    postpaidRoot,
    postpaidUser,
    postpaidAdmin,
    billingAdmin,
  } = usersTypes;

  //Methods
  useEffect(() => {
    if (!isToggle) {
      buttonRef?.current?.focus();
    }
  }, [isToggle]);

  useEffect(() => {
    if (
      role === postpaidAdmin ||
      role === billingAdmin ||
      role === rootAdmin ||
      role === postpaidRoot
    ) {
      dispatch(pendingApprovalCount(token));
    }
    if (role === superAdmin) {
      dispatch(getPostpaidOrdersCount(token));
    }
    dispatch(orderInProcess(token));
    dispatch(getUsedMemory(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (role === postpaidRoot) {
      dispatch(getBillingDetail(token));
    }
  }, []);

  useEffect(() => {
    if (role === rootAdmin && !is_subscribe) {
      navigate(ROUTES.BILLINGS);
    }
  }, [route]);

  const checkKey = (e) => {
    const currentNode = e.target;
    const lastChild = divRef.current;
    if (currentNode === lastChild && window.innerWidth <= 767) {
      e.preventDefault();
      buttonRef?.current?.focus();
    }
  };

  const sidebarStatus = (status) => {
    setIsToggle(false);
    setRoute(status);
  };

  //Static condition variables
  const disabledClass = !is_subscribe && "disabled";
  const noTabIndex = !is_subscribe ? "-1" : null;

  return (
    <header
      className={`sideBar ${isToggle ? `toggle` : ``}`}
      onKeyDown={checkKey}
    >
      <div className="mobileHeader">
        <Row className="align-items-center">
          <Col md={12}>
            <Link to="/" className="sideBar-Logo">
              <img
                src={MainLogo}
                alt="247 Accessible Documents Logo"
                className="img-fluid logo-desktop"
              />
            </Link>
          </Col>
          <Col md={12} className="mobile-show">
            <button
              aria-haspopup="menu"
              aria-label={isToggle ? "close navigation" : "open navigation"}
              ref={buttonRef}
              className={`mobileToggle d-none ${
                isToggle ? "menuClose" : "menuOpen"
              }`}
              onClick={() => {
                setIsToggle(!isToggle);
              }}
            >
              <Mobilemenu
                aria-hidden="true"
                focusable="false"
                className="menu-bar"
                role="img"
              />
              <CloseMenu
                className="menu-close"
                aria-hidden="true"
                focusable="false"
              />
            </button>
          </Col>
        </Row>
      </div>
      <div className="sidebarScroll mt-2">
        <nav aria-label="Main">
          <ul className="sideBar__list sideBar__listTop ">
            {navList.map(
              ({
                id,
                to,
                label,
                Icon,
                replace,
                roles,
                activeClass,
                activeFor,
                type,
              }) => {
                if (roles.includes(role)) {
                  return (
                    <li
                      className={
                        activeFor.includes(
                          pathname.replace(`/${params.id}`, "/:id")
                        ) && activeClass
                      }
                      key={id}
                    >
                      <Link
                        tabIndex={
                          to !== ROUTES.BILLINGS && !is_subscribe ? "-1" : null
                        }
                        className={to !== ROUTES.BILLINGS && disabledClass}
                        aria-current={pathname === to ? true : false}
                        onClick={() => sidebarStatus(to)}
                        to={is_subscribe && to}
                        replace={replace}
                      >
                        <span className="sidebar__icon">
                          <Icon aria-hidden="true" focusable="false" />
                        </span>
                        <span className="sidebar__text">{label}</span>
                        {type === "order-management" && (
                          <span className="badge ms-auto">{orderCount}</span>
                        )}
                        {type === "requests" && (
                          <span className="badge ms-auto">
                            {approval_count > 0 && approval_count}
                          </span>
                        )}
                        {type === "clients-order-management" && (
                          <span className="badge ms-auto">
                            {postpaid_orders_count > 0 && postpaid_orders_count}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                }
              }
            )}
          </ul>
        </nav>

        {role !== superAdmin && (
          <div className="spaceCardWrapper">
            <div className="spaceCard d-flex justify-content-around align-items-center flex-wrap">
              <div className="spaceCard__left">
                <SpaceUsageIcon aria-hidden="true" focusable="false" />
              </div>
              <div className="spaceCard__Right">
                <span className="title">Space Usage</span>
              </div>
              <div className="spaceCard_bottom">
                {role === admin ||
                role === rootAdmin ||
                role === postpaidRoot ||
                role === postpaidAdmin ||
                role === billingAdmin ? (
                  <>
                    <p className="mb-0">
                      <span>Self:</span>
                      {usedMemory?.self ? bytesToSize(usedMemory?.self) : "0KB"}
                    </p>
                    <p className="mb-0">
                      <span> Others:</span>
                      {usedMemory?.sub_user
                        ? bytesToSize(usedMemory?.sub_user)
                        : "0KB"}
                    </p>
                  </>
                ) : role === companyUser ||
                  role === user ||
                  role === postpaidUser ? (
                  <p className="mb-0">
                    <span> Self:</span>
                    {usedMemory?.self ? bytesToSize(usedMemory?.self) : "0KB"}
                  </p>
                ) : (
                  <p className="mb-0">
                    <span> Super Admin:</span>
                    {usedMemory?.user ? bytesToSize(usedMemory?.user) : "0KB"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {role === postpaidRoot && (
          <div className="invoicesCard">
            <div className="spaceCard">
              <p className="text-left">Invoice Status</p>
              <div className="innerInvoicecard">
                <p>
                  <span>Paid: </span>
                  {currencyFormatter(billingDetails?.Invoice_paid)}
                </p>
                <p>
                  <span>Pending: </span>
                  {currencyFormatter(billingDetails?.Invoice_pending_amount)}
                </p>
              </div>
            </div>
          </div>
        )}
        <nav aria-label="UserAccount">
          <ul className="sideBar__list sideBar__listBottom mt-5">
            <li
              className={
                (pathname === ROUTES.PROFILE ||
                  pathname === ROUTES.EDIT_PROFILE) &&
                "active"
              }
            >
              <Link
                tabIndex={noTabIndex}
                className={disabledClass}
                to={is_subscribe && ROUTES.PROFILE}
                aria-current={
                  pathname === ROUTES.PROFILE ||
                  pathname === ROUTES.EDIT_PROFILE
                    ? true
                    : false
                }
                onClick={() => sidebarStatus("profile")}
                replace
              >
                {image ? (
                  <img
                    className="img-fluid table_picture me-2"
                    src={image}
                    alt={""}
                  />
                ) : (
                  <span className="sidebar__icon">
                    <UserIcon aria-hidden="true" focusable="false" />
                  </span>
                )}
                <span className="sidebar__text text-capitalize line-clamp">
                  {name}
                </span>
              </Link>
            </li>
            <li className={route === "logout" && "active"}>
              <a href={help} target="_blank">
                <span className="sidebar__icon text-center">
                  <Help
                    aria-hidden="true"
                    focusable="false"
                    width={20}
                    // height="auto"
                  />
                </span>
                <span className="sidebar__text">Help</span>
              </a>
            </li>
            <li className={route === "logout" && "active"}>
              <Link
                to=""
                aria-current={route === "logout" ? true : false}
                ref={divRef}
                onClick={() => {
                  sidebarStatus("logout");
                  dispatch(signOut({ token }));
                }}
                replace
              >
                <span className="sidebar__icon">
                  <LogoutIcon aria-hidden="true" focusable="false" />
                </span>
                <span className="sidebar__text">Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Sidebar;
