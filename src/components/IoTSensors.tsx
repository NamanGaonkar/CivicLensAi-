

interface IoTSensor {
  _id: Id<"iotSensors">;
  sensorId: string;
  type: "air_quality" | "noise" | "water_pressure" | "temperature";
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  currentValue: number;
  unit: string;
  threshold: {
    min: number;
    max: number;
  };
  status: "normal" | "warning" | "critical";
  lastUpdated: number;
}

interface IoTSensorsProps {
  sensors: IoTSensor[];
}

export function IoTSensors({ sensors }: IoTSensorsProps) {
  const statusColors = {
    normal: "bg-civic-teal/20 text-civic-teal border-civic-teal/30",
    warning: "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30",
    critical: "bg-accent-orange/20 text-accent-orange border-accent-orange/30",
  };

  const sensorIcons = {
    air_quality: "🌬️",
    noise: "🔊",
    water_pressure: "💧",
    temperature: "🌡️",
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold text-white mb-6">IoT Sensors</h3>
      
      <div className="space-y-4">
        {sensors.map((sensor) => (
          <div
            key={sensor._id}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{sensorIcons[sensor.type]}</span>
                <div>
                  <h4 className="font-medium text-white">{sensor.location.name}</h4>
                  <p className="text-white/60 text-sm capitalize">
                    {sensor.type.replace("_", " ")}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full border ${statusColors[sensor.status]}`}>
                {sensor.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">
                {sensor.currentValue}
                <span className="text-sm text-white/60 ml-1">{sensor.unit}</span>
              </div>
              <div className="text-xs text-white/50">
                Updated {new Date(sensor.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    sensor.status === "critical" ? "bg-accent-orange" :
                    sensor.status === "warning" ? "bg-accent-yellow" : "bg-civic-teal"
                  }`}
                  style={{
                    width: `${Math.min(100, (sensor.currentValue / sensor.threshold.max) * 100)}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>{sensor.threshold.min}</span>
                <span>{sensor.threshold.max}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
