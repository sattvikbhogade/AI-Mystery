import { Link } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';

export default function Brand({ compact = false }) {
  return <Link className="brand" to="/" aria-label="AI Mystery Room home"><span className="brand-mark"><Fingerprint size={20} strokeWidth={1.6} /></span>{!compact && <span className="brand-name">MYSTERY<span>ROOM</span></span>}</Link>;
}
