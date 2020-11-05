import React from 'react';
import './App.css';
import { MessageFormPage} from './components/message-form-page';

function App() {
  return (
    <div className="App">
      <header>
        <h1>
          A letter to Santa
        </h1>
      </header>

      <main>
  <MessageFormPage />
      </main>

      <footer>
        Made with
        <a href="https://glitch.com">Glitch</a>!
      </footer>
    </div>
  );
}

export default App;
