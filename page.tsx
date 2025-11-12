import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";

// Lazy-load below-the-fold and interactive components to reduce initial JS
const AnalyticsSection = dynamic(() => import("@/components/home/AnalyticsSection"), {
  loading: () => <div />,
});
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection"), {
  loading: () => <div />,
});
const PopupReview = dynamic(() => import("@/components/PopupReview"), {
  loading: () => <div />,
});
const InvestmentCalculator = dynamic(() => import("@/components/InvestmentCalculator"), {
  loading: () => <div />,
});
const PriceTicker = dynamic(() => import("@/components/PriceTicker"), {
  loading: () => <div />,
});
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), {
  loading: () => <div />,
});
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs"), {
  loading: () => <div />,
});
const OurTeam = dynamic(() => import("@/components/home/OurTeam"), {
  loading: () => <div />,
});
const CallToAction = dynamic(() => import("@/components/home/CallToAction"), {
  loading: () => <div />,
});

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PriceTicker />
      <AnalyticsSection />
      <Features />
      <PopupReview />
      <WhyChooseUs />
      <InvestmentCalculator />
      <HowItWorks />
      <TestimonialsSection />
      <OurTeam />
      <CallToAction />
    </main>
  );
}

