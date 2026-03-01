"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, Link as LinkIcon, Image, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type InputType = "text" | "url" | "image";

export default function Dashboard() {
  const router = useRouter();
  const [inputType, setInputType] = useState<InputType>("text");
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);

    try {
      let response;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      if (inputType === "text") {
        response = await fetch(`${apiUrl}/api/scan/text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: textContent }),
        });
      } else if (inputType === "url") {
        response = await fetch(`${apiUrl}/api/scan/url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlContent }),
        });
      } else if (inputType === "image" && imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        response = await fetch(`${apiUrl}/api/scan/image`, {
          method: "POST",
          body: formData,
        });
      }

      if (response && response.ok) {
        const result = await response.json();
        // Store result in sessionStorage and navigate
        sessionStorage.setItem("scanResult", JSON.stringify(result));
        router.push("/results");
      } else {
        alert("Scan failed. Please try again.");
      }
    } catch (error) {
      console.error("Scan error:", error);
      alert("Failed to connect to API. Make sure the backend is running.");
    } finally {
      setIsScanning(false);
    }
  };

  const loadExample = async (exampleType: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/demo/examples`);
      const data = await response.json();
      
      if (exampleType === "scam") {
        setInputType("text");
        setTextContent(data.text_examples[0].content);
      } else if (exampleType === "prize") {
        setInputType("text");
        setTextContent(data.text_examples[1].content);
      } else if (exampleType === "safe") {
        setInputType("text");
        setTextContent(data.text_examples[2].content);
      } else if (exampleType === "url") {
        setInputType("url");
        setUrlContent(data.url_examples[0]);
      }
    } catch (error) {
      console.error("Failed to load example:", error);
    }
  };

  const canScan = () => {
    if (inputType === "text") return textContent.trim().length > 0;
    if (inputType === "url") return urlContent.trim().length > 0;
    if (inputType === "image") return imageFile !== null;
    return false;
  };

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
              href="/analytics"
              className="px-4 py-2 glass hover:bg-white/10 rounded-lg transition-all"
            >
              Analytics
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 glow-text">Scan for Threats</h1>
            <p className="text-gray-400 text-lg">
              Analyze emails, SMS, URLs, and images for phishing and scam indicators
            </p>
          </motion.div>

          {/* Input Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-2xl border border-blue-500/20 mb-8"
          >
            <div className="flex gap-4 mb-8">
              {[
                { type: "text" as InputType, icon: FileText, label: "Text / Email" },
                { type: "url" as InputType, icon: LinkIcon, label: "URL" },
                { type: "image" as InputType, icon: Image, label: "Image" },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setInputType(option.type)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    inputType === option.type
                      ? "border-blue-500 bg-blue-500/20 glow-border"
                      : "border-blue-500/20 hover:border-blue-500/50"
                  }`}
                >
                  <option.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">{option.label}</div>
                </button>
              ))}
            </div>

            {/* Input Area */}
            <AnimatePresence mode="wait">
              {inputType === "text" && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste email or SMS content here..."
                    className="w-full h-64 p-4 bg-slate-900/50 border border-blue-500/30 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  />
                </motion.div>
              )}

              {inputType === "url" && (
                <motion.div
                  key="url"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <input
                    type="text"
                    value={urlContent}
                    onChange={(e) => setUrlContent(e.target.value)}
                    placeholder="https://suspicious-website.com"
                    className="w-full p-4 bg-slate-900/50 border border-blue-500/30 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </motion.div>
              )}

              {inputType === "image" && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border-2 border-dashed border-blue-500/30 rounded-xl p-12 text-center hover:border-blue-500/50 transition-all"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Image className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                    {imageFile ? (
                      <div>
                        <p className="text-lg font-semibold mb-2">{imageFile.name}</p>
                        <p className="text-gray-400">Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-semibold mb-2">Upload Screenshot</p>
                        <p className="text-gray-400">Click to select an image</p>
                      </div>
                    )}
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleScan}
                disabled={!canScan() || isScanning}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-lg transition-all hover:glow-border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Scan Now
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Example Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-xl border border-blue-500/20"
          >
            <h3 className="font-semibold mb-4">Try Example Scans:</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => loadExample("scam")}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all"
              >
                Urgent Payment Scam
              </button>
              <button
                onClick={() => loadExample("prize")}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all"
              >
                Prize Winner Scam
              </button>
              <button
                onClick={() => loadExample("safe")}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all"
              >
                Legitimate Message
              </button>
              <button
                onClick={() => loadExample("url")}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all"
              >
                Suspicious URL
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
