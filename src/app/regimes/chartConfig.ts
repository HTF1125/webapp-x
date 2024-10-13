// app/regimes/chartConfig.ts
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  zoomPlugin
);

export function setupChartConfig(data: Record<string, string>, startDate: Date) {
  const dates = Object.keys(data).map((date) => new Date(date));
  const filteredDates = dates.filter(date => date >= startDate);
  const regimes = filteredDates.map(date => data[date.toISOString().split('T')[0]]);
  const uniqueRegimes = Array.from(new Set(regimes));

  const regimeColors = uniqueRegimes.reduce((acc, regime, index) => {
    const hue = (index * 360) / uniqueRegimes.length;
    acc[regime] = `hsla(${hue}, 70%, 60%, 0.3)`;
    return acc;
  }, {} as Record<string, string>);

  const annotations = filteredDates.map((date, index) => ({
    type: "box" as const,
    xMin: date.getTime(),
    xMax: index < filteredDates.length - 1 ? filteredDates[index + 1].getTime() : undefined,
    yMin: 0,
    yMax: 1,
    backgroundColor: regimeColors[regimes[index]],
    borderWidth: 0,
  }));

  const chartData = {
    labels: filteredDates,
    datasets: [],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "year",
          displayFormats: {
            year: "yyyy",
          },
        },
        title: {
          display: true,
          text: "Date",
        },
        adapters: {
          date: {
            locale: enUS,
          },
        },
        min: startDate.getTime(),
      },
      y: {
        display: false,
        min: 0,
        max: 1,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          generateLabels: () => {
            return uniqueRegimes.map((regime) => ({
              text: regime,
              fillStyle: regimeColors[regime],
              strokeStyle: regimeColors[regime],
              lineWidth: 0,
              hidden: false,
            }));
          },
        },
        onClick: () => {}, // Disable legend click events
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: (context: any) => {
            if (context[0].label) {
              return new Date(context[0].label).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              });
            }
            return "";
          },
          label: (context: any) => {
            const date = new Date(context.label);
            const regime = data[date.toISOString().split("T")[0]];
            return `Regime: ${regime}`;
          },
        },
      },
      annotation: {
        annotations: annotations,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
  };

  return { chartData, chartOptions };
}
