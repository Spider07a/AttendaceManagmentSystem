import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';

const HODDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ name: '', code: '', department: '', semester: '', facultyId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjRes, userRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/users') // HODs only receive users from their own dept securely via backend restriction
      ]);
      setSubjects(subjRes.data);
      setFaculty(userRes.data.filter(u => u.role === 'faculty'));
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subjects', form);
      fetchData();
      setForm({ name: '', code: '', department: form.department, semester: '', facultyId: '' });
      alert('Subject created & assigned successfully!');
    } catch(err) {
      alert(err.response?.data?.message || 'Error creating subject');
    }
  };

  if (loading) return <Spinner text="Loading Department Data..." />;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>HOD Dashboard</h1>
      
      <Card title="Assign Subject to Faculty">
        <form onSubmit={handleCreateSubject} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Subject Name (e.g. DSA)" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <Input label="Subject Code" required value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
          <Input label="Department" required value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
          <Input label="Semester" type="number" required value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} />
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Assign To Faculty</label>
            <select className="input-field" required value={form.facultyId} onChange={e => setForm({...form, facultyId: e.target.value})}>
              <option value="">-- Select Faculty --</option>
              {faculty.map(f => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
             <Button type="submit">Create & Assign Subject</Button>
          </div>
        </form>
      </Card>

      <Card title="Department Subject Roster" style={{ marginTop: '2rem' }}>
         <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Code</th>
                <th style={{ padding: '1rem' }}>Subject Name</th>
                <th style={{ padding: '1rem' }}>Sem</th>
                <th style={{ padding: '1rem' }}>Assigned Faculty</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{s.code}</td>
                  <td style={{ padding: '1rem' }}>{s.name}</td>
                  <td style={{ padding: '1rem' }}>{s.semester}</td>
                  <td style={{ padding: '1rem' }}>{s.facultyId ? s.facultyId.name : 'Unassigned'}</td>
                </tr>
              ))}
              {subjects.length === 0 && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center'}}>No Subjects found.</td></tr>}
            </tbody>
         </table>
      </Card>
    </div>
  );
};

export default HODDashboard;
