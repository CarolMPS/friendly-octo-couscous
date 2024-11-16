import './App.css';
import MainPage from './pages/Home';
import Detail from './pages/Detail';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/character/:id" element={<Detail />} />
      </Routes>
    </Router>
    <footer></footer>
    </>
  );
}

export default App;
