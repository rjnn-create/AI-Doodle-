import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, PlusCircle, Compass, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/create', icon: PlusCircle, label: 'Create' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl shadow-purple-500/10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative px-4 py-3 rounded-full transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex flex-col items-center gap-1 ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
