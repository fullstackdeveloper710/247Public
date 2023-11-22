import React, { useEffect, useState } from "react";
import { PROFILE_TITLE } from "constants/title";
import Button from "components/Button";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import "./Profile.scss";
import {
  Avtar,
  Emailicon,
  Mobileicon,
  UserIcon,
  PlanIcon,
  CountryIcon,
  CompanyUserIcon,
  DesignationIcon,
  Address1,
  State,
  City,
  Pincode,
} from "assets/images";
import { ROUTES } from "routes/constant";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "redux/asyncApi/appApi";
import Tile from "components/Tile";
import DlTileList from "components/DlTileList";
import { usersTypes } from "util/helpers";
import CustomModal from "components/CustomModal";
import UpdatePassword from "../UpdatePassword";

const Profile = () => {
  document.title = PROFILE_TITLE;

  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userAuth, userDetails } = useSelector((state) => state.app);
  const { user } = userDetails;
  const {
    token,
    user: { role },
  } = userAuth;

  const { postpaidUser, user: payUser, superAdmin, rootAdmin } = usersTypes;
  const showField =
    role !== payUser &&
    role !== superAdmin &&
    role !== postpaidUser &&
    role !== rootAdmin;

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    dispatch(getUserDetails(token));
  }, []);
  const onEditProfileHandler = () => {
    navigate(ROUTES.EDIT_PROFILE);
  };

  const onUpdatePassHandler = () => {
    handleShow();
  };

  const data = [
    {
      Icon: UserIcon,
      dt: "First Name",
      dd: user?.first_name,
    },
    {
      Icon: UserIcon,
      dt: "Last Name",
      dd: user?.last_name,
    },
    {
      Icon: Emailicon,
      dt: "Email",
      dd: user?.email,
    },
    {
      Icon: Mobileicon,
      dt: "Mobile Number",
      dd: user?.mobile_number ? "+" + user?.mobile_number : "",
    },
    {
      Icon: DesignationIcon,
      dt: "Designation",
      dd: user?.designation,
    },
    {
      Icon: CompanyUserIcon,
      dt: "Company Name",
      dd: user?.company_name,
    },
    {
      Icon: CountryIcon,
      dt: "Country",
      dd: user?.address?.country,
    },
    {
      Icon: PlanIcon,
      dt: "Plan",
      dd: user?.plan,
    },
    {
      Icon: Address1,
      dt: "Address 1",
      dd: user?.address?.address1,
    },
    {
      Icon: Address1,
      dt: "Address 2",
      dd: user?.address?.address2,
    },
    {
      Icon: State,
      dt: "State",
      dd: user?.address?.state,
    },
    {
      Icon: City,
      dt: "City",
      dd: user?.address?.city,
    },
    {
      Icon: Pincode,
      dt: "Zip Code",
      dd: user?.address?.postal_code,
    },
  ];
  if (showField) {
    data.splice(5, 0, {
      Icon: DesignationIcon,
      dt: "Department",
      dd: user?.department,
    });
  }
  return (
    <div className="mainWrapper profile">
      <div className="main-content">
        <div className="profile__cardWrap">
          <Row>
            <Col lg="12">
              <div className="profile__card">
                <div className="profile__cardleft">
                  <span className="profile__icon">
                    {user?.profile_image ? (
                      <img
                        src={user?.profile_image}
                        alt={
                          !user?.description
                            ? "No description"
                            : user?.description
                        }
                      />
                    ) : (
                      <Avtar aria-hidden="true" focusable="false" />
                    )}
                  </span>
                  <div className="profile__content">
                    <h2 className="text-capitalize">
                      {user?.first_name} {user?.last_name}
                    </h2>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div className="btn-group">
                  <Button
                    title={"Update Password"}
                    className={"button--border me-3"}
                    onClick={onUpdatePassHandler}
                  />
                  <Button
                    title={"Edit profile"}
                    className={"button--border"}
                    onClick={onEditProfileHandler}
                  />
                </div>
                <CustomModal
                  show={show}
                  handleClose={handleClose}
                  modalHeading="Update Password"
                  className="updatePasswordModal"
                >
                  <div className="customModalBody">
                    <UpdatePassword handleClose={handleClose} />
                  </div>
                </CustomModal>
              </div>
            </Col>
          </Row>
          <div className="profileDlList">
            <DlTileList
              className="dl_tile_list"
              data={data}
              TileClass="tile_class"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
