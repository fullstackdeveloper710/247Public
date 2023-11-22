import React, { useEffect, useState, useRef } from "react";
import { ArrowDown, ArrowUp, Clear, Search } from "assets/images";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { SORT } from "./constant";
import SelectBox from "components/SelectBox/SelectBox";
import { noRecordFound, rangePagination } from "util/helpers";
import "./table.scss";
import _ from "lodash";
const Datatable = (props) => {
  const {
    currentPage,
    setCurrentPage,
    setPageSize,
    pageSize,
    type,
    search,
    pageSizing,
    paginationBar,
    filterSearch,
    AddUserButton,
    AddCustomUserButton,
    generateInvBtn,
  } = props;
  const pageContentSize = [5, 10, 15, 20];
  const tableRef = useRef(null);
  const searchRef = useRef(null);
  const entriesRef = useRef(null);
  const { data, tableHead, renderCell } = props;
  const [temp, setTemp] = useState(data);
  const [start, setStart] = useState((currentPage - 1) * pageSize);
  const [last, setlast] = useState(currentPage * pageSize);
  // const [FilterData, setFilterData] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const [Order, setOrder] = useState("ASC");
  const [FilterVal, setFilterVal] = useState("");
  const [sortCol, setSortCol] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchByOptions, setSearchByoptions] = useState([]);
  const [searchBy, setSearchBy] = useState("");

  useEffect(() => {
    const options = tableHead
      .filter((item, i) => item.searching)
      .map((item) => {
        return {
          label: item.title,
          value: item.key,
        };
      });
    setSearchByoptions(options);
  }, []);

  useEffect(() => {
    // setFilterData(data);
    setSearchApiData(data);
    setTemp(data);
    if (entriesRef && entriesRef.current) {
      entriesRef.current.role = "status";
      entriesRef.current.ariaLive = "polite";
    }
  }, [data, pageSize]);

  useEffect(() => {
    setStart((currentPage - 1) * pageSize);
    setlast(currentPage * pageSize);
    setSortCol("");
  }, [currentPage, pageSize]);

  const sortings = (col) => {
    if (Order === "ASC") {
      const sorted = [...temp].sort((a, b) =>
        a[col]?.toString()?.toLowerCase() > b[col]?.toString()?.toLowerCase()
          ? 1
          : -1
      );
      setTemp(sorted);
      setOrder("DSC");
    }

    if (Order === "DSC") {
      const sorted = [...temp].sort((a, b) =>
        a[col]?.toString()?.toLowerCase() < b[col]?.toString()?.toLowerCase()
          ? 1
          : -1
      );
      setTemp(sorted);
      setOrder("ASC");
    }
    setSortCol(col);
  };

  const searchOnEnter = (e) => {
    if (e.key === "Enter") {
      handleFilter("search");
    }
  };

  const handleFilter = (searchVal) => {
    setLoading(true);
    if (searchVal === "clear") {
      setTemp(searchApiData);
      setFilterVal("");
      setLoading(false);
    } else {
      const filterResult = searchApiData.filter((item, index) => {
        const itemValue = item?.[searchBy]
          ?.toString()
          ?.toLowerCase()
          ?.replace(/\s/g, "");
        return itemValue?.includes(
          FilterVal?.replace(/\s/g, "")?.toLowerCase()
        );
      });
      // searchApiData.filter((item, i) => {
      //   for (var c = 0; c < tableHead.length; c++) {
      //     // var filedname = "";
      //     // if (tableHead[c].searching === true) {
      //     //   var filedname = item[tableHead[c].key];
      //     let filedname = item?.[searchBy];
      //     console.log(filedname,"fieldname")
      //     if (filedname === "NULL") {
      //       filedname = item.job_order_no;
      //       return filedname?.toString()?.toLowerCase()?.includes(FilterVal?.replace(/\s/g,"")?.toLowerCase());
      //     } else {
      //       return filedname?.toString()?.toLowerCase()?.includes(FilterVal?.replace(/\s/g,"")?.toLowerCase());
      //     }
      //     // }
      //   }
      // });

      if (filterResult.length > 0) {
        setTemp(filterResult);
        setCurrentPage(1);
        setLoading(false);
      } else {
        setTemp([]);
        setLoading(false);
      }
    }
    // tableRef.current.focus()
  };

  const pageCount = temp ? Math.ceil(temp.length / pageSize) : 0;
  // const range = (start, end) => {
  //   return Array.from({ length: end - start }, (_, i) => start + i);
  // };

  // const pages = range(1, pageCount + 1);
  const pages = rangePagination(pageCount, currentPage, pageSizing, 1);

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    setStart(pageSize * (pageNo - 1));
    setlast(pageSize * pageNo);
  };

  const nextButton = () => {
    if (currentPage !== pages[pages?.length - 1]) {
      setStart(pageSize * currentPage);
      setlast(pageSize * (currentPage + 1));
      setCurrentPage(currentPage + 1);
    }
  };

  const preButton = () => {
    if (currentPage > 1) {
      setStart((currentPage - 2) * pageSize);
      setlast(pageSize * (currentPage - 1));
      setCurrentPage(currentPage - 1);
    }
  };

  const SelectedList = (e) => {
    const { value } = e.target;
    const intVal = parseInt(value);
    setStart(intVal * (currentPage - 1));
    setlast(currentPage * intVal);
    setPageSize(intVal);
    setCurrentPage(1);
  };
  return (
    <>
      {!loading && (
        <div className="table_container dataTables_wrapper">
          <div className="table_header_data d-flex justify-content-end align-items-center">
            {generateInvBtn}
            {search && (
              <>
                <div className="filterSearch me-2">
                  <SelectBox
                    className="form-control form-select"
                    onChange={(e) => {
                      setSearchBy(e.target.value);
                    }}
                    value={searchBy}
                    options={searchByOptions}
                    label={"Search By:"}
                  />
                </div>
                <div className="d-flex align-items-center dataTables_filter">
                  <label htmlFor="search-field">Search:</label>
                  <input
                    disabled={searchBy === ""}
                    ref={searchRef}
                    type="input"
                    id="search-field"
                    value={FilterVal}
                    onChange={(e) => {
                      setFilterVal(e.target.value);
                      if (e.target.value === "") {
                        setTemp(data);
                      }
                    }}
                    onKeyDown={(e) => searchOnEnter(e)}
                    aria-controls="table1"
                    className="table_search ms-1"
                  />
                  {FilterVal.length > 0 && (
                    <button
                      disabled={searchBy === ""}
                      className="clear"
                      onClick={() => {
                        handleFilter("clear");
                        searchRef.current.focus();
                      }}
                      aria-label="clear"
                    >
                      <Clear />
                    </button>
                  )}
                  <button
                    disabled={searchBy === ""}
                    onClick={() => handleFilter("search")}
                    className="searchbtn"
                    aria-label="search"
                  >
                    <Search />
                  </button>
                </div>
              </>
            )}

            {filterSearch && (
              <div className="filterSearch">
                <SelectBox
                  className="form-control form-select"
                  // onChange={""}
                  // name=""
                  // value={""}
                  options={[]}
                  label={"Filter By:"}
                />
              </div>
            )}
            {AddUserButton}
            {AddCustomUserButton}
          </div>

          <div className="table_style">
            {temp && temp.length > 0 ? (
              <div className="table_data pt-3">
                <div className="my-custom-div">
                  <table
                    className="table customTable"
                    ref={tableRef}
                    id="table1"
                    aria-describedby="table_info table1_info"
                  >
                    <thead>
                      <tr>
                        {tableHead.map(
                          ({ title, key, sorting, width, theadId }) => (
                            <th
                              id={theadId}
                              key={key}
                              width={width}
                              aria-controls="table1"
                              aria-sort={key === sortCol ? SORT[Order] : null}
                              onClick={() => sorting && sortings(key)}
                              className={
                                key === sortCol ? `sorting ${Order}` : ""
                              }
                            >
                              {sorting ? (
                                <button
                                  className={` sorting_button d-flex align-items-center ${key} `}
                                >
                                  <span>{title} </span>
                                  {sorting && (
                                    <span className="sort-btn d-flex flex-column ms-2">
                                      {key !== sortCol ? (
                                        <>
                                          <ArrowUp
                                            aria-hidden="true"
                                            focusable="false"
                                          />{" "}
                                          <ArrowDown
                                            aria-hidden="true"
                                            focusable="false"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          {key === sortCol &&
                                            Order === "ASC" && (
                                              <ArrowUp
                                                aria-hidden="true"
                                                focusable="false"
                                              />
                                            )}
                                          {key === sortCol &&
                                            Order === "DSC" && (
                                              <ArrowDown
                                                aria-hidden="true"
                                                focusable="false"
                                              />
                                            )}
                                        </>
                                      )}
                                    </span>
                                  )}
                                </button>
                              ) : (
                                <div
                                  className={` d-flex align-items-center ${key} `}
                                >
                                  <span>{title} </span>
                                </div>
                              )}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {temp &&
                        temp.slice(start, last)?.map((curElm, index) => {
                          {
                            const tHeadId = Math.floor(
                              100000 + Math.random() * 900000
                            );
                            return (
                              <tr key={`user_id` + index}>
                                {tableHead.map((data) =>
                                  type === "order" ||
                                  type === "user" ||
                                  type === "order-details" ||
                                  type === "approval" ||
                                  type === "clients-order" ||
                                  type === "workload" ||
                                  type === "client-user" ? (
                                    data.key === "id" ||
                                    data.key === "job_document_name" ||
                                    data.key === "original_file_name" ||
                                    data.key === "file_name" ||
                                    data.key === "clients_order_id" ||
                                    data.key === "name" ||
                                    data.key === "first_name" ? (
                                      <th key={data.key} id={tHeadId}>
                                        {renderCell ? (
                                          renderCell(
                                            curElm[data.key],
                                            curElm,
                                            data.key,
                                            index,
                                            tHeadId
                                          )
                                        ) : (
                                          <span>{curElm[data.key]} </span>
                                        )}
                                      </th>
                                    ) : (
                                      <td
                                        id={Math.floor(
                                          100000 + Math.random() * 900000
                                        )}
                                      >
                                        {renderCell ? (
                                          renderCell(
                                            curElm[data.key],
                                            curElm,
                                            data.key,
                                            index,
                                            tHeadId
                                          )
                                        ) : (
                                          <span>{curElm[data.key]} </span>
                                        )}
                                      </td>
                                    )
                                  ) : (
                                    <td>
                                      {renderCell ? (
                                        renderCell(
                                          curElm[data.key],
                                          curElm,
                                          data.key,
                                          index
                                        )
                                      ) : (
                                        <span>{curElm[data.key]} </span>
                                      )}
                                    </td>
                                  )
                                )}
                              </tr>
                            );
                          }
                        })}
                    </tbody>
                  </table>
                </div>

                {temp && temp?.length > 0 && (
                  <div className="pagination-inner-wrapper">
                    {pageSizing && (
                      <div className="d-flex align-items-center dt-length">
                        <label htmlFor="show_entries" className="me-2">
                          Show entries
                        </label>
                        <select
                          id="show_entries"
                          aria-describedby="table1_info"
                          className="form-select w-auto"
                          value={pageSize}
                          onChange={SelectedList}
                        >
                          {pageContentSize.map((curElm, index) => {
                            return (
                              <>
                                <option value={curElm} key={index}>
                                  {curElm}
                                </option>
                              </>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    <div
                      className={
                        paginationBar ? "dataTables_info" : "total_page_count"
                      }
                      id="table1_info"
                      role="status"
                      // aria-describedby="table_desc"
                      aria-live="polite"
                      ref={entriesRef}
                    >
                      Showing {pageSize * (currentPage - 1) + 1} to{" "}
                      {pages[pages.length - 1] === currentPage
                        ? temp?.length
                        : pageSize * currentPage}{" "}
                      of <span>{temp?.length}</span> entries
                    </div>

                    {paginationBar && (
                      <nav
                        aria-label="Pagination"
                        className="dataTables_paginate"
                      >
                        <ul className="pagination mb-0 d-flex align-items-center cursor">
                          <li>
                            <button
                              onClick={() => preButton()}
                              className={`paginate_button  ${
                                currentPage === 1 ? `disabled` : `enabled`
                              }`}
                              disabled={currentPage === 1 && true}
                            >
                              <BsChevronLeft
                                aria-hidden="true"
                                focusable="false"
                              />
                              <span className={`me-2`}>Previous</span>
                              <span className="visually_hidden">Page</span>
                            </button>
                          </li>
                          {pages.map((page, index) => (
                            <li
                              key={index}
                              className={
                                page === currentPage
                                  ? "me-2 dt-item active "
                                  : "dt-item me-2"
                              }
                            >
                              <button
                                role="link"
                                className="dt-link cursor_pointer"
                                onClick={() => pagination(page)}
                                disabled={page === "..."}
                                aria-label={`page ${page}`}
                                aria-current={
                                  page === currentPage ? true : false
                                }
                              >
                                {page}{" "}
                              </button>
                            </li>
                          ))}
                          <li>
                            <button
                              onClick={() => nextButton()}
                              className={`paginate_button ${
                                currentPage === pages[pages?.length - 1]
                                  ? `disabled`
                                  : `enabled`
                              }`}
                              disabled={
                                currentPage === pages[pages?.length - 1]
                              }
                            >
                              <span className="">Next</span>
                              <span className="visually_hidden">Page</span>
                              <BsChevronRight
                                aria-hidden="true"
                                focusable="false"
                              />
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-record-main">
                <div className="no-record">{noRecordFound}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Datatable;
