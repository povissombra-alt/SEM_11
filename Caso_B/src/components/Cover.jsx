export default function Cover({ item, size = 'md', className = '' }) {
  const [from, to] = item?.colors ?? ['#4c1d95', '#0e7490'];
  return (
    <div
      className={`cover cover-${size} ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <span className="cover-emoji">{item?.emoji ?? '🎵'}</span>
    </div>
  );
}
