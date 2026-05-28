import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-primary)] rounded-full opacity-[0.02] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-primary)] rounded-full opacity-[0.015] blur-[150px]" />
      </div>
    </div>
  );
}
