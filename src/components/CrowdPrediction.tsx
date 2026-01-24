import { motion } from "framer-motion";
import { Users, TrendingUp, MapPin, Clock, AlertCircle } from "lucide-react";

interface CrowdForecast {
  area: string;
  location: { lat: number; lng: number };
  currentDensity: number; // people per sq km
  predictedDensity: number;
  timeframe: string;
  trend: "increasing" | "decreasing" | "stable";
  reason: string;
  confidence: number;
}

export function CrowdPrediction() {
  const forecasts: CrowdForecast[] = [
    {
      area: "City Market Area",
      location: { lat: 15.4909, lng: 73.8278 },
      currentDensity: 450,
      predictedDensity: 820,
      timeframe: "Today 6-8 PM",
      trend: "increasing",
      reason: "Weekend market + 3 civic events scheduled",
      confidence: 92
    },
    {
      area: "Beach Promenade",
      location: { lat: 15.4889, lng: 73.8298 },
      currentDensity: 320,
      predictedDensity: 680,
      timeframe: "Tomorrow 5-7 PM",
      trend: "increasing",
      reason: "Evening rush hour + good weather forecast",
      confidence: 85
    },
    {
      area: "City Center Square",
      location: { lat: 15.4929, lng: 73.8258 },
      currentDensity: 580,
      predictedDensity: 380,
      timeframe: "Sunday Morning",
      trend: "decreasing",
      reason: "Weekend slowdown pattern observed",
      confidence: 78
    },
    {
      area: "Transportation Hub",
      location: { lat: 15.4949, lng: 73.8238 },
      currentDensity: 720,
      predictedDensity: 750,
      timeframe: "Next 2 hours",
      trend: "stable",
      reason: "Normal weekday commute pattern",
      confidence: 88
    }
  ];

  const trendColors = {
    increasing: "from-red-500 to-orange-500",
    decreasing: "from-green-500 to-emerald-500",
    stable: "from-blue-500 to-cyan-500"
  };

  const trendIcons = {
    increasing: "📈",
    decreasing: "📉",
    stable: "➡️"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI Crowd Movement Predictions</h2>
        </div>
        <p className="text-white/90 text-sm">
          Real-time crowd density forecasting using historical patterns, events, and citizen reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-red-600">
            {forecasts.filter(f => f.trend === 'increasing').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Areas Expecting Crowds</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-indigo-600">
            {Math.round(forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Avg Prediction Confidence</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-purple-600">
            {Math.max(...forecasts.map(f => f.predictedDensity))}
          </div>
          <div className="text-sm text-gray-600 mt-1">Peak Density (per km²)</div>
        </div>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {forecasts.map((forecast, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${trendColors[forecast.trend]} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-bold text-lg">{forecast.area}</h3>
                </div>
                <span className="text-2xl">{trendIcons[forecast.trend]}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Density Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Current</div>
                  <div className="text-2xl font-bold text-gray-900">{forecast.currentDensity}</div>
                  <div className="text-xs text-gray-500">people/km²</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-700 mb-1">Predicted</div>
                  <div className="text-2xl font-bold text-purple-900">{forecast.predictedDensity}</div>
                  <div className="text-xs text-purple-600">people/km²</div>
                </div>
              </div>

              {/* Trend Arrow */}
              <div className="flex items-center justify-center">
                <div className={`w-full bg-gradient-to-r ${trendColors[forecast.trend]} h-2 rounded-full relative`}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-white"></div>
                </div>
              </div>

              {/* Change Percentage */}
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {forecast.trend === 'increasing' ? '+' : forecast.trend === 'decreasing' ? '-' : '±'}
                  {Math.abs(Math.round(((forecast.predictedDensity - forecast.currentDensity) / forecast.currentDensity) * 100))}%
                </div>
                <div className="text-sm text-gray-600 capitalize">{forecast.trend} Trend</div>
              </div>

              {/* Timeframe */}
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600 font-semibold">Forecast Window</div>
                  <div className="text-sm font-bold text-blue-900">{forecast.timeframe}</div>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">AI Analysis</span>
                </div>
                <p className="text-xs text-amber-900">{forecast.reason}</p>
              </div>

              {/* Confidence Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Prediction Confidence</span>
                  <span className="text-sm font-bold text-indigo-600">{forecast.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${forecast.confidence}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                View on Map
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Methodology */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 mb-2">Crowd Prediction Methodology</h3>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Historical foot traffic data from citizen reports and IoT sensors</li>
              <li>• Weather forecast integration (rain, temperature, holidays)</li>
              <li>• Public event calendar analysis (concerts, markets, festivals)</li>
              <li>• Time-of-day and day-of-week behavioral patterns</li>
              <li>• Real-time update every 15 minutes for accurate forecasting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
