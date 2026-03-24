"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaCheckCircle, FaStar, FaLaptop, FaCamera, FaDesktop } from 'react-icons/fa';
import Button from '@/components/common/Button';

export default function DesignSystemTestPage() {
  return (
    <div className="min-h-screen bg-grey-50 font-sans pb-20">
      {/* Hero Section Preview */}
      <section className="bg-blue-secondary text-white py-20 px-4">
        <div className="max-w-[1440px] mx-auto px-4 md:px-120">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              Client Preview: Mona Sans + New Design System
            </span>
            <h1 className="text-5xl md:text-5xl font-bold tracking-[-2px] leading-[60px] mb-6">
              The Tech That Powers Your Ambition. On Demand.
            </h1>
            <p className="text-lg opacity-90 mb-10 leading-relaxed max-w-2xl">
              Experience the sleek new look with Mona Sans typography. High-performance workstations, MacBooks, and premium gear delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="yellow" size="lg" className="!rounded-full px-10 h-14 text-base">
                Explore Store
              </Button>
              <Button variant="outline" size="lg" className="!rounded-full !bg-white/10 !text-white !border-white/30 h-14 text-base hover:!bg-white/20">
                How it Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-120 mt-16 space-y-24">
        
        {/* Typography Showcase */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-semibold tracking-tight text-black">Typography System</h2>
            <div className="h-px flex-1 bg-grey-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <p className="text-xs text-grey-400 mb-2 uppercase font-bold tracking-widest">Display / 62px</p>
                <h1 className="text-5xl font-bold tracking-[-2.0px] leading-[60px] text-black italic">Mona Sans Bold Italic</h1>
              </div>
              <div>
                <p className="text-xs text-grey-400 mb-2 uppercase font-bold tracking-widest">H1 / 47px</p>
                <h1 className="text-4xl font-semibold tracking-[-1.5px] leading-[58px] text-black">Section Main Heading</h1>
              </div>
              <div>
                <p className="text-xs text-grey-400 mb-2 uppercase font-bold tracking-widest">H2 / 36px</p>
                <h2 className="text-3xl font-semibold tracking-[-0.8px] leading-[45px] text-black">Secondary Level Header</h2>
              </div>
              <div>
                <p className="text-xs text-grey-400 mb-2 uppercase font-bold tracking-widest">H3 / 27px</p>
                <h3 className="text-2xl font-semibold tracking-[-0.8px] leading-[35px] text-black">Card & Modal Title Style</h3>
              </div>
            </div>
            
            <div className="space-y-8 bg-white p-8 rounded-2xl border border-grey-200">
              <div>
                <p className="text-xs text-grey-400 mb-2 uppercase font-bold tracking-widest">Body Regular / 16px</p>
                <p className="text-base font-normal tracking-[-0.4px] leading-[23px] text-grey-600">
                  Mona Sans is a variable font inspired by industrial signage. It's designed to be functional and full of character. This body text shows the optimal line height and letter spacing configured in your design system.
                </p>
              </div>
              <div>
                <p className="text-xs text-grey-400 mb-2 uppercase font-bold tracking-widest">Caption / 14px</p>
                <p className="text-sm font-normal tracking-[-0.4px] leading-[20px] text-grey-500">
                  * Perfect for small metadata, tooltips, and secondary information that needs to remain legible at smaller sizes.
                </p>
              </div>
              <div className="pt-4 border-t border-grey-100 flex gap-6">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-black">90k+</span>
                  <span className="text-xs text-grey-400 uppercase">Devices</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-black">30k+</span>
                  <span className="text-xs text-grey-400 uppercase">Users</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-black">4.9/5</span>
                  <span className="text-xs text-grey-400 uppercase">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Showcase */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-semibold tracking-tight text-black">Standard Components</h2>
            <div className="h-px flex-1 bg-grey-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Buttons Column */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold tracking-[-0.8px] leading-[28px] mb-4">Buttons</h4>
              <div className="space-y-4">
                <Button variant="yellow" className="w-full">Primary Action</Button>
                <Button variant="black" className="w-full">Secondary Outline</Button>
                <Button variant="blue" className="w-full">Blue Speciality</Button>
                <div className="flex gap-2">
                  <button className="inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer text-center rounded-full border border-grey-700 px-5 py-2 bg-grey-700 text-white flex-1">Selected</button>
                  <button className="inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer text-center rounded-full border border-grey-700 bg-white text-grey-700 px-5 py-2 hover:bg-grey-100 flex-1">Default</button>
                </div>
              </div>
            </div>

            {/* Form Preview */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold tracking-[-0.8px] leading-[28px] mb-4">Form Elements</h4>
              <div className="space-y-4 p-6 bg-white rounded-2xl border border-grey-200 shadow-sm">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-grey-700">Full Name</label>
                  <input type="text" className="w-full border border-grey-300 rounded-md px-3 transition-all duration-200 text-base font-normal h-10 tablet:h-9 desktop:h-[35px]" placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-grey-700">Status</label>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center justify-center bg-orange-300 text-black">New Launch</span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-sm inline-flex items-center justify-center bg-red-sale text-white">Limited Deal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Preview */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold tracking-[-0.8px] leading-[28px] mb-4">Product Card</h4>
              <div className="bg-white border border-grey-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-md h-full relative">
                <div className="absolute top-2 left-2 bg-red-sale text-white px-2 py-1 text-xs font-semibold rounded-sm z-10">-20% OFF</div>
                <div className="h-48 bg-grey-100 flex items-center justify-center relative group">
                  <FaLaptop size={60} className="text-grey-300 transition-transform group-hover:scale-110 duration-500" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full shadow-lg">Quick View</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-semibold text-black line-clamp-2 px-4 pt-4 leading-tight min-h-[46px] !px-0 !pt-0">MacBook Pro M4 Pro Chip 14" Display</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <FaStar key={i} className="text-orange-300" size={12} />)}
                    <span className="text-xs text-grey-500 ml-1">(128 Reviews)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-lg font-semibold text-black text-xl">₹6,499</span>
                    <span className="text-sm line-through text-grey-400">₹8,500</span>
                    <span className="text-xs text-grey-500">/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette Preview */}
        <section className="bg-white p-10 rounded-[40px] border border-grey-200 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Unified Color Palette</h2>
            <p className="text-grey-500 max-w-xl mx-auto">Configured in tailwind.config.js to ensure brand consistency across the entire application.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="space-y-3">
              <div className="h-24 rounded-2xl bg-orange-300 shadow-inner flex items-end p-3"><span className="text-xs font-bold text-black">Primary Orange</span></div>
              <p className="text-[10px] text-grey-400 font-mono text-center">--color-orange-300</p>
            </div>
            <div className="space-y-3">
              <div className="h-24 rounded-2xl bg-blue-secondary shadow-inner flex items-end p-3"><span className="text-xs font-bold text-white">Secondary Blue</span></div>
              <p className="text-[10px] text-grey-400 font-mono text-center">--blue-secondary</p>
            </div>
            <div className="space-y-3">
              <div className="h-24 rounded-2xl bg-black shadow-inner flex items-end p-3"><span className="text-xs font-bold text-white">Deep Black</span></div>
              <p className="text-[10px] text-grey-400 font-mono text-center">--color-black</p>
            </div>
            <div className="space-y-3">
              <div className="h-24 rounded-2xl bg-red-sale shadow-inner flex items-end p-3"><span className="text-xs font-bold text-white">Accent Red</span></div>
              <p className="text-[10px] text-grey-400 font-mono text-center">--color-red-sale</p>
            </div>
            <div className="space-y-3">
              <div className="h-24 rounded-2xl bg-grey-500 shadow-inner flex items-end p-3"><span className="text-xs font-bold text-white">Neutral Grey</span></div>
              <p className="text-[10px] text-grey-400 font-mono text-center">--color-grey-500</p>
            </div>
          </div>
        </section>

        <footer className="text-center py-10 opacity-50">
          <p className="text-sm">Indian Rentals Design Preview Prototype v3.1 • 2026</p>
        </footer>
      </div>
    </div>
  );
}
