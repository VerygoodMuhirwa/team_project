import React from "react";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Students from "./components/Students";
import Teachers from "./components/Teachers";
import Department from "./components/Department";
import Subjects from "./components/Subjects";
import Invoices from "./components/Invoices";
import Accounts from "./components/Accounts";
import Holidays from './components/Holidays'
import Fees from './components/Fees'
import ExamList from './components/ExamList'
import Events from './components/Events'
import Timetables from './components/TimeTables'
import Library from './components/Library'
import Blogs from './components/Blogs'
import Settings from './components/Seeting'
import Authentication from './components/Authentication'

function App() {
  return (
    <Router>
      <div className="app flex flex-row">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/student" element={<Students />} />
            <Route path="/teacher" element={<Teachers />} />
            <Route path="/departments" element={<Department />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/account" element={<Accounts />} />
            <Route path="/holiday" element={<Holidays />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/examList" element={<ExamList />} />
            <Route path="/events" element={<Events />} />
            <Route path="/timetables" element={<Timetables />} />
            <Route path="/library" element={<Library />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/authentication" element={<Authentication />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
