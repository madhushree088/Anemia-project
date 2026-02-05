import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Heart, 
  FileText, 
  Camera, 
  TrendingUp, 
  Calendar,
  Activity,
  Users,
  BookOpen
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Last Hemoglobin',
      value: '12.5 g/dL',
      status: 'Normal',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Tests Completed',
      value: '3',
      status: 'This month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Health Score',
      value: '85/100',
      status: 'Good',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const quickActions = [
    {
      title: 'Manual Assessment',
      description: 'Complete health questionnaire',
      icon: FileText,
      link: '/assessment',
      color: 'bg-blue-500',
    },
    {
      title: 'AI Test',
      description: 'Image-based anemia detection',
      icon: Camera,
      link: '/ai-test',
      color: 'bg-purple-500',
    },
    {
      title: 'View Results',
      description: 'Check your test history',
      icon: TrendingUp,
      link: '/results',
      color: 'bg-green-500',
    },
    {
      title: 'Health Resources',
      description: 'Nutrition & education',
      icon: BookOpen,
      link: '/resources',
      color: 'bg-orange-500',
    },
  ];

  const recentTests = [
    {
      date: '2024-01-15',
      type: 'Manual Assessment',
      result: 'Normal',
      hemoglobin: '12.8 g/dL',
    },
    {
      date: '2024-01-10',
      type: 'AI Test - Fingernail',
      result: 'Normal',
      hemoglobin: '12.5 g/dL',
    },
    {
      date: '2024-01-05',
      type: 'Manual Assessment',
      result: 'Mild Anemia',
      hemoglobin: '11.2 g/dL',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <Heart className="h-12 w-12" />
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mt-2">
              Track your health journey and get personalized insights
            </p>
          </div>
        </div>
      </div>

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-4`}>
              <Activity className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className={`text-sm font-medium ${stat.color}`}>{stat.status}</div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${action.color} text-white mb-4`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tests */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Tests</h2>
          <Link to="/results">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hemoglobin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTests.map((test, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(test.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {test.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        test.result === 'Normal' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {test.hemoglobin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="outline" className="w-full sm:w-auto">Try AI Test</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};