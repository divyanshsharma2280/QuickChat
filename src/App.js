import Form from './modules/Form';
import './App.css';
import Dashboard from './modules/Dashboard';
import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children , auth=false}) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null||false;
  const currentPath = window.location.pathname;

  if (!isLoggedIn && currentPath !== '/users/sign_up' && auth) {
    
    return <Navigate to={'/users/sign_up'} />;
  } else if (isLoggedIn && (currentPath === '/users/sign_in' || currentPath === '/users/sign_up')) {
    
    return <Navigate to={'/'} />;
  }

  return children;
};


function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute auth={true}>
          <Dashboard/>
        </ProtectedRoute>
      }/>
      <Route path='/users/sign_in' element={
        <ProtectedRoute>
          <Form isSignInPage={true}/>
        </ProtectedRoute>
      }/>
      <Route path='/users/sign_up' element={
        <ProtectedRoute>
          <Form isSignInPage={false}/>
        </ProtectedRoute>
      }/>
    </Routes>
  );
}

export default App;
