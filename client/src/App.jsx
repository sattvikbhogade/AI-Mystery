import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreateCase from './pages/CreateCase.jsx';
import Investigation from './pages/Investigation.jsx';
import Accusation from './pages/Accusation.jsx';
import Verdict from './pages/Verdict.jsx';
import Cases from './pages/Cases.jsx';
export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/create" element={<CreateCase/>}/><Route path="/cases" element={<Cases/>}/><Route path="/case/:id" element={<Investigation/>}/><Route path="/case/:id/accuse" element={<Accusation/>}/><Route path="/case/:id/verdict" element={<Verdict/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
