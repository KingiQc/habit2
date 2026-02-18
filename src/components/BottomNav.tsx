import React from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { path: "/profile", icon: "mdi:account-outline", activeIcon: "mdi:account", label: "Profile" },
  { path: "/", icon: "mdi:view-grid-outline", activeIcon: "mdi:view-grid", label: "Home" },
  { path: "/settings", icon: "mdi:cog-outline", activeIcon: "mdi:cog", label: "Settings" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav bg-background border-t border-border">
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-0.5 py-1 px-4 transition-colors"
          >
            <Icon
              icon={active ? item.activeIcon : item.icon}
              width={26}
              className={active ? "text-foreground" : "text-muted-foreground"}
            />
          </button>
        );
      })}
    </div>
  );
}
