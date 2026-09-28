'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Blog from './Blog';
import EducationExperience from './Education';
import Profile from './Profile';
import Projects from './Projects';
import Skills from './Skills';
import Socials from './Socials';
import WorkExperience from './WorkExperience';

/** Ordered dashboard sections; `trans` is a key under `dashboard.menu`. */
const TABS = [
  { trans: 'Profile', component: Profile },
  { trans: 'Work', component: WorkExperience },
  { trans: 'Education', component: EducationExperience },
  { trans: 'Skills', component: Skills },
  { trans: 'Projects', component: Projects },
  { trans: 'Socials', component: Socials },
  { trans: 'Blog', component: Blog },
] as const;

/** Dashboard section switcher with animated content transitions. */
const Tab = () => {
  const t = useTranslations('dashboard.menu');
  const [activeTab, setActiveTab] = useState(0);

  const Active = TABS[activeTab].component;

  return (
    <div className="mt-7">
      <div
        role="tablist"
        aria-label="Dashboard sections"
        className="m-auto flex w-full gap-1.5 overflow-x-auto rounded-xl border bg-muted/50 p-1.5 sm:w-max"
      >
        {TABS.map((tab, index) => (
          <button
            key={tab.trans}
            role="tab"
            type="button"
            aria-selected={index === activeTab}
            onClick={() => setActiveTab(index)}
            className={cn(
              'whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors',
              index === activeTab ? 'bg-primary font-medium text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t(tab.trans)}
          </button>
        ))}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Active />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tab;
