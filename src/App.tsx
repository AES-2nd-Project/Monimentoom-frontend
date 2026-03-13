import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home';
import Room from './pages/Room';

const queryClient = new QueryClient();

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/rooms/:nickname' element={<Room />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
