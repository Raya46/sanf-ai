"use client";

import React, { useRef, useEffect, useState } from "react";
import GooeySvgFilter from "@/components/ui/gooey-svg-filter";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

export function TabNavigation({ activeTab, onTabChange, tabs }: TabNavigationProps) {
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeTabStyle, setActiveTabStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
      const activeTabElement = tabsRef.current[activeIndex];
      if (activeTabElement) {
        setActiveTabStyle({
          left: activeTabElement.offsetLeft,
          width: activeTabElement.offsetWidth,
        });
      }
    }
  }, [activeTab]);

  return (
    <>
      <div
        className="relative flex w-fit text-sm bg-gray-800 rounded-t-lg"
        style={{ filter: "url(#gooey-filter)" }}
      >
        {/* Active folder background */}
        <div
          className="absolute top-0 h-full bg-sanf-primary rounded-t-lg transition-all duration-300 ease-out z-10"
          style={{
            left: activeTabStyle.left,
            width: activeTabStyle.width,
            borderRadius: "5px 20px 0 0", // Adjust for folder shape
            height: "calc(100% + 20px)", // Extend slightly below
            top: "-20px", // Adjust position
          }}
        />

        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            ref={(el: HTMLDivElement | null) => {
              tabsRef.current[index] = el;
              return;
            }}
            onClick={() => onTabChange(tab.id)}
            className={`relative z-20 px-4 py-2 uppercase font-medium cursor-pointer transition-colors duration-200
              ${activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-gray-100"}
            `}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <GooeySvgFilter />
    </>
  );
}

