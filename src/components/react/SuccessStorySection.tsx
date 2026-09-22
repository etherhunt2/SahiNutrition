import { useState, useRef, useEffect } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

const STATS: StatItem[] = [
  { value: 800, suffix: '+', label: 'Clients Coached', icon: 'users' },
  { value: 94, suffix: '%', label: 'Goal Achievement', icon: 'target' },
  { value: 5000, suffix: '+', label: 'Diet Plans Created', icon: 'file' },
  { value: 12, suffix: '+', label: 'Years Experience', icon: 'award' },
];

const MONTHLY_DATA = {
  labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
  weightLoss: [1.5, 3.5, 6, 8, 10.5, 12],
  weightGain: [0.8, 1.8, 3, 4.2, 5.5, 6.8],
};

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <span className="success-story__stat-number">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function BarChart({ inView }: { inView: boolean }) {
  return (
    <div className="success-story__chart">
      <h4 className="success-story__chart-title">Average Client Progress (6 Months)</h4>
      <div className="success-story__chart-legend">
        <span className="success-story__chart-legend-item">
          <span className="success-story__dot success-story__dot--loss"></span> Weight Loss (kg)
        </span>
        <span className="success-story__chart-legend-item">
          <span className="success-story__dot success-story__dot--gain"></span> Weight Gain (kg)
        </span>
      </div>
      <div className="success-story__bars">
        {MONTHLY_DATA.labels.map((label, i) => (
          <div key={label} className="success-story__bar-group">
            <div className="success-story__bar-container">
              <div
                className="success-story__bar success-story__bar--loss"
                style={{
                  height: inView ? `${(MONTHLY_DATA.weightLoss[i] / 12) * 100}%` : '0%',
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <span className="success-story__bar-value">{MONTHLY_DATA.weightLoss[i]}</span>
              </div>
              <div
                className="success-story__bar success-story__bar--gain"
                style={{
                  height: inView ? `${(MONTHLY_DATA.weightGain[i] / 12) * 100}%` : '0%',
                  transitionDelay: `${i * 100 + 50}ms`,
                }}
              >
                <span className="success-story__bar-value">{MONTHLY_DATA.weightGain[i]}</span>
              </div>
            </div>
            <span className="success-story__bar-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SatisfactionRing({ inView }: { inView: boolean }) {
  const circumference = 2 * Math.PI * 60;
  const segments = [
    { label: 'Exceeded Goals', percent: 42, color: '#10b981' },
    { label: 'Met Goals', percent: 38, color: '#3b82f6' },
    { label: 'Good Progress', percent: 14, color: '#f59e0b' },
    { label: 'In Progress', percent: 6, color: '#6b7280' },
  ];

  let offset = 0;

  return (
    <div className="success-story__ring-chart">
      <h4 className="success-story__chart-title">Client Satisfaction</h4>
      <div className="success-story__ring-wrapper">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="60" fill="none" stroke="#1a1a1a" strokeWidth="16"/>
          {segments.map((seg, i) => {
            const dash = (seg.percent / 100) * circumference;
            const currentOffset = offset;
            offset += dash;
            return (
              <circle
                key={i}
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${inView ? dash : 0} ${circumference}`}
                strokeDashoffset={-currentOffset}
                style={{
                  transition: `stroke-dasharray 1s ease ${i * 200}ms`,
                  transform: 'rotate(-90deg)',
                  transformOrigin: '80px 80px',
                }}
              />
            );
          })}
          <text x="80" y="76" textAnchor="middle" fill="#f5f5f5" fontSize="24" fontWeight="700" fontFamily="Outfit">
            94%
          </text>
          <text x="80" y="94" textAnchor="middle" fill="#a3a3a3" fontSize="10" fontFamily="Inter">
            Success Rate
          </text>
        </svg>
        <ul className="success-story__ring-legend">
          {segments.map((seg, i) => (
            <li key={i}>
              <span className="success-story__dot" style={{ background: seg.color }}></span>
              <span className="success-story__ring-label">{seg.label}</span>
              <span className="success-story__ring-percent">{seg.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getIcon(icon: string) {
  switch (icon) {
    case 'users':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      );
    case 'target':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
        </svg>
      );
    case 'file':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      );
    case 'award':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function SuccessStorySection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="success-story" id="success" ref={sectionRef}>
      <div className="success-story__container">
        <span className="success-story__label">Proven Results</span>
        <h2 className="success-story__title">
          Our Success <span className="success-story__gradient">Story</span>
        </h2>
        <p className="success-story__subtitle">
          Numbers don't lie. Here's the impact we've made on our clients' lives 
          over 12+ years of dedicated coaching.
        </p>

        {/* Stats Grid */}
        <div className="success-story__stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="success-story__stat">
              <div className="success-story__stat-icon">
                {getIcon(stat.icon)}
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
              <span className="success-story__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="success-story__charts">
          <BarChart inView={inView} />
          <SatisfactionRing inView={inView} />
        </div>
      </div>
    </section>
  );
}
