import React, { useState, useEffect } from 'react';
import { FaChartLine, FaUsers, FaClock, FaCheckCircle, FaHospital } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsPage({ user, onBack }) {
  const [stats, setStats] = useState(null);
  const [dailyFlow, setDailyFlow] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [hourlyDist, setHourlyDist] = useState([]);
  const [priorityDist, setPriorityDist] = useState([]);
  const [waitTimeTrends, setWaitTimeTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [statsRes, flowRes, deptRes, hourlyRes, priorityRes, waitRes] = await Promise.all([
        fetch('http://localhost:5000/api/analytics/stats', { headers }),
        fetch('http://localhost:5000/api/analytics/daily-flow', { headers }),
        fetch('http://localhost:5000/api/analytics/department-stats', { headers }),
        fetch('http://localhost:5000/api/analytics/hourly-distribution', { headers }),
        fetch('http://localhost:5000/api/analytics/priority-distribution', { headers }),
        fetch('http://localhost:5000/api/analytics/wait-time-trends', { headers })
      ]);

      const [statsData, flowData, deptData, hourlyData, priorityData, waitData] = await Promise.all([
        statsRes.json(),
        flowRes.json(),
        deptRes.json(),
        hourlyRes.json(),
        priorityRes.json(),
        waitRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (flowData.success) setDailyFlow(flowData.data.dailyFlow);
      if (deptData.success) setDepartmentStats(deptData.data.departments);
      if (hourlyData.success) setHourlyDist(hourlyData.data.hourlyDistribution);
      if (priorityData.success) setPriorityDist(priorityData.data.priorityDistribution);
      if (waitData.success) setWaitTimeTrends(waitData.data.waitTimeTrends);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading analytics...</div>
        </div>
      </div>
    );
  }

  const dailyFlowChartData = {
    labels: dailyFlow.map(d => d.date),
    datasets: [
      { label: 'Total Patients', data: dailyFlow.map(d => d.total), borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)', tension: 0.4 },
      { label: 'Completed', data: dailyFlow.map(d => d.completed), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4 }
    ]
  };

  const departmentChartData = {
    labels: departmentStats.map(d => d.name),
    datasets: [
      { label: 'Total Patients', data: departmentStats.map(d => d.total), backgroundColor: '#6366f1' },
      { label: 'Completed', data: departmentStats.map(d => d.completed), backgroundColor: '#10b981' }
    ]
  };

  const hourlyChartData = {
    labels: hourlyDist.filter(h => h.count > 0).map(h => h.hour),
    datasets: [{ label: 'Patients per Hour', data: hourlyDist.filter(h => h.count > 0).map(h => h.count), backgroundColor: 'rgba(245, 158, 11, 0.6)', borderColor: '#f59e0b', borderWidth: 2 }]
  };

  const priorityChartData = {
    labels: priorityDist.map(p => p.priority),
    datasets: [{ data: priorityDist.map(p => p.count), backgroundColor: ['#3b82f6', '#f59e0b', '#ec4899', '#ef4444'] }]
  };

  const waitTimeChartData = {
    labels: waitTimeTrends.map(w => w.date),
    datasets: [{ label: 'Average Wait Time (minutes)', data: waitTimeTrends.map(w => w.avgWaitTime), borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', tension: 0.4, fill: true }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '30px', borderRadius: '12px', color: 'white', marginBottom: '30px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid white', color: 'white', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px', fontSize: '14px' }}>← Back</button>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>📊 Analytics Dashboard</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Hospital performance metrics and insights</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Today's Patients</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.today.total}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{stats.today.completed} completed</div>
              </div>
              <FaUsers style={{ fontSize: '48px', color: '#3b82f6', opacity: 0.3 }} />
            </div>
          </div>

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Avg Wait Time</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.today.avgWaitTime}m</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Today's average</div>
              </div>
              <FaClock style={{ fontSize: '48px', color: '#10b981', opacity: 0.3 }} />
            </div>
          </div>

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>This Month</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.thisMonth.total}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{stats.thisMonth.completed} completed</div>
              </div>
              <FaCheckCircle style={{ fontSize: '48px', color: '#f59e0b', opacity: 0.3 }} />
            </div>
          </div>

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Total Patients</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.overall.totalPatients}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{stats.overall.activeDepartments} departments</div>
              </div>
              <FaHospital style={{ fontSize: '48px', color: '#8b5cf6', opacity: 0.3 }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>📈 Daily Patient Flow (Last 7 Days)</h3>
          <div style={{ height: '300px' }}><Line data={dailyFlowChartData} options={chartOptions} /></div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>⏱️ Wait Time Trends</h3>
          <div style={{ height: '300px' }}><Line data={waitTimeChartData} options={chartOptions} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>🏥 Department-wise Comparison</h3>
          <div style={{ height: '300px' }}><Bar data={departmentChartData} options={chartOptions} /></div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>🕐 Peak Hours Distribution</h3>
          <div style={{ height: '300px' }}><Bar data={hourlyChartData} options={chartOptions} /></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>🎯 Priority Distribution</h3>
          <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}><Pie data={priorityChartData} options={chartOptions} /></div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>📋 Department Details</h3>
          <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'white' }}>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', color: '#666' }}>Department</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontSize: '12px', color: '#666' }}>Total</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontSize: '12px', color: '#666' }}>Waiting</th>
                  <th style={{ padding: '10px', textAlign: 'center', fontSize: '12px', color: '#666' }}>Avg Wait</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{dept.name}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{dept.total}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{dept.waiting}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>{dept.avgWaitTime}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>🔄 Auto-refreshing every 30 seconds</div>
    </div>
  );
}

export default AnalyticsPage;