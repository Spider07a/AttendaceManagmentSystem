import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendance/my');
        setAttendanceLogs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <Spinner text="Fetching your multi-subject attendance records..." />;

  // Group by Subject
  const subjectStats = {};
  attendanceLogs.forEach(log => {
      if (!log.subjectId) return; // Defensive
      const subjName = log.subjectId.name;
      if (!subjectStats[subjName]) {
          subjectStats[subjName] = { total: 0, present: 0, code: log.subjectId.code };
      }
      subjectStats[subjName].total++;
      if (log.status === 'Present') subjectStats[subjName].present++;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>My Attendance overview</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Welcome, {user?.name}. Here is your subject-wise breakdown.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {Object.entries(subjectStats).map(([subjName, stats]) => {
            const percentage = Math.round((stats.present / stats.total) * 100);
            return (
              <Card key={subjName} className="flex-center" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', borderTop: `4px solid ${percentage < 75 ? 'var(--error)' : 'var(--success)'}` }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{subjName} ({stats.code})</h3>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: percentage < 75 ? 'var(--error)' : 'var(--success)' }}>{percentage}%</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{stats.present} / {stats.total} Classes Attended</p>
              </Card>
            )
        })}
        {Object.keys(subjectStats).length === 0 && (
           <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No classified attendance logged yet.</p>
        )}
      </div>

      <Card title="Raw Global Attendance History">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Subject</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLogs.map((record, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td style={{ padding: '1rem' }}>{record.subjectId?.name || 'Unknown Subject'}</td>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {record.status === 'Present' ? (
                      <><CheckCircle size={16} color="var(--success)" /> <span style={{ color: 'var(--success)' }}>Present</span></>
                    ) : (
                      <><XCircle size={16} color="var(--error)" /> <span style={{ color: 'var(--error)' }}>Absent</span></>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
