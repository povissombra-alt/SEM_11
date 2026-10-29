const icons = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.7" />
      <rect x="14" y="3" width="7" height="7" rx="1.7" />
      <rect x="3" y="14" width="7" height="7" rx="1.7" />
      <rect x="14" y="14" width="7" height="7" rx="1.7" />
    </>
  ),
  movements: (
    <>
      <path d="M4 7h16" />
      <path d="m7 4-3 3 3 3" />
      <path d="M20 17H4" />
      <path d="m17 14 3 3-3 3" />
    </>
  ),
  piggy: (
    <>
      <path d="M4.5 13.5A6.5 6.5 0 0 1 11 7h3.5a5.5 5.5 0 0 1 5.5 5.5v.5a5 5 0 0 1-5 5h-.5v2h-3v-2H10a5.5 5.5 0 0 1-5.5-5.5Z" />
      <path d="M15 7.2A4.8 4.8 0 0 0 18.8 11" />
      <path d="M4.5 13H2.8" />
      <path d="M8.5 13.5h3" />
      <circle cx="16.5" cy="11.5" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  settings: (
    <>
      <path d="M4 6h10" />
      <path d="M18 6h2" />
      <circle cx="16" cy="6" r="2" />
      <path d="M4 12h2" />
      <path d="M10 12h10" />
      <circle cx="8" cy="12" r="2" />
      <path d="M4 18h10" />
      <path d="M18 18h2" />
      <circle cx="16" cy="18" r="2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10 19a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  arrowDownLeft: (
    <>
      <path d="M17 7 7 17" />
      <path d="M16 17H7V8" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 19h16" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M2.5 10h19" />
      <path d="M7 15h3" />
    </>
  ),
  check: <path d="m5 12 4.5 4.5L19 7" />,
  sparkles: (
    <>
      <path d="M12 3.5 13.6 8l4.4 1.6-4.4 1.6L12 15.5l-1.6-4.3L6 9.6 10.4 8 12 3.5Z" />
      <path d="M18.5 15.5 19.3 18l2.2.8-2.2.8-.8 2.4-.8-2.4-2.2-.8 2.2-.8.8-2.5Z" />
      <path d="M5 3v3M3.5 4.5h3" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 15v2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18" />
      <path d="M10.6 5.7A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.4 3.2" />
      <path d="M6.4 6.7A16.6 16.6 0 0 0 2.5 12S6 18.5 12 18.5a9.8 9.8 0 0 0 4.1-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m6 7 1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M9 12h9" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 20 6v5c0 5.2-3.4 8.6-8 10-4.6-1.4-8-4.8-8-10V6l8-3Z" />
      <path d="m8.5 12 2.3 2.3 4.7-5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.2 2.4 3.4 5.4 3.4 9S14.2 18.6 12 21c-2.2-2.4-3.4-5.4-3.4-9S9.8 5.4 12 3Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M8.2 3.5 10 8 7.8 9.6a15.5 15.5 0 0 0 6.6 6.6L16 14l4.5 1.8v3.1a2.1 2.1 0 0 1-2.3 2.1C9.8 20.4 3.6 14.2 2.9 5.8A2.1 2.1 0 0 1 5 3.5h3.2Z" />
  ),
  pin: (
    <>
      <path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
    </>
  ),
  food: (
    <>
      <path d="M7 3v7a2.5 2.5 0 0 0 5 0V3" />
      <path d="M9.5 10v11" />
      <path d="M17.5 3c-1.3 1.4-2 3.2-2 5.5 0 2 .8 3.5 2 4.5V21" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  car: (
    <>
      <path d="m4 13 1.6-5.2A2 2 0 0 1 7.5 6h9a2 2 0 0 1 1.9 1.8L20 13" />
      <path d="M3 13h18v5H3z" />
      <path d="M3 18v2M21 18v2" />
      <circle cx="7" cy="15.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="15.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  zap: <path d="M13 2 4.5 13H11l-1 9L19.5 10H13l0-8Z" />,
  bag: (
    <>
      <path d="M5 8h14l1 13H4L5 8Z" />
      <path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4V8Z" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
  ),
  book: (
    <>
      <path d="M4 4h6a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4V4Z" />
      <path d="M20 4h-4a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h4V4Z" />
    </>
  ),
  banknote: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9v6M18 9v6" />
    </>
  ),
  plane: (
    <path d="M21 16.2 13.5 13v5.2l2 1.5V21L12 19.5 8.5 21v-1.3l2-1.5V13L3 16.2v-1.7L10.5 9V4.5a1.5 1.5 0 1 1 3 0V9L21 14.5v1.7Z" />
  ),
  laptop: (
    <>
      <rect x="4" y="4" width="16" height="11" rx="2" />
      <path d="M2 19h20l-2-4H4l-2 4Z" />
    </>
  ),
  filter: (
    <path d="M4 5h16l-6.2 7.2V19l-3.6 2v-8.8L4 5Z" />
  ),
  alert: (
    <>
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 9v5" />
      <circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  trendUp: (
    <>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" />
      <path d="M4 7h14" />
      <path d="M16 11h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 4v7h-7" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="m20 4-9 9" />
      <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </>
  ),
};

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className = '',
  ...props
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {icons[name] || icons.sparkles}
    </svg>
  );
}
