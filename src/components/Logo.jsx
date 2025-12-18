// src/components/Logo.jsx
export default function Logo({ size = 40 }) {
  return (
    <div className="flex items-center">
      <img
        src="/smg-logo.png"
        alt="SMG Electric Scooters"
        style={{ height: size }}
        className="w-auto object-contain"
      />
    </div>
  );
}
