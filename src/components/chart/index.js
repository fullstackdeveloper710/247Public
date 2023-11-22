import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
const Chart = ({ ChartData, totalFiles, lowestMonth, higherMonth }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  const options = {
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        grid: {
          drawOnChartArea: true,
        },
        ticks: {
          precision: 0,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    pointRadius: 8,
    pointHoverRadius: 10,
    backgroundColor: "linear-gradient(to right, #20f08b, #07dfb1)",
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Data",
        data: labels.map((data, index) => ChartData?.[index + 1]),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        fill: true,
      },
    ],
  };
  return (
    <Line
      options={options}
      data={data}
      role="img"
      aria-label={
        higherMonth && lowestMonth && totalFiles
          ? `Line graph depicting number of files uploaded from January to
  December. The highest number of files was uploaded in ${higherMonth} while
  the lowest number of files uploaded in ${lowestMonth}. The total number of
  files uploaded in the year is ${totalFiles}.`
          : `No files uploaded yet`
      }
    />
  );
};
export default Chart;
