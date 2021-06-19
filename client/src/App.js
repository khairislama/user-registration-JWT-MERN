import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import { AuthContextProvider } from './context/AuthContext';
import Router from './Router';
import NavbarDark from './components/NavbarDark';

axios.defaults.withCredentials = true;

function App() {
  return (
      <AuthContextProvider>
        <NavbarDark />
        <Router />
      </AuthContextProvider>
  );
}

export default App;
