import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, BarChart3, Zap, Shield, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CheckCircle size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            TeamFlow
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
          <Zap size={14} className="text-indigo-400" />
          <span className="text-indigo-400 text-sm font-medium">Built for modern development teams</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Manage Your Team's Work{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            with Clarity
          </span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          TeamFlow brings your projects, tasks, and team together in one place. 
          Track progress, assign work, and ship faster with powerful collaboration tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 text-base"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 text-base"
          >
            View Demo
          </Link>
        </div>

        {/* Demo credentials hint */}
        <p className="text-slate-500 text-sm mt-6">
          Demo: <code className="text-indigo-400">admin@demo.com</code> / <code className="text-indigo-400">password123</code>
        </p>
      </section>

      {/* Feature grid */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything your team needs
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A complete platform to manage projects, track tasks, and collaborate seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <BarChart3 size={24} className="text-indigo-400" />,
              title: 'Real-time Dashboard',
              desc: 'Get an instant overview of all projects, tasks, completion rates, and overdue items with beautiful analytics.',
              color: 'indigo',
            },
            {
              icon: <Users size={24} className="text-emerald-400" />,
              title: 'Team Collaboration',
              desc: 'Invite members to projects, assign tasks, and manage roles with fine-grained permissions for admins and members.',
              color: 'emerald',
            },
            {
              icon: <Shield size={24} className="text-amber-400" />,
              title: 'Role-Based Access',
              desc: 'Admin and Member roles ensure the right people have the right access. Secure, reliable, and auditable.',
              color: 'amber',
            },
            {
              icon: <CheckCircle size={24} className="text-purple-400" />,
              title: 'Kanban Board',
              desc: 'Drag and drop tasks across Todo, In Progress, Review, and Completed columns for intuitive workflow management.',
              color: 'purple',
            },
            {
              icon: <Zap size={24} className="text-rose-400" />,
              title: 'Priority Tracking',
              desc: 'Assign Low, Medium, or High priority to tasks. Get notified of overdue items and upcoming deadlines.',
              color: 'rose',
            },
            {
              icon: <Globe size={24} className="text-sky-400" />,
              title: 'Deploy Anywhere',
              desc: 'Production-ready with Railway deployment support. PostgreSQL backed, JWT secured, and enterprise-grade.',
              color: 'sky',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Get started in minutes</h2>
          <p className="text-slate-400 text-lg">Three steps to streamlined team collaboration</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create your account', desc: 'Sign up and become an Admin. Your account gives you full control over projects and team members.' },
            { step: '02', title: 'Set up a project', desc: 'Create projects, add team members, and define roles. Admins manage, members collaborate.' },
            { step: '03', title: 'Assign & track tasks', desc: 'Create tasks with priorities and due dates, assign them to members, and track progress on the Kanban board.' },
          ].map((step, idx) => (
            <div key={idx} className="relative text-center">
              <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-400 font-bold text-xl">{step.step}</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-indigo-900/50 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to ship faster?</h2>
          <p className="text-slate-300 mb-8">Join teams who manage their work with TeamFlow.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30"
          >
            Start for Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <CheckCircle size={13} className="text-white" />
            </div>
            <span className="text-slate-400 text-sm font-medium">TeamFlow</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} TeamFlow. Built with React & Node.js.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
