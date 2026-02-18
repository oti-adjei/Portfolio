import Header from '../home/components/Header';
import WorksGallery from '../home/components/WorksGallery';
import Footer from '../home/components/Footer';

export default function Works() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <WorksGallery />
      </main>
      <Footer />
    </div>
  );
}
