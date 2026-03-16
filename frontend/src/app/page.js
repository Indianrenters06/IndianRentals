"use client";
import Hero from "@/components/Hero";
import RentByCategory from "@/components/RentByCategory";
import WhyChooseUs from "@/components/WhyChooseUs";
import BestRentedProducts from "@/components/BestRentedProducts";
import FeatureSection from "@/components/FeatureSection";
import RentalProcess from "@/components/RentalProcess";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden font-manrope">
      <Hero />
      <RentByCategory />
      <BestRentedProducts type="bestRented" defaultTitle="Best Rented Products" />
      <FeatureSection />
      <BestRentedProducts type="newLaunches" defaultTitle="New Launches This Week" />
      <FeaturedShowcase />
      <RentalProcess />
      <WhyChooseUs />
      {/* <Testimonials /> */}
    </main>
  );
}
