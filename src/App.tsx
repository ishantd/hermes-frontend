import './App.css';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChatPage from './pages/ChatPage';

const router = createBrowserRouter([
  {
    path: '/signup',
    element: <SignupForm />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/',
    element: <ChatPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
