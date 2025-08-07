"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import EducationExperience from "../dashboard/Education";
import Profile from "../dashboard/Profile";
import Projects from "../dashboard/Projects";
import Skills from "../dashboard/Skills";
import WorkExperience from "../dashboard/WorkExperience";

const Tab = () => {
  const [activeTab, setActiveTab] = useState(0);
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

  return (
    <Fragment>
      <div className="w-full bg-secondary rounded-md py-1.5 px-2 flex overflow-auto gap-3 text-sm mt-12 no-scrollbar overscroll-none justify-evenly">
        {tab.map((item, index) => (
          <motion.div
            key={index}
            onClick={() => setActiveTab(index)}
            className={`w-max px-3 py-1 rounded-md text-nowrap cursor-pointer transition-colors duration-200
              ${
                index === activeTab
                  ? "bg-white text-black border border-white shadow"
                  : "bg-black text-white"
              }
            `}
            whileTap={{ scale: 0.99 }}
            whileHover={{ scale: 1.05 }}
            layout
          >
            {t(item.trans)}
          </motion.div>
        ))}
      </div>
      {/* content */}
      <div className="w-full mt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {content[activeTab].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </Fragment>
  );
};

export default Tab;
