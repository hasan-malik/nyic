import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import GetToKnow from "./components/GetToKnow";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <GetToKnow />
      </main>
      <Footer />
    </div>
  );
}
