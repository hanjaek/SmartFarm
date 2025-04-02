import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MonitoringPage from "./pages/MonitoringPage";
import ControlPage from "./pages/ControlPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/control" element={<ControlPage />} />
      </Routes>
    </Router>
  );
}

export default App;
