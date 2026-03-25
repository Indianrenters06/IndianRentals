"use client";
import Hero from "@/components/Hero";
import RentByCategory from "@/components/RentByCategory";
import WhyChooseUs from "@/components/WhyChooseUs";
import BestRentedProducts from "@/components/BestRentedProducts";
import FeatureSection from "@/components/FeatureSection";
import ClientSection from "@/components/ClientSection";
import RentalProcess from "@/components/RentalProcess";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  console.log("Forcing tailwind reload...");
  return (
    <main className="min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden font-manrope">
      <Hero />
      <RentByCategory />
      <BestRentedProducts type="bestRented" defaultTitle="Best Rented Products" />
      <FeatureSection />
      <ClientSection />
      <BestRentedProducts type="newLaunches" defaultTitle="New Launches This Week" />
      <FeaturedShowcase />
      <RentalProcess />
      <WhyChooseUs />
      <Testimonials />
    </main>
  );
}
