  
  import { Navbar, Hero, Stats, Features, HowItWorks, Testimonials, Integrations, Pricing, CTA, Footer }
   from '@/components/landing';

  export default function HomePage() {
      return (
          <main className="min-h-screen bg-white dark:bg-gray-950">
              <Navbar />
              <Hero />
              <Stats />
              <Features />
              <HowItWorks />
              <Testimonials />
              <Integrations />
              <Pricing />
              <CTA />
              <Footer />
          </main>
      );
  }
