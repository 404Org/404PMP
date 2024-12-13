import './App.css';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage'
import Logout from './components/LogOut'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPasswordPage';
// import ComingSoon from './components/ComingSoon';
import ProtectedRoutes from './components/ProtectedRoutes'
import AllProjectsPage from './pages/AllProjectsPage'
import MyProjectsPage from './pages/MyProjectsPage'
import EditProfilePage from './pages/EditProfilePage'

function App() {
  return (
    <div>
      <Router>
            <div>
                <Routes>
                    <Route element={<ProtectedRoutes authenticationRequired={false} />}>
                      <Route path="/" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/forgotpassword" element={<ForgotPasswordPage/>} />
                      <Route path="/resetpassword/:token" element={<ResetPasswordPage/>} />
                    </Route>
                    <Route element={<ProtectedRoutes authenticationRequired={true} />}>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/logout" element={<Logout />} />
                      {/* <Route path="/coming-soon" element={<ComingSoon />} /> */}
                      <Route path="/allprojects" element={<AllProjectsPage/>} />
                      <Route path="/myprojects" element={<MyProjectsPage/>} />
                      <Route path="/profile" element={<EditProfilePage/>} />
                    </Route>
                </Routes>
            </div>
        </Router>
    </div>
  );
}

export default App;
