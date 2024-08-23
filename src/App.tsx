import './App.css';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import PageWrapper from './components/PageWrapper';

const router = createBrowserRouter([
  {
    path: '/signup',
    element: (
      <PageWrapper>
        <SignupForm />
      </PageWrapper>
    ),
  },
  {
    path: '/login',
    element: (
      <PageWrapper>
        <LoginForm />
      </PageWrapper>
    ),
  },
  {
    path: '/',
    element: (
      <PageWrapper>
        <ChatPage />
      </PageWrapper>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
