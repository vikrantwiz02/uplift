import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Heart, MessageCircle, Clock, User, Edit, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";


const CommunityForum = ({ compact = false }) => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const categories = [
    { value: 'general', label: 'General Discussion', color: 'bg-blue-100 text-blue-800' },
    { value: 'anxiety', label: 'Anxiety Support', color: 'bg-purple-100 text-purple-800' },
    { value: 'depression', label: 'Depression Support', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'mindfulness', label: 'Mindfulness & Meditation', color: 'bg-green-100 text-green-800' },
    { value: 'self-care', label: 'Self-Care Tips', color: 'bg-pink-100 text-pink-800' },
    { value: 'success-stories', label: 'Success Stories', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'resources', label: 'Resources & Tools', color: 'bg-teal-100 text-teal-800' },
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      const data = await apiClient.getCommunityPosts(params);
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching community posts:', error);
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
        await apiClient.updateCommunityPost(editingId, {
          title: title.trim(),
          content: content.trim(),
          category,
          isAnonymous: isAnonymous,
        });

        toast({
          title: "Post updated!",
          description: "Your community post has been updated.",
        });
      } else {
        await apiClient.createCommunityPost({
          title: title.trim(),
          content: content.trim(),
          category,
          isAnonymous: isAnonymous,
        });

        toast({
          title: "Post created!",
          description: "Your post has been shared with the community.",
        });
      }

      resetForm();
      fetchPosts();
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
    setContent('');
    setCategory('general');
    setIsAnonymous(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setIsAnonymous(post.isAnonymous);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await apiClient.deleteCommunityPost(id);

      toast({
        title: "Post deleted",
        description: "Your community post has been removed.",
      });
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId) => {
    try {
      await apiClient.likeCommunityPost(postId);

      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getCategoryStyle = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.color || 'bg-gray-100 text-gray-800';
  };

  if (compact) {
    const recentPosts = posts.slice(0, 3);
    
    return (
      <div className="space-y-3">
        {recentPosts.length === 0 ? (
          <div className="text-center py-4">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No recent posts</p>
            <Button 
              size="sm" 
              onClick={() => setShowForm(true)}
              className="mt-2"
            >
              Create Post
            </Button>
          </div>
        ) : (
          recentPosts.map((post) => (
            <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                <Badge className={`text-xs ${getCategoryStyle(post.category)}`}>
                  {categories.find(c => c.value === post.category)?.label}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">{post.content}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Heart className="h-3 w-3" />
                  <span>{post.likes_count}</span>
                </div>
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Community Forum</h2>
          <p className="text-gray-600">Connect, share, and support each other</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All Posts
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* New Post Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Post' : 'Create New Post'}
            </CardTitle>
            <CardDescription>
              Share your thoughts, experiences, or ask for support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Share your thoughts, experiences, or ask for support..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{isAnonymous ? 'Anonymous' : 'Public'}</span>
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Posting...' : (editingId ? 'Update Post' : 'Create Post')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No posts yet. Be the first to start a conversation!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {post.isAnonymous ? 'A' : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {post.isAnonymous ? 'Anonymous' : 'Community Member'}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getCategoryStyle(post.category)}>
                        {categories.find(c => c.value === post.category)?.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{post.likesCount}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Reply</span>
                    </Button>
                  </div>
                  
                  {post.updatedAt !== post.createdAt && (
                    <p className="text-xs text-gray-500">
                      Edited {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                    </p>
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

export default CommunityForum;