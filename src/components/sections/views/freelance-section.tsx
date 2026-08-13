import * as React from 'react';
import { LucideBriefcase, LucideStar, LucideTrendingUp, LucideUsers } from 'lucide-react';

export function FreelanceSection() {
  return (
    <div className="flex h-full w-full flex-col gap-8 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold tracking-tight text-white/90">
          Freelance & Client Journey
        </h3>
        <p className="text-sm leading-relaxed text-white/60">
          Over the past few years, I&apos;ve had the privilege of working with amazing startups, agencies, and individual clients. My freelance journey has been defined by delivering high-impact, scalable, and immersive web experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard icon={<LucideBriefcase />} title="Projects Delivered" value="20+" />
        <StatCard icon={<LucideUsers />} title="Happy Clients" value="15+" />
        <StatCard icon={<LucideStar />} title="5-Star Ratings" value="100%" />
        <StatCard icon={<LucideTrendingUp />} title="Years Active" value="3+" />
      </div>

      <div className="flex flex-col gap-6">
        <h4 className="text-xl font-semibold text-white/80">Selected Client Projects</h4>
        
        <ProjectCard 
          title="Fintech Dashboard Re-architecture"
          client="Confidential Startup"
          description="Led the frontend re-architecture of a major fintech dashboard, migrating from legacy React to Next.js 14. Improved performance scores by 40% and implemented complex data visualization components."
          tech={['Next.js', 'Tailwind', 'Recharts', 'TypeScript']}
        />

        <ProjectCard 
          title="Immersive E-Commerce Experience"
          client="Boutique Fashion Brand"
          description="Designed and developed a 3D-first e-commerce landing page using React Three Fiber. Customers can interact with 3D models of the clothing line before purchasing."
          tech={['Three.js', 'R3F', 'Framer Motion', 'Shopify API']}
        />
        
        <ProjectCard 
          title="Automated Booking Platform"
          client="Local Enterprise"
          description="Built a full-stack booking system with real-time availability, calendar sync, and automated SMS reminders, reducing no-shows by 25%."
          tech={['React', 'Node.js', 'PostgreSQL', 'Twilio']}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white/90">{value}</div>
        <div className="text-xs text-white/50">{title}</div>
      </div>
    </div>
  );
}

function ProjectCard({ title, client, description, tech }: { title: string; client: string; description: string; tech: string[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-5 transition-colors hover:border-white/20 hover:bg-white/[0.02]">
      <div>
        <h5 className="text-lg font-bold text-white/90">{title}</h5>
        <div className="text-xs font-medium text-blue-400/80">{client}</div>
      </div>
      <p className="text-sm leading-relaxed text-white/60">{description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span key={t} className="rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-white/70">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

