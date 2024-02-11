import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './page/About';
import Resume from './page/Resume';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Contact from './page/Contact';
import Project from './page/Project';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<Header />} />
            <Route path='/about' element={<About />} />
            <Route path='/resume' element={<Resume />} />
            <Route path='/project' element={<Project />} />
            <Route path='/contact' element={<Contact />} />
          </Route>
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
