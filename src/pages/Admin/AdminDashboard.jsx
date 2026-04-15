import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', department: '', semester: '', rollNo: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', department: '', semester: '', facultyId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, subjRes] = await Promise.all([
        api.get('/users'),
        api.get('/subjects')
      ]);
      setUsers(userRes.data);
      setSubjects(subjRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', userForm);
      fetchData();
      setUserForm({ name: '', email: '', role: 'student', department: '', semester: '', rollNo: '' });
      alert('User Created Successfully!');
    } catch(err) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm("Permanently delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch(err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subjects', subjectForm);
      fetchData();
      setSubjectForm({ name: '', code: '', department: subjectForm.department, semester: '', facultyId: '' });
      alert('Subject created & assigned successfully!');
    } catch(err) {
      alert(err.response?.data?.message || 'Error creating subject');
    }
  };

  if (loading) return <Spinner text="Loading Admin Resources..." />;

  const facultyMembers = users.filter(u => u.role === 'faculty');

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Global Admin Console</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* User Management Section */}
        <Card title="1. Add New Platform User">
          <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Input label="Full Name" required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
            <Input label="Email" type="email" required value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Account Role</label>
              <select className="input-field" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="hod">HOD</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Input label="Department (Optional)" value={userForm.department} onChange={e => setUserForm({...userForm, department: e.target.value})} />
            <Input label="Semester (Students Only)" type="number" value={userForm.semester} onChange={e => setUserForm({...userForm, semester: e.target.value})} />
            <Input label="Roll No (Students Only)" value={userForm.rollNo} onChange={e => setUserForm({...userForm, rollNo: e.target.value})} />
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </Card>

        {/* Subject Management Section */}
        <Card title="2. Assign Subject to Faculty (Admin Override)">
          <form onSubmit={handleCreateSubject} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Subject Name (e.g. DSA)" required value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} />
            <Input label="Subject Code" required value={subjectForm.code} onChange={e => setSubjectForm({...subjectForm, code: e.target.value})} />
            <Input label="Department" required value={subjectForm.department} onChange={e => setSubjectForm({...subjectForm, department: e.target.value})} />
            <Input label="Semester" type="number" required value={subjectForm.semester} onChange={e => setSubjectForm({...subjectForm, semester: e.target.value})} />
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Assign To Faculty</label>
              <select className="input-field" required value={subjectForm.facultyId} onChange={e => setSubjectForm({...subjectForm, facultyId: e.target.value})}>
                <option value="">-- Select Faculty --</option>
                {facultyMembers.map(f => (
                  <option key={f._id} value={f._id}>{f.name} ({f.department})</option>
                ))}
              </select>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Button type="submit">Create & Assign Subject</Button>
            </div>
          </form>
        </Card>

        {/* Data Tables */}
        <Card title="All Registered Users">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Dept</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{u.role}</td>
                    <td style={{ padding: '1rem' }}>{u.name}</td>
                    <td style={{ padding: '1rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}>{u.department || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
