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
  const rawMax = Math.max(...data.datasets.flatMap(d => d.data));

  // Compute a "nice" maximum for the Y axis (round up to 1,2,5 * power of 10)
  const getNiceMax = (v: number) => {
    if (!isFinite(v) || v <= 0) return 3;
    const pow = Math.pow(10, Math.floor(Math.log10(v)));
    const candidates = [1, 2, 5, 10];
    for (let c of candidates) {
      const n = c * pow;
      if (v <= n) return n;
    }
    return 10 * pow;
  };

  const maxValue = getNiceMax(rawMax);

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
          {(() => {
            const step = Math.max(1, Math.round(maxValue / 4));
            const ticks = [maxValue, step * 3, step * 2, step * 1, 0];
            return ticks.map((t, i) => (
              <span key={i}>{t}</span>
            ));
          })()}
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
              <div key={label} className="flex flex-col items-center space-y-1 sm:space-y-2 flex-1 max-w-[80px]">
                <div className="flex items-end h-36 sm:h-48 w-full justify-center gap-2">
                  {data.datasets.map((dataset, datasetIndex) => {
                    const value = dataset.data[index] ?? 0;
                    const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const minHeight = value > 0 && pct < 6 ? 6 : pct; // ensure tiny values are visible
                    return (
                      <div
                        key={dataset.label}
                        className="rounded-t transition-all duration-500 hover:opacity-80"
                        style={{
                          width: `${Math.max(8, 100 / Math.max(3, data.datasets.length * 3))}%`,
                          height: `${minHeight}%`,
                          backgroundColor: mapColor(dataset.borderColor),
                        }}
                        title={`${dataset.label}: ${value}`}
                      ></div>
                    );
                  })}
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
