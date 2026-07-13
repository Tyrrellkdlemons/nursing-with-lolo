import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <div className="not-found"><span>404</span><h1>This page wandered off clinical.</h1><p>The study content is still here. Head back to the dashboard or open the lesson library.</p><div><Link className="button button--primary" to="/"><ArrowLeft /> Dashboard</Link><Link className="button button--secondary" to="/library"><Search /> Lesson library</Link></div></div>;
}

