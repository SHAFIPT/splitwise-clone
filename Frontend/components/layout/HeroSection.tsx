'use client';
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import CreateGroupModal from "../dashboard/CreateGroupModal";
import { useRouter } from "next/navigation";
const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SplitEase
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Start managing your shared expenses effortlessly. Split bills, track
            balances, and settle up with friends in just a few clicks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            onClick={()=> router.push("/dashboard/groups")}
            className="text-lg cursor-pointer px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Your First Expense
          </Button>
          <CreateGroupModal
            trigger={
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 cursor-pointer py-4 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                <Users className="mr-2 h-5 w-5" />
                Create a Group
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              $0
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Total Expenses Tracked
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              0
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Active Groups
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              $0
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Amount Settled
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
