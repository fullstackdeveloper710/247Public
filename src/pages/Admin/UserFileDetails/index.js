import { USERS_FILE_DETAILS_TITLE } from "constants/title";
import React, { useEffect } from "react";
import "./userFileDetails.scss";
import { Col, Row } from "react-bootstrap";
import FileDetailTable from "./FileDetailTable";
import { useDispatch, useSelector } from "react-redux";
import { getClientUserbyId } from "redux/asyncApi/userApi";
import { useParams } from "react-router-dom";
import moment from "moment";
import { dateFormat, notAvailable } from "util/helpers";
import DlTileList from "components/DlTileList";

const UserFileDetails = () => {
  document.title = USERS_FILE_DETAILS_TITLE;
  const {
    userAuth: { token },
  } = useSelector((state) => state.app) || {};

  const { clientUserById } = useSelector((state) => state.user) || {};
  const { data, files } = clientUserById || {};
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const values = {
      id: params?.id,
    };
    dispatch(getClientUserbyId({ token, values }));
  }, []);

  const cardData = [
    {
      dt: "Order Invoice:",
      dd: data?.order_invoice_number ?? notAvailable,
    },
    {
      dt: "Order status:",
      dd: data?.order_status ?? notAvailable,
    },
    {
      dt: "Upload Date:",
      dd: data?.order_generate_date
        ? moment(data.order_generate_date).format(dateFormat)
        : notAvailable,
    },
    {
      dt: "No of Pages:",
      dd: data?.order_total_pages ?? notAvailable,
    },
    {
      dt: "Deliver Date:",
      dd: data?.order_delivery_date
        ? moment(data.order_delivery_date).format(dateFormat)
        : notAvailable,
    },
    {
      dt: "No of Files:",
      dd: data?.order_total_files ?? notAvailable,
    },
  ];
  return (
    <div className="userFileWrap">
      <div className="main-content">
        <Row>
          <Col md="12">
            <div className="userFileDetail">
              <h2 className="mainTitle mb-4">Last Order Details</h2>
              <DlTileList
                className="dl_tile_list"
                data={cardData}
                TileClass="tile_class"
              />
            </div>
          </Col>

          <Col md="12">
            <div className="fileDetails">
              <h2 className="mainTitle mb-0">File Details</h2>
              <div className="fileTable">
                <FileDetailTable data={files} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserFileDetails;
