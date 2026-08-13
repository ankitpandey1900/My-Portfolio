'use client';

import React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { PROJECTS } from '../content/portfolio-content';

function ProjectCard({ project }: { project: any }) {
  return (
    <div
      className="relative flex flex-col w-full min-h-[300px] p-6 md:p-8 rounded-xl overflow-hidden group bg-black/40 backdrop-blur-md border border-blue-900/30 hover:border-blue-500/50 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    >
      {/* Sci-Fi Tech Grid Background */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      
      {/* Glowing Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/0 group-hover:border-blue-400/80 transition-colors duration-500" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/0 group-hover:border-blue-400/80 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/0 group-hover:border-blue-400/80 transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/0 group-hover:border-blue-400/80 transition-colors duration-500" />

      {/* Content Header (Telemetry) */}
      <div className="relative z-10 flex items-center justify-between border-b border-blue-900/30 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
            [ STATUS: {project.status ?? 'ONLINE'} ]
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-500 tracking-widest">SYS.ID // {project.id}</span>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-zinc-100 tracking-tight group-hover:text-blue-50 transition-colors">
            {project.name}
          </h3>
          <p className="text-blue-300/70 text-sm font-mono mt-1 uppercase tracking-wide">
            {project.tagline}
          </p>
        </div>
        
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3">
          {project.description}
        </p>
        
        {/* Tech Stack Array */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {project.stack.map((tech: string) => (
            <span key={tech} className="text-[10px] font-mono px-2 py-1 bg-blue-950/30 border border-blue-900/50 rounded-sm text-blue-300/80 uppercase tracking-wider">
              {tech}
            </span>
          ))}
        </div>
        
        {/* Action Links */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-blue-900/30">
          {project.href && (
            <a href={project.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono font-bold text-blue-400 hover:text-blue-300 transition-colors">
              <span>{'>'} INITIALIZE_LINK</span>
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
              <span>{'>'} VIEW_SOURCE</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
      <div className="mb-12 md:mb-20 space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-blue-500/50" />
          <span className="text-blue-400 font-mono text-sm uppercase tracking-[0.3em]">System.Logs</span>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-blue-500/50 to-transparent" />
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
          Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Missions</span>
        </h2>
        <p className="text-lg font-mono text-zinc-400 max-w-2xl border-l-2 border-blue-900/50 pl-4 py-1">
          {'>'} Fetching classified telemetry data...<br />
          {'>'} Displaying successfully shipped engineering operations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

