'use client';
import BenefitsSection from "@/components/dashboard/BenefitsSection";
import FeaturesSection from "@/components/dashboard/FeaturesSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/layout/HeroSection";
import withAuth from "@/lib/auth/withAuth";
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";

const Dashboard  = () => {

  const user = useSelector((state: RootState) => state.user)
  
  console.log('this isht suer :',user)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
};

export default withAuth(Dashboard);  
