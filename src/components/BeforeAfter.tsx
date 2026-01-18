import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";

interface BeforeAfterProps {
  reports?: any[];
}

export function BeforeAfter({ reports = [] }: BeforeAfterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Filter for resolved reports with before/after images
  const resolvedReports = reports.filter(
    (report) => report.status === "resolved" && report.beforeImageUrl && report.afterImageUrl
  );

  if (resolvedReports.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-slate-600">No resolved issues with before/after photos yet.</p>
      </div>
    );
  }

  const currentReport = resolvedReports[currentIndex];

  const nextReport = () => {
    setCurrentIndex((prev) => (prev + 1) % resolvedReports.length);
    setSliderPosition(50);
  };

  const prevReport = () => {
    setCurrentIndex((prev) => (prev - 1 + resolvedReports.length) % resolvedReports.length);
    setSliderPosition(50);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Resolved Issues</h2>
        <div className="flex items-center space-x-2 text-slate-600">
          <span className="font-medium">
            {currentIndex + 1} of {resolvedReports.length}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {/* Image Comparison Slider */}
        <div className="relative h-[500px] overflow-hidden">
          {/* Before Image */}
          <div className="absolute inset-0">
            <img
              src={currentReport.beforeImageUrl}
              alt="Before"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg">
              BEFORE
            </div>
          </div>

          {/* After Image with Clip Path */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={currentReport.afterImageUrl}
              alt="After"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-lg">
              AFTER
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={(e) => {
              const onMouseMove = (moveEvent: MouseEvent) => {
                const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                setSliderPosition(Math.max(0, Math.min(100, newPosition)));
              };

              const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
              };

              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
              <div className="flex space-x-1">
                <ChevronLeft className="w-4 h-4 text-slate-700" />
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Report Details */}
        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">{currentReport.description}</h3>

          <div className="flex items-center space-x-6 text-slate-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{currentReport.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Resolved: {new Date(currentReport.resolvedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {currentReport.officialComment && (
            <div className="bg-civic-lightBlue/20 border-l-4 border-civic-teal p-4 rounded">
              <p className="text-sm font-semibold text-civic-darkBlue mb-1">Official Response:</p>
              <p className="text-slate-700">{currentReport.officialComment}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between p-4 border-t border-slate-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevReport}
            disabled={resolvedReports.length <= 1}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextReport}
            disabled={resolvedReports.length <= 1}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
