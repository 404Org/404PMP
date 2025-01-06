import './App.css';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoutes from './components/ProtectedRoutes'
import NewProjectsPage from './pages/NewProjectsPage'
import MyProjectsPage from './pages/MyProjectsPage'
import EditProfilePage from './pages/EditProfilePage'
import ProjectList from './pages/Project';
import ProjectDetails from './components/projects/ProjectDetails';
import NewProject from './components/projects/NewProject';
import EditProject from './components/projects/EditProject';
import ViewProfilePage from './pages/ViewProfilePage'
import UserList from './components/users/UserList';
import UserDetails from './components/users/UserDetails';
import UserEdit from './components/users/UserEdit';
import { UserProvider } from './hooks/UserContext';
import NotFoundPage from './pages/NotFoundPage';
import InterestedPage from './pages/InterestedPage';
import Error404 from './components/Error404';
import { isTokenExpired } from './auth';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('_id');
      localStorage.removeItem('user');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <UserProvider>
        {/* <Router> */}
          <div>
            <Routes>
              <Route element={<ProtectedRoutes authenticationRequired={false} />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />
              </Route>
              <Route element={<ProtectedRoutes authenticationRequired={true} />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/projects/new" element={<NewProject />} />
                <Route path="/projects/:id/edit" element={<EditProject />} />
                <Route path="/newprojects" element={<NewProjectsPage />} />
                <Route path="/myprojects" element={<MyProjectsPage />} />
                <Route path="/editprofile" element={<EditProfilePage />} />
                <Route path="/viewprofile" element={<ViewProfilePage />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/users/:id/edit" element={<UserEdit />} />
                <Route path="/interested/:projectId" element={<InterestedPage />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/404" element={<Error404 />} />
              </Route>
            </Routes>
          </div>
        {/* </Router> */}
      </UserProvider>
    </div>
  );
}

export default App;
