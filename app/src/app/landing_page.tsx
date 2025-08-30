"use client";
import React from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Sparkles, 
  Zap, 
  Users, 
  Shield,
  ArrowRight,
  Star,
  PlayCircle
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-text-primary bg-dark-primary bg-hero-gradient">
      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-md border-b border-borders-primary/50" style={{
        background: 'rgba(25, 23, 36, 0.5)'
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{
                background: 'linear-gradient(90deg, #A961FF 0%, #7F00FF 100%)'
              }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">Kulikéun</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-text-secondary hover:text-text-primary transition-colors">
                About
              </a>
              <Link 
                href="/chat"
                className="px-6 py-2 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 bg-brand-gradient"
              >
                Get the app
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 backdrop-blur-md" 
                 style={{
                   background: 'rgba(30, 28, 38, 0.75)',
                   borderColor: '#3A3842'
                 }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#A961FF' }}></div>
              <span className="text-sm text-text-secondary">Trusted by 1M+ users worldwide</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-text-primary">Your AI chat</span>
              <br />
              <span 
                className="bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #A961FF 0%, #7F00FF 100%)'
                }}
              >
                assistant awaits
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Chat smarter and get things done faster with your AI-powered assistant. 
              Available for iOS and Android.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/chat"
                className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-3 min-w-[200px] justify-center bg-brand-gradient"
              >
                Get the app
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 rounded-full font-semibold text-text-primary transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-3 min-w-[200px] justify-center backdrop-blur-md border" 
                      style={{
                        background: 'rgba(30, 28, 38, 0.75)',
                        borderColor: '#3A3842'
                      }}>
                <PlayCircle className="w-5 h-5" />
                Watch demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-text-primary mb-2">10K+</div>
                <div className="text-text-secondary">Tasks completed daily</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-text-primary mb-2">5M+</div>
                <div className="text-text-secondary">Downloads & counting</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-text-primary mb-2">4.8</div>
                <div className="text-text-secondary">by thousands users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" 
               style={{ background: '#A961FF' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" 
               style={{ background: '#7F00FF' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Powerful AI capabilities
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Experience the future of AI assistance with our advanced features designed to enhance your productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Text Chat Feature */}
            <div className="p-8 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-105"
                 style={{
                   background: 'rgba(30, 28, 38, 0.75)',
                   borderColor: '#3A3842'
                 }}>
              <div className="p-3 rounded-full w-fit mb-6" style={{ background: '#A961FF20' }}>
                <MessageSquare className="w-8 h-8" style={{ color: '#A961FF' }} />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Smart Conversations</h3>
              <p className="text-text-secondary leading-relaxed">
                Engage in natural, context-aware conversations with our advanced AI that understands nuance and provides intelligent responses.
              </p>
            </div>

            {/* Image Generation Feature */}
            <div className="p-8 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-105"
                 style={{
                   background: 'rgba(30, 28, 38, 0.75)',
                   borderColor: '#3A3842'
                 }}>
              <div className="p-3 rounded-full w-fit mb-6" style={{ background: '#A961FF20' }}>
                <ImageIcon className="w-8 h-8" style={{ color: '#A961FF' }} />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">AI Image Creation</h3>
              <p className="text-text-secondary leading-relaxed">
                Transform your ideas into stunning visuals with our powerful AI image generation capabilities.
              </p>
            </div>

            {/* Fast Responses */}
            <div className="p-8 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-105"
                 style={{
                   background: 'rgba(30, 28, 38, 0.75)',
                   borderColor: '#3A3842'
                 }}>
              <div className="p-3 rounded-full w-fit mb-6" style={{ background: '#A961FF20' }}>
                <Zap className="w-8 h-8" style={{ color: '#A961FF' }} />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Lightning Fast</h3>
              <p className="text-text-secondary leading-relaxed">
                Get instant responses powered by Supabase Edge Functions for optimal performance and reliability.
              </p>
            </div>

            {/* Multi-Platform */}
            <div className="p-8 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-105"
                 style={{
                   background: 'rgba(30, 28, 38, 0.75)',
                   borderColor: '#3A3842'
                 }}>
              <div className="p-3 rounded-full w-fit mb-6" style={{ background: '#A961FF20' }}>
                <Users className="w-8 h-8" style={{ color: '#A961FF' }} />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Cross-Platform</h3>
              <p className="text-text-secondary leading-relaxed">
                Access your AI assistant seamlessly across all your devices with synchronized conversations.
              </p>
            </div>

            {/* Security */}
            <div className="p-8 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-105"
                 style={{
                   background: 'rgba(30, 28, 38, 0.75)',
                   borderColor: '#3A3842'
                 }}>
              <div className="p-3 rounded-full w-fit mb-6" style={{ background: '#A961FF20' }}>
                <Shield className="w-8 h-8" style={{ color: '#A961FF' }} />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Privacy First</h3>
              <p className="text-text-secondary leading-relaxed">
                Your conversations are secure and private, with enterprise-grade encryption and data protection.
              </p>
            </div>

            {/* Productivity */}
            <div className="p-8 rounded-2xl border backdrop-blur-md transition-all duration-200 hover:scale-105"
                 style={{
                   background: 'rgba(30, 28, 38, 0.75)',
                   borderColor: '#3A3842'
                 }}>
              <div className="p-3 rounded-full w-fit mb-6" style={{ background: '#A961FF20' }}>
                <Star className="w-8 h-8" style={{ color: '#A961FF' }} />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary mb-4">Boost Productivity</h3>
              <p className="text-text-secondary leading-relaxed">
                Streamline your workflow with intelligent assistance for writing, coding, analysis, and creative tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Preview */}
      <section className="px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                Experience the future of AI interaction
              </h2>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                Our intuitive interface makes it easy to chat with AI, generate images, and get things done. 
                Whether you're brainstorming ideas or solving complex problems, our assistant is here to help.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" 
                       style={{ background: '#A961FF' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-text-primary">Natural language processing</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" 
                       style={{ background: '#A961FF' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-text-primary">Real-time image generation</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" 
                       style={{ background: '#A961FF' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-text-primary">Streaming responses</span>
                </div>
              </div>
                            <Link
              href="/chat"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 bg-brand-gradient"
            >
              Try it now
              <ArrowRight className="w-5 h-5" />
            </Link>
            </div>
            
            {/* Mock Mobile Screens */}
            <div className="relative">
              <div className="flex justify-center items-center gap-6">
                {/* Phone mockup with chat interface */}
                <div className="relative">
                  <div className="w-80 h-[600px] rounded-[3rem] border-8 p-4" 
                       style={{
                         background: 'rgba(30, 28, 38, 0.75)',
                         borderColor: '#3A3842'
                       }}>
                    {/* Phone Screen Content */}
                    <div className="w-full h-full rounded-[2rem] overflow-hidden" 
                         style={{ background: '#0C0B10' }}>
                      {/* Status Bar */}
                      <div className="flex justify-between items-center px-6 py-3 text-text-primary text-sm">
                        <span>09:41</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-2 bg-text-primary rounded-sm"></div>
                          <div className="w-1 h-2 bg-text-primary rounded-sm"></div>
                          <div className="w-6 h-2 bg-text-primary rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* App Header */}
                      <div className="px-6 py-4 border-b border-borders-primary/30">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full" style={{ background: '#A961FF20' }}>
                            <MessageSquare className="w-5 h-5" style={{ color: '#A961FF' }} />
                          </div>
                          <div>
                            <h3 className="text-text-primary font-semibold">Kulikéun 2.1</h3>
                          </div>
                        </div>
                      </div>
                      
                      {/* Chat Content */}
                      <div className="px-6 py-4 space-y-4">
                        <div className="p-4 rounded-2xl max-w-[85%]" 
                             style={{ background: 'rgba(30, 28, 38, 0.75)' }}>
                          <p className="text-text-primary text-sm">
                            How can I learn english language quickly?
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl max-w-[85%] ml-auto" 
                             style={{ background: '#A961FF20' }}>
                          <p className="text-text-primary text-sm">
                            Learning english requires effective strategies, consistency and motivation. Here are the steps you can try:
                          </p>
                          <div className="mt-3 space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <span style={{ color: '#A961FF' }}>1.</span>
                              <span className="text-text-primary">Set Clear Goals</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span style={{ color: '#A961FF' }}>2.</span>
                              <span className="text-text-primary">Use Active Learning Techniques</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Input Area */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3 p-3 rounded-full border backdrop-blur-md"
                             style={{
                               background: 'rgba(30, 28, 38, 0.75)',
                               borderColor: '#3A3842'
                             }}>
                          <input 
                            className="flex-1 bg-transparent text-text-primary placeholder-text-placeholder text-sm outline-none"
                            placeholder="Type here..."
                            readOnly
                          />
                          <button className="p-2 rounded-full" style={{ background: '#A961FF' }}>
                            <ArrowRight className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl border backdrop-blur-md"
               style={{
                 background: 'rgba(30, 28, 38, 0.75)',
                 borderColor: '#3A3842'
               }}>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Join millions of users who are already experiencing the power of AI assistance. 
              Start your journey today.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-white text-lg transition-all duration-200 hover:scale-105 active:scale-95 bg-brand-gradient"
            >
              Get the app
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-8 py-12 border-t border-borders-primary/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 rounded-full" style={{
                background: 'linear-gradient(90deg, #A961FF 0%, #7F00FF 100%)'
              }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">Kulikéun</span>
            </div>
            <div className="flex items-center gap-8 text-text-secondary">
              <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-text-primary transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-borders-primary/30 text-center">
            <p className="text-text-secondary">
              © 2024 Kulikéun. All rights reserved. Powered by Supabase Edge Functions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}