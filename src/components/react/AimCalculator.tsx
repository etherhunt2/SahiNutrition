import { useState, useMemo, useCallback } from 'react';

type GoalType = 'loss' | 'gain';
type EffortLevel = 'trial' | 'motivated' | 'dedicated';

interface EffortConfig {
  label: string;
  description: string;
  lossPerMonth: [number, number];
  gainPerMonth: [number, number];
  color: string;
}

const EFFORT_LEVELS: Record<EffortLevel, EffortConfig> = {
  trial: {
    label: 'Trial',
    description: 'Light changes, exploring what works',
    lossPerMonth: [1, 2],
    gainPerMonth: [0.5, 1],
    color: '#f59e0b',
  },
  motivated: {
    label: 'Motivated',
    description: 'Consistent effort with flexibility',
    lossPerMonth: [2, 3],
    gainPerMonth: [1, 1.5],
    color: '#10b981',
  },
  dedicated: {
    label: 'Dedicated',
    description: 'Full commitment, maximum results',
    lossPerMonth: [3, 4],
    gainPerMonth: [1.5, 2],
    color: '#3b82f6',
  },
};

export default function AimCalculator() {
  const [goalType, setGoalType] = useState<GoalType>('loss');
  const [duration, setDuration] = useState(3);
  const [effort, setEffort] = useState<EffortLevel>('motivated');

  const result = useMemo(() => {
    const config = EFFORT_LEVELS[effort];
    const range = goalType === 'loss' ? config.lossPerMonth : config.gainPerMonth;
    const min = +(range[0] * duration).toFixed(1);
    const max = +(range[1] * duration).toFixed(1);
    return { min, max };
  }, [goalType, duration, effort]);

  const progressPercentage = useMemo(() => {
    const maxPossible = goalType === 'loss' ? 48 : 24; // 12 months × dedicated max
    return Math.min(100, (result.max / maxPossible) * 100);
  }, [result, goalType]);

  const getMotivationalText = useCallback(() => {
    if (duration <= 2) return "A great start — every journey begins with the first step!";
    if (duration <= 4) return "This is where real changes start to show. You'll feel the difference!";
    if (duration <= 6) return "Half a year of dedication can transform your entire life.";
    if (duration <= 9) return "With this commitment, you'll become an inspiration to others.";
    return "A full year of transformation — this is how legends are made!";
  }, [duration]);

  return (
    <section className="aim-calculator" id="aim">
      <div className="aim-calculator__container">
        <span className="aim-calculator__label">Interactive Goal Planner</span>
        <h2 className="aim-calculator__title">
          What Is Your <span className="aim-calculator__gradient">AIM?</span>
        </h2>
        <p className="aim-calculator__subtitle">
          Set your target and see what's achievable with the right guidance. 
          Drag the sliders and select your effort level.
        </p>

        <div className="aim-calculator__content">
          {/* Controls */}
          <div className="aim-calculator__controls">
            {/* Goal Type Toggle */}
            <div className="aim-calculator__field">
              <label className="aim-calculator__field-label">Your Goal</label>
              <div className="aim-calculator__goal-toggle">
                <button
                  className={`aim-calculator__goal-btn ${goalType === 'loss' ? 'active' : ''}`}
                  onClick={() => setGoalType('loss')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                  Weight Loss
                </button>
                <button
                  className={`aim-calculator__goal-btn ${goalType === 'gain' ? 'active' : ''}`}
                  onClick={() => setGoalType('gain')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Weight Gain
                </button>
              </div>
            </div>

            {/* Duration Slider */}
            <div className="aim-calculator__field">
              <label className="aim-calculator__field-label">
                Duration
                <span className="aim-calculator__field-value">{duration} {duration === 1 ? 'Month' : 'Months'}</span>
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="aim-calculator__slider"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((duration - 1) / 11) * 100}%, #2a2a2a ${((duration - 1) / 11) * 100}%, #2a2a2a 100%)`,
                }}
              />
              <div className="aim-calculator__slider-labels">
                <span>1 month</span>
                <span>6 months</span>
                <span>12 months</span>
              </div>
            </div>

            {/* Effort Level */}
            <div className="aim-calculator__field">
              <label className="aim-calculator__field-label">Effort Level</label>
              <div className="aim-calculator__effort-options">
                {(Object.entries(EFFORT_LEVELS) as [EffortLevel, EffortConfig][]).map(([key, config]) => (
                  <button
                    key={key}
                    className={`aim-calculator__effort-btn ${effort === key ? 'active' : ''}`}
                    onClick={() => setEffort(key)}
                    style={{ '--effort-color': config.color } as React.CSSProperties}
                  >
                    <span className="aim-calculator__effort-name">{config.label}</span>
                    <span className="aim-calculator__effort-desc">{config.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Display */}
          <div className="aim-calculator__result">
            <div className="aim-calculator__result-card">
              <div className="aim-calculator__result-header">
                <span className="aim-calculator__result-type">
                  {goalType === 'loss' ? 'Expected Weight Loss' : 'Expected Weight Gain'}
                </span>
                <div className="aim-calculator__result-badge" style={{ background: EFFORT_LEVELS[effort].color }}>
                  {EFFORT_LEVELS[effort].label}
                </div>
              </div>

              <div className="aim-calculator__result-numbers">
                <span className="aim-calculator__result-range">
                  {result.min} — {result.max}
                </span>
                <span className="aim-calculator__result-unit">kg</span>
              </div>

              <div className="aim-calculator__result-meta">
                in {duration} {duration === 1 ? 'month' : 'months'}
              </div>

              {/* Progress Bar */}
              <div className="aim-calculator__progress">
                <div className="aim-calculator__progress-track">
                  <div
                    className="aim-calculator__progress-fill"
                    style={{
                      width: `${progressPercentage}%`,
                      background: `linear-gradient(90deg, ${EFFORT_LEVELS[effort].color}, ${EFFORT_LEVELS[effort].color}cc)`,
                    }}
                  ></div>
                </div>
              </div>

              <p className="aim-calculator__result-motivation">
                {getMotivationalText()}
              </p>

              {/* Breakdown */}
              <div className="aim-calculator__breakdown">
                <div className="aim-calculator__breakdown-item">
                  <span className="aim-calculator__breakdown-label">Per month</span>
                  <span className="aim-calculator__breakdown-value">
                    {goalType === 'loss'
                      ? `${EFFORT_LEVELS[effort].lossPerMonth[0]}–${EFFORT_LEVELS[effort].lossPerMonth[1]} kg`
                      : `${EFFORT_LEVELS[effort].gainPerMonth[0]}–${EFFORT_LEVELS[effort].gainPerMonth[1]} kg`}
                  </span>
                </div>
                <div className="aim-calculator__breakdown-item">
                  <span className="aim-calculator__breakdown-label">Per week</span>
                  <span className="aim-calculator__breakdown-value">
                    {goalType === 'loss'
                      ? `${(EFFORT_LEVELS[effort].lossPerMonth[0] / 4).toFixed(2)}–${(EFFORT_LEVELS[effort].lossPerMonth[1] / 4).toFixed(2)} kg`
                      : `${(EFFORT_LEVELS[effort].gainPerMonth[0] / 4).toFixed(2)}–${(EFFORT_LEVELS[effort].gainPerMonth[1] / 4).toFixed(2)} kg`}
                  </span>
                </div>
              </div>

              <a href="#contact" className="aim-calculator__cta">
                Start Your Journey Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
