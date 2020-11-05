import React from 'react';
import './App.css';
import { MessageFormComponent} from './components/MessageFormComponent';

function App() {
  return (
    <div className="App">
      <header>
        <h1>
          A letter to Santa
        </h1>
      </header>

      <main>
  <MessageFormComponent />
      </main>

      <footer>
        Made with
        <a href="https://glitch.com">Glitch</a>!
      </footer>
    </div>
  );
}

export default App;
