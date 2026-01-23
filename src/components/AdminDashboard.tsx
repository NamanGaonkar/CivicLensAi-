import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import {
  Shield,
  Users,
  FileText,
  Settings,
  BarChart3,
  UserCog,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports" | "settings">("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch real data from Supabase
  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched users from database:', data);
      
      setUsers(data?.map(u => ({
        id: u.id,
        name: u.full_name || 'Unknown',
        email: u.email,
        role: u.role || 'citizen',
        status: 'active'
      })) || []);
      
      console.log('Users state updated');
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchReports = async () => {
    try {
      // First fetch all reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;
      
      console.log('Fetched reports from database:', reportsData);
      
      // Then fetch user info for each report
      const reportsWithUsers = await Promise.all(
        (reportsData || []).map(async (report) => {
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', report.user_id)
            .single();
          
          return {
            id: report.id,
            title: report.title,
            description: report.description,
            category: report.category,
            status: report.status,
            priority: report.priority || 'medium',
            location: report.location,
            image_url: report.image_url,
            userName: userData?.full_name || 'Unknown',
            userEmail: userData?.email || '',
            created: new Date(report.created_at).toLocaleDateString()
          };
        })
      );
      
      setReports(reportsWithUsers);
      console.log('Reports state updated:', reportsWithUsers);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    }
  };

  const stats = [
    { label: "Total Users", value: users.length.toString(), icon: Users, color: "from-blue-500 to-blue-600", change: "+12%" },
    { label: "Total Reports", value: reports.length.toString(), icon: FileText, color: "from-purple-500 to-purple-600", change: "+8%" },
    { label: "Active Officials", value: users.filter(u => u.role === 'official' || u.role === 'admin').length.toString(), icon: UserCog, color: "from-civic-teal to-civic-darkBlue", change: "+3%" },
    { label: "Resolution Rate", value: reports.length > 0 ? Math.round((reports.filter(r => r.status === 'resolved').length / reports.length) * 100) + '%' : '0%', icon: TrendingUp, color: "from-green-500 to-green-600", change: "+5%" },
  ];

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleStatusChange = (userId: number, newStatus: string) => {
    // API call to update user status
    console.log(`Updating user ${userId} status to: ${newStatus}`);
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-white/80 text-sm">Full system control & management</p>
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
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 mb-6">
          <div className="border-b border-slate-200 px-6">
            <div className="flex gap-6">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "users", label: "User Management", icon: Users },
                { id: "reports", label: "Reports", icon: FileText },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">System Overview</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Recent Activity</h3>
                    <p className="text-sm text-blue-700">23 new reports in the last 24 hours</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">System Health</h3>
                    <p className="text-sm text-green-700">All systems operational</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === "users" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">User Management</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {users.filter(u => 
                        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-900">{user.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:border-red-500 outline-none"
                            >
                              <option value="citizen">Citizen</option>
                              <option value="official">Official</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={user.status}
                              onChange={(e) => handleStatusChange(user.id, e.target.value)}
                              className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:border-red-500 outline-none"
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                              <option value="banned">Banned</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">All Reports</h2>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="p-4 border border-slate-200 rounded-lg hover:border-red-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{report.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>Created: {report.created}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              report.priority === "high" ? "bg-red-100 text-red-700" :
                              report.priority === "medium" ? "bg-orange-100 text-orange-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {report.priority}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              report.status === "resolved" ? "bg-green-100 text-green-700" :
                              report.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              {report.status === 'in_progress' ? 'IN PROGRESS' : report.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report Details Modal */}
            {selectedReport && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="sticky top-0 bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Report Details</h2>
                      <button
                        onClick={() => setSelectedReport(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 mb-1">Title</h3>
                      <p className="text-lg font-semibold text-slate-900">{selectedReport.title}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 mb-1">Description</h3>
                      <p className="text-slate-700">{selectedReport.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Category</h3>
                        <p className="text-slate-900">{selectedReport.category}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Location</h3>
                        <p className="text-slate-900">{selectedReport.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Status</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          selectedReport.status === "resolved" ? "bg-green-100 text-green-700" :
                          selectedReport.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {selectedReport.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Priority</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          selectedReport.priority === "high" ? "bg-red-100 text-red-700" :
                          selectedReport.priority === "medium" ? "bg-orange-100 text-orange-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {selectedReport.priority.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Submitted By</h3>
                        <p className="text-slate-900">{selectedReport.userName}</p>
                        <p className="text-sm text-slate-500">{selectedReport.userEmail}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-1">Date</h3>
                        <p className="text-slate-900">{selectedReport.created}</p>
                      </div>
                    </div>

                    {/* Image */}
                    {selectedReport.image_url && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">Image</h3>
                        <img
                          src={selectedReport.image_url}
                          alt="Report"
                          className="w-full rounded-lg border border-slate-200"
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setSelectedReport(null)}
                        className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">System Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Notifications</h3>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-slate-700">Email notifications for new reports</span>
                    </label>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Security</h3>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-slate-700">Two-factor authentication required</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
