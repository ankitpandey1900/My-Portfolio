'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import {
  CONTACT_INFO,
  EXPERIENCE,
  RESUME_PROFILE,
  SKILL_GROUPS,
} from '../content/portfolio-content';
import Link from 'next/link';

export function ResumeSection() {
  const latestExperience = EXPERIENCE[0];
  const primarySkills = SKILL_GROUPS.flatMap((group) => group.items).slice(0, 10);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
  };

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-4">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
          Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">Profile</span>
        </h2>
        <p className="text-white/60 text-sm md:text-base font-sans max-w-2xl">
          {RESUME_PROFILE.summary}
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Main Identity Card */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-orange-500/20 transition-colors duration-700 pointer-events-none" />
          
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
              {RESUME_PROFILE.name}
            </h3>
            <p className="text-orange-400 font-medium mb-6">
              {RESUME_PROFILE.headline}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-white/40" />
                {RESUME_PROFILE.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-white/40" />
                {CONTACT_INFO.email}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link 
              href="/resume" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform text-sm"
            >
              <Download className="w-4 h-4" />
              View Full Resume
            </Link>
            <a 
              href={`mailto:${CONTACT_INFO.email}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-colors text-sm border border-white/5"
            >
              Initiate Contact
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Metrics/Stats Card */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden"
        >
          {RESUME_PROFILE.metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-4xl md:text-5xl font-display font-light text-white tracking-tighter">
                {metric.value}
              </span>
              <span className="text-xs uppercase tracking-widest text-white/50 font-semibold mt-1">
                {metric.label}
              </span>
            </div>
          ))}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] translate-y-1/3 translate-x-1/3 pointer-events-none" />
        </motion.div>

        {/* Current Experience */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg leading-tight">Current Role</h4>
              <p className="text-white/50 text-xs uppercase tracking-wider">{latestExperience?.period}</p>
            </div>
          </div>
          
          {latestExperience ? (
            <div>
              <h5 className="text-xl font-display font-medium text-white">{latestExperience.role}</h5>
              <p className="text-orange-300/80 mb-4 text-sm">{latestExperience.company}</p>
              <ul className="space-y-2">
                {latestExperience.highlights.slice(0, 3).map((highlight, idx) => (
                  <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-orange-500/50 mt-0.5">▹</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-white/50">Currently exploring new opportunities.</p>
          )}
        </motion.div>

        {/* Core Skills */}
        <motion.div 
          variants={itemVariants}
          className="col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col"
        >
          <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
            Top Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2 mt-auto">
            {primarySkills.map((skill) => (
              <span 
                key={skill} 
                className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg text-xs font-mono text-white/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
