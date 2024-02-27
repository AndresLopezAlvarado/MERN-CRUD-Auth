import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <BrowserRouter>
          <main className="container mx-auto px-10">
            <NavBar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/add-task" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskFormPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
