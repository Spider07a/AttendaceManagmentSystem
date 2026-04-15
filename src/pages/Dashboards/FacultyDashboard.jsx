import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { CheckCircle, XCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        setSubjects(res.data); // Backend strictly filters to subjects taught by this faculty mapping via JWT
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    const fetchRoster = async () => {
      try {
        const [usersRes, attRes] = await Promise.all([
           api.get('/users'), // Backend returns ALL students globally? No, let's filter purely client side or backend limits. We will filter client side assuming admin API permits or backend permits via dept.
           api.get(`/attendance/subject/${selectedSubject._id}`)
        ]);
        
        // Filter students belonging to this subject's semester and department
        const eligibleStudents = usersRes.data.filter(u => 
          u.role === 'student' && 
          u.department === selectedSubject.department &&
          u.semester === selectedSubject.semester
        );
        
        setStudents(eligibleStudents);
        
        // Pre-fill attendance state based on fetched history for the current date
        const todayLogs = attRes.data.filter(a => a.date === date);
        const map = {};
        todayLogs.forEach(log => { map[log.studentId._id] = log.status });
        setAttendanceState(map);

      } catch(err) {
        console.error(err);
      }
    };
    fetchRoster();
  }, [selectedSubject, date]);

  const handleMark = (studentId, status) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    if (Object.keys(attendanceState).length === 0) return;
    setSaving(true);
    try {
      await api.post('/attendance/mark', {
        date,
        subjectId: selectedSubject._id,
        records: attendanceState
      });
      alert('Attendance explicitly saved for ' + selectedSubject.name);
    } catch(err) {
      alert(err.response?.data?.message || 'Error saving attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner text="Loading your designated courses..." />;

  if (!selectedSubject) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Faculty Dashboard</h1>
        <Card title="Select Subject to Manage">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {subjects.map(s => (
               <Button key={s._id} onClick={() => setSelectedSubject(s)}>
                 {s.name} ({s.code}) - Sem {s.semester}
               </Button>
            ))}
            {subjects.length === 0 && <p>No subjects assigned by your HOD yet.</p>}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>{selectedSubject.name} Attendance</h1>
          <Button variant="secondary" onClick={() => setSelectedSubject(null)} style={{ marginTop: '0.5rem' }}>← Back to Courses</Button>
        </div>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
          style={{ width: 'auto', background: 'var(--bg-secondary)' }}
        />
      </div>

      <Card title={`Roster for ${selectedSubject.code}`}>
         <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Roll No</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{student.rollNo}</td>
                  <td style={{ padding: '1rem' }}>{student.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button 
                        variant={attendanceState[student._id] === 'Present' ? 'primary' : 'secondary'}
                        style={{ background: attendanceState[student._id] === 'Present' ? 'var(--success)' : '' }}
                        onClick={() => handleMark(student._id, 'Present')}
                      >
                        <CheckCircle size={16} /> Present
                      </Button>
                      <Button 
                        variant={attendanceState[student._id] === 'Absent' ? 'primary' : 'secondary'}
                        style={{ background: attendanceState[student._id] === 'Absent' ? 'var(--error)' : '' }}
                        onClick={() => handleMark(student._id, 'Absent')}
                      >
                        <XCircle size={16} /> Absent
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan="3" style={{ padding: '1.5rem', textAlign: 'center'}}>No students found strictly enrolled in Dept: {selectedSubject.department}, Sem: {selectedSubject.semester}.</td></tr>}
            </tbody>
         </table>

         {students.length > 0 && (
           <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
             <Button onClick={submitAttendance} disabled={saving}>{saving ? 'Saving...' : 'Save Attendance'}</Button>
           </div>
         )}
      </Card>
    </div>
  );
};

export default FacultyDashboard;
