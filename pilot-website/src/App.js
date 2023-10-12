import "./App.css";
import Home from "./Components/Home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Productivity from "./Components/Productivity/Productivity";
import Navbar from "./Components/navbar/Navbar";
import Links from "./Components/Links/Links";
import Login from "./Components/Login/Login";
import Scheduling from "./Components/Scheduling/Scheduling";
import MonthlyCalendar from "./Components/Scheduling/MonthlyCalendar/MonthlyCalendar";
import VacationSchedule from "./Components/Scheduling/VacationSchedule/VacationSchedule";
import UnionAgreement from "./Components/UnionAgreement/UnionAgreement";
import Klein from "./Components/Klein/Klein";
import MeetingMinutes from "./Components/MeetingMinutes/MeetingMinutes";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Productivity" element={<Productivity />} />
        <Route path="/meeting-minutes" element={<MeetingMinutes />} />
        <Route path="/scheduling" element={<Scheduling />} />
        <Route path="/monthly-calendar" element={<MonthlyCalendar />} />
        <Route path="/vacation-schedule" element={<VacationSchedule />} />
        <Route path="/klein" element={<Klein />} />
        <Route path="/union-agreement" element={<UnionAgreement />} />
        <Route path="/links" element={<Links />} />
      </Routes>
    </Router>
  );
}

export default App;
