import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import GuestRoute from './components/GuestRoute.jsx';
import Home from './pages/Home.jsx';
import PetDetail from './pages/PetDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyApplications from './pages/MyApplications.jsx';
import ShelterDashboard from './pages/ShelterDashboard.jsx';
import PetForm from './pages/PetForm.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Forbidden from './pages/Forbidden.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Logged-out visitors only: logged-in users are redirected to the homepage */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Adopters only */}
        <Route element={<ProtectedRoute roles={['adopter']} />}>
          <Route path="/my-applications" element={<MyApplications />} />
        </Route>

        {/* Shelters (and admins for pet forms) */}
        <Route element={<ProtectedRoute roles={['shelter']} />}>
          <Route path="/shelter" element={<ShelterDashboard />} />
        </Route>
        <Route element={<ProtectedRoute roles={['shelter', 'admin']} />}>
          <Route path="/shelter/pets/new" element={<PetForm />} />
          <Route path="/shelter/pets/:id/edit" element={<PetForm />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
