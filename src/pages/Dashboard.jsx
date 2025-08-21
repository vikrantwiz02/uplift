import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Calendar, Target, Users, BookOpen, Plus, LogOut, Bot, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import MoodTracker from "@/components/MoodTracker";
import JournalEntry from "@/components/JournalEntry";
import MeditationTimer from "@/components/MeditationTimer";
import WellnessGoals from "@/components/WellnessGoals";
import AIChat from "@/components/AIChat";
import CommunityForum from "@/components/CommunityForum";
import CrisisResources from "@/components/CrisisResources";

const Dashboard = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      
      toast({
        title: "Signed out successfully",
        description: "Take care and come back soon!",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'mood', label: 'Mood Tracker', icon: Brain },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'meditation', label: 'Meditation', icon: Calendar },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'ai-chat', label: 'AI Assistant', icon: Bot },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'crisis', label: 'Crisis Support', icon: AlertTriangle },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-gray-800">Uplift</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hello, {user?.fullName || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <span>Today's Mood</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodTracker compact={true} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span>Quick Meditation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MeditationTimer compact={true} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <span>Wellness Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WellnessGoals compact={true} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-500" />
                    <span>AI Assistant</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AIChat compact={true} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    <span>Community</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommunityForum compact={true} />
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Crisis Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 mb-3">
                    24/7 support available if you need immediate help
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => setActiveTab('crisis')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Get Help Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'mood' && <MoodTracker />}
          {activeTab === 'journal' && <JournalEntry />}
          {activeTab === 'meditation' && <MeditationTimer />}
          {activeTab === 'goals' && <WellnessGoals />}
          {activeTab === 'ai-chat' && <AIChat />}
          {activeTab === 'community' && <CommunityForum />}
          {activeTab === 'crisis' && <CrisisResources />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;