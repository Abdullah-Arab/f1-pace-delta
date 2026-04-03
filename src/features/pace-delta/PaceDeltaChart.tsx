import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getTeammatePaceDelta } from './paceDelta.service';
import type { PaceDeltaResult } from './paceDelta.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const PaceDeltaChart: React.FC = () => {
  const [result, setResult] = useState<PaceDeltaResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPaceDelta() {
      try {
        setIsLoading(true);
        setError(null);
        const paceResult = await getTeammatePaceDelta();
        
        if (isMounted) {
          if (paceResult) {
            paceResult.deltas.sort((a, b) => b.delta - a.delta);
            setResult(paceResult);
          } else {
            setResult(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch pace delta data.');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPaceDelta();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div style={styles.stateContainer}>
        <p style={styles.stateText}>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.stateContainer}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!result || result.deltas.length === 0) {
    return (
      <div style={styles.stateContainer}>
        <p style={styles.stateText}>No data available</p>
      </div>
    );
  }

  const { session, deltas: data } = result;

  const chartData = {
    labels: data.map((d) => d.team),
    datasets: [
      {
        label: 'Delta (seconds)',
        data: data.map((d) => d.delta),
        backgroundColor: '#e10600', // vibrant F1 Red to keep it UI friendly
        hoverBackgroundColor: '#c80500',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#f9fafb',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        callbacks: {
          label: (context) => {
            const item = data[context.dataIndex];
            return `Gap: ${item.delta.toFixed(3)}s (Faster: #${item.fasterDriver}, Slower: #${item.slowerDriver})`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Delta (Seconds)',
          color: '#6b7280',
          font: { size: 13, weight: 500 }
        },
        grid: {
          color: '#e5e7eb',
        },
        ticks: { color: '#4b5563' },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#111827',
          font: {
            weight: 'bold',
            size: 13
          },
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>
          Qualifying Telemetry <span style={styles.inlineSession}>({session.country_name} {session.year})</span>
        </h2>
        <p style={styles.subtitle}>Analyzing the raw performance gap across teammates ({data.length} teams plotted)</p>
      </header>
      <div style={styles.chartWrapper}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  },
  header: {
    marginBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.3px',
  },
  inlineSession: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: '6px',
  },
  subtitle: {
    margin: 0,
    fontSize: '15px',
    color: '#4b5563',
  },
  chartWrapper: {
    position: 'relative' as const,
    height: '450px',
    width: '100%',
  },
  stateContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px dashed #d1d5db',
    maxWidth: '900px',
    margin: '0 auto',
  },
  stateText: {
    color: '#4b5563',
    fontSize: '16px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '16px',
    fontWeight: '500',
  },
};
