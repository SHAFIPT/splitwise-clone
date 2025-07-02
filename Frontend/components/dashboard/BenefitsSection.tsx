import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    "Split bills fairly among friends and roommates",
    "Track expenses across multiple groups and trips",
    "Get real-time updates on who owes what",
    "Settle up easily with integrated payment tracking",
    "Access your data from any device, anywhere",
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
                Why choose SplitEase?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
                Join thousands of users who trust SplitEase to manage their
                shared expenses with precision and ease.
              </p>
            </div>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1 transition-colors duration-300">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white shadow-2xl">
              <h4 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to get started?
              </h4>
              <p className="mb-8 opacity-90 text-lg leading-relaxed">
                Join thousands of users who trust SplitEase to manage their
                shared expenses with precision and transparency.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="w-full text-lg py-4 bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Splitting Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
