import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import EditPage from './pages/EditPages';
import ListPage from './pages/listPage';
import RequireAuth from './pages/components/RequireAuth'

import './App.css';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<RequireAuth />}>
          <Route index element={<EditPage />} />
          <Route path='list' element={<ListPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
