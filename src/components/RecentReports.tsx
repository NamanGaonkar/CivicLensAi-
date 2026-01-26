import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Tag } from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  upvotes: number;
  created_at: string;
  image_url?: string | null;
  address?: string;
  city?: string;
  state?: string;
}

interface RecentReportsProps {
  reports: Report[];
}

export function RecentReports({ reports }: RecentReportsProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const priorityColors = {
    critical: "bg-accent-orange/20 text-accent-orange border-accent-orange/30",
    high: "bg-accent-orange/20 text-orange-500 border-orange-500/30",
    medium: "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30",
    low: "bg-civic-lightBlue/30 text-civic-teal border-civic-teal/30",
  };

  const statusColors = {
    open: "bg-accent-orange/20 text-accent-orange",
    in_progress: "bg-accent-yellow/20 text-accent-yellow",
    resolved: "bg-civic-teal/20 text-civic-teal",
    closed: "bg-gray-500/20 text-gray-400",
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Reports</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {reports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className="p-4 bg-white rounded-lg border border-civic-teal/20 hover:border-civic-teal/40 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-slate-900 truncate flex-1 mr-2">
                {report.title}
              </h4>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full border ${priorityColors[report.priority]}`}>
                  {report.priority}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[report.status]}`}>
                  {report.status.replace("_", " ")}
                </span>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm mb-3">{report.category}</p>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{new Date(report.created_at).toLocaleDateString()}</span>
              <div className="flex items-center space-x-1">
                <span>👍</span>
                <span>{report.upvotes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for full report details */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {selectedReport.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-xs rounded-full border ${priorityColors[selectedReport.priority]}`}>
                      {selectedReport.priority}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full ${statusColors[selectedReport.status]}`}>
                      {selectedReport.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Image */}
              {selectedReport.image_url && (
                <div className="w-full">
                  <img
                    src={selectedReport.image_url}
                    alt={selectedReport.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Tag className="w-5 h-5 text-civic-teal mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Category</p>
                      <p className="text-slate-600">{selectedReport.category}</p>
                    </div>
                  </div>

                  {selectedReport.department && (
                    <div className="flex items-start space-x-3">
                      <Tag className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Department</p>
                        <p className="text-slate-600">{selectedReport.department}</p>
                      </div>
                    </div>
                  )}

                  {selectedReport.priority && (
                    <div className="flex items-start space-x-3">
                      <Tag className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Priority</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          selectedReport.priority === 'high' ? 'bg-red-100 text-red-700' :
                          selectedReport.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {selectedReport.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-civic-teal mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Reported On</p>
                      <p className="text-slate-600">
                        {new Date(selectedReport.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {selectedReport.address && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-civic-teal mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Location</p>
                        <p className="text-slate-600">
                          {selectedReport.address}
                          {selectedReport.city && `, ${selectedReport.city}`}
                          {selectedReport.state && `, ${selectedReport.state}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upvotes */}
                <div className="flex items-center space-x-2 text-slate-600">
                  <span className="text-2xl">👍</span>
                  <span className="font-semibold">{selectedReport.upvotes} upvotes</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
