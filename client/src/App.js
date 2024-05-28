import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import Fib from './Fib';
import OtherPage from './OtherPage';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to="/">Home</Link>
        <Link to="/otherPage">OtherPage</Link>
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <Routes>
          <Route exact path="/" Component={Fib} />
          <Route path="/otherPage" Component={OtherPage} />
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
