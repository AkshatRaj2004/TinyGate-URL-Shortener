import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { cssColor } from '../../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const DAY = 86_400_000;
const MIN_DAYS = 14;
const MAX_DAYS = 90;

/** Turns {"2026-11-03": 4, ...} into a continuous daily series ending today. */
const buildSeries = (clicksOverTime) => {
  const keys = Object.keys(clicksOverTime).sort();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const first = keys.length ? new Date(`${keys[0]}T00:00:00Z`) : today;
  const span = Math.round((today - first) / DAY) + 1;
  const days = Math.min(MAX_DAYS, Math.max(MIN_DAYS, span));

  const labels = [];
  const values = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today.getTime() - i * DAY);
    const key = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }));
    values.push(clicksOverTime[key] || 0);
  }
  return { labels, values, days };
};

const ClicksChart = ({ clicksOverTime = {} }) => {
  const { labels, values, days } = useMemo(() => buildSeries(clicksOverTime), [clicksOverTime]);

  const accent = cssColor('accent');
  const muted  = cssColor('muted');
  const grid   = cssColor('line');

  const data = {
    labels,
    datasets: [{
      label: 'Clicks',
      data: values,
      fill: true,
      borderColor: accent,
      borderWidth: 1.75,
      backgroundColor: (ctx) => {
        const { chartArea, ctx: c } = ctx.chart;
        if (!chartArea) return cssColor('accent', 0.08);
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, cssColor('accent', 0.14));
        g.addColorStop(1, cssColor('accent', 0));
        return g;
      },
      tension: 0.25,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: accent,
      pointHoverBorderColor: cssColor('surface'),
      pointHoverBorderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: cssColor('surface'),
        borderColor: grid,
        borderWidth: 1,
        titleColor: muted,
        bodyColor: cssColor('fg'),
        titleFont: { size: 11, weight: '500' },
        bodyFont: { size: 12, weight: '600' },
        padding: 8,
        cornerRadius: 6,
        displayColors: false,
        callbacks: { label: (c) => `${c.parsed.y} click${c.parsed.y === 1 ? '' : 's'}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: grid },
        ticks: {
          color: muted,
          font: { size: 11 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: days > 30 ? 8 : 7,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: grid, drawTicks: false },
        border: { display: false },
        ticks: { color: muted, font: { size: 11 }, precision: 0, padding: 8, maxTicksLimit: 5 },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};

export default ClicksChart;
