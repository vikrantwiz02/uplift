
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, RotateCcw, Waves, Heart, Leaf } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";


const MeditationTimer = ({ compact = false, onNavigate }) => {
  const [selectedDuration, setSelectedDuration] = useState('5');
  const [selectedType, setSelectedType] = useState('mindfulness');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);
  const { toast } = useToast();

  const sessionTypes = [
    { value: 'mindfulness', label: 'Mindfulness', icon: Waves },
    { value: 'breathing', label: 'Breathing', icon: Heart },
    { value: 'body-scan', label: 'Body Scan', icon: Leaf },
    { value: 'loving-kindness', label: 'Loving Kindness', icon: Heart },
  ];

  const durations = [
    { value: '1', label: '1 minute' },
    { value: '5', label: '5 minutes' },
    { value: '10', label: '10 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '20', label: '20 minutes' },
    { value: '30', label: '30 minutes' },
  ];

  useEffect(() => {
    if (!compact) {
      fetchRecentSessions();
    }
  }, [compact]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            toast({
              title: "Meditation Complete!",
              description: "Well done! How did that feel?",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, toast]);

  const fetchRecentSessions = async () => {
    try {
      const data = await apiClient.getMeditationSessions({ limit: 5 });
      setRecentSessions(data || []);
    } catch (error) {
      console.error('Error fetching meditation sessions:', error);
    }
  };

  const startTimer = () => {
    const minutes = parseInt(selectedDuration);
    setTimeLeft(minutes * 60);
    setIsActive(true);
    setIsCompleted(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setIsCompleted(false);
  };

  const saveSession = async () => {
    setLoading(true);
    try {
      const originalDuration = parseInt(selectedDuration);
      const actualDuration = Math.ceil((originalDuration * 60 - timeLeft) / 60);

      await apiClient.createMeditationSession({
        sessionType: selectedType,
        durationMinutes: actualDuration,
        completed: isCompleted,
        notes: notes.trim() || undefined,
      });

      toast({
        title: "Session saved!",
        description: "Your meditation session has been recorded.",
      });

      setNotes('');
      setIsCompleted(false);
      if (!compact) {
        fetchRecentSessions();
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durations.slice(0, 4).map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.value}m
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {timeLeft > 0 ? (
            <div className="text-lg font-mono">{formatTime(timeLeft)}</div>
          ) : (
            <div className="text-sm text-gray-500">Ready to start</div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {!isActive && timeLeft === 0 && (
            <Button 
              onClick={() => {
                if (onNavigate) {
                  onNavigate();
                } else {
                  startTimer();
                }
              }} 
              size="sm" 
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          {isActive && (
            <Button onClick={pauseTimer} size="sm" variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          {timeLeft > 0 && (
            <Button onClick={resetTimer} size="sm" variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Waves className="h-5 w-5 text-blue-500" />
            <span>Meditation Timer</span>
          </CardTitle>
          <CardDescription>
            Take a moment to center yourself and find peace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Setup */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Session Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center py-8">
            <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
              {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
            </div>
            
            <div className="flex justify-center space-x-4">
              {!isActive && timeLeft === 0 && (
                <Button onClick={startTimer} size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Start Meditation
                </Button>
              )}
              
              {isActive && (
                <Button onClick={pauseTimer} size="lg" variant="outline">
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </Button>
              )}
              
              {timeLeft > 0 && (
                <Button onClick={resetTimer} size="lg" variant="outline">
                  <Square className="h-5 w-5 mr-2" />
                  Stop
                </Button>
              )}
            </div>
          </div>

          {/* Session Notes */}
          {(isCompleted || timeLeft > 0) && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Notes (Optional)
                </label>
                <Textarea
                  placeholder="How did this session feel? Any insights or observations?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button onClick={saveSession} disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Session'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {session.sessionType.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.durationMinutes} minutes • {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                    {session.notes && (
                      <div className="text-sm text-gray-700 mt-1">{session.notes}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {session.completed ? '✓ Completed' : 'Incomplete'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeditationTimer;
