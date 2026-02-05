import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  BookOpen, 
  Utensils, 
  MapPin, 
  Phone, 
  Star, 
  Navigation,
  Search,
  Filter,
  Heart,
  Clock,
  Globe,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Apple,
  Beef,
  Wheat,
  Milk
} from 'lucide-react';
import { nutritionItems, nutritionTips, vitaminCSources, NutritionItem, NutritionTip } from '../data/nutritionData';
import { hospitals, Hospital } from '../data/hospitalData';

type TabType = 'nutrition' | 'hospitals';
type NutritionFilter = 'all' | 'meat' | 'vegetables' | 'fruits' | 'grains' | 'legumes' | 'nuts';

export const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('nutrition');
  const [nutritionFilter, setNutritionFilter] = useState<NutritionFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userStatus, setUserStatus] = useState<'normal' | 'mild' | 'moderate' | 'severe'>('normal');

  useEffect(() => {
    // Get user's latest test result to personalize recommendations
    const results = JSON.parse(localStorage.getItem('testResults') || '[]');
    if (results.length > 0) {
      setUserStatus(results[0].status);
    }
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'meat': return <Beef className="h-4 w-4" />;
      case 'vegetables': return <Apple className="h-4 w-4" />;
      case 'fruits': return <Apple className="h-4 w-4" />;
      case 'grains': return <Wheat className="h-4 w-4" />;
      case 'dairy': return <Milk className="h-4 w-4" />;
      case 'legumes': return <Apple className="h-4 w-4" />;
      case 'nuts': return <Apple className="h-4 w-4" />;
      default: return <Utensils className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredNutritionItems = nutritionItems.filter(item => {
    const matchesFilter = nutritionFilter === 'all' || item.category === nutritionFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const relevantTips = nutritionTips.filter(tip => 
    tip.severity === 'all' || tip.severity === userStatus
  );

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.specialty.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDirections = (hospital: Hospital) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`;
    window.open(url, '_blank');
  };

  const callHospital = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const visitWebsite = (website?: string) => {
    if (website) {
      window.open(website, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Health Resources</h1>
        </div>
        <p className="text-gray-600">
          Comprehensive nutrition guides and healthcare directory to support your anemia management journey.
        </p>
        
        {userStatus !== 'normal' && (
          <div className={`mt-4 p-4 rounded-lg border ${getStatusColor(userStatus)}`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                Personalized recommendations for {userStatus} anemia status
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'nutrition'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Utensils className="h-4 w-4" />
            <span>Nutrition Guide</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'hospitals'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Hospital Directory</span>
          </div>
        </button>
      </div>

      {activeTab === 'nutrition' && (
        <div className="space-y-8">
          {/* Personalized Tips */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Personalized Nutrition Tips
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantTips.map((tip) => (
                <div key={tip.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">{tip.title}</h3>
                      <p className="text-blue-800 text-sm">{tip.description}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {tip.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search iron-rich foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={nutritionFilter}
                onChange={(e) => setNutritionFilter(e.target.value as NutritionFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="meat">Meat & Seafood</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="legumes">Legumes</option>
                <option value="nuts">Nuts & Seeds</option>
              </select>
            </div>
          </div>

          {/* Iron-Rich Foods Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Iron-Rich Foods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNutritionItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(item.category)}
                      <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Iron Content:</span>
                      <span className="font-semibold text-red-600">{item.ironContent}mg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Serving Size:</span>
                      <span className="text-sm font-medium">{item.servingSize}</span>
                    </div>
                    {item.vitaminC && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">High in Vitamin C</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {item.benefits.slice(0, 3).map((benefit, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Vitamin C Sources */}
          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <Apple className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Vitamin C Sources for Better Iron Absorption
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Combine these vitamin C-rich foods with iron sources to enhance absorption by up to 300%.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {vitaminCSources.map((source, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-800">{source}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'hospitals' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search hospitals, specialties, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Hospital Directory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHospitals.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{hospital.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{hospital.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Navigation className="h-4 w-4" />
                      <span>{hospital.distance} away</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialty.map((spec, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            spec === 'Hematology' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex items-center space-x-4 text-sm">
                    {hospital.emergencyServices && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        <span>24/7 Emergency</span>
                      </div>
                    )}
                    {hospital.hematologyDept && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <Heart className="h-4 w-4" />
                        <span>Hematology Dept</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    <Button
                      size="sm"
                      onClick={() => callHospital(hospital.phone)}
                      className="flex items-center space-x-1"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDirections(hospital)}
                      className="flex items-center space-x-1"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Directions</span>
                    </Button>
                    {hospital.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => visitWebsite(hospital.website)}
                        className="flex items-center space-x-1"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredHospitals.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
              <p className="text-gray-600">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};