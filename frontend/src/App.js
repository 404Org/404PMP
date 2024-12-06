import './App.css';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Home from './pages/Home'
import Logout from './components/LogOut'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ComingSoon from './components/ComingSoon';



function App() {
  return (
    <div>
      <Router>
            <div>
                <Routes>
                    {/* <Route path="/login" element={<LoginPage />} /> */}
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgotpassword" element={<ForgotPasswordPage/>} />
                    <Route path="/resetpassword/:token" element={<ResetPasswordPage/>} />
                    <Route path="/" element={<LoginPage />} /> 
                    <Route path="/home" element={<Home />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />
                </Routes>
            </div>
        </Router>
    </div>
  );
}

export default App;
