'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroStarfield } from '@/components/home/ui/hero-starfield';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

export default function FreelancePage() {
  return (
    <div className="min-h-screen bg-black text-[#EDEDED] font-sans selection:bg-white/30 overflow-x-hidden relative">
      
      {/* Space Environment */}
      <div className="fixed inset-0 pointer-events-none">
        <HeroStarfield showMeteors={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-black/50 backdrop-blur-md">
        <Link href="/" className="text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors flex items-center gap-2">
          ← Back to Orbit
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-emerald-500">Currently Available</span>
          </div>
          <a 
            href="mailto:ankit1pandey11@gmail.com" 
            className="px-5 py-2 rounded-full bg-white text-black text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Contact
          </a>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 md:pt-40">
        
        {/* Header */}
        <motion.header 
          className="mb-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="md:hidden flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-emerald-500">Currently Available</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Freelance Software Engineer
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed font-light">
            I build full-stack SaaS applications, bespoke e-commerce platforms, and internal tools. Focused on Next.js, TypeScript, and PostgreSQL.
          </motion.p>
        </motion.header>

        {/* Stats Grid */}
        <motion.section 
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] border border-white/[0.05] rounded-[2rem] overflow-hidden mb-24 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-sm pointer-events-none" />
          <StatBlock value="05+" label="Client Projects" />
          <StatBlock value="02" label="SaaS Built" />
          <StatBlock value="2026" label="Started Active" />
          <StatBlock value="05+" label="Happy Clients" />
        </motion.section>

        {/* Projects */}
        <section className="mb-24">
          <motion.h2 
            className="text-[11px] md:text-xs font-sans font-semibold tracking-widest uppercase text-white/50 mb-8 flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            Selected Work
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </motion.h2>
          
          <div className="flex flex-col gap-6 relative">
            <ProjectRow 
              index={0}
              title="Cue Junction & Darshan Cafe"
              type="Unified Management System"
              description="A full-stack SaaS managing operations for a billiards club and cafe. Features robust billing, real-time table tracking, and analytical reporting hardcoded to IST. Engineered for absolute stability and zero-latency local operations."
              tags={['Next.js 16', 'React 19', 'Turbopack', 'PostgreSQL', 'Prisma 5', 'Better Auth', 'Tailwind 4', 'PWA']}
            />
            
            <ProjectRow 
              index={1}
              title="Aesthetic Beauty & Hair"
              type="E-Commerce Architecture"
              description="High-conversion e-commerce platform for beauty products. Implemented a fast catalog, seamless cart state management, and an admin dashboard for inventory control."
              tags={['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Supabase']}
            />
            
            <ProjectRow 
              index={2}
              title="Monthly Meal Subscription System"
              type="Restaurant Platform"
              description="Menu-driven web application for a restaurant featuring a complex monthly meal subscription model. Handled recurring billing, automated menu rotation, and a customer dashboard."
              tags={['React', 'Node.js', 'PostgreSQL', 'Payment Gateway']}
            />
          </div>
        </section>

        {/* CTA */}
        <motion.section 
          className="py-16 md:py-24 border-t border-white/[0.05] text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 tracking-tight text-white">
            Available for new projects.
          </h2>
          <p className="text-white/50 mb-10 max-w-lg mx-auto font-light leading-relaxed">
            Whether you need a full SaaS build or an architectural review, let&apos;s discuss your technical requirements.
          </p>
          <a 
            href="mailto:ankit1pandey11@gmail.com" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-black text-xs font-sans font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Start a Conversation
          </a>
        </motion.section>
      </main>
    </div>
  );
}

function StatBlock({ value, label }: { value: string, label: string }) {
  return (
    <motion.div variants={fadeUp} className="p-8 md:p-10 bg-black/60 relative z-10 flex flex-col justify-center text-center">
      <h3 className="text-4xl font-display font-bold tracking-tight text-white mb-2">{value}</h3>
      <p className="text-[10px] font-sans font-bold tracking-widest uppercase text-white/40">{label}</p>
    </motion.div>
  );
}

function ProjectRow({ title, type, description, tags, index }: { title: string, type: string, description: string, tags: string[], index: number }) {
  // Calculate dynamic top offset so they stack nicely (e.g. 100px, 120px, 140px)
  const topOffset = 100 + (index * 20);

  return (
    <motion.div 
      className="p-8 md:p-10 rounded-[2rem] border border-white/[0.05] bg-black/80 backdrop-blur-xl hover:bg-white/[0.04] transition-colors relative group overflow-hidden sticky"
      style={{ top: `${topOffset}px`, zIndex: 10 + index }}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-6">
        <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">{title}</h3>
        <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-white/50">{type}</span>
      </div>
      <p className="relative z-10 text-white/60 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-light">
        {description}
      </p>
      <div className="relative z-10 flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-semibold tracking-wider uppercase text-white/60">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
