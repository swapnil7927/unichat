import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Logout from './pages/Logout';
import OnBoarding from './pages/OnBoarding';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/logout" element={<Logout />} />
        <Route exact path="/onboarding" element={<OnBoarding />} />
      </Routes>
    </Router>
  );
}

export default App;