"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import BlurFade from "../magicui/blur-fade";
import EducationExperience from "./education";
import Profile from "./Profile";
import Projects from "./projects";
import Skills from "./skills";
import WorkExperience from "./workExperience";

const Tab = () => {
  const [activeTab, setActiveTab] = useState(0); // default = Profile

  const t = useTranslations("dashboard.menu");

  const tab = [
    { trans: "Profile" },
    { trans: "Work" },
    { trans: "Education" },
    { trans: "Skills" },
    { trans: "Projects" },
  ];

  const content = [
    { component: <Profile />, trans: "Profile" },
    { component: <WorkExperience />, trans: "Work" },
    { component: <EducationExperience />, trans: "Education" },
    { component: <Skills />, trans: "Skills" },
    { component: <Projects />, trans: "Projects" },
  ];

  // ✅ Load saved tab on mount
  useEffect(() => {
    const saved = localStorage.getItem("activeTab");
    if (saved && !isNaN(Number(saved))) {
      setActiveTab(Number(saved));
    }
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    localStorage.setItem("activeTab", index.toString());
  };

  return (
    <BlurFade yOffset={20} delay={0.04}>
      {/* tabs */}
      <div className="bg-muted rounded-md py-1.5 px-2 flex overflow-auto sm:w-max w-full gap-3 text-sm mt-7 m-auto">
        {tab.map((item, index) => (
          <motion.div
            key={index}
            onClick={() => handleTabClick(index)}
            className={`w-max px-3 py-1 rounded-md text-nowrap cursor-pointer transition-colors duration-200
              ${
                index === activeTab
                  ? "bg-white text-black border border-white shadow"
                  : "dark:bg-black dark:text-white"
              }`}
            whileTap={{ scale: 0.99 }}
            whileHover={{ scale: 1.05 }}
            layout
          >
            {t(item.trans)}
          </motion.div>
        ))}
      </div>

      {/* divider */}
      <hr className="h-1 mt-2 mb-3 dark:bg-secondary bg-muted rounded-[300%]" />

      {/* content */}
      <div className="w-full h-max">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab} // important for AnimatePresence
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {content[activeTab]?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </BlurFade>
  );
};

export default Tab;
