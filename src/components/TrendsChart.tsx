interface TrendsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

interface TrendsChartProps {
  data: TrendsData;
}

export function TrendsChart({ data }: TrendsChartProps) {
  const maxValue = Math.max(...data.datasets.flatMap(d => d.data));

  // Map old colors to new civic palette
  const mapColor = (color: string) => {
    const colorMap: Record<string, string> = {
      '#3b82f6': '#0091B9',  // blue -> teal
      '#ef4444': '#FF6500',  // red -> orange
      '#f59e0b': '#FFD500',  // amber -> yellow
      '#10b981': '#10b981',  // green -> green (keep for resolved)
      '#8b5cf6': '#004F9B',  // violet -> dark blue
    };
    return colorMap[color] || color;
  };

  return (
    <div className="glass-card p-3 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">Weekly Trends</h3>
      
      <div className="relative h-48 sm:h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 pr-2 sm:pr-4">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-6 sm:ml-8 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-t border-civic-teal/20"></div>
            ))}
          </div>
          
          {/* Chart bars */}
          <div className="absolute inset-0 flex items-end justify-between px-1 sm:px-4">
            {data.labels.map((label, index) => (
              <div key={label} className="flex flex-col items-center space-y-1 sm:space-y-2 flex-1 max-w-[60px]">
                <div className="flex space-x-0.5 sm:space-x-1 items-end h-36 sm:h-48">
                  {data.datasets.map((dataset, datasetIndex) => (
                    <div
                      key={dataset.label}
                      className="w-2 sm:w-4 rounded-t transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${(dataset.data[index] / maxValue) * 100}%`,
                        backgroundColor: mapColor(dataset.borderColor),
                      }}
                      title={`${dataset.label}: ${dataset.data[index]}`}
                    ></div>
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs text-slate-600 truncate w-full text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-6 mt-3 sm:mt-4">
        {data.datasets.map((dataset) => (
          <div key={dataset.label} className="flex items-center space-x-1 sm:space-x-2">
            <div
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded"
              style={{ backgroundColor: mapColor(dataset.borderColor) }}
            ></div>
            <span className="text-xs sm:text-sm text-slate-700">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
