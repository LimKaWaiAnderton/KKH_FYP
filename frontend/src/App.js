import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import TeamList from './pages/manager/TeamList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <NavBar />
        <div className="main-content">
          <Routes>
            <Route path="/manager/team-list" element={<TeamList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;