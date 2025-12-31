import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from "../components/HeroSection"
import Catagory from "../components/CategorySection"
import FeaturesSection from '../components/FeaturesSection';
import InfoSection from '../components/InfoSection';
import MainFooterSection from '../components/Footer';
const Home = () => {

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- Hero Section --- */}
           <section>
            <Hero/>
           </section>
           <section>
            <Catagory/>
           </section>
            {/* --- Features Section --- */}
            <section className="py-20 container mx-auto px-4">
                 <FeaturesSection/>
            </section>
            <section>
                <InfoSection/>
            </section>
            <section>
                <MainFooterSection/>
            </section>
        </div>
    );
};

export default Home;