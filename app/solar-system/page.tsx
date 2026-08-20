import { SceneRoot } from '@/components/canvas/scene-root';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar System | Ankit Pandey',
  description: 'Interactive solar-system portfolio experience.',
};

export default function SolarSystemPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-space-black">
      <SceneRoot />
      {/* Screen-reader accessible content mirror */}
      <div className="sr-only">
        <h1>Ankit Pandey — Interactive Solar System</h1>
        <p>
          Interactive solar-system portfolio showcasing projects, experience, services, skills, and
          contact information in a 3D universe.
        </p>
      </div>
    </main>
  );
}
