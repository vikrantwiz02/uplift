
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Meh, Heart, Zap, Sun, Cloud, CloudRain } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";


const MoodTracker = ({ compact = false, onNavigate }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [notes, setNotes] = useState('');
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const moodOptions = [
    { value: 1, label: 'Very Low', icon: CloudRain, color: 'text-gray-600' },
    { value: 2, label: 'Low', icon: Cloud, color: 'text-blue-600' },
    { value: 3, label: 'Neutral', icon: Meh, color: 'text-yellow-600' },
    { value: 4, label: 'Good', icon: Smile, color: 'text-green-600' },
    { value: 5, label: 'Excellent', icon: Sun, color: 'text-orange-500' },
  ];

  const emotionOptions = [
    'Happy', 'Sad', 'Anxious', 'Calm', 'Excited', 'Tired', 'Stressed', 'Grateful',
    'Angry', 'Peaceful', 'Confused', 'Confident', 'Lonely', 'Loved', 'Motivated', 'Overwhelmed'
  ];

  useEffect(() => {
    if (!compact) {
      fetchRecentEntries();
    }
  }, [compact]);

  const fetchRecentEntries = async () => {
    try {
      const data = await apiClient.getMoodEntries({ limit: 5 });
      setRecentEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await apiClient.createMoodEntry({
        moodLevel: selectedMood,
        emotions: selectedEmotions,
        notes: notes.trim() || undefined,
      });

      toast({
        title: "Mood logged successfully!",
        description: "Your mood has been recorded.",
      });

      // Reset form
      setSelectedMood(null);
      setSelectedEmotions([]);
      setNotes('');
      
      if (!compact) {
        fetchRecentEntries();
      }
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

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {moodOptions.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMood(mood.value)}
              className="p-2"
            >
              <mood.icon className={`h-4 w-4 ${mood.color}`} />
            </Button>
          ))}
        </div>
        <Button 
          onClick={() => {
            if (selectedMood && onNavigate) {
              handleMoodSubmit().then(() => onNavigate());
            } else if (onNavigate) {
              onNavigate();
            }
          }} 
          disabled={loading} 
          className="w-full"
        >
          {loading ? 'Saving...' : 'Log Mood'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <span>How are you feeling today?</span>
          </CardTitle>
          <CardDescription>
            Track your daily emotions and identify patterns over time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div>
            <h3 className="font-semibold mb-3">Select your mood:</h3>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  onClick={() => setSelectedMood(mood.value)}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <mood.icon className={`h-6 w-6 mb-2 ${mood.color}`} />
                  <span className="text-xs">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Emotion Tags */}
          <div>
            <h3 className="font-semibold mb-3">What emotions are you experiencing?</h3>
            <div className="flex flex-wrap gap-2">
              {emotionOptions.map((emotion) => (
                <Badge
                  key={emotion}
                  variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleEmotion(emotion)}
                >
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="font-semibold mb-3">Additional notes (optional):</h3>
            <Textarea
              placeholder="What's on your mind? Any specific thoughts or events that influenced your mood?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleMoodSubmit} disabled={loading || !selectedMood} className="w-full">
            {loading ? 'Saving...' : 'Log Mood Entry'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Mood Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry) => {
                const mood = moodOptions.find(m => m.value === entry.moodLevel);
                return (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {mood && <mood.icon className={`h-5 w-5 mt-1 ${mood.color}`} />}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{mood?.label}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {entry.emotions.map((emotion) => (
                            <Badge key={emotion} variant="secondary" className="text-xs">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-gray-700">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodTracker;
