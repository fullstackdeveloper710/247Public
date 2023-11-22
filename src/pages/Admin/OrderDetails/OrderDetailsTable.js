import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DataTablesComp from "components/dataTable";
import { ArrowDownLong, InfoIcon } from "assets/images";
import {
  downloadAllPdf,
  downloadAllReport,
  downloadReport,
  download_pdf,
} from "redux/asyncApi/uploadApi";
import Button from "components/Button";
import { ORDER_STATUS_CLASS } from "constants/job_status";
import { getItem, setItem } from "constants/localstorage";
import {
  bytesToSize,
  currencyFormatter,
  dateFormat,
  noRecordFound,
  removeUnderScore,
} from "util/helpers";
import CustomTooltip from "components/CustomTootip";

const OrderDetailsTable = ({
  order_details,
  success,
  loading,
  file_exist,
  id,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //Redux state
  const {
    userAuth: { token },
  } = useSelector((state) => state.app);

  //Redux action dispatcher.
  const dispatch = useDispatch();

  //Static varriable for compare file status.
  const complete = "complete";

  //Methods
  //This function handle datatable row and columns.
  const cellRendrer = useCallback(
    (cell, row, column, index) => {
      if (column === "file_name") {
        return (
          <div className="d-flex">
            <span id={row.id} className="file_name_head">
              {row?.original_file_name ?? ""}
            </span>
            {row?.comments && (
              <CustomTooltip
                heading="Message"
                content={row?.comments}
                Icon={InfoIcon}
                tooltipId="message-tooltip"
                contentclass="tip-content"
                iconClass="tooltip_icon"
                mainClass="custom_tooltip"
              />
            )}
          </div>
        );
      }

      if (column === "file_type") {
        return (
          <div id={cell + index} className="text-uppercase">
            {removeUnderScore(row?.file_type ?? "")}
          </div>
        );
      }
      if (column === "file_deliver_date") {
        return (
          <div>
            <span className="role">
              {moment(row.file_deliver_date).format(dateFormat)}
            </span>
          </div>
        );
      }
      if (column === "file_status") {
        return (
          <div>
            <span className={`_badge ${ORDER_STATUS_CLASS[row?.label_value]}`}>
              {row?.label_text}
            </span>
          </div>
        );
      }
      if (column === "file_price_per_page") {
        return (
          <div>
            <span>{currencyFormatter(row?.file_price_per_page)}</span>
          </div>
        );
      }
      if (column === "file_page_count") {
        return <div>{row.file_page_count}</div>;
      }
      if (column === "file_size") {
        return <div>{bytesToSize(row.file_size)}</div>;
      }
      if (column === "file_estimate_cost") {
        return (
          <div>
            <span>{currencyFormatter(row?.file_estimate_cost)}</span>
          </div>
        );
      }
      if (column === "id") {
        return (
          <>
            {row.file_status === complete && (
              <div className="download-flie-btns">
                <button
                  role={"link"}
                  autoFocus={getItem("id") === row.id ? true : false}
                  id={index + "1"}
                  className={`download-link job_button`}
                  onClick={() => {
                    setItem("id", row.id);
                    const values = {
                      id: row.id,
                      fileName: row.original_file_name,
                    };
                    dispatch(
                      download_pdf({
                        token,
                        values,
                      })
                    );
                  }}
                  download
                  aria-labelledby={
                    row.id +
                    " " +
                    row.job_document_type +
                    index +
                    " " +
                    index +
                    1
                  }
                >
                  <ArrowDownLong aria-hidden="true" focusable="false" />
                  Accessible File
                </button>
                <button
                  role={"link"}
                  autoFocus={getItem("id") === row.job_filename ? true : false}
                  id={index + "2"}
                  className={`download-link job_button`}
                  onClick={() => {
                    setItem("id", row.job_filename);
                    const values = {
                      id: row.id,
                      fileName: row.original_file_name,
                    };
                    dispatch(
                      downloadReport({
                        token,
                        values,
                      })
                    );
                  }}
                  download
                  aria-labelledby={
                    row.id +
                    " " +
                    row.job_document_type +
                    index +
                    " " +
                    index +
                    2
                  }
                >
                  <ArrowDownLong aria-hidden="true" focusable="false" /> Report
                </button>
              </div>
            )}
          </>
        );
      }

      return row[column];
    },
    [order_details]
  );

  //This array is work for show table headers dynamicly in data table.
  const tableHead = [
    { title: "File Name", key: "file_name", sorting: true },
    { title: "Type", key: "file_type", sorting: true },
    { title: "Date of delivery", key: "file_deliver_date", sorting: true },
    { title: "status", key: "file_status", sorting: true },
    {
      title: "price per page",
      key: "file_price_per_page",
      sorting: true,
    },
    { title: "no of pages", key: "file_page_count", sorting: true },
    { title: "file size", key: "file_size", sorting: false },
    { title: "total", key: "file_estimate_cost", sorting: false },
    { title: "Download", key: "id", sorting: false },
  ];

  return (
    <div className="dt-responsive">
      {/* {success && (
        <div> */}
          {/* {!loading && success && ( */}
            <DataTablesComp
              tableHead={tableHead}
              data={order_details}
              renderCell={cellRendrer}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              setPageSize={setPageSize}
              pageSize={pageSize}
              type="order-details"
              search={false}
              pageSizing={true}
              paginationBar={true}
              tableDescription="Order Details List"
            />
          {/* )} */}
          <div className="form-buttons d-flex align-items-center justify-content-end px-4 py-5">
            <Button
              disabled={!file_exist}
              title={"Download All Accessible Files"}
              onClick={() => {
                const values = {
                  id: id,
                };
                dispatch(downloadAllPdf({ token, values }));
              }}
              className={"button--border"}
            />
            <Button
              disabled={!file_exist}
              title={"Download All Reports"}
              onClick={() => {
                const values = {
                  id: id,
                };
                dispatch(downloadAllReport({ token, values }));
              }}
              className={"button--blue ms-3"}
            />
          </div>
        {/* </div> */}
      {/* )} */}
      {/* {!loading && !success && order_details?.message && (
        <div className="no-record-main">
          <div className="no-record">{noRecordFound}</div>
        </div>
      )} */}
    </div>
  );
};
export default OrderDetailsTable;
