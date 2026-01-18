import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, XCircle, MapPin } from "lucide-react";

interface StatusTrackerProps {
  userReports?: any[];
}

export function StatusTracker({ userReports = [] }: StatusTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-civic-darkBlue" />;
      case "rejected":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-accent-orange" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700 border-green-300";
      case "in-progress":
        return "bg-civic-lightBlue text-civic-darkBlue border-civic-teal";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-orange-100 text-accent-orange border-accent-orange";
    }
  };

  const getTimeline = (report: any) => {
    const created = new Date(report.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      created: created.toLocaleDateString(),
      updated: report.updatedAt ? new Date(report.updatedAt).toLocaleDateString() : "N/A",
      resolved: report.resolvedAt ? new Date(report.resolvedAt).toLocaleDateString() : "N/A",
      daysElapsed: diffDays
    };
  };

  if (userReports.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">You haven't filed any reports yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">My Reports Status</h2>

      <div className="space-y-4">
        {userReports.map((report, index) => {
          const timeline = getTimeline(report);
          
          return (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">{getStatusIcon(report.status)}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{report.description}</h3>
                    <div className="flex items-center space-x-2 text-slate-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{report.location}</span>
                    </div>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status.replace("-", " ").toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Created</p>
                  <p className="text-sm font-medium text-slate-900">{timeline.created}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Last Updated</p>
                  <p className="text-sm font-medium text-slate-900">{timeline.updated}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    {report.status === "resolved" ? "Resolved" : "Days Elapsed"}
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {report.status === "resolved" ? timeline.resolved : `${timeline.daysElapsed} days`}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-600 mb-2">
                  <span>Submitted</span>
                  <span>In Progress</span>
                  <span>Resolved</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        report.status === "resolved"
                          ? "100%"
                          : report.status === "in-progress"
                          ? "50%"
                          : "25%"
                    }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full ${
                      report.status === "resolved"
                        ? "bg-green-500"
                        : report.status === "in-progress"
                        ? "bg-civic-teal"
                        : "bg-accent-orange"
                    }`}
                  />
                </div>
              </div>

              {/* Official Response */}
              {report.officialComment && (
                <div className="bg-civic-lightBlue/20 border-l-4 border-civic-teal p-4 rounded">
                  <p className="text-sm font-semibold text-civic-darkBlue mb-1">Official Update:</p>
                  <p className="text-slate-700">{report.officialComment}</p>
                  {report.assignedDepartment && (
                    <p className="text-xs text-slate-600 mt-2">
                      Assigned to: {report.assignedDepartment}
                    </p>
                  )}
                </div>
              )}

              {/* Response Timeline */}
              {report.responseTimeline && report.status !== "resolved" && (
                <div className="mt-4 flex items-center justify-between p-3 bg-accent-yellow/20 border border-accent-yellow/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-accent-orange" />
                    <span className="text-sm font-medium text-slate-900">
                      Expected resolution: {report.responseTimeline}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
