import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTablesComp from "components/dataTable";
import { updateInvoiceStatus } from "redux/asyncApi/orderApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "routes/constant";
import moment from "moment";
import { ORDER_STATUS_CLASS } from "constants/job_status";
import { dateFormat, notAvailable } from "util/helpers";
import Button from "components/Button";
import ConfirmPopUp from "components/Confirm/ConfirmPopUp";
const ClientOrdersTable = ({ orderData, setIds, ids, GenerateInvBtn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const { loading } = useSelector((state) => state.app);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const { token } = useSelector((state) => state.app.userAuth);

  const { data, status } = orderData || {};

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setIds((prevCheckedIds) => [...prevCheckedIds, parseInt(name)]);
    } else {
      setIds((prevCheckedIds) =>
        prevCheckedIds.filter((id) => id !== parseInt(name))
      );
    }
  };

  const handleOpenConfirmationBox = (rowData) => {
    setShow(true);
    setSelectedOrderId(rowData?.id);
  };

  const cellRendrer = useCallback(
    (cell, row, column, index) => {
      if (column === "id") {
        return (
          <div id={row.id} className="clientOrderCol">
            <input
              type="checkbox"
              disabled={
                row?.invoice_created ||
                row?.label_value === "cancelled"
              }
              name={row.id}
              checked={
                ids.includes(row.id) || row?.invoice_created ? true : false
              }
              onChange={handleCheckboxChange}
            />
            <a
              href="#"
              className="download-link"
              onClick={() =>
                navigate(ROUTES.ORDER_DETAILS + "/" + row.id, {
                  state: {
                    id: row.id,
                    row,
                  },
                })
              }
            >
              {"PORD-" + row?.id}
            </a>
          </div>
        );
      }
      if (column === "order_invoice_number") {
        return (
          <div id={row.id}>
            {row?.order_invoice_number ? (
              <div
                onClick={() =>
                  navigate(
                    ROUTES.CLIENT_INVOICE_DETAILS.replace(/:id/g, row.id),
                    {
                      state: {
                        id: row.id,
                        row,
                      },
                    }
                  )
                }
              >
                <a href="#" className="download-link">
                  {row?.order_invoice_number}
                </a>
              </div>
            ) : (
              <span>{notAvailable}</span>
            )}
          </div>
        );
      }

      if (column === "order_generate_date") {
        return (
          <div id={row.id}>
            <span className="role">
              {moment(row.order_generate_date).format(dateFormat)}
            </span>
          </div>
        );
      }

      if (column === "department") {
        return (
          <div id={row.id}>
            <span className="role text-capitalize">
              {row?.department ?? notAvailable}
            </span>
          </div>
        );
      }
      if (column === "order_total_pages") {
        return <div>{row?.order_total_pages}</div>;
      }
      if (column === "order_delivery_date") {
        return (
          <div id={row.id}>
            <span className="role">
              {moment(row?.order_delivery_date).format(dateFormat)}
            </span>
          </div>
        );
      }

      if (column === "order_by") {
        return (
          <div id={row.id}>
            <span className="role text-capitalize">{row?.order_by}</span>
          </div>
        );
      }

      if (column === "label_text") {
        return (
          <div>
            <span className={`_badge ${ORDER_STATUS_CLASS[row?.label_value]}`}>
              {row?.label_text}
            </span>
          </div>
        );
      }

      if (column === "clients_action") {
        return row.order_invoice_number ? (
          <Button
            onClick={() => handleOpenConfirmationBox(row)}
            className="btn btn--md button--blue"
            title="Mark as Paid"
            disabled={row.mark_as_paid ? true : false|| row?.label_value === "cancelled"}
          />
        ) : (
          <span className="inv_not_generated">Invoice not generated</span>
        );
      }

      return row[column];
    },
    [ids]
  );

  const tableHead = [
    {
      key: "id",
      title: "ORDER NUMBER",
      sorting: true,
      searching: true,
      width: "15%",
    },
    {
      key: "order_invoice_number",
      title: "INVOICE NUMBER",
      sorting: true,
      searching: true,
      width: "20%",
    },
    {
      key: "order_generate_date",
      title: "DATE",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "department",
      title: "DEPARTMENT",
      sorting: true,
      searching: false,
      width: "10%",
    },
    {
      key: "order_total_pages",
      title: "TOTAL PAGES",
      sorting: true,
      searching: false,
      width: "10%",
    },
    {
      key: "order_delivery_date",
      title: "DATE OF DELIVERY",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "order_by",
      title: "ORDER BY",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "label_text",
      title: "STATUS",
      sorting: true,
      searching: false,
      width: "10%",
    },
    {
      key: "clients_action",
      title: "ACTION",
      sorting: false,
      searching: false,
      width: "10%",
    },
  ];

  const handleMarkAsPaid = () => {
    let object = { order_id: selectedOrderId, mark_as_paid: true };
    dispatch(updateInvoiceStatus({ object, token }));
    setShow(false);
  };
  return (
    <div className="dt-responsive">
      <ConfirmPopUp
        show={show}
        heading={"Update Invoice Status"}
        handleClose={() => setShow(false)}
        onConfirmHandler={handleMarkAsPaid}
        confirmMsg={"Are you sure you want to Mark as Paid this order?"}
      />
      {/* {!loading && status && ( */}
      <DataTablesComp
        tableHead={tableHead}
        data={data}
        renderCell={cellRendrer}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        setPageSize={setPageSize}
        pageSize={pageSize}
        type="clients-order"
        search={true}
        pageSizing={true}
        paginationBar={true}
        // pageSize={true}
        generateInvBtn={GenerateInvBtn}
        tableDescription="Postpaid Order List"
      />
      {/* )} */}
      {/* {!loading && !status && (
        <div className="no-record-main">
          <div className="no-record">No Record Found</div>
        </div>
      )} */}
    </div>
  );
};
export default ClientOrdersTable;
