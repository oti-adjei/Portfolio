import Header from '../home/components/Header';
import WorksGallery from '../home/components/WorksGallery';
import Footer from '../home/components/Footer';
import FloatingShapes from '../../components/FloatingShapes';

export default function Works() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FloatingShapes />
      <Header />
      <main className="relative z-10 pt-20">
        <WorksGallery />
      </main>
      <Footer />
    </div>
  );
}
