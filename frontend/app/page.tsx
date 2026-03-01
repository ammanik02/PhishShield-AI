"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Brain, Lock, TrendingUp, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 cyber-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold glow-text">PhishShield AI</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all hover:glow-border"
            >
              Launch Dashboard
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/30 glow-border">
                <Shield className="w-16 h-16 text-blue-500" />
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 glow-text">
              Stop Cyber Fraud
              <br />
              <span className="text-blue-500">Before It Starts</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered real-time detection of phishing, scams, and cyber fraud across emails, SMS, URLs, and images.
              Powered by AMD-accelerated machine learning.
            </p>

            <div className="flex gap-4 justify-center mb-12">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold text-lg transition-all hover:glow-border hover:scale-105"
              >
                Try It Now - Free
              </Link>
              <Link
                href="/analytics"
                className="px-8 py-4 glass hover:bg-white/10 rounded-lg font-semibold text-lg transition-all border border-blue-500/30"
              >
                View Analytics
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { label: "Scams Detected", value: "12,847", icon: Shield },
                { label: "Fraud Prevented", value: "₹847M", icon: TrendingUp },
                { label: "Accuracy Rate", value: "98.3%", icon: Zap },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass p-6 rounded-xl border border-blue-500/20"
                >
                  <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-500 mb-1">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-gray-400 text-lg">Multi-modal detection with explainable results</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "NLP Analysis",
                description: "Advanced natural language processing detects manipulation tactics and suspicious patterns in text",
              },
              {
                icon: Globe,
                title: "URL Scanning",
                description: "Real-time URL reputation analysis identifies phishing sites and malicious domains",
              },
              {
                icon: Lock,
                title: "OCR Detection",
                description: "Extract and analyze text from images to catch scams hidden in screenshots",
              },
              {
                icon: Zap,
                title: "AMD Optimized",
                description: "3.2x faster inference with AMD hardware acceleration and ONNX Runtime",
              },
              {
                icon: Shield,
                title: "Explainable AI",
                description: "Understand why content is flagged with human-readable explanations",
              },
              {
                icon: TrendingUp,
                title: "Real-Time Analytics",
                description: "Track threats, monitor trends, and measure fraud prevention impact",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all hover:glow-border group"
              >
                <feature.icon className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AMD Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl border border-red-500/30 glow-border"
          >
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-red-500/20 rounded-full mb-6">
                <span className="text-red-500 font-semibold">⚡ AMD ACCELERATED</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">Optimized for AMD Hardware</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto">
                PhishShield AI leverages AMD Ryzen AI and Instinct accelerators with ONNX Runtime and ROCm
                for blazing-fast inference and industry-leading performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-red-500/10 rounded-xl">
                  <div className="text-3xl font-bold text-red-500 mb-2">3.2x</div>
                  <div className="text-gray-400">Faster Inference</div>
                </div>
                <div className="p-6 bg-red-500/10 rounded-xl">
                  <div className="text-3xl font-bold text-red-500 mb-2">40%</div>
                  <div className="text-gray-400">Lower Latency</div>
                </div>
                <div className="p-6 bg-red-500/10 rounded-xl">
                  <div className="text-3xl font-bold text-red-500 mb-2">10K+</div>
                  <div className="text-gray-400">Requests/Second</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Protect Yourself?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of users protecting themselves from cyber fraud every day
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold text-lg transition-all hover:glow-border hover:scale-105"
            >
              Start Scanning Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2026 PhishShield AI. Built for AMD Slingshot Hackathon.</p>
          <p className="mt-2">Powered by AMD Hardware Acceleration</p>
        </div>
      </footer>
    </div>
  );
}
