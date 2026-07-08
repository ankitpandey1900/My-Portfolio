import { SceneRoot } from '@/components/canvas/scene-root';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-space-black">
      <SceneRoot />
      {/* Screen-reader accessible content mirror */}
      <div className="sr-only">
        <h1>Ankit Pandey — Software Engineer Portfolio</h1>
        <p>
          Interactive solar-system portfolio showcasing projects, experience, services, skills, and
          contact information.
        </p>
        <nav aria-label="Sections">
          <ul>
            <li>About</li>
            <li>Projects</li>
            <li>Services</li>
            <li>Skills</li>
            <li>Experience</li>
            <li>Contact</li>
          </ul>
        </nav>
      </div>
    </main>
  );
}
