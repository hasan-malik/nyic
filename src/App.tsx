import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Constellation from "./pages/Constellation";
import Share from "./pages/Share";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ReviewQueue from "./pages/admin/ReviewQueue";
import Circles from "./pages/admin/Circles";
import Activation from "./pages/admin/Activation";

/** Public site shell: navbar + footer wrap the public pages. */
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/constellation" element={<Constellation />} />
          <Route path="/share" element={<Share />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="review" element={<ReviewQueue />} />
          <Route path="circles" element={<Circles />} />
          <Route path="activation" element={<Activation />} />
        </Route>
      </Routes>
    </>
  );
}
