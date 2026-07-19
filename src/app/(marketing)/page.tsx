import Hero from "@/components/home/Hero";
import Statistics from "@/components/home/Statistics";
import CareerDistribution from "@/components/home/CareerDistribution";
import Features from "@/components/home/Features";
import AIJourney from "@/components/home/HowItWorks";
import FeaturedCareers from "@/components/home/FeaturedCareers";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Statistics />
      <FeaturedCareers />
      <Features />
      <AIJourney />
      <CareerDistribution />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
