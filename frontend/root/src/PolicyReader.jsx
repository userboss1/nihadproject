import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icon from 'lucide-react'; 

// --- MOCK POLICY DATA ---
const policyData = {
  title: "Employee Code of Conduct & Ethics",
  version: "1.2.0 (Effective Jan 2026)",
  sections: [
    {
      id: 1,
      title: "Introduction and Scope",
      icon: "Users",
      content: "This policy outlines the expected behavior and professional standards for all employees. Adherence is mandatory to foster a respectful and productive work environment.",
      required: true
    },
    {
      id: 2,
      title: "Confidentiality and Data Security",
      icon: "Lock",
      content: "Protecting proprietary information, client data, and sensitive company records is paramount. Employees must follow all guidelines regarding secure data handling and communication.",
      required: true
    },
    {
      id: 3,
      title: "Workplace Harassment and Discrimination",
      icon: "Shield",
      content: "We maintain a zero-tolerance policy for harassment, intimidation, or discrimination based on race, gender, religion, sexual orientation, or any other protected characteristic.",
      required: true
    },
    {
      id: 4,
      title: "Use of Company Assets",
      icon: "Laptop",
      content: "Company-provided equipment, software, and communication systems are intended solely for business use. Personal use must be minimal and compliant with security protocols.",
      required: false
    },
    {
      id: 5,
      title: "Reporting Violations and Whistleblowing",
      icon: "AlertTriangle",
      content: "Employees are encouraged to report observed or suspected violations through designated channels. Retaliation against whistleblowers is strictly prohibited.",
      required: true
    },
    {
      id: 6,
      title: "Policy Sign-off and Acknowledgment",
      icon: "CheckCircle",
      content: "I acknowledge that I have read, understood, and agree to abide by the terms of this Employee Code of Conduct and Ethics policy.",
      required: true
    }
  ],
};
// --- END MOCK POLICY DATA ---


// --- COMPONENT: SECTION LIST ITEM ---
const SectionListItem = ({ section, isCurrent, isCompleted, onSelect }) => {
  if (!section) return null; 
  
  const iconName = section.icon || 'FileText';
  const LucideIcon = Icon[iconName] || Icon.FileText;

  return (
    <motion.li
      onClick={() => onSelect(section.id)}
      className={`relative p-3 cursor-pointer transition-all duration-300 rounded-lg group ${
        isCurrent
          ? 'bg-blue-50/80 shadow-inner'
          : 'hover:bg-gray-50'
      }`}
      whileHover={{ x: isCurrent ? 0 : 4 }}
    >
      {/* Active Indicator Line - Now on the LEFT */}
      {isCurrent && (
        <motion.div
          layoutId="activeSection"
          className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-lg shadow-lg"
        />
      )}
      
      <div className="flex items-center gap-3 ml-2">
        {/* Status Checkmark/Icon */}
        <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
          isCompleted 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-500'
        }`}>
          {isCompleted ? <Icon.Check className="w-4 h-4" /> : <LucideIcon className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold transition-colors ${isCurrent ? 'text-blue-800' : 'text-gray-700'}`}>
            {section.id}. {section.title}
          </p>
          {section.required && (
            <p className={`text-xs ${isCompleted ? 'text-green-600' : 'text-red-500'}`}>
              {isCompleted ? 'Completed' : 'Required Reading'}
            </p>
          )}
        </div>
      </div>
    </motion.li>
  );
};


// --- COMPONENT: MAIN POLICY READER ---
const PolicyReader = () => {
  const [currentSectionId, setCurrentSectionId] = useState(1);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [isPolicySigned, setIsPolicySigned] = useState(false);
  
  const currentSection = policyData.sections.find(s => s.id === currentSectionId);
  const requiredCount = policyData.sections.filter(s => s.required).length;
  const completedRequiredCount = policyData.sections.filter(s => s.required && completedSections.has(s.id)).length;
  const progressPercent = (completedRequiredCount / requiredCount) * 100 || 0;
  
  const allRequiredComplete = completedRequiredCount === requiredCount;

  // Handler to mark the section as read and navigate to the next
  const handleNextSection = () => {
    if (currentSection) {
      setCompletedSections(prev => new Set(prev).add(currentSection.id));
    }

    const nextSection = policyData.sections.find(s => s.id > currentSectionId);
    if (nextSection) {
      setCurrentSectionId(nextSection.id);
    } 
  };

  // Handler for final sign-off
  const handleSignOff = () => {
      if (allRequiredComplete) {
          setIsPolicySigned(true);
      }
  };

  // Framer Motion variant for content transition
  const contentVariants = {
    enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } },
    initial: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >

        {/* --- LEFT COLUMN: READING PANE (Content) --- */}
        <motion.div className="lg:col-span-2" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 min-h-[70vh]">
            
            <AnimatePresence mode="wait">
              {currentSection && (
                <motion.div
                  key={currentSection.id}
                  variants={contentVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                >
                  <h2 className="text-4xl font-extrabold text-gray-900 mb-4 border-b pb-3">
                    {currentSection.title}
                  </h2>
                  <p className="text-sm font-medium text-blue-600 mb-6">
                    Section {currentSection.id} of {policyData.sections.length}
                  </p>
                  
                  <div className="text-lg text-gray-700 leading-relaxed mb-10">
                    <p>{currentSection.content}</p>
                  </div>
                  
                  {/* Action Button */}
                  <motion.button
                    onClick={handleNextSection}
                    disabled={isPolicySigned}
                    className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                    whileHover={{ scale: isPolicySigned ? 1 : 1.05 }}
                    whileTap={{ scale: isPolicySigned ? 1 : 0.95 }}
                  >
                    {currentSection.id === policyData.sections.length ? (
                        <>
                            <Icon.BookMarked className="w-5 h-5" /> Finish Reading
                        </>
                    ) : (
                        <>
                            <Icon.ChevronsRight className="w-5 h-5" /> Mark as Read & Continue
                        </>
                    )}
                  </motion.button>
                  
                  {/* Status Tag */}
                  <motion.div 
                    className="mt-6 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                      {completedSections.has(currentSection.id) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-green-700 bg-green-100 rounded-full font-medium">
                              <Icon.Check className="w-4 h-4" /> Section viewed.
                          </span>
                      ) : (
                           <span className="inline-flex items-center gap-1.5 px-3 py-1 text-red-700 bg-red-100 rounded-full font-medium">
                              <Icon.AlertTriangle className="w-4 h-4" /> Action required.
                          </span>
                      )}
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
        
        {/* --- RIGHT COLUMN: NAVIGATION & STATUS (Sidebar) --- */}
        <motion.div className="lg:col-span-1" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <div className="bg-white p-6 rounded-2xl shadow-2xl sticky top-10 border border-gray-100">
            
            {/* Header */}
            <h1 className="text-2xl font-extrabold text-gray-900 border-b pb-3 mb-4">
              {policyData.title}
            </h1>
            <p className="text-sm text-gray-500 mb-6">Version: {policyData.version}</p>

            {/* Progress Bar with Motion */}
            <div className="mb-8">
                <p className="text-sm font-semibold mb-2 text-gray-700">Reading Progress ({completedRequiredCount}/{requiredCount} required sections)</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                        className="bg-blue-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1 }}
                    />
                </div>
                <p className="text-xs text-blue-600 font-bold mt-1">{progressPercent.toFixed(0)}% Complete</p>
            </div>

            {/* Navigation List */}
            <motion.ul layout className="space-y-2">
              {policyData.sections.map((section) => (
                <SectionListItem
                  key={section.id}
                  section={section}
                  isCurrent={section.id === currentSectionId}
                  isCompleted={completedSections.has(section.id)}
                  onSelect={setCurrentSectionId}
                />
              ))}
            </motion.ul>

            {/* Final Sign-off Button */}
            <motion.button
                onClick={handleSignOff}
                disabled={!allRequiredComplete || isPolicySigned}
                className={`w-full mt-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    isPolicySigned
                        ? 'bg-green-600 text-white cursor-default'
                        : allRequiredComplete
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                whileHover={{ scale: isPolicySigned || !allRequiredComplete ? 1 : 1.01 }}
                whileTap={{ scale: isPolicySigned || !allRequiredComplete ? 1 : 0.98 }}
            >
                {isPolicySigned ? (
                    <>
                        <Icon.SealCheck className="w-5 h-5" /> Policy Acknowledged
                    </>
                ) : (
                    <>
                        <Icon.PenTool className="w-5 h-5" /> Acknowledge & Sign
                    </>
                )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PolicyReader;  
// 1010