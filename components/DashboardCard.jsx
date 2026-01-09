import Link from 'next/link';

export default function DashboardCard({ title, count, link = "#" }) {
    return (
        <div className="dashboard-card">
            <h3 className="dashboard-title">{title}</h3>
            <p className="dashboard-count">{count}</p>
            {/* Next.js me <a> ki jagah Link use karte hain */}
            <Link href={link} className="dashboard-link">
                View All
            </Link>
        </div>
    );
}