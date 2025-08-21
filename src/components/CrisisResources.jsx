import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Globe, MapPin, AlertTriangle, Heart } from "lucide-react";
import { apiClient } from "@/lib/api";

const CrisisResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await apiClient.getCrisisResources();
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching crisis resources:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency Notice */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">
                If you're in immediate danger or having thoughts of self-harm
              </h3>
              <p className="text-red-700 mb-3">
                Please reach out for help immediately. You are not alone, and there are people who want to support you.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 988 (US)
                </Button>
                <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Text HOME to 741741
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Crisis Support Resources</h2>
        <p className="text-gray-600">
          24/7 support services for mental health crises and emergencies
        </p>
      </div>

      {/* Resources List */}
      <div className="grid gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    <span>{resource.title}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{resource.country}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-700 mb-4">
                {resource.description}
              </CardDescription>
              
              <div className="flex flex-wrap gap-3">
                {resource.phoneNumber && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${resource.phoneNumber}`, '_self')}
                    className="flex items-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{resource.phoneNumber}</span>
                  </Button>
                )}
                
                {resource.websiteUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(resource.websiteUrl, '_blank')}
                    className="flex items-center space-x-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Visit Website</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Support */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            Remember: Seeking help is a sign of strength
          </h3>
          <p className="text-blue-700 mb-3">
            Mental health challenges are real and treatable. Professional support can make a significant difference in your recovery and wellbeing.
          </p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• You deserve support and care</li>
            <li>• Recovery is possible with the right help</li>
            <li>• Many people have overcome similar challenges</li>
            <li>• Taking the first step to reach out shows courage</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisResources;