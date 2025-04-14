import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PopupProvider } from "./context/PopupContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage"; // ✅ 홈페이지 추가
import BoardPage from "./pages/BoardPage";
import WritePostPage from "./pages/WritePostPage";
import PostDetailPage from "./pages/PostDetailPage";

import HomeNavbar from "./components/HomeNavbar";
import UserNavbar from "./components/UserNavbar";
import AdminNavbar from "./components/AdminNavbar";

// 유저 페이지
import UserDashboard from './pages/User/UserDashboard';
import UserControlPanel from './pages/User/UserControlPanel';
import DataVisualization from "./pages/User/UserDataVisualization";
import Settings from "./pages/User/UserSettings";
import Profile from "./pages/User/UserProfile";
import Help from "./pages/User/UserHelp";
import UserEnvironmentSettings from "./pages/User/UserEnvironmentSettings";

// 어드민 페이지
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserList from "./pages/admin/AdminUserList";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMonitoring from "./pages/admin/AdminMonitoring";
import AdminEventLogs from "./pages/admin/AdminEventLogs";
import AdminEnvironmentSettings from "./pages/admin/AdminEnvironmentSettings";
import AdminSecuritySettings from "./pages/admin/AdminSecuritySettings";
import AdminSystemSettings from "./pages/admin/AdminSystemSettings";
import AdminProfile from "./pages/admin/AdminProfile";

import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedRole = sessionStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <PopupProvider>
      {userRole === "user" && <UserNavbar setUserRole={setUserRole} />}
      {userRole === "admin" && <AdminNavbar setUserRole={setUserRole} />}
      {!userRole && <HomeNavbar />} {/* 로그인 안 된 상태 */}

      <Routes>
        {/* ✅ 홈페이지 - 홍보용 */}
        <Route path="/" element={<HomePage setUserRole={setUserRole} />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/write" element={userRole ? <WritePostPage /> : <Navigate to="/login" />} />
        <Route path="/board/:id" element={userRole ? <PostDetailPage /> : <Navigate to="/login" />} />

        {/* ✅ 로그인 */}
        <Route path="/login" element={<LoginPage setUserRole={setUserRole} />} />
        <Route path="/signup" element={<RegisterPage />} />

        {/* ✅ 유저용 페이지 */}
        {userRole === "user" && (
          <>
            <Route path="/user" element={<Navigate to="/user/dashboard" />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/control" element={<UserControlPanel />} />
            <Route path="/user/data" element={<DataVisualization />} />
            <Route path="/env-settings" element={<UserEnvironmentSettings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
          </>
        )}

        {/* ✅ 어드민용 페이지 */}
        {userRole === "admin" && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/monitoring" element={<AdminMonitoring />} />
            <Route path="/admin/eventlogs" element={<AdminEventLogs />} />
            <Route path="/admin/environment" element={<AdminEnvironmentSettings />} />
            <Route path="/admin/security" element={<AdminSecuritySettings />} />
            <Route path="/admin/system" element={<AdminSystemSettings />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </>
        )}

        {/* ✅ 잘못된 경로 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </PopupProvider>
    </Router>
  );
}

export default App;
