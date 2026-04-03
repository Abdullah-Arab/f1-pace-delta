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
import type { TeamDelta } from './paceDelta.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const PaceDeltaChart: React.FC = () => {
  const [data, setData] = useState<TeamDelta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPaceDelta() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getTeammatePaceDelta();
        
        if (isMounted) {
          const sortedResult = [...result].sort((a, b) => b.delta - a.delta);
          setData(sortedResult);
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

  if (data.length === 0) {
    return (
      <div style={styles.stateContainer}>
        <p style={styles.stateText}>No data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.team),
    datasets: [
      {
        label: 'Delta (seconds)',
        data: data.map((d) => d.delta),
        backgroundColor: '#4b5563', // Neutral gray
        hoverBackgroundColor: '#1f2937', // Darker gray on hover
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          text: 'Delta (s)',
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#374151',
          font: {
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Teammate Pace Delta – Latest Qualifying</h2>
        <p style={styles.subtitle}>Gap between fastest and slowest driver per team</p>
      </header>
      <div style={styles.chartWrapper}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
  },
  chartWrapper: {
    position: 'relative' as const,
    height: '400px',
    width: '100%',
  },
  stateContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px dashed #e5e7eb',
  },
  stateText: {
    color: '#6b7280',
    fontSize: '15px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '15px',
    fontWeight: '500',
  },
};
