import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle, XCircle, MapPin } from "lucide-react";

interface StatusTrackerProps {
  userReports?: any[];
}

export function StatusTracker({ userReports = [] }: StatusTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case "in_progress":
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
      case "closed":
        return "bg-green-100 text-green-700 border-green-300";
      case "in_progress":
      case "in-progress":
        return "bg-civic-lightBlue text-civic-darkBlue border-civic-teal";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-orange-100 text-accent-orange border-accent-orange";
    }
  };

  const getTimeline = (report: any) => {
    const created = new Date(report.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      created: created.toLocaleDateString(),
      updated: report.updated_at ? new Date(report.updated_at).toLocaleDateString() : "N/A",
      resolved: report.resolved_at ? new Date(report.resolved_at).toLocaleDateString() : "N/A",
      daysElapsed: diffDays
    };
  };

  if (userReports.length === 0) {
    return (
      <div className="glass-card p-6 sm:p-8 md:p-12 text-center mx-3 sm:mx-0">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-sm sm:text-base text-slate-600">You haven't filed any reports yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-3 md:px-0 pb-20 md:pb-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">My Reports Status</h2>

      <div className="space-y-3 sm:space-y-4">
        {userReports.map((report, index) => {
          const timeline = getTimeline(report);
          const location = report.address || `${report.area}, ${report.city}` || "Location not specified";
          
          console.log('Report status for', report.title, ':', report.status);
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">{getStatusIcon(report.status)}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{report.title}</h3>
                    <p className="text-slate-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-2 text-slate-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{location}</span>
                    </div>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status.replace(/_/g, " ").replace(/-/g, " ").toUpperCase()}
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
                        report.status === "resolved" || report.status === "closed"
                          ? "100%"
                          : report.status === "in_progress" || report.status === "in-progress"
                          ? "50%"
                          : "25%"
                    }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full ${
                      report.status === "resolved" || report.status === "closed"
                        ? "bg-green-500"
                        : report.status === "in_progress" || report.status === "in-progress"
                        ? "bg-civic-teal"
                        : "bg-accent-orange"
                    }`}
                  />
                </div>
              </div>

              {/* Official Responses */}
              {report.responses && report.responses.length > 0 && (
                <div className="space-y-3 mt-4">
                  <p className="text-sm font-semibold text-civic-darkBlue">Official Updates:</p>
                  {report.responses.map((response: any, idx: number) => (
                    <div key={idx} className="bg-civic-lightBlue/20 border-l-4 border-civic-teal p-4 rounded">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-civic-darkBlue">
                          {response.responder_name || 'Official'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(response.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <p className="text-slate-700 mb-2">{response.response_text}</p>
                      {response.status_update && (
                        <div className="inline-flex items-center px-2 py-1 bg-civic-teal/20 text-civic-teal rounded text-xs font-medium">
                          Status changed to: {response.status_update.replace('_', ' ').toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
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
