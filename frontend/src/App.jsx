
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';

// --- Importaciones Clave para Rutas Protegidas ---
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './pages/student/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard';

// --- Páginas de Profesor ---
import StudentList from './pages/teacher/StudentList';
import StudentDetail from './pages/teacher/StudentDetail';
import AttemptDetail from './pages/teacher/AttemptDetail';

// --- Páginas de Estudiante para el Nuevo Layout ---
import Upload from './pages/student/Upload';
import Evaluations from './pages/student/Evaluations';
import Progress from './pages/student/Progress';
import EvaluationDetail from './pages/student/EvaluationDetail';

// --- Marcadores de posición ---
const Placeholder = () => <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white"><h1>Coming Soon...</h1></div>;

function App() {
  return (
    <Routes>
      {/* --- Rutas Públicas (para Login/Registro) --- */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* --- Rutas Protegidas para Estudiantes --- */}
      <Route
        path="/student/dashboard"
        element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>}
      />
      <Route
        path="/student/upload"
        element={<ProtectedRoute allowedRoles={['student']}><Upload /></ProtectedRoute>}
      />
      <Route
        path="/student/evaluations"
        element={<ProtectedRoute allowedRoles={['student']}><Evaluations /></ProtectedRoute>}
      />
      <Route
        path="/student/evaluations/:textId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <EvaluationDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/progress"
        element={<ProtectedRoute allowedRoles={['student']}><Progress /></ProtectedRoute>}
      />
      <Route
        path="/student/settings"
        element={<ProtectedRoute allowedRoles={['student']}><Placeholder /></ProtectedRoute>}
      />

      {/* --- Rutas Protegidas para Docentes --- */}
      <Route
        path="/teacher/dashboard"
        element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>}
      />
      <Route
        path="/teacher/students"
        element={<ProtectedRoute allowedRoles={['teacher']}><StudentList /></ProtectedRoute>}
      />
      <Route
        path="/teacher/students/:studentId"
        element={<ProtectedRoute allowedRoles={['teacher']}><StudentDetail /></ProtectedRoute>}
      />
      <Route
        path="/teacher/attempts/:attemptId"
        element={<ProtectedRoute allowedRoles={['teacher']}><AttemptDetail /></ProtectedRoute>}
      />
      <Route
        path="/teacher/settings"
        element={<ProtectedRoute allowedRoles={['teacher']}><Placeholder /></ProtectedRoute>}
      />

      {/* --- Ruta genérica para cualquier otra URL --- */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;