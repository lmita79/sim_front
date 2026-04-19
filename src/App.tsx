import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Map } from './components/Map/Map';
import './styles/tokens.css';

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Sidebar />
        <Map />
      </div>
    </AppProvider>
  );
}

export default App;
