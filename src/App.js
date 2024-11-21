import React from 'react';
import './App.css';
import Header from './components/Header';  // Importamos el componente Header
import Inici from "./components/Inici"

function App() {
  return (
    <div className="App">
      <div>
        <Header />  {/* Usamos el componente Header aquí */}
      </div>
        <Inici />  {/* Usamos el componente Inici aquí */}
    
    </div> 
  );
}

export default App;
