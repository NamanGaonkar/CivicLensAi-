import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { 
  ClipboardList, 
  Filter, 
  UserCheck, 
  Clock, 
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Building2,
  LogOut,
  Search,
  MapPin,
  Calendar,
  Send,
  X,
  FileText
} from "lucide-react";

import { toast } from "sonner";

interface OfficialDashboardProps {
  onLogout: () => void;
  userEmail: string;
}

interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  location: string;
  created: string;
  userName: string;
  responses: Response[];
}

interface Response {
  id: number;
  responderName: string;
  text: string;
  statusUpdate?: string;
  created: string;
}

export function OfficialDashboard({ onLogout, userEmail }: OfficialDashboardProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [responseText, setResponseText] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch real data from Supabase
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // First fetch all reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      console.log('Official Dashboard - Fetched reports:', reportsData);

      // Fetch user info and responses for each report
      const reportsWithResponses = await Promise.all(
        (reportsData || []).map(async (report) => {
          // Get user info
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', report.user_id)
            .single();

          // Get responses
          const { data: responses } = await supabase
            .from('report_responses')
            .select('*')
            .eq('report_id', report.id)
            .order('created_at', { ascending: false });

          return {
            id: report.id,
            title: report.title,
            description: report.description,
            category: report.category,
            status: report.status,
            priority: report.priority || 'medium',
            location: report.location,
            created: new Date(report.created_at).toLocaleDateString(),
            userName: userData?.full_name || 'Unknown User',
            responses: (responses || []).map(r => ({
              id: r.id,
              responderName: r.responder_name,
              text: r.response_text,
              statusUpdate: r.status_update,
              created: new Date(r.created_at).toLocaleDateString()
            }))
          };
        })
      );

      setReports(reportsWithResponses);
      console.log('Official Dashboard - Reports loaded successfully:', reportsWithResponses);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    }
  };

  const handleSubmitResponse = async () => {
    if (!selectedReport || !responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    console.log('Submitting response for report:', selectedReport.id);
    console.log('Response text:', responseText);
    console.log('Status update:', statusUpdate);
    console.log('User email:', userEmail);

    try {
      // Insert response into database
      const { data: responseData, error: responseError } = await supabase
        .from('report_responses')
        .insert({
          report_id: String(selectedReport.id),
          responder_email: userEmail,
          responder_name: 'Official',
          response_text: responseText,
          status_update: statusUpdate || null
        })
        .select();

      if (responseError) {
        console.error('Response insert error:', responseError);
        throw responseError;
      }
      
      console.log('Response inserted successfully:', responseData);

      // Update report status if status was changed
      if (statusUpdate) {
        console.log('Updating report status to:', statusUpdate, 'for report ID:', selectedReport.id);
        
        // Use RPC function to bypass RLS
        const { data: updateData, error: updateError } = await supabase
          .rpc('update_report_status', {
            report_uuid: String(selectedReport.id),
            new_status: statusUpdate
          });

        if (updateError) {
          console.error('Status update error:', updateError);
          throw updateError;
        }
        
        console.log('Status updated successfully via RPC');
      } else {
        console.log('No status update selected, keeping current status');
      }

      toast.success('Response submitted successfully');
      setResponseText('');
      setStatusUpdate('');
      setSelectedReport(null);
      fetchReports(); // Refresh the reports list
    } catch (error: any) {
      console.error('Error submitting response:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      toast.error(`Failed to submit response: ${error.message || 'Unknown error'}`);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: "Total Reports", value: reports.length, icon: FileText, color: "text-blue-600" },
    { label: "Open Issues", value: reports.filter(r => r.status === "open").length, icon: AlertCircle, color: "text-red-600" },
    { label: "In Progress", value: reports.filter(r => r.status === "in_progress").length, icon: Clock, color: "text-orange-600" },
    { label: "Resolved", value: reports.filter(r => r.status === "resolved").length, icon: CheckCircle2, color: "text-green-600" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Official Dashboard</h1>
              <p className="text-white/80 text-sm">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${
                  stat.label === "Total Reports" ? "from-blue-500 to-blue-600" :
                  stat.label === "Open Issues" ? "from-red-500 to-red-600" :
                  stat.label === "In Progress" ? "from-orange-500 to-orange-600" :
                  "from-green-500 to-green-600"
                } rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports List */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Citizen Reports</h2>
              
              {/* Search and Filter */}
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-civic-teal focus:ring-2 focus:ring-civic-teal/20 outline-none text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:border-civic-teal outline-none text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedReport?.id === report.id
                      ? "border-civic-teal bg-civic-lightBlue/10"
                      : "border-slate-200 hover:border-civic-teal/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 flex-1">{report.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      report.status === "resolved" ? "bg-green-100 text-green-700" :
                      report.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">{report.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {report.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.created}
                    </span>
                    {report.responses.length > 0 && (
                      <span className="flex items-center gap-1 text-civic-teal">
                        <MessageSquare className="w-3 h-3" />
                        {report.responses.length}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Report Details & Response Form */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            {selectedReport ? (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Report Details</h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Report Info */}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">{selectedReport.title}</h3>
                  <p className="text-sm text-slate-700 mb-3">{selectedReport.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Category:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedReport.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Priority:</span>
                      <span className={`ml-2 font-medium ${
                        selectedReport.priority === "high" ? "text-red-600" :
                        selectedReport.priority === "medium" ? "text-orange-600" :
                        "text-yellow-600"
                      }`}>{selectedReport.priority}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Reported by:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedReport.userName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Date:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedReport.created}</span>
                    </div>
                  </div>
                </div>

                {/* Previous Responses */}
                {selectedReport.responses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-3">Responses</h3>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto">
                      {selectedReport.responses.map((response) => (
                        <div key={response.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-blue-900">{response.responderName}</span>
                            <span className="text-xs text-blue-600">{response.created}</span>
                          </div>
                          <p className="text-sm text-blue-800 mb-1">{response.text}</p>
                          {response.statusUpdate && (
                            <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-900 rounded-full">
                              Status updated to: {response.statusUpdate}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response Form */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Add Response</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Response
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Enter your response to the citizen..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-civic-teal focus:ring-2 focus:ring-civic-teal/20 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Update Status (Optional)
                    </label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-civic-teal focus:ring-2 focus:ring-civic-teal/20 outline-none"
                    >
                      <option value="">Keep current status</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim()}
                    className="w-full bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Response
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a report to view details and respond</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
