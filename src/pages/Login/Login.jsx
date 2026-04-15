import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(`/${user.role}`);
    } catch (err) {
      setErrors({ form: 'Invalid credentials. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem', background: 'radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>AMS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Attendance Management System</p>
        </div>

        <Card>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
          
          <form onSubmit={handleSubmit}>
            {errors.form && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{errors.form}</div>}
            


            <Input 
              label="Email Address" 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Button 
              type="submit" 
              className="w-full mt-4" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            <p><strong>Demo Credentials (Password: "password" for all)</strong></p>
            <p>Admin: admin@gmail.com</p>
            <p>CSE HOD: hod_cse@gmail.com | EE HOD: hod_ee@gmail.com</p>
            <p>Faculty CSE: ramesh@gmail.com | Faculty EE: verma@gmail.com</p>
            <p>CSE Student: anurag@gmail.com | EE Student: rahul_ee@gmail.com</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
