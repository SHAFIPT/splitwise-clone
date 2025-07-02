import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, DollarSign, Check } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Plus,
      title: "Add Expenses",
      description:
        "Quickly log shared expenses with detailed information about who paid and who owes what.",
      action: "Add Your First Expense",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Create Groups",
      description:
        "Organize expenses by creating groups for trips, roommates, events, or any shared activity.",
      action: "Create a Group",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: DollarSign,
      title: "Track Balances",
      description:
        "See who owes what at a glance with real-time balance tracking and smart calculations.",
      action: "View Balances",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Check,
      title: "Settle Up",
      description:
        "Easily settle debts and mark payments as complete to keep everyone's accounts clear.",
      action: "Settle Debts",
      gradient: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            Everything you need to manage shared expenses
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Powerful features designed to make splitting expenses simple and
            transparent for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`mx-auto w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                  {feature.description}
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                >
                  {feature.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
