import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PasswordInput({ value, onChange, placeholder = "Password", className = "" }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-secondary text-foreground rounded-xl px-4 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-muted-foreground/30 transition-all placeholder:text-muted-foreground"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon icon={visible ? "mdi:eye-off" : "mdi:eye"} width={22} />
      </button>
    </div>
  );
}
