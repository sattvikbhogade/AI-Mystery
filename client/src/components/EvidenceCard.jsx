import { Clock3, MessageSquareText, FileText, Camera, Video, UserRound, ArrowUpRight } from 'lucide-react';
const icons = { whatsapp: MessageSquareText, document: FileText, image: Camera, cctv: Video, witness_statement: UserRound, report: FileText };
export default function EvidenceCard({ item, onClick }) {
  const Icon = icons[item.type] || FileText;
  return <button type="button" className="evidence-card" onClick={onClick}><div className="evidence-card-top"><span className="evidence-icon"><Icon size={17} /></span><span className="evidence-type">{String(item.type || 'document').replace('_', ' ')}</span><ArrowUpRight className="evidence-arrow" size={16} /></div><h3>{item.title}</h3><p>{item.description}</p><div className="evidence-card-foot"><Clock3 size={13} /><span>{item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Time unknown'}</span></div></button>;
}
