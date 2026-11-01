import { UserRound, Check } from 'lucide-react';
export default function SuspectCard({ suspect, selected, onClick, compact = false }) {
  return <button type="button" className={`suspect-card ${selected ? 'selected' : ''} ${compact ? 'suspect-compact' : ''}`} onClick={onClick}><div className="suspect-avatar">{suspect.imageUrl ? <img src={suspect.imageUrl} alt="" /> : <UserRound size={22} />}</div><div className="suspect-card-copy"><div className="suspect-name">{suspect.name}</div><div className="suspect-role">{suspect.occupation}</div>{!compact && <div className="suspect-relation">{suspect.relationship}</div>}</div>{selected && <span className="suspect-check"><Check size={13} /></span>}</button>;
}
