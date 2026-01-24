import { motion } from "framer-motion";
import { Trash2, TrendingUp, MapPin, Calendar, AlertTriangle } from "lucide-react";

interface WastePrediction {
  area: string;
  location: { lat: number; lng: number };
  currentFillLevel: number;
  predictedFillDate: string;
  daysUntilFull: number;
  priority: "low" | "medium" | "high" | "critical";
  basedonReports: number;
}

export function WastePrediction() {
  // Demo data - replace with real AI predictions
  const predictions: WastePrediction[] = [
    {
      area: "MG Road, Zone A",
      location: { lat: 15.4909, lng: 73.8278 },
      currentFillLevel: 85,
      predictedFillDate: "2026-01-25",
      daysUntilFull: 1,
      priority: "critical",
      basedonReports: 12
    },
    {
      area: "Beach Road, Zone B",
      location: { lat: 15.4889, lng: 73.8298 },
      currentFillLevel: 72,
      predictedFillDate: "2026-01-27",
      daysUntilFull: 3,
      priority: "high",
      basedonReports: 8
    },
    {
      area: "City Center, Zone C",
      location: { lat: 15.4929, lng: 73.8258 },
      currentFillLevel: 58,
      predictedFillDate: "2026-01-30",
      daysUntilFull: 6,
      priority: "medium",
      basedonReports: 5
    },
    {
      area: "Residential Area D",
      location: { lat: 15.4949, lng: 73.8238 },
      currentFillLevel: 35,
      predictedFillDate: "2026-02-03",
      daysUntilFull: 10,
      priority: "low",
      basedonReports: 3
    }
  ];

  const priorityColors = {
    critical: "from-red-500 to-red-600 border-red-400",
    high: "from-orange-500 to-orange-600 border-orange-400",
    medium: "from-yellow-500 to-yellow-600 border-yellow-400",
    low: "from-green-500 to-green-600 border-green-400"
  };

  const priorityBadges = {
    critical: "bg-red-100 text-red-700 border-red-300",
    high: "bg-orange-100 text-orange-700 border-orange-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    low: "bg-green-100 text-green-700 border-green-300"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Trash2 className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI Waste Collection Predictions</h2>
        </div>
        <p className="text-white/90 text-sm">
          Machine learning analysis of historical reports and IoT sensor data to predict waste collection needs
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-red-600">
            {predictions.filter(p => p.priority === 'critical').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Critical Alerts</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-orange-600">
            {predictions.filter(p => p.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">High Priority</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-civic-teal">
            {predictions.reduce((sum, p) => sum + p.basedonReports, 0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Reports Analyzed</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-civic-darkBlue">
            {Math.round(predictions.reduce((sum, p) => sum + p.currentFillLevel, 0) / predictions.length)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Avg Fill Level</div>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((prediction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${priorityColors[prediction.priority]} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-bold text-lg">{prediction.area}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${priorityBadges[prediction.priority]} bg-white/90`}>
                  {prediction.priority}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Fill Level Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Fill Level</span>
                  <span className="text-2xl font-bold text-civic-darkBlue">{prediction.currentFillLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.currentFillLevel}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-3 rounded-full bg-gradient-to-r ${priorityColors[prediction.priority]}`}
                  />
                </div>
              </div>

              {/* Prediction Info */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-civic-teal mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Predicted Full</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {new Date(prediction.predictedFillDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Days Until Full</div>
                    <div className="text-sm font-semibold text-gray-900">{prediction.daysUntilFull} days</div>
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">AI Insight</span>
                </div>
                <p className="text-xs text-blue-900">
                  Based on {prediction.basedonReports} citizen reports and historical patterns, 
                  this area requires collection within {prediction.daysUntilFull} days to prevent overflow.
                </p>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                Schedule Collection
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Model Info */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-purple-900 mb-2">How Our AI Prediction Works</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Analyzes historical waste collection reports from citizens</li>
              <li>• Monitors real-time IoT sensor data from smart waste bins</li>
              <li>• Factors in seasonal patterns, events, and area demographics</li>
              <li>• Machine learning model trained on 10,000+ data points</li>
              <li>• Prediction accuracy: 87% within 24-hour window</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
