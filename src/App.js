import React from 'react';
import './App.css';
import Header from './components/Header';  // Importamos el componente Header
import Inici from "./components/Inici"

function App() {
  return (
    <div className="App">
      <Header />  {/* Usamos el componente Header aquí */}
      <Inici />
    </div> 
  );
}

export default App;
