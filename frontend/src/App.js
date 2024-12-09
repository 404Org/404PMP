import './App.css';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Home from './pages/Home'
import Logout from './components/LogOut'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ComingSoon from './components/ComingSoon';
import ProtectedRoutes from './components/ProtectedRoutes'
import ProjectList from './pages/Project';
import ProjectDetails from './components/projects/ProjectDetails';
import NewProject from './components/projects/NewProject';
import EditProject from './components/projects/EditProject';


function App() {
  return (
    <div>
      <Router>
            <div>
                <Routes>
                    <Route path="/" element={<LoginPage />} /> 
                    {/* <Route path="/login" element={<LoginPage />} /> */}
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgotpassword" element={<ForgotPasswordPage/>} />
                    <Route path="/resetpassword/:token" element={<ResetPasswordPage/>} />
                    <Route element={<ProtectedRoutes />}>
                      <Route path="/home" element={<Home />} />
                      <Route path="/projects" element={<ProjectList />} />
                      <Route path="/projects/:id" element={<ProjectDetails />} />
                      <Route path="/projects/new" element={<NewProject />} />
                      <Route path="/projects/:id/edit" element={<EditProject />} />
                      <Route path="/logout" element={<Logout />} />
                      <Route path="/coming-soon" element={<ComingSoon />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    </div>
  );
}

export default App;
