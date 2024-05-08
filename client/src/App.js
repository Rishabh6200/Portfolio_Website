import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import About from './page/About';
import Resume from './page/Resume';
import Header from './components/Header';
import Contact from './page/Contact';
import Project from './page/Project';
import AdminLogin from './admin/pages/AdminLogin';
import DashboardLayout from './admin/layout/DashboadLayout';
import Home from './admin/pages/Home';
import Address from './admin/pages/Address';
import PersonalDetail from './admin/pages/PersonalDetail';
import SkillList from './admin/pages/SkillList';
import EducationList from './admin/pages/EducationList';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Header />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/project" element={<Project />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="skill" element={<SkillList />} />
            <Route path="education" element={<EducationList />} />
            <Route path="detail" element={<PersonalDetail />} />
            <Route path="address" element={<Address />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
