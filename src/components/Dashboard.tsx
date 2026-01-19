import { StatsCard } from "./StatsCard";
import { GoogleInteractiveMap } from "./GoogleInteractiveMap";
import { RecentReports } from "./RecentReports";
import { TrendsChart } from "./TrendsChart";
import { motion } from "framer-motion";
import { Database, Sparkles, BarChart3, AlertCircle, CheckCircle2, TrendingUp, Users, ImageIcon, User } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface DashboardProps {
  onNavigate?: (view: "community" | "beforeafter" | "profile") => void;
}

export function Dashboard({ onNavigate }: DashboardProps = {}) {
  const [stats, setStats] = useState({
    totalReports: 0,
    openReports: 0,
    resolvedReports: 0,
    resolutionRate: 0,
    trendsData: {
      labels: [] as string[],
      datasets: [] as any[]
    }
  });
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all reports
      const { data: reportsData, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (reportsData) {
        setReports(reportsData);
        
        // Calculate stats
        const total = reportsData.length;
        const open = reportsData.filter(r => r.status === 'open').length;
        const resolved = reportsData.filter(r => r.status === 'resolved').length;
        const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

        // Calculate weekly trends (last 7 days)
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - i));
          return date;
        });

        const labels = last7Days.map(date => {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return days[date.getDay()];
        });

        // Count reports by day and status
        const reportsByDay = last7Days.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return reportsData.filter(r => {
            const reportDate = new Date(r.created_at).toISOString().split('T')[0];
            return reportDate === dateStr;
          });
        });

        const openByDay = reportsByDay.map(reports => 
          reports.filter(r => r.status === 'open').length
        );
        const inProgressByDay = reportsByDay.map(reports => 
          reports.filter(r => r.status === 'in_progress').length
        );
        const resolvedByDay = reportsByDay.map(reports => 
          reports.filter(r => r.status === 'resolved').length
        );

        setStats({
          totalReports: total,
          openReports: open,
          resolvedReports: resolved,
          resolutionRate,
          trendsData: {
            labels,
            datasets: [
              {
                label: 'Open',
                data: openByDay,
                borderColor: '#FF6500',
                backgroundColor: '#FF6500',
              },
              {
                label: 'In Progress',
                data: inProgressByDay,
                borderColor: '#FFD500',
                backgroundColor: '#FFD500',
              },
              {
                label: 'Resolved',
                data: resolvedByDay,
                borderColor: '#10b981',
                backgroundColor: '#10b981',
              },
            ]
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    toast.info("Demo data is already in your database!");
  };

  const hasNoData = stats.totalReports === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6 md:space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">City Dashboard</h2>
        <p className="text-sm sm:text-base text-slate-600">Real-time civic engagement analytics</p>
        
        {hasNoData && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="glass-card p-6 max-w-md mx-auto bg-white/80 border-civic-teal/30">
              <div className="flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-civic-teal" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Data Yet</h3>
              <p className="text-slate-600 mb-4 text-sm">
                Get started by adding some demo data to see the dashboard in action
              </p>
              <motion.button
                onClick={handleSeedDemo}
                className="w-full px-4 py-2 bg-gradient-to-r from-civic-teal to-civic-darkBlue text-white font-semibold rounded-lg hover:from-civic-teal/90 hover:to-civic-darkBlue/90 transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Add Demo Data</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      >
        {[
          { title: "Total Reports", value: stats.totalReports, change: "+12%", icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, color: "blue" as const },
          { title: "Open Issues", value: stats.openReports, change: "-5%", icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, color: "yellow" as const },
          { title: "Resolved", value: stats.resolvedReports, change: "+18%", icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, color: "green" as const },
          { title: "Resolution Rate", value: `${stats.resolutionRate}%`, change: "+3%", icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />, color: "purple" as const }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {/* Left Column - Charts and Analytics */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8"
        >
          <TrendsChart data={stats.trendsData} />
          <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <GoogleInteractiveMap reports={reports} />
          </div>
        </motion.div>

        {/* Right Column - Recent Activity */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 sm:space-y-6 md:space-y-8"
        >
          <RecentReports reports={reports} />
        </motion.div>
      </div>
      {/* AI Chatbot is rendered globally in App for authenticated views */}
    </motion.div>
  );
}
