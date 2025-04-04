import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmartFarmNavbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ControlPanel from "./pages/ControlPanel";
import DataVisualization from "./pages/DataVisualization";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Logout from "./pages/Logout";

function App() {
  return (
    <Router>
      <SmartFarmNavbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/control" element={<ControlPanel />} />
        <Route path="/data" element={<DataVisualization />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
