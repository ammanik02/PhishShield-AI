"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Activity, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface Analytics {
  total_scans: number;
  fraud_prevented: number;
  scans_today: number;
  threat_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  recent_scans: Array<{
    timestamp: string;
    type: string;
    threat_level: string;
    score: number;
  }>;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/analytics`);
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const threatData = [
    { name: "Low", value: analytics.threat_distribution.low, color: "#22c55e" },
    { name: "Medium", value: analytics.threat_distribution.medium, color: "#eab308" },
    { name: "High", value: analytics.threat_distribution.high, color: "#f97316" },
    { name: "Critical", value: analytics.threat_distribution.critical, color: "#ef4444" },
  ];

  const barData = [
    { name: "Low", count: analytics.threat_distribution.low },
    { name: "Medium", count: analytics.threat_distribution.medium },
    { name: "High", count: analytics.threat_distribution.high },
    { name: "Critical", count: analytics.threat_distribution.critical },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 cyber-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold glow-text">PhishShield AI</span>
          </Link>
          
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 glow-text">Analytics Dashboard</h1>
            <p className="text-gray-400 text-lg">Real-time threat intelligence and impact metrics</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Shield,
                label: "Total Scans",
                value: analytics.total_scans.toLocaleString(),
                color: "blue",
              },
              {
                icon: TrendingUp,
                label: "Fraud Prevented",
                value: `₹${(analytics.fraud_prevented / 1000000).toFixed(0)}M`,
                color: "green",
              },
              {
                icon: Activity,
                label: "Scans Today",
                value: analytics.scans_today.toLocaleString(),
                color: "purple",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="glass p-8 rounded-2xl border border-blue-500/20 hover:glow-border transition-all"
              >
                <stat.icon className={`w-12 h-12 text-${stat.color}-500 mb-4`} />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-8 rounded-2xl border border-blue-500/20"
            >
              <h2 className="text-2xl font-bold mb-6">Threat Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={threatData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {threatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-8 rounded-2xl border border-blue-500/20"
            >
              <h2 className="text-2xl font-bold mb-6">Threats by Level</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Recent Scans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-8 rounded-2xl border border-blue-500/20"
          >
            <h2 className="text-2xl font-bold mb-6">Recent Scans</h2>
            <div className="space-y-3">
              {analytics.recent_scans.map((scan, index) => {
                const getThreatColor = (level: string) => {
                  switch (level.toLowerCase()) {
                    case "critical":
                      return "bg-red-500/20 border-red-500/50 text-red-500";
                    case "high":
                      return "bg-orange-500/20 border-orange-500/50 text-orange-500";
                    case "medium":
                      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-500";
                    default:
                      return "bg-green-500/20 border-green-500/50 text-green-500";
                  }
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full border ${getThreatColor(scan.threat_level)}`}>
                        {scan.threat_level}
                      </div>
                      <div>
                        <div className="font-semibold capitalize">{scan.type} Scan</div>
                        <div className="text-sm text-gray-400">
                          {new Date(scan.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{scan.score.toFixed(1)}%</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Real-World Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 glass p-12 rounded-2xl border border-blue-500/20 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Real-World Impact</h2>
            <p className="text-gray-300 text-lg mb-8">
              PhishShield AI is protecting users from cyber fraud every day
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold text-blue-500 mb-2">98.3%</div>
                <div className="text-gray-400">Detection Accuracy</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-green-500 mb-2">&lt;500ms</div>
                <div className="text-gray-400">Average Response Time</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-purple-500 mb-2">24/7</div>
                <div className="text-gray-400">Real-Time Protection</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
