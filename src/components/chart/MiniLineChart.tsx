import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MiniLineChartProps {
  data: number[];
}

const MiniLineChart: React.FC<MiniLineChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const padding = (maxValue - minValue) * 0.1;

  const chartData: ChartData<"line"> = {
    labels: data.map((_, index) => index + 1), // X-axis labels as indices
    datasets: [
      {
        label: "NAV",
        data: data, // Y-axis values
        fill: false,
        borderColor: "#00FFFF",
        tension: 0.1, // Smoothing
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
      datalabels: {
        display: false, // Ensure no datalabels are shown
      },
    },
    scales: {
      x: {
        display: false, // Hide X-axis
      },
      y: {
        display: false, // Hide Y-axis
        min: minValue - padding, // Add padding below min value
        max: maxValue + padding, // Add padding above max value
      },
    },
    elements: {
      point: {
        radius: 0, // Remove points on the line
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "150px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MiniLineChart;
