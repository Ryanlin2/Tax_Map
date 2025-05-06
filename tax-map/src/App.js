import logo from './logo.svg';
import './App.css';
import MapComponent from './Components/MapComponent'; 

function App() {
  return (
    <div className="App">
      <MapComponent /> {/* ✅ This renders your choropleth map */}
    </div>
  );
}

export default App;
