"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ScanResult {
  scan_id: string;
  timestamp: string;
  input_type: string;
  scam_probability: number;
  threat_level: string;
  confidence: number;
  explanation: string;
  suspicious_elements: string[];
  recommendations: string[];
  amd_optimized: boolean;
}

export default function Results() {
  const router = useRouter();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  // Typing effect for explanation
  useEffect(() => {
    if (result && result.explanation) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= result.explanation.length) {
          setTypedText(result.explanation.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  const getThreatColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "text-red-500 border-red-500 bg-red-500/20";
      case "high":
        return "text-orange-500 border-orange-500 bg-orange-500/20";
      case "medium":
        return "text-yellow-500 border-yellow-500 bg-yellow-500/20";
      default:
        return "text-green-500 border-green-500 bg-green-500/20";
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
      case "high":
        return XCircle;
      case "medium":
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  const ThreatIcon = getThreatIcon(result.threat_level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 cyber-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold glow-text">PhishShield AI</span>
          </Link>
          
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            New Scan
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 glow-text">Scan Results</h1>
            <p className="text-gray-400">
              Analyzed {result.input_type} • {new Date(result.timestamp).toLocaleString()}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Score & Threat */}
            <div className="lg:col-span-1 space-y-6">
              {/* Threat Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass p-8 rounded-2xl border border-blue-500/20 text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="rgba(59, 130, 246, 0.2)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke={
                        result.scam_probability >= 75
                          ? "#ef4444"
                          : result.scam_probability >= 50
                          ? "#f97316"
                          : result.scam_probability >= 25
                          ? "#eab308"
                          : "#22c55e"
                      }
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 552" }}
                      animate={{
                        strokeDasharray: `${(result.scam_probability / 100) * 552} 552`,
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold">{result.scam_probability}%</div>
                    <div className="text-gray-400">Risk Score</div>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${getThreatColor(
                    result.threat_level
                  )}`}
                >
                  <ThreatIcon className="w-6 h-6" />
                  <span className="font-bold text-lg">{result.threat_level} Threat</span>
                </div>

                <div className="mt-6 pt-6 border-t border-blue-500/20">
                  <div className="text-sm text-gray-400 mb-2">Confidence</div>
                  <div className="text-2xl font-bold">{(result.confidence * 100).toFixed(0)}%</div>
                </div>
              </motion.div>

              {/* AMD Badge */}
              {result.amd_optimized && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-6 rounded-xl border border-red-500/30 text-center"
                >
                  <div className="text-red-500 font-bold mb-2">⚡ AMD ACCELERATED</div>
                  <div className="text-sm text-gray-400">
                    Processed with AMD-optimized AI inference
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-8 rounded-2xl border border-blue-500/20"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-500" />
                  AI Analysis
                </h2>
                <p className="text-gray-300 leading-relaxed">{typedText}</p>
              </motion.div>

              {/* Suspicious Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-8 rounded-2xl border border-blue-500/20"
              >
                <h2 className="text-2xl font-bold mb-4">Detected Indicators</h2>
                <div className="space-y-3">
                  {result.suspicious_elements.map((element, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-blue-500/20"
                    >
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{element}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass p-8 rounded-2xl border border-blue-500/20"
              >
                <h2 className="text-2xl font-bold mb-4">Recommended Actions</h2>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-blue-500/20"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-500 text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-300">{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4"
              >
                <Link
                  href="/dashboard"
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-center transition-all hover:glow-border"
                >
                  Scan Another
                </Link>
                <button className="px-6 py-4 glass hover:bg-white/10 rounded-xl font-semibold transition-all flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Report
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
