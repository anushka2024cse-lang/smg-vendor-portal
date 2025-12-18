export default function FormField({ label, help, children }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      {label && <label className="vf-label">{label}</label>}
      {children}
      {help && <p className="vf-hint">{help}</p>}
    </div>
  );
}
