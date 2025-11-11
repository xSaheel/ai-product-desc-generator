"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md backdrop-saturate-150 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Deskriptr
                </span>
                <span>🤖</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base flex items-center"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base flex items-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 px-4 leading-tight">
            Generate Compelling Product Descriptions
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              with AI
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4 leading-relaxed">
            Create professional, SEO-optimized product descriptions in seconds.
            <br />
            Save time and boost sales with AI-powered copy that converts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Link
              href="/sign-up"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Start Generating Now
            </Link>
            <Link
              href="/sign-in"
              className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 px-4">
            <div className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:border-blue-200 transition-all duration-300 ease-out cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                Lightning Fast
              </h3>
              <p className="text-gray-600 text-sm sm:text-base group-hover:text-gray-700 transition-colors duration-300">
                Generate professional product descriptions in seconds, not
                hours.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 hover:border-green-200 transition-all duration-300 ease-out cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                SEO Optimized
              </h3>
              <p className="text-gray-600 text-sm sm:text-base group-hover:text-gray-700 transition-colors duration-300">
                AI-generated content that ranks well and converts visitors to
                customers.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 md:col-span-2 lg:col-span-1 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 hover:border-purple-200 transition-all duration-300 ease-out cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                Customizable
              </h3>
              <p className="text-gray-600 text-sm sm:text-base group-hover:text-gray-700 transition-colors duration-300">
                Choose your tone, target audience, and style to match your
                brand.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Developer Info */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 mb-1">
                Built with ❤️ by{" "}
                <span className="font-semibold text-gray-900">Saheel Das</span>
              </p>
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Deskriptr. All rights reserved.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/xSaheel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/saheeldas21/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="mailto:saheeldas75@gmail.com"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                aria-label="Email"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
