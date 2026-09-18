export default function WaveDivider({
  color = "var(--cream)",
  flip = false,
}: {
  color?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={`wave-divider ${flip ? "rotate-180" : ""}`}
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,32 C 180,80 360,0 600,28 C 840,56 1020,4 1260,24 C 1350,32 1410,40 1440,44 L1440,100 L0,100 Z"
        fill={color}
      />
    </svg>
  );
}
