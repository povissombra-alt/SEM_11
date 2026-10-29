export default function Avatar({ name, size = 'md', online = false }) {
  const initials = (name || 'Fintra')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      <span>{initials}</span>
      {online && <i className="avatar-online" />}
    </span>
  );
}
