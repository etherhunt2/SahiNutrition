import { useState, useRef, useCallback } from 'react';

type TransformMode = 'loss' | 'gain';

export default function PhotoTransform() {
  const [mode, setMode] = useState<TransformMode>('loss');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be under 10MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setTransformedImage(null);
      setSliderPosition(50);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleTransform = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: originalImage,
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error('Transformation failed. Please try again.');
      }

      const data = await response.json();
      setTransformedImage(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, mode]);

  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging.current) handleSliderMove(e.clientX);
  }, [handleSliderMove]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleSliderMove(e.touches[0].clientX);
  }, [handleSliderMove]);

  return (
    <section className="photo-transform" id="look-fit">
      <div className="photo-transform__container">
        <span className="photo-transform__label">AI Powered</span>
        <h2 className="photo-transform__title">
          Want to Look <span className="photo-transform__gradient">Fit?</span>
        </h2>
        <p className="photo-transform__subtitle">
          Upload your photo and see what a healthier version of you could look like. 
          Our AI creates a realistic preview — not a bodybuilder, just you at your best.
        </p>

        {/* Mode Toggle */}
        <div className="photo-transform__toggle">
          <button
            className={`photo-transform__toggle-btn ${mode === 'loss' ? 'active' : ''}`}
            onClick={() => setMode('loss')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
            Weight Loss
          </button>
          <button
            className={`photo-transform__toggle-btn ${mode === 'gain' ? 'active' : ''}`}
            onClick={() => setMode('gain')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Weight Gain
          </button>
        </div>

        {/* Upload Area */}
        {!originalImage && (
          <div>
            <div
              className="photo-transform__upload"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="photo-transform__upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="photo-transform__upload-text">
                Drag & drop your photo here
              </p>
              <span className="photo-transform__upload-hint">
                or click to browse (JPG, PNG, WebP — max 10MB)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
            </div>

            {/* Quick Demo Samples */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>Or try with realistic AI samples:</span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMode('loss');
                    setOriginalImage('/samples/loss-before.jpg');
                    setTransformedImage('/samples/loss-after.jpg');
                    setError(null);
                    setSliderPosition(50);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '9999px',
                    color: '#34d399',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  ⚡ Preview Weight Loss Demo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('gain');
                    setOriginalImage('/samples/gain-before.jpg');
                    setTransformedImage('/samples/gain-after.jpg');
                    setError(null);
                    setSliderPosition(50);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '9999px',
                    color: '#fbbf24',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  ⚡ Preview Weight Gain Demo
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Image Preview / Comparison */}
        {originalImage && (
          <div className="photo-transform__preview">
            {!transformedImage ? (
              <div className="photo-transform__original">
                <img src={originalImage} alt="Your uploaded photo" />
                <div className="photo-transform__actions">
                  <button
                    className="photo-transform__transform-btn"
                    onClick={handleTransform}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="photo-transform__spinner"></span>
                        Transforming...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Generate Fit Version
                      </>
                    )}
                  </button>
                  <button
                    className="photo-transform__reset-btn"
                    onClick={() => {
                      setOriginalImage(null);
                      setTransformedImage(null);
                      setError(null);
                    }}
                  >
                    Upload Different Photo
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="photo-transform__comparison"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
              >
                <div className="photo-transform__comparison-before">
                  <img src={originalImage} alt="Before" />
                  <span className="photo-transform__comparison-label">Before</span>
                </div>
                <div
                  className="photo-transform__comparison-after"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img src={transformedImage} alt="After transformation" />
                  <span className="photo-transform__comparison-label">After</span>
                </div>
                <div
                  className="photo-transform__comparison-slider"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="photo-transform__comparison-handle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8L22 12L18 16"/>
                      <path d="M6 8L2 12L6 16"/>
                    </svg>
                  </div>
                </div>
                <button
                  className="photo-transform__reset-btn photo-transform__retry"
                  onClick={() => {
                    setOriginalImage(null);
                    setTransformedImage(null);
                  }}
                >
                  Try Another Photo
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="photo-transform__error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <p className="photo-transform__disclaimer">
          *AI-generated preview for visualization only. Results may vary based on individual 
          factors. This is not a guarantee of outcomes.
        </p>
      </div>
    </section>
  );
}
