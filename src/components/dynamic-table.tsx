import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';
import { parseISO, format } from 'date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

interface RegimeChartProps {
  regime: {
    code: string;
    data: Record<string, string>;
  };
}

const regimeColors: Record<string, string> = {
  Expansion: 'rgba(0, 255, 0, 0.2)',
  Slowdown: 'rgba(255, 255, 0, 0.2)',
  Contraction: 'rgba(255, 0, 0, 0.2)',
  Recovery: 'rgba(0, 0, 255, 0.2)',
};

export default function RegimeChart({ regime }: RegimeChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<any>(null);
  const chartRef = useRef<ChartJS>(null);

  useEffect(() => {
    const dates = Object.keys(regime.data).map(date => parseISO(date));
    const states = Object.values(regime.data);

    // Extend the time series to today
    const today = new Date();
    if (dates[dates.length - 1] < today) {
      dates.push(today);
      states.push(states[states.length - 1]);
    }

    const uniqueStates = Array.from(new Set(states));

    const annotations: any[] = [];
    let currentState = states[0];
    let startIndex = 0;

    states.forEach((state, index) => {
      if (state !== currentState || index === states.length - 1) {
        annotations.push({
          type: 'box',
          xMin: dates[startIndex],
          xMax: index === states.length - 1 ? dates[index] : dates[index - 1],
          yMin: 0,
          yMax: 1,
          backgroundColor: regimeColors[currentState as keyof typeof regimeColors],
          borderColor: 'transparent',
        });
        currentState = state;
        startIndex = index;
      }
    });

    setChartData({
      labels: dates,
      datasets: [{
        data: dates.map(() => 1),
        borderColor: 'transparent',
        pointRadius: 0,
      }]
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            generateLabels: () => {
              return uniqueStates.map(state => ({
                text: state,
                fillStyle: regimeColors[state as keyof typeof regimeColors],
                strokeStyle: regimeColors[state as keyof typeof regimeColors],
                lineWidth: 0,
                hidden: false,
              }));
            }
          }
        },
        title: {
          display: true,
          text: `Regime Data for ${regime.code}`,
        },
        annotation: {
          annotations: annotations,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (context: any) => {
              return format(context[0].parsed.x, 'yyyy-MM-dd');
            },
            label: (context: any) => {
              const index = context.dataIndex;
              return `State: ${states[index]}`;
            }
          }
        }
      },
      scales: {
        y: {
          display: false,
          min: 0,
          max: 1,
        },
        x: {
          type: 'time',
          time: {
            unit: 'year',
            displayFormats: {
              year: 'yyyy'
            }
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
          }
        }
      }
    });
  }, [regime]);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      {chartData && chartOptions && (
        <Chart
          ref={chartRef}
          type='line'
          data={chartData}
          options={chartOptions}
        />
      )}
    </div>
  );
}