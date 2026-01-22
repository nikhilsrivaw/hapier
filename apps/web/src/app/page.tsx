 import { Navbar, Hero, Features, Pricing, CTA, Footer } from '@/components/landing';
export default function HomePage() {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <Features />
        <Pricing />
        <CTA />
        <Footer />
      </main>
    );
  }