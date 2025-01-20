import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Movie from './components/Movie';
import Series from './components/Series';
import Info from './components/Info';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/tv/:id" element={<Series />} />
        <Route path="/info/:type/:id" element={<Info />} />
      </Routes>
    </Router>
  );
}

export default App;
