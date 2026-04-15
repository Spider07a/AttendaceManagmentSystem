import React, { useState } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const [formData, setFormData] = useState({ name: '', email: '', rollNo: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrs = {};
    if (!formData.name) newErrs.name = 'Name is required';
    if (!formData.email) newErrs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrs.email = 'Invalid email';
    if (!formData.rollNo) newErrs.rollNo = 'Roll Number is required';
    
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    try {
      await api.post('/students', JSON.stringify(formData));
      alert('Student added successfully!');
      navigate('/admin');
    } catch (err) {
      alert('Failed to add student');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Add Student</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Enroll a new student into the system.</p>
      </div>

      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input 
            label="Full Name" 
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
          <Input 
            label="Email Address" 
            type="email"
            placeholder="e.g. john@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
          <Input 
            label="Roll Number / ID" 
            placeholder="e.g. CS-2024-001"
            value={formData.rollNo}
            onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
            error={errors.rollNo}
          />

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => navigate('/admin')}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Adding...' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddStudent;
