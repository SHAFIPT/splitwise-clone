import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calculator, DollarSign, Smartphone, Shield, Clock } from "lucide-react";
import Link from "next/link";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SplitEase</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Features
              </Button>
              <Button variant="ghost" className="hidden sm:inline-flex">
                How it Works
              </Button>
              <Button variant="outline">
              <Link href="/login">Log In</Link>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/register">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Split Bills.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Share Easy.
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl">
                The simplest way to split expenses with friends, roommates, and groups. 
                Track shared costs, settle debts, and keep everyone happy.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  See How It Works
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
          
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="h-full bg-white rounded-2xl p-6 flex flex-col justify-center items-center">
                  <div className="w-full max-w-sm space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Trip to Miami</h3>
                      <p className="text-gray-500">4 people</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">A</div>
                          <span className="text-sm font-medium">Hotel</span>
                        </div>
                        <span className="text-sm font-semibold">$320.00</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">B</div>
                          <span className="text-sm font-medium">Dinner</span>
                        </div>
                        <span className="text-sm font-semibold">$85.50</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">C</div>
                          <span className="text-sm font-medium">Gas</span>
                        </div>
                        <span className="text-sm font-semibold">$45.20</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">You owe</p>
                        <p className="text-lg font-bold text-purple-600">$112.68</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to split expenses
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple tools that make sharing costs effortless
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Splitting</h3>
                <p className="text-gray-600">
                  Automatically calculate how much each person owes, including tax and tip
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Group Management</h3>
                <p className="text-gray-600">
                  Create groups for different occasions - trips, roommates, regular outings
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile First</h3>
                <p className="text-gray-600">
                  Add expenses on the go with our intuitive mobile interface
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your financial data is encrypted and never shared with third parties
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600">
                  Everyone sees expenses and balances update instantly
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Settlement</h3>
                <p className="text-gray-600">
                  Simple debt resolution with optimized payment suggestions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How SplitEase Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Three simple steps to stress-free expense sharing
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Expenses</h3>
              <p className="text-gray-600">
                Snap a photo of receipts or manually enter expenses. Choose who was involved and how to split it.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Balances</h3>
              <p className="text-gray-600">
                See who owes what at a glance. SplitEase automatically calculates everyone&#39;s share and keeps running totals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Settle Up</h3>
              <p className="text-gray-600">
                Get payment reminders and mark debts as paid. Everyone stays on the same page about what&#39;s settled.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to split smarter?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of people who&#39;ve simplified their shared expenses
          </p>
          <div className="mt-8">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 shadow-lg">
              Start Splitting for Free
            </Button>
          </div>
          <p className="mt-4 text-sm text-blue-100">
            No signup required to try it out
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SplitEase</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The easiest way to split bills and track shared expenses with friends, roommates, and groups.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SplitEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
