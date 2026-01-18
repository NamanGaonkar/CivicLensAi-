import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ClipboardList, 
  Filter, 
  UserCheck, 
  Clock, 
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Building2
} from "lucide-react";

import { toast } from "sonner";

export function OfficialDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [assignmentData, setAssignmentData] = useState({
    department: "",
    responseTimeline: "",
    officialComment: ""
  });

  // Placeholder data - replace with actual queries
  const departments = [
    "All Departments",
    "Public Works",
    "Sanitation",
    "Transportation",
    "Parks & Recreation",
    "Utilities",
    "Public Safety"
  ];

  const stats = [
    { label: "Total Reports", value: 156, icon: ClipboardList, color: "text-civic-teal" },
    { label: "Pending", value: 42, icon: AlertCircle, color: "text-accent-orange" },
    { label: "In Progress", value: 38, icon: Clock, color: "text-civic-darkBlue" },
    { label: "Resolved", value: 76, icon: CheckCircle2, color: "text-green-600" }
  ];

  const mockReports = [
    {
      _id: "1",
      description: "Pothole on Main Street",
      location: "Main St & 5th Ave",
      category: "road",
      status: "pending",
      createdAt: Date.now() - 86400000,
      assignedDepartment: null,
      priority: "high"
    },
    {
      _id: "2",
      description: "Broken streetlight",
      location: "Park Avenue",
      category: "streetlight",
      status: "in-progress",
      createdAt: Date.now() - 172800000,
      assignedDepartment: "Public Works",
      responseTimeline: "48 hours",
      priority: "medium"
    }
  ];

  const handleAssignReport = (reportId: string) => {
    if (!assignmentData.department || !assignmentData.responseTimeline) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Report assigned successfully! (Backend integration pending)");
    setSelectedReport(null);
    setAssignmentData({ department: "", responseTimeline: "", officialComment: "" });
  };

  const handleAddComment = (reportId: string) => {
    if (!assignmentData.officialComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    toast.success("Official comment added! (Backend integration pending)");
    setAssignmentData({ ...assignmentData, officialComment: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Official Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage and respond to citizen reports</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-civic-lightBlue/30 border border-civic-teal rounded-xl">
          <Building2 className="w-5 h-5 text-civic-teal" />
          <span className="font-semibold text-civic-darkBlue">Public Works Department</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-12 h-12 ${stat.color} opacity-20`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Department Filter */}
      <div className="glass-card p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-civic-teal" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none text-slate-900"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept.toLowerCase().replace(/ /g, "-")}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {mockReports.map((report, index) => (
          <motion.div
            key={report._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{report.description}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      report.status === "pending"
                        ? "bg-accent-orange/20 text-accent-orange"
                        : report.status === "in-progress"
                        ? "bg-civic-darkBlue/20 text-civic-darkBlue"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {report.status.replace("-", " ").toUpperCase()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      report.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : report.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {report.priority?.toUpperCase() || "NORMAL"}
                  </span>
                </div>
                <p className="text-slate-600 mb-2">{report.location}</p>
                <p className="text-sm text-slate-500">
                  Reported: {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Assignment Section */}
            {selectedReport === report._id ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-slate-200 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assign Department
                    </label>
                    <select
                      value={assignmentData.department}
                      onChange={(e) =>
                        setAssignmentData({ ...assignmentData, department: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none"
                    >
                      <option value="">Select Department</option>
                      {departments.slice(1).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Response Timeline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 48 hours, 5 days"
                      value={assignmentData.responseTimeline}
                      onChange={(e) =>
                        setAssignmentData({ ...assignmentData, responseTimeline: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Official Comment
                  </label>
                  <textarea
                    placeholder="Add an official response or update..."
                    value={assignmentData.officialComment}
                    onChange={(e) =>
                      setAssignmentData({ ...assignmentData, officialComment: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:border-civic-teal focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAssignReport(report._id)}
                    className="px-6 py-2 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-semibold rounded-xl"
                  >
                    Assign & Save
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-200">
                {report.assignedDepartment ? (
                  <>
                    <div className="flex-1 text-sm text-slate-600">
                      <span className="font-semibold">Assigned to:</span> {report.assignedDepartment}
                      {report.responseTimeline && (
                        <span className="ml-4">
                          <span className="font-semibold">Timeline:</span> {report.responseTimeline}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedReport(report._id)}
                      className="px-4 py-2 text-civic-teal font-semibold hover:bg-civic-teal/10 rounded-lg"
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedReport(report._id)}
                    className="flex items-center space-x-2 px-6 py-2 bg-civic-teal text-white font-semibold rounded-xl hover:bg-civic-teal/90"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>Claim & Assign</span>
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
