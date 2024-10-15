// SidebarItem.js
import Link from "next/link";

export default function SidebarItem({ icon, text, link, subItems, expanded }) {
  return (
    <li>
      <Link href={link} className={`flex items-center p-2 ${expanded ? "justify-start" : "justify-center"}`}>
        {icon}
        {expanded && <span className="ml-2">{text}</span>}
      </Link>
      {subItems && expanded && (
        <ul className="ml-4">
          {subItems.map((subItem, index) => (
            <li key={index}>
              <Link href={subItem.link} className="flex items-center p-2">
                {subItem.text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
