import { Routes, Route } from "react-router-dom"

const Home = () => {
  return <div>Home</div>
}

const About = () => {
  return <div>About</div>
}

const Login = () => {
  return <div>Login</div>
}

function App() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
  </Routes>
  )
}

export default App