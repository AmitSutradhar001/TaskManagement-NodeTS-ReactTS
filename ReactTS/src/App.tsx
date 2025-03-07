import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FC } from "react";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import TaskManagement from "./pages/TaskManagement.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
const App: FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/task-management" element={<TaskManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
