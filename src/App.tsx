import React from 'react';
import './App.css';
import Header from './Shared/header';
import Main from './main';

function App() {
  return (
    <div className="App">
      <div>
        <Header/>
        
        <Main />       
      </div>   
    </div>
  );
}

export default App;
