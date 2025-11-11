"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface GeneratedDescription {
  id: number;
  productName: string;
  productType?: string;
  targetAudience?: string;
  features?: string;
  tone?: string;
  description: string;
  createdAt: string;
}

interface FormData {
  productName: string;
  productType: string;
  targetAudience: string;
  features: string;
  tone: string;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    productType: "",
    targetAudience: "",
    features: "",
    tone: "Professional and engaging",
  });
  const [descriptions, setDescriptions] = useState<GeneratedDescription[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toneOptions = [
    "Professional and engaging",
    "Casual and friendly",
    "Luxury and premium",
    "Technical and detailed",
    "Fun and playful",
    "Urgent and action-oriented",
  ];

  useEffect(() => {
    if (isLoaded && user) {
      fetchDescriptions();
    }
  }, [isLoaded, user]);

  const fetchDescriptions = async () => {
    try {
      const response = await fetch("/api/descriptions");
      if (response.ok) {
        const data = await response.json();
        setDescriptions(data.descriptions);
      } else {
        setError("Failed to fetch descriptions");
      }
    } catch {
      setError("Failed to fetch descriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newDescription = await response.json();
        setDescriptions([newDescription, ...descriptions]);
        setFormData({
          productName: "",
          productType: "",
          targetAudience: "",
          features: "",
          tone: "Professional and engaging",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to generate description");
      }
    } catch {
      setError("Failed to generate description");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Access Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Deskriptr
              </h1>
              <p className="mt-1 sm:mt-2 text-gray-600 text-sm sm:text-base">
                Generate compelling product descriptions using AI
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.firstName?.charAt(0) ||
                    user.emailAddresses[0]?.emailAddress
                      .charAt(0)
                      .toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Generation Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-0 sm:mr-4 mb-4 sm:mb-0 mx-auto sm:mx-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Generate New Description
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Fill in the details below to create a compelling product
                description
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="productName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Wireless Bluetooth Headphones"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="productType"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Product Type
                </label>
                <input
                  type="text"
                  id="productType"
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Electronics, Clothing, Home & Garden"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="targetAudience"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Target Audience
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Music enthusiasts, Professionals"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tone"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Tone
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                >
                  {toneOptions.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="features"
                className="block text-sm font-semibold text-gray-700"
              >
                Key Features
              </label>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none"
                placeholder="e.g., Noise cancellation, 30-hour battery life, premium sound quality, wireless connectivity, built-in microphone"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <svg
                    className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating || !formData.productName}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating Description...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Description
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Generated Descriptions List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-0 sm:mr-4 mb-4 sm:mb-0 mx-auto sm:mx-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Generated Descriptions
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Your previously generated product descriptions
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">
                Loading descriptions...
              </span>
            </div>
          ) : descriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No descriptions yet
              </h3>
              <p className="text-gray-600">
                Generate your first product description using the form above!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {descriptions.map((desc) => (
                <div
                  key={desc.id}
                  className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {desc.productName}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {(() => {
                          try {
                            const date = new Date(desc.createdAt);
                            if (isNaN(date.getTime())) {
                              return "Invalid Date";
                            }
                            return date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            });
                          } catch (error) {
                            console.error(
                              "Date parsing error:",
                              error,
                              desc.createdAt
                            );
                            return "Invalid Date";
                          }
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    {desc.productType && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Type
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {desc.productType}
                        </p>
                      </div>
                    )}
                    {desc.targetAudience && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Audience
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {desc.targetAudience}
                        </p>
                      </div>
                    )}
                    {desc.tone && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Tone
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {desc.tone}
                        </p>
                      </div>
                    )}
                    {desc.features && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Features
                        </p>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {desc.features}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                        {desc.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
