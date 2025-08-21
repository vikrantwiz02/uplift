import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const JournalEntry = () => {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodRating, setMoodRating] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const data = await apiClient.getJournalEntries();
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update existing entry
        await apiClient.updateJournalEntry(editingId, {
          title: title.trim(),
          content: content.trim(),
          moodRating: moodRating ? parseInt(moodRating) : undefined,
          isPrivate: isPrivate,
        });

        toast({
          title: "Entry updated!",
          description: "Your journal entry has been updated.",
        });
      } else {
        // Create new entry
        await apiClient.createJournalEntry({
          title: title.trim(),
          content: content.trim(),
          moodRating: moodRating ? parseInt(moodRating) : undefined,
          isPrivate: isPrivate,
        });

        toast({
          title: "Entry saved!",
          description: "Your journal entry has been saved.",
        });
      }

      // Reset form
      setTitle('');
      setContent('');
      setMoodRating('');
      setIsPrivate(true);
      setEditingId(null);
      fetchEntries();
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

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setMoodRating(entry.moodRating?.toString() || '');
    setIsPrivate(entry.isPrivate);
    setEditingId(entry.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await apiClient.deleteJournalEntry(id);

      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted.",
      });
      fetchEntries();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setMoodRating('');
    setIsPrivate(true);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* New/Edit Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span>{editingId ? 'Edit Entry' : 'New Journal Entry'}</span>
          </CardTitle>
          <CardDescription>
            Express your thoughts and feelings in a safe, private space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Entry title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Textarea
                placeholder="What's on your mind today? Write about your thoughts, feelings, experiences, or anything you'd like to remember..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select value={moodRating} onValueChange={setMoodRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional: Rate your mood (1-5)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Low</SelectItem>
                    <SelectItem value="2">2 - Low</SelectItem>
                    <SelectItem value="3">3 - Neutral</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPrivate(!isPrivate)}
                className="flex items-center space-x-2"
              >
                {isPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                <span>{isPrivate ? 'Private' : 'Shared'}</span>
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update Entry' : 'Save Entry')}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Entries */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Journal Entries</h2>
        {entries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No journal entries yet. Start writing your first entry above!</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                      {entry.moodRating && (
                        <span className="text-sm">• Mood: {entry.moodRating}/5</span>
                      )}
                      {entry.isPrivate && <Lock className="h-3 w-3" />}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                {entry.updatedAt !== entry.createdAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(entry.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalEntry;
