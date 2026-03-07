import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms/:nickname' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
