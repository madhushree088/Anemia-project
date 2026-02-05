import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Heart, Camera, FileText, Users, Award, Shield } from 'lucide-react';

export const Landing: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Manual Assessment',
      description: 'Complete comprehensive health questionnaire with symptoms tracking and medical history.',
    },
    {
      icon: Camera,
      title: 'AI-Powered Testing',
      description: 'Advanced image analysis of fingernails and eyelids for accurate anemia detection.',
    },
    {
      icon: Users,
      title: 'Expert Resources',
      description: 'Access nutrition guidelines, hospital directory, and educational content.',
    },
    {
      icon: Award,
      title: 'Personalized Results',
      description: 'Get detailed health recommendations based on your assessment results.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-3">
                <Heart className="h-16 w-16 text-red-500" />
                <h1 className="text-5xl font-bold text-gray-900">AnemiaCheck</h1>
              </div>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced anemia detection and health management platform combining AI technology 
              with comprehensive health assessments for accurate, personalized results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Anemia Detection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines traditional health assessments with cutting-edge AI technology 
              to provide accurate anemia detection and personalized health recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-100">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Tests Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Available Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Shield className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Take Control of Your Health Today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who trust AnemiaCheck for accurate health assessments 
            and personalized recommendations.
          </p>
          <Link to="/register">
            <Button size="lg">
              Start Your Free Assessment
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};