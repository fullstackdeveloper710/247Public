import React, { Fragment, useCallback, useState } from "react";
import Datatable from "components/dataTable";
import moment from "moment";
import { bytesToSize, dateFormat } from "util/helpers";
import "./userFileDetails.scss";
import { ORDER_STATUS_CLASS } from "constants/job_status";

const FileDetailTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [focus, setFocus] = useState();
  const tableHead = [
    {
      key: "original_file_name",
      title: "FILE NAME",
      sorting: true,
      searching: true,
      width: "20%",
    },
    {
      key: "file_type",
      title: "TYPE",
      sorting: true,
      searching: true,
      width: "15%",
    },
    {
      key: "file_upload_date",
      title: "UPLOAD DATE",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "file_status",
      title: "STATUS",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "file_size",
      title: "SIZE",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "file_page_count",
      title: "PAGES",
      sorting: true,
      searching: false,
      width: "15%",
    },
    {
      key: "file_estimate_cost",
      title: "TOTAL COST",
      sorting: true,
      searching: false,
      width: "15%",
    },
  ];

  const cellRendrer = useCallback(
    (cell, row, column, index) => {
      if (column === "original_file_name") {
        return (
          <div>
            <a
              id={row.id}
              href="#"
              className="download-link file_name_id"
              title={row?.original_file_name}
            >
              {row?.original_file_name}
            </a>
          </div>
        );
      }

      if (column === "file_type") {
        return (
          <div id={row.id} className="d-flex align-items-center">
            <span className="text-uppercase">{row?.file_type}</span>
          </div>
        );
      }

      if (column === "file_upload_date") {
        return (
          <div className="table-button d-flex">
            {row?.file_upload_date
              ? moment(row?.file_upload_date).format(dateFormat)
              : ""}
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
      if (column === "file_size") {
        return (
          <div id={row.id}>
            <span className="role">{bytesToSize(row?.file_size)}</span>
          </div>
        );
      }
      if (column === "file_page_count") {
        return <div id={row.id}>{row?.file_page_count}</div>;
      }
      if (column === "file_estimate_cost") {
        return (
          <div className="table-button d-flex">{row?.file_estimate_cost}</div>
        );
      }

      return row[column];
    },
    [focus]
  );

  return (
    <Fragment>
      {/* {data?.length > 0 ? ( */}
        <Datatable
          tableHead={tableHead}
          data={data}
          renderCell={cellRendrer}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          type="user"
          search={true}
          pageSizing={true}
          paginationBar={true}
          tableDescription="User List"
        />
      {/* ) : (
        <div className="no-record-main">
          <div className="no-record">No Record Founds</div>
        </div>
      )} */}
    </Fragment>
  );
};

export default FileDetailTable;
