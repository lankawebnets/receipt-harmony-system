
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect to the login page
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/login');
  }, [navigate]);
  
  return null;
};

export default Index;
