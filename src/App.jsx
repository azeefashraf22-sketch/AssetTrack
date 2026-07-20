import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Issues from "./pages/Issues";
import AssetPublicPage from "./pages/AssetPublicPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* Toaster component globally active rahega */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          }
        />
        <Route path="/asset/:assetCode" element={<AssetPublicPage />} />
      </Routes>
    </>
  );
}

export default App;