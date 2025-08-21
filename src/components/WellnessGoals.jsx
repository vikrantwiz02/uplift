import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Check, Trash2, Edit } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const WellnessGoals = ({ compact = false }) => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetFrequency, setTargetFrequency] = useState('1');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
    }
  }, [isAuthenticated]);

  const fetchGoals = async () => {
    try {
      const data = await apiClient.getWellnessGoals();
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wellness goals",
        variant: "destructive",
      });
    }
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await apiClient.updateWellnessGoal(editingId, {
          title: title.trim(),
          description: description.trim() || undefined,
          targetFrequency: parseInt(targetFrequency),
        });

        toast({
          title: "Goal updated!",
          description: "Your wellness goal has been updated.",
        });
      } else {
        await apiClient.createWellnessGoal({
          title: title.trim(),
          description: description.trim() || undefined,
          targetFrequency: parseInt(targetFrequency),
        });

        toast({
          title: "Goal created!",
          description: "Your new wellness goal has been added.",
        });
      }

      resetForm();
      fetchGoals();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetFrequency('1');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (goal) => {
    setTitle(goal.title);
    setDescription(goal.description || '');
    setTargetFrequency(goal.targetFrequency.toString());
    setEditingId(goal.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiClient.deleteWellnessGoal(id);
      toast({
        title: "Goal deleted",
        description: "Your wellness goal has been removed.",
      });
      fetchGoals();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async (id, newStreak) => {
    try {
      await apiClient.updateWellnessGoal(id, {
        currentStreak: newStreak,
      });

      fetchGoals();
      toast({
        title: "Progress updated!",
        description: "Your goal progress has been recorded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleComplete = async (id, isCompleted) => {
    try {
      await apiClient.updateWellnessGoal(id, {
        isCompleted: !isCompleted,
      });

      fetchGoals();
      toast({
        title: isCompleted ? "Goal reopened" : "Goal completed!",
        description: isCompleted ? "Goal marked active again." : "Congratulations on reaching your goal!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (compact) {
    const activeGoals = goals.filter(goal => !goal.isCompleted).slice(0, 3);
    
    return (
      <div className="space-y-3">
        {activeGoals.length === 0 ? (
          <div className="text-center py-4">
            <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No active goals</p>
            <Button 
              size="sm" 
              onClick={() => setShowForm(true)}
              className="mt-2"
            >
              Add Goal
            </Button>
          </div>
        ) : (
          activeGoals.map((goal) => (
            <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{goal.title}</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStreak(goal.id, goal.current_streak + 1)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Streak: {goal.currentStreak}</span>
                <span>•</span>
                <span>Target: {goal.targetFrequency}/week</span>
              </div>
              <Progress 
                value={(goal.currentStreak / goal.targetFrequency) * 100} 
                className="h-1 mt-2"
              />
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Goal Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Wellness Goal
        </Button>
      )}

      {/* Goal Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Goal' : 'Create New Goal'}
            </CardTitle>
            <CardDescription>
              Set a wellness goal to track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Goal title (e.g., 'Daily meditation', 'Exercise 3x per week')"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Goal description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Select value={targetFrequency} onValueChange={setTargetFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Target frequency per week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 time per week</SelectItem>
                    <SelectItem value="2">2 times per week</SelectItem>
                    <SelectItem value="3">3 times per week</SelectItem>
                    <SelectItem value="4">4 times per week</SelectItem>
                    <SelectItem value="5">5 times per week</SelectItem>
                    <SelectItem value="7">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingId ? 'Update Goal' : 'Create Goal')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No wellness goals yet. Create your first goal to get started!</p>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id} className={goal.isCompleted ? 'opacity-75' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className={`text-lg ${goal.isCompleted ? 'line-through' : ''}`}>
                      {goal.title}
                    </CardTitle>
                    {goal.description && (
                      <CardDescription className="mt-1">
                        {goal.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleComplete(goal.id, goal.isCompleted)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Streak: {goal.currentStreak}</span>
                    <span>Target: {goal.targetFrequency}/week</span>
                  </div>
                  
                  <Progress 
                    value={Math.min((goal.currentStreak / goal.targetFrequency) * 100, 100)}
                    className="h-2"
                  />
                  
                  {!goal.isCompleted && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateStreak(goal.id, goal.currentStreak + 1)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Mark Progress
                      </Button>
                      {goal.currentStreak > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStreak(goal.id, Math.max(0, goal.currentStreak - 1))}
                        >
                          Undo
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WellnessGoals;
