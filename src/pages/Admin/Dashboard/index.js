import { DASHBOARD_TITLE } from "constants/title";
import React, { useEffect } from "react";
import "./Dashboard.scss";
import {
  File,
  FileTime,
  CalendarGroup,
  FileGroup,
  OrderGroup,
  PdfFile,
  PptFile,
  WordFile,
  FolderPdf,
  Group,
} from "assets/images";
import Chart from "components/chart";
import { useDispatch, useSelector } from "react-redux";
import { getChartData, getDashboard } from "redux/asyncApi/userApi";
import DlTileList from "components/DlTileList";
import GTMTAGS from "components/GTMTAGS";
const Dashboard = () => {
  document.title = DASHBOARD_TITLE;
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.user);
  const { ChartData } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.app.userAuth);
  const increaseBy = "increase by ";
  const decreaseBy = "decrease by";
  const lastmonth = "last month";
  const lastyear = "last year";

  const tileData = [
    {
      Icon: File,
      dt: "Yearly Files",
      dd: dashboardData?.response?.yearlydata?.total_files,
      progress:
        dashboardData?.response?.yearlydata?.progress === 0 ||
        dashboardData?.response?.yearlydata?.progress === undefined ? (
          ""
        ) : dashboardData?.response?.yearlydata?.progress > 0 ? (
          <>
            <span className="visually_hidden">{increaseBy}</span>
            {`(+${dashboardData?.response?.yearlydata?.progress.toFixed(2)}%)`}
            <span className="visually_hidden">{lastyear}</span>
          </>
        ) : (
          <>
            <span className="visually_hidden">{decreaseBy}</span>
            {`(${dashboardData?.response?.yearlydata?.progress.toFixed(2)}%)`}
            <span className="visually_hidden">{lastyear}</span>
          </>
        ),
    },
    {
      Icon: FileTime,
      dt: "Monthly Files",
      dd: dashboardData?.response?.monthlydata?.total_files,
      progress:
        dashboardData?.response?.monthlydata?.progress === 0 ||
        dashboardData?.response?.monthlydata?.progress === undefined ? (
          ""
        ) : dashboardData?.response?.monthlydata?.progress > 0 ? (
          <>
            <span className="visually_hidden">{increaseBy}</span>
            {`(+${dashboardData?.response?.monthlydata?.progress.toFixed(2)}%)`}
            <span className="visually_hidden">{lastmonth}</span>
          </>
        ) : (
          <>
            <span className="visually_hidden">{decreaseBy}</span>
            {`(${dashboardData?.response?.monthlydata?.progress.toFixed(2)}%)`}
            <span className="visually_hidden">{lastmonth}</span>
          </>
        ),
    },
    {
      Icon: OrderGroup,
      dt: "Orders in Progress",
      dd: dashboardData?.response?.inprogressfiles?.inprogressfiles,
    },
    {
      Icon: CalendarGroup,
      dt: "Yearly Pages",
      dd: dashboardData?.response?.yearly_pages_data?.totalpages,
      progress:
        dashboardData?.response?.yearly_pages_data?.progress === 0 ||
        dashboardData?.response?.yearly_pages_data?.progress === undefined ? (
          ""
        ) : dashboardData?.response?.yearly_pages_data?.progress > 0 ? (
          <>
            <span className="visually_hidden">{increaseBy}</span>
            {`(+${dashboardData?.response?.yearly_pages_data?.progress.toFixed(
              2
            )}%)`}
            <span className="visually_hidden">{lastyear}</span>
          </>
        ) : (
          <>
            <span className="visually_hidden">{decreaseBy}</span>
            {`(${dashboardData?.response?.yearly_pages_data?.progress.toFixed(
              2
            )}%)`}
            <span className="visually_hidden">{lastyear}</span>
          </>
        ),
    },
    {
      Icon: FileGroup,
      dt: "Monthly Pages",
      dd: dashboardData?.response?.monthly_pages_data?.totalpages,
      progress:
        dashboardData?.response?.monthly_pages_data?.progress === 0 ||
        dashboardData?.response?.monthly_pages_data?.progress === undefined ? (
          ""
        ) : dashboardData?.response?.monthly_pages_data?.progress > 0 ? (
          <>
            <span className="visually_hidden">{increaseBy}</span>
            {`(+${dashboardData?.response?.monthly_pages_data?.progress.toFixed(
              2
            )}%)`}
            <span className="visually_hidden">{lastmonth}</span>
          </>
        ) : (
          <>
            <span className="visually_hidden">{increaseBy} </span>
            {`(${dashboardData?.response?.monthly_pages_data?.progress.toFixed(
              2
            )}%)`}
            <span className="visually_hidden">{lastmonth}</span>
          </>
        ),
    },
    {
      Icon: Group,
      dt: "Orders Completed",
      dd: dashboardData?.response?.completed_files?.completed_files,
    },
    {
      Icon: PdfFile,
      dt: "Monthly Files / PDF",
      dd: dashboardData?.response?.pdffilesdata?.total_files,
      progress:
        dashboardData?.response?.pdffilesdata?.progress === 0 ||
        dashboardData?.response?.monthly_pages_data?.progress === undefined ? (
          ""
        ) : dashboardData?.response?.pdffilesdata?.progress > 0 ? (
          <>
            <span className="visually_hidden">{increaseBy}</span>
            {`(+${dashboardData?.response?.pdffilesdata?.progress.toFixed(
              2
            )}%)`}
            <span className="visually_hidden">{lastmonth}</span>
          </>
        ) : (
          <>
            <span className="visually_hidden">{increaseBy} </span>
            {`(${dashboardData?.response?.pdffilesdata?.progress.toFixed(2)}%)`}
            <span className="visually_hidden">{lastmonth}</span>
          </>
        ),
    },
    {
      Icon: PptFile,
      dt: "Monthly Files / PPT",
      dd: dashboardData?.response?.pptdata?.total_files,
      progress:
        dashboardData?.response?.pptdata?.progress === 0 ||
        dashboardData?.response?.monthly_pages_data?.progress === undefined ? (
          ""
        ) : dashboardData?.response?.pptdata?.progress > 0 ? (
          <>
            <span className="visually_hidden">{increaseBy}</span>
            {`(+${dashboardData?.response?.pptdata?.progress.toFixed(2)}%)`}
            <span className="visually_hidden">{lastmonth}</span>
          </>
        ) : (
          <>
            <span className="visually_hidden">{increaseBy} </span>
            {`(${dashboardData?.response?.pptdata?.progress.toFixed(2)}%)`}
            <span className="visually_hidden">{lastmonth}</span>
          </>
        ),
    },
    {
      Icon: WordFile,
      dt: "Monthly Files / Word",
      dd: dashboardData?.response?.word_file_data?.total_files,
    },
    {
      Icon: FolderPdf,
      dt: "Monthly Files / PDF Form",
      dd: dashboardData?.response?.pdfformdata?.total_files,
    },
  ];
  useEffect(() => {
    dispatch(getDashboard(token));
    dispatch(getChartData(token));
  }, [dispatch, token]);

  return (
    <>
      <GTMTAGS />
      <div className="dashboard">
        <div className="dashboardCards">
          <DlTileList
            className="dl_tile_list"
            data={tileData}
            TileClass="tile_class"
          />
        </div>
        <div className="customBlock mt-4">
          <h2 className="mainTitle mb-4">Monthly Files</h2>
          <div className="chart_container mt-4">
            <Chart
              ChartData={ChartData?.response}
              totalFiles={dashboardData?.response?.yearlydata?.total_files ?? 0}
              higherMonth={
                dashboardData?.response?.highestUploadCountByMonth?.month
              }
              lowestMonth={dashboardData?.response?.lowestfilecountmonth?.month}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
