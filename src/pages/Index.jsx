
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Users, BookOpen, Calendar, Shield, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      
      toast({
        title: "Signed out successfully",
        description: "Take care and come back soon!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const features = [
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Track your daily emotions and identify patterns over time",
      color: "text-pink-500"
    },
    {
      icon: Brain,
      title: "Mindfulness Tools",
      description: "Guided meditation and breathing exercises for inner peace",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar wellness journeys",
      color: "text-blue-500"
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access evidence-based tools and educational content",
      color: "text-green-500"
    },
    {
      icon: Calendar,
      title: "Daily Check-ins",
      description: "Build healthy habits with personalized wellness routines",
      color: "text-orange-500"
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "Your privacy and security are our top priorities",
      color: "text-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">Uplift</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-gray-800 transition-colors">About</Link>
            <Link to="/resources" className="text-gray-600 hover:text-gray-800 transition-colors">Resources</Link>
            <Link to="/community" className="text-gray-600 hover:text-gray-800 transition-colors">Community</Link>
            {isAuthenticated ? (
              <>
                <Button asChild variant="outline">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Your Journey to 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"> Wellness </span>
            Starts Here
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A safe, supportive space for everyone to prioritize their mental health and wellbeing. 
            No matter your age, background, or experience – you belong here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link to="/auth">Start Your Wellness Journey</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4">
                  <Link to="/resources">Explore Resources</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tools for Every Step of Your Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover evidence-based tools and resources designed to support your mental health and wellbeing
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 border-0 text-white">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Prioritize Your Wellbeing?
            </h3>
            <p className="text-xl mb-8 text-pink-100">
              Join thousands who have already started their wellness journey with Uplift
            </p>
            {isAuthenticated ? (
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Link to="/dashboard">Continue Your Journey</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Link to="/auth">Create Your Free Account</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold">Uplift</span>
              </div>
              <p className="text-gray-400">
                Supporting mental health and wellbeing for everyone, everywhere.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/crisis" className="hover:text-white transition-colors">Crisis Support</Link></li>
                <li><Link to="/guides" className="hover:text-white transition-colors">Self-Help Guides</Link></li>
                <li><Link to="/professionals" className="hover:text-white transition-colors">Find Professionals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/forums" className="hover:text-white transition-colors">Support Forums</Link></li>
                <li><Link to="/groups" className="hover:text-white transition-colors">Support Groups</Link></li>
                <li><Link to="/stories" className="hover:text-white transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Uplift Wellbeing Portal. Made with ❤️ for mental health.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
