import React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo-wrapper">
          <div className="logo-icon-box">
            <BookOpen size={20} />
          </div>
          <span className="site-title">PDF Library</span>
        </Link>
        <span className="site-badge">Practical Reference</span>
      </div>
    </header>
  );
};

export default Header;
