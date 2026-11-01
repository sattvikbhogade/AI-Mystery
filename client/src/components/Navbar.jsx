import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Brand from './Brand.jsx';

export default function Navbar() {
  return <header className="nav-shell"><div className="container nav-inner"><Brand /><nav className="main-nav" aria-label="Main navigation"><a href="/#how-it-works">The experience</a><NavLink to="/cases">Case files</NavLink></nav><Link className="nav-cta" to="/create">Open a case <ArrowUpRight size={15} /></Link></div></header>;
}
