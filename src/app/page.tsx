import Navbar from "@/components/Navbar";
import HomeContent from "@/components/HomeContent";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HomeContent />
      <Footer />
    </main>
  );
}
