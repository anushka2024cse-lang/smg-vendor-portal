// src/components/Sidebar.jsx

const menuItems = [
  "Dashboard",
  "Production Schedule",
  "Store / Bin Details",
  "Reports",
  "Green Certificate",
];

export default function Sidebar({ active, onSelect }) {
  return (
    <div className="w-64 h-screen bg-[#0A2342] text-white p-6 fixed left-0 top-0">
      <h1 className="text-3xl font-extrabold mb-8">SMG</h1>

      <ul className="space-y-3 text-sm">
        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => onSelect(item)}
            className={
              "cursor-pointer px-3 py-2 rounded transition " +
              (item === active
                ? "bg-white text-[#0A2342] font-semibold"
                : "hover:bg-blue-900")
            }
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
