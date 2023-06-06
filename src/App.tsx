import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Player from "./Player";
import Callback from "./Callback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;
