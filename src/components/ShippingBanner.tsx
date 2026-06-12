"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const TIMEZONE_COUNTRY: Record<string, string> = {
  "Europe/Madrid": "Spain",
  "Africa/Ceuta": "Spain",
  "Atlantic/Canary": "Spain",
  "Europe/Paris": "France",
  "Europe/London": "United Kingdom",
  "Europe/Berlin": "Germany",
  "Europe/Rome": "Italy",
  "Europe/Amsterdam": "Netherlands",
  "Europe/Brussels": "Belgium",
  "Europe/Lisbon": "Portugal",
  "Atlantic/Azores": "Portugal",
  "Europe/Zurich": "Switzerland",
  "Europe/Vienna": "Austria",
  "Europe/Stockholm": "Sweden",
  "Europe/Oslo": "Norway",
  "Europe/Copenhagen": "Denmark",
  "Europe/Helsinki": "Finland",
  "Europe/Warsaw": "Poland",
  "America/New_York": "United States",
  "America/Chicago": "United States",
  "America/Denver": "United States",
  "America/Los_Angeles": "United States",
  "America/Mexico_City": "Mexico",
  "America/Bogota": "Colombia",
  "America/Buenos_Aires": "Argentina",
  "America/Argentina/Buenos_Aires": "Argentina",
  "America/Sao_Paulo": "Brazil",
  "America/Toronto": "Canada",
  "America/Vancouver": "Canada",
  "Asia/Tokyo": "Japan",
  "Asia/Shanghai": "China",
  "Asia/Seoul": "South Korea",
  "Asia/Dubai": "UAE",
  "Australia/Sydney": "Australia",
};

function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIMEZONE_COUNTRY[tz]) return TIMEZONE_COUNTRY[tz];
    const lang = navigator.language || "";
    const region = lang.split("-")[1]?.toUpperCase();
    const langMap: Record<string, string> = {
      ES: "Spain", FR: "France", GB: "United Kingdom", DE: "Germany",
      IT: "Italy", NL: "Netherlands", PT: "Portugal", US: "United States",
      MX: "Mexico", AR: "Argentina", BR: "Brazil", CA: "Canada",
      JP: "Japan", CN: "China", KR: "South Korea", AU: "Australia",
    };
    return (region && langMap[region]) ? langMap[region] : "Spain";
  } catch {
    return "Spain";
  }
}

export default function ShippingBanner() {
  const [country, setCountry] = useState("Spain");
  const pathname = usePathname();

  useEffect(() => {
    setCountry(detectCountry());
  }, []);

  if (pathname === "/") return null;

  return (
    <div className="shipping-banner" style={{
      width: "100%",
      height: "22px",
      background: "#0b0b0b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "6.375px",
      fontWeight: 300,
      letterSpacing: "0.45em",
      color: "rgba(255, 255, 255, 0.45)",
      textTransform: "uppercase",
      fontFamily: "var(--font-primary), sans-serif",
      borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
      paddingLeft: "0.45em",
      boxSizing: "border-box",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1100,
    }}>
      Complimentary shipping to your country
    </div>
  );
}
