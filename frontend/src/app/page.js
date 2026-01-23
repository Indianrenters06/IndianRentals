"use client";
import Hero from "@/components/Hero";
import RentByCategory from "@/components/RentByCategory";
import WhyChooseUs from "@/components/WhyChooseUs";
import BestRentedProducts from "@/components/BestRentedProducts";
import FeatureSection from "@/components/FeatureSection";
import RentalProcess from "@/components/RentalProcess";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <RentByCategory />
      <BestRentedProducts />
      <RentalProcess />
      <FeatureSection />
      <WhyChooseUs />
      <Testimonials />
    </main>
  );
}
