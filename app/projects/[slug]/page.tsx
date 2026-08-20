import { getProjectBySlug, projects } from '@/content/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';
import { HeroStarfield } from '@/components/home/ui/hero-starfield';

const IconGitHub = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  
  return {
    title: `${project.title} - Case Study`,
    description: project.tagline,
  };
}

export function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-[#EDEDED] font-sans overflow-x-hidden relative selection:bg-white/30">
      {/* Space Environment */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <HeroStarfield showMeteors={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
        {/* Subtle accent glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] bg-gradient-to-b ${project.accentColor} opacity-[0.05] blur-[120px] rounded-full mix-blend-screen`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-32">
        {/* Top Navigation */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest mb-16 md:mb-24 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        {/* Hero Section */}
        <header className="mb-20 md:mb-32">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 px-3 py-1 rounded-full">
              {project.category}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-[-0.02em] leading-[1.1] mb-6">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl leading-relaxed mb-10">
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-4">
            {project.liveLink && (
              <a 
                href={project.liveLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-sans font-bold text-sm hover:scale-105 transition-transform"
              >
                Visit Site <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.githubLink && (
              <a 
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 text-white border border-white/10 px-6 py-3 rounded-full font-sans font-medium text-sm hover:bg-white/10 transition-colors"
              >
                <IconGitHub className="w-4 h-4" /> Source Code
              </a>
            )}
          </div>
        </header>

        {/* Content Sections */}
        <article className="mt-16 prose prose-invert prose-lg max-w-none prose-headings:font-display prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h2:mt-16 prose-p:text-white/70 prose-p:font-light prose-p:leading-relaxed prose-a:text-white prose-a:underline-offset-4 hover:prose-a:text-white/80 prose-strong:text-white prose-ul:text-white/70 prose-ol:text-white/70 prose-li:marker:text-white/40 prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-hr:border-white/10">
          
          {/* Tech Stack */}
          <div className="not-prose mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-6">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span 
                  key={tech}
                  className="text-xs md:text-sm text-white/70 bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          {project.isUnderConstruction ? (
            <div className="not-prose my-24 p-12 md:p-20 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700" />
              
              <div className="relative z-10 flex flex-col items-center">
                <span className="relative flex h-3 w-3 mb-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                
                <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                  Under Construction
                </h3>
                <p className="text-white/50 text-lg md:text-xl font-light max-w-lg leading-relaxed">
                  I'm currently writing the full case study for this project. Check back soon for the complete technical deep dive and architecture breakdown!
                </p>
              </div>
            </div>
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}: any) {
                  return inline ? (
                    <code className="bg-white/5 text-emerald-400 px-2 py-1 rounded-md font-mono text-sm border border-emerald-500/20 mx-0.5 whitespace-nowrap" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                table({children}) {
                  return (
                    <div className="overflow-x-auto my-12 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
                      <table className="w-full text-left border-collapse m-0">
                        {children}
                      </table>
                    </div>
                  )
                },
                th({children}) {
                  return <th className="border-b border-white/10 px-6 py-5 text-xs tracking-widest uppercase font-mono text-white/40 bg-white/5">{children}</th>
                },
                td({children}) {
                  return <td className="border-b border-white/5 px-6 py-5 align-middle text-white/80">{children}</td>
                },
                img({src, alt}) {
                  return (
                    <span className="my-16 relative rounded-3xl overflow-hidden border border-white/10 group cursor-pointer block">
                      <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none flex items-center justify-center">
                         <span className="bg-black/50 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full font-mono uppercase tracking-widest border border-white/20">Zoom/Expand Image</span>
                      </span>
                      <img src={src} alt={alt} className="w-full h-auto !m-0 transition-transform duration-700 group-hover:scale-[1.02] block" />
                    </span>
                  )
                },
                blockquote({children}) {
                  return (
                    <blockquote className="border-l-2 border-emerald-500/50 pl-6 my-10 italic text-white/70 bg-gradient-to-r from-emerald-500/10 to-transparent py-4 rounded-r-2xl text-xl font-light">
                      {children}
                    </blockquote>
                  )
                }
              }}
            >
              {project.content}
            </ReactMarkdown>
          )}

        </article>
        
        {/* Footer */}
        <footer className="mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Ankit Pandey.
          </p>
          <Link href="/" className="text-white/60 hover:text-white font-mono uppercase tracking-widest text-xs transition-colors">
            Return to Home
          </Link>
        </footer>
      </div>
    </main>
  );
}
