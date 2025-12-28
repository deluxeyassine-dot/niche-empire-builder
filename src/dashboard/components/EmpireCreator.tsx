/**
 * EmpireCreator - React Dashboard Component
 *
 * Beautiful interface for creating new niche empires with integrated generators
 */

import React, { useState, useEffect } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface EmpireConfig {
  niche: string;
  businessName: string;
  targetAudience: string;
  products: {
    enabled: boolean;
    types: ('physical' | 'digital' | 'service')[];
    count: number;
  };
  content: {
    enabled: boolean;
    types: ('blog' | 'social' | 'video' | 'email' | 'ads' | 'landing')[];
  };
  website: {
    enabled: boolean;
    template: 'default' | 'minimal' | 'professional';
  };
  email: {
    enabled: boolean;
    sequences: ('welcome' | 'abandoned-cart' | 'promotional')[];
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

interface GenerationStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress: number;
  message?: string;
}

interface QuickStartTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  niche: string;
  config: Partial<EmpireConfig>;
}

// ============================================================================
// Quick Start Templates
// ============================================================================

const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Complete online store with products, content, and email marketing',
    icon: '🛍️',
    niche: 'Smart Home Products',
    config: {
      products: { enabled: true, types: ['physical', 'digital'], count: 10 },
      content: { enabled: true, types: ['blog', 'social', 'email'] },
      website: { enabled: true, template: 'default' },
      email: { enabled: true, sequences: ['welcome', 'abandoned-cart'] }
    }
  },
  {
    id: 'saas',
    name: 'SaaS Business',
    description: 'Software-as-a-Service with landing pages and email sequences',
    icon: '💻',
    niche: 'Project Management Software',
    config: {
      products: { enabled: true, types: ['digital', 'service'], count: 3 },
      content: { enabled: true, types: ['blog', 'landing', 'email'] },
      website: { enabled: true, template: 'professional' },
      email: { enabled: true, sequences: ['welcome'] }
    }
  },
  {
    id: 'content',
    name: 'Content Business',
    description: 'Content-focused empire with blog, social media, and newsletters',
    icon: '📝',
    niche: 'Health & Fitness',
    config: {
      products: { enabled: true, types: ['digital'], count: 5 },
      content: { enabled: true, types: ['blog', 'social', 'video', 'email'] },
      website: { enabled: true, template: 'minimal' },
      email: { enabled: true, sequences: ['welcome'] }
    }
  },
  {
    id: 'services',
    name: 'Service Business',
    description: 'Service-based business with booking and client communication',
    icon: '🔧',
    niche: 'Home Services',
    config: {
      products: { enabled: true, types: ['service'], count: 5 },
      content: { enabled: true, types: ['landing', 'email'] },
      website: { enabled: true, template: 'professional' },
      email: { enabled: true, sequences: ['welcome'] }
    }
  }
];

// ============================================================================
// Main Component
// ============================================================================

export const EmpireCreator: React.FC = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState<'select' | 'configure' | 'generate' | 'complete'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<QuickStartTemplate | null>(null);
  const [config, setConfig] = useState<EmpireConfig>({
    niche: '',
    businessName: '',
    targetAudience: '',
    products: {
      enabled: true,
      types: ['physical'],
      count: 5
    },
    content: {
      enabled: true,
      types: ['blog', 'social']
    },
    website: {
      enabled: true,
      template: 'default'
    },
    email: {
      enabled: true,
      sequences: ['welcome']
    },
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#f59e0b'
    }
  });

  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  // Quick Start Handler
  const handleQuickStart = (template: QuickStartTemplate) => {
    setSelectedTemplate(template);
    setConfig({
      ...config,
      niche: template.niche,
      businessName: `${template.niche} Empire`,
      targetAudience: 'General consumers',
      ...template.config
    });
    setCurrentStep('configure');
  };

  // Custom Start Handler
  const handleCustomStart = () => {
    setSelectedTemplate(null);
    setCurrentStep('configure');
  };

  // Generate Empire
  const handleGenerate = async () => {
    setCurrentStep('generate');
    setIsGenerating(true);

    // Initialize generation steps
    const steps: GenerationStep[] = [];

    if (config.products.enabled) {
      steps.push({
        id: 'products',
        name: `Generate ${config.products.count} Products`,
        status: 'pending',
        progress: 0
      });
    }

    if (config.content.enabled) {
      config.content.types.forEach(type => {
        steps.push({
          id: `content-${type}`,
          name: `Generate ${type.charAt(0).toUpperCase() + type.slice(1)} Content`,
          status: 'pending',
          progress: 0
        });
      });
    }

    if (config.website.enabled) {
      steps.push({
        id: 'website',
        name: 'Build Website',
        status: 'pending',
        progress: 0
      });
    }

    if (config.email.enabled) {
      steps.push({
        id: 'email',
        name: 'Create Email Campaigns',
        status: 'pending',
        progress: 0
      });
    }

    steps.push({
      id: 'finalize',
      name: 'Finalize & Package',
      status: 'pending',
      progress: 0
    });

    setGenerationSteps(steps);

    // Simulate generation process
    for (let i = 0; i < steps.length; i++) {
      // Update step to in-progress
      setGenerationSteps(prev => prev.map((step, idx) =>
        idx === i ? { ...step, status: 'in-progress' } : step
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setGenerationSteps(prev => prev.map((step, idx) =>
          idx === i ? { ...step, progress } : step
        ));
      }

      // Mark as completed
      setGenerationSteps(prev => prev.map((step, idx) =>
        idx === i ? { ...step, status: 'completed', progress: 100 } : step
      ));
    }

    setIsGenerating(false);
    setGenerationComplete(true);
    setCurrentStep('complete');
  };

  // Reset Handler
  const handleReset = () => {
    setCurrentStep('select');
    setSelectedTemplate(null);
    setGenerationSteps([]);
    setIsGenerating(false);
    setGenerationComplete(false);
  };

  // ============================================================================
  // Render Step: Template Selection
  // ============================================================================

  const renderTemplateSelection = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create Your Niche Empire
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose a quick start template or create your own custom empire from scratch
        </p>
      </div>

      {/* Quick Start Templates */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Start Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUICK_START_TEMPLATES.map(template => (
            <div
              key={template.id}
              onClick={() => handleQuickStart(template)}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className="text-5xl">{template.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {template.niche}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Start */}
      <div className="text-center pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Want full control?
        </h3>
        <button
          onClick={handleCustomStart}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Start from Scratch
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // Render Step: Configuration
  // ============================================================================

  const renderConfiguration = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configure Your Empire</h1>
          <p className="text-gray-600">Customize every aspect of your niche business</p>
        </div>
        <button
          onClick={() => setCurrentStep('select')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niche / Industry *
                </label>
                <input
                  type="text"
                  value={config.niche}
                  onChange={(e) => setConfig({ ...config, niche: e.target.value })}
                  placeholder="e.g., Smart Home Products, Fitness Equipment, Digital Marketing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={config.businessName}
                  onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                  placeholder="e.g., SmartHome Pro, FitLife Elite"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience *
                </label>
                <input
                  type="text"
                  value={config.targetAudience}
                  onChange={(e) => setConfig({ ...config, targetAudience: e.target.value })}
                  placeholder="e.g., Tech-savvy homeowners aged 30-50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.products.enabled}
                  onChange={(e) => setConfig({ ...config, products: { ...config.products, enabled: e.target.checked } })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Enable</span>
              </label>
            </div>

            {config.products.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Types
                  </label>
                  <div className="space-y-2">
                    {['physical', 'digital', 'service'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.products.types.includes(type as any)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...config.products.types, type as any]
                              : config.products.types.filter(t => t !== type);
                            setConfig({ ...config, products: { ...config.products, types } });
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{type} Products</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Products: {config.products.count}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={config.products.count}
                    onChange={(e) => setConfig({ ...config, products: { ...config.products, count: parseInt(e.target.value) } })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>20</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Content Marketing</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.content.enabled}
                  onChange={(e) => setConfig({ ...config, content: { ...config.content, enabled: e.target.checked } })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Enable</span>
              </label>
            </div>

            {config.content.enabled && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'blog', label: 'Blog Posts', icon: '📝' },
                  { id: 'social', label: 'Social Media', icon: '📱' },
                  { id: 'video', label: 'Video Scripts', icon: '🎬' },
                  { id: 'email', label: 'Email Copy', icon: '📧' },
                  { id: 'ads', label: 'Ad Copy', icon: '📢' },
                  { id: 'landing', label: 'Landing Pages', icon: '🚀' }
                ].map(item => (
                  <label
                    key={item.id}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      config.content.types.includes(item.id as any)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={config.content.types.includes(item.id as any)}
                      onChange={(e) => {
                        const types = e.target.checked
                          ? [...config.content.types, item.id as any]
                          : config.content.types.filter(t => t !== item.id);
                        setConfig({ ...config, content: { ...config.content, types } });
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-2xl">{item.icon}</span>
                    <span className="ml-2 text-sm font-medium text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Website */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Website</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.website.enabled}
                  onChange={(e) => setConfig({ ...config, website: { ...config.website, enabled: e.target.checked } })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Enable</span>
              </label>
            </div>

            {config.website.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Template Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'default', label: 'Default', desc: 'Feature-rich' },
                    { id: 'minimal', label: 'Minimal', desc: 'Clean & simple' },
                    { id: 'professional', label: 'Professional', desc: 'Business-focused' }
                  ].map(template => (
                    <label
                      key={template.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                        config.website.template === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="template"
                        checked={config.website.template === template.id}
                        onChange={() => setConfig({ ...config, website: { ...config.website, template: template.id as any } })}
                        className="sr-only"
                      />
                      <div className="font-medium text-gray-900">{template.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.desc}</div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email Marketing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Marketing</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.email.enabled}
                  onChange={(e) => setConfig({ ...config, email: { ...config.email, enabled: e.target.checked } })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Enable</span>
              </label>
            </div>

            {config.email.enabled && (
              <div className="space-y-2">
                {[
                  { id: 'welcome', label: 'Welcome Series', desc: 'Onboard new subscribers' },
                  { id: 'abandoned-cart', label: 'Abandoned Cart', desc: 'Recover lost sales' },
                  { id: 'promotional', label: 'Promotional', desc: 'Sales & offers' }
                ].map(seq => (
                  <label
                    key={seq.id}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      config.email.sequences.includes(seq.id as any)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={config.email.sequences.includes(seq.id as any)}
                      onChange={(e) => {
                        const sequences = e.target.checked
                          ? [...config.email.sequences, seq.id as any]
                          : config.email.sequences.filter(s => s !== seq.id);
                        setConfig({ ...config, email: { ...config.email, sequences } });
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">{seq.label}</div>
                      <div className="text-xs text-gray-500">{seq.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Branding & Summary */}
        <div className="space-y-6">
          {/* Branding */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={config.branding.primaryColor}
                    onChange={(e) => setConfig({ ...config, branding: { ...config.branding, primaryColor: e.target.value } })}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.branding.primaryColor}
                    onChange={(e) => setConfig({ ...config, branding: { ...config.branding, primaryColor: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={config.branding.secondaryColor}
                    onChange={(e) => setConfig({ ...config, branding: { ...config.branding, secondaryColor: e.target.value } })}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.branding.secondaryColor}
                    onChange={(e) => setConfig({ ...config, branding: { ...config.branding, secondaryColor: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={config.branding.accentColor}
                    onChange={(e) => setConfig({ ...config, branding: { ...config.branding, accentColor: e.target.value } })}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.branding.accentColor}
                    onChange={(e) => setConfig({ ...config, branding: { ...config.branding, accentColor: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!config.niche || !config.businessName}
              className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Empire
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // Render Step: Generation Progress
  // ============================================================================

  const renderGeneration = () => (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generating Your Empire</h1>
        <p className="text-gray-600">Please wait while we create your complete niche business...</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="space-y-4">
          {generationSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="flex items-center space-x-4">
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-100' :
                  step.status === 'in-progress' ? 'bg-blue-100 animate-pulse' :
                  step.status === 'error' ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  {step.status === 'completed' && (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {step.status === 'in-progress' && (
                    <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {step.status === 'error' && (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${
                      step.status === 'in-progress' ? 'text-blue-600' :
                      step.status === 'completed' ? 'text-green-600' :
                      'text-gray-700'
                    }`}>
                      {step.name}
                    </h3>
                    {step.status === 'in-progress' && (
                      <span className="text-sm font-medium text-blue-600">{step.progress}%</span>
                    )}
                    {step.status === 'completed' && (
                      <span className="text-sm font-medium text-green-600">Complete</span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {(step.status === 'in-progress' || step.status === 'completed') && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          step.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {step.message && (
                    <p className="text-sm text-gray-500 mt-1">{step.message}</p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < generationSteps.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-8 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">This may take a few minutes</h4>
            <p className="text-sm text-blue-700">
              We're creating {config.products.count} products, generating content, building your website, and setting up email campaigns. Feel free to grab a coffee!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // Render Step: Complete
  // ============================================================================

  const renderComplete = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Empire is Ready! 🎉
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We've successfully generated your complete <strong>{config.businessName}</strong> niche business
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.products.enabled && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{config.products.count}</div>
            <div className="text-sm text-gray-600">
              {config.products.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')} products
            </div>
          </div>
        )}

        {config.content.enabled && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Content</h3>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{config.content.types.length}</div>
            <div className="text-sm text-gray-600">
              Content types generated
            </div>
          </div>
        )}

        {config.email.enabled && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{config.email.sequences.length}</div>
            <div className="text-sm text-gray-600">
              Email sequences ready
            </div>
          </div>
        )}
      </div>

      {/* Generated Files */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Generated Files</h2>

        <div className="space-y-4">
          {/* Products */}
          {config.products.enabled && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Products</h3>
                    <p className="text-sm text-gray-600">{config.products.count} product files • JSON & CSV</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  View Files
                </button>
              </div>
            </div>
          )}

          {/* Website */}
          {config.website.enabled && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Website</h3>
                    <p className="text-sm text-gray-600">Complete {config.website.template} template • HTML, CSS, JS</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  Preview
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {config.content.enabled && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Marketing Content</h3>
                    <p className="text-sm text-gray-600">{config.content.types.length} content types • Ready to publish</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  View Content
                </button>
              </div>
            </div>
          )}

          {/* Email */}
          {config.email.enabled && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Campaigns</h3>
                    <p className="text-sm text-gray-600">{config.email.sequences.length} automated sequences • HTML emails</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  View Emails
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleReset}
          className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Create Another Empire
        </button>
        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
          Download All Files
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {currentStep === 'select' && renderTemplateSelection()}
        {currentStep === 'configure' && renderConfiguration()}
        {currentStep === 'generate' && renderGeneration()}
        {currentStep === 'complete' && renderComplete()}
      </div>
    </div>
  );
};

export default EmpireCreator;
