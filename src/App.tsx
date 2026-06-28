import React, { useState } from "react";
import { Sparkles, ArrowRight, Cpu, Radio, Gauge, Thermometer } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import IoTBasics from "./components/IoTBasics";
import ProjectLed from "./components/ProjectLed";
import ProjectServo from "./components/ProjectServo";
import ProjectWeather from "./components/ProjectWeather";
import IoTExplorerPresentation from "./components/IoTExplorerPresentation";
import { PROJECTS_DATA, IMAGES } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "basics" | "projects" >("projects");
  const [activeProjectId, setActiveProjectId] = useState<"led_control" | "servo_phone" | "weather_dht11">("servo_phone");
  const [completedPresentation, setCompletedPresentation] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>("");

  const launchProject = (id: "led_control" | "servo_phone" | "weather_dht11") => {
    setActiveProjectId(id);
    setCompletedPresentation(true);
    setActiveTab("projects");
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-slate-800 font-sans flex flex-col antialiased selection:bg-[#FF6321]/20 selection:text-[#FF6321]" id="app-root">
      
      {/* KID-FRIENDLY ACCENT TOP-BAR */}
      <div className="h-1 bg-gradient-to-r from-[#FF6321] via-[#38BDF8] to-[#4ADE80]"></div>

      {/* STICKY MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-white px-6 py-4 shadow-md border-b-4 border-[#38BDF8] transition-all">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo */}
          <button 
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 focus:outline-hidden group cursor-pointer text-left"
          >
            <div className="w-10 h-10 bg-[#FF6321] rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-sm group-hover:scale-105 transition-all duration-300">
              i
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0C4A6E] leading-none mb-1">
                Module 103 <span className="text-[#FF6321]">Internet of Things</span>
              </h1>
              <span className="text-[10px] text-[#38BDF8] font-bold tracking-wider uppercase font-mono block">
                Interactive Learning Hub
              </span>
            </div>
          </button>

          {/* Navigation and Pupil Pill Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
            {/* Simple Navigation Menu */}
            <nav className="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200">
              {[
                { id: "home" as const, label: "🏠 Home Base" },
                { id: "basics" as const, label: "🛠️ Hardware Anatomy" },
                { id: "projects" as const, label: "🚀 IoT Explorer" }
              ].map((navTab) => {
                const isSelected = activeTab === navTab.id;
                return (
                  <button
                    key={navTab.id}
                    onClick={() => setActiveTab(navTab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-white text-[#0C4A6E] shadow-sm font-black"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {navTab.label}
                  </button>
                );
              })}
            </nav>

            {/* Student Explorer Badge Indicator */}
            <div className="flex items-center gap-2 bg-[#E0F2FE] px-4 py-1.5 rounded-full border border-[#bae6fd]">
              <div className="w-6 h-6 bg-[#38BDF8] rounded-full border-2 border-white flex items-center justify-center text-[11px] text-white">👦</div>
              <span className="font-extrabold text-xs text-[#0369A1] tracking-tight">Student Explorer</span>
            </div>
          </div>

        </div>
      </header>

      {/* CORE FRAME FOR VIEW TRANSITIONS */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 w-full space-y-12">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              layoutId="home-tab-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-12"
              id="home-content"
            >
              {/* HERO BANNER SECTION */}
              <div className="bg-gradient-to-r from-[#38BDF8] to-[#818CF8] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row gap-8 items-center min-h-[320px]">
                
                {/* Decorative background vectors from spec */}
                <div className="absolute right-[-20px] top-[-20px] opacity-20 pointer-events-none">
                  <svg width="200" height="200" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="white"/>
                  </svg>
                </div>

                {/* Left block of Banner */}
                <div className="md:w-1/2 space-y-4 relative z-10 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full border border-white/25 text-xs text-yellow-300 font-extrabold shadow-3xs">
                    <Sparkles className="w-3.5 h-3.5" /> Welcome to the World of IoT!
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    Welcome to the World of IoT!
                  </h2>
                  <p className="text-lg md:text-xl font-medium opacity-90 leading-relaxed">
                    Learn how to control things around you using just your phone and simple electronics. Ready to become a tech wizard?
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <button 
                      onClick={() => setActiveTab("basics")}
                      className="px-5 py-3 bg-white text-[#0C4A6E] font-black text-xs rounded-2xl hover:bg-slate-50 transition-all cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5"
                    >
                      🛠️ View Hardware Anatomy <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
                    </button>
                    <button 
                      onClick={() => setActiveTab("projects")}
                      className="px-5 py-3 bg-[#FF6321] hover:bg-[#ff7a42] font-black text-xs text-white rounded-2xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-md border-b-4 border-[#b53c07]"
                    >
                      🚀 IoT Explorer
                    </button>
                  </div>
                </div>

                {/* Right block graphical image illustration */}
                <div className="md:w-1/2 flex justify-center relative">
                  <div className="relative">
                    <img 
                      src={IMAGES.hero} 
                      alt="Robotics & IoT Training Institute (RITI) Logo" 
                      className="w-[300px] h-auto rounded-3xl object-cover shadow-2xl border-4 border-white/20 transition-all hover:scale-[1.02] duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded-xl text-[9px] font-black text-indigo-405 uppercase tracking-widest flex items-center gap-1 shadow-md text-indigo-400">
                      <span>⚡</span> LIVE LEARNING STATION
                    </div>
                  </div>
                </div>
              </div>

              {/* THREE INTERACTIVE PROJECT CARDS GRAPHIC LINKERS */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b-2 border-indigo-100 pb-2">
                  <h3 className="text-2xl font-black text-[#0C4A6E] tracking-tight">
                    Choose Your Mission:
                  </h3>
                  <span className="bg-yellow-400 text-[#854D0E] px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider shadow-sm">
                    3 Active Missions Today
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {PROJECTS_DATA.map((proj) => {
                    // Decide custom border/bg depending on project type
                    let cardBorder = "border-[#FACC15]";
                    let blockBg = "bg-[#FEF9C3]";
                    let btnStyle = "bg-[#FACC15] text-[#854D0E] hover:bg-[#FDE047]";
                    let catPill = "bg-blue-100 text-blue-600";
                    let techPill = "bg-purple-100 text-purple-600";
                    let techLabel = "Bluetooth";

                    if (proj.id === "servo_phone") {
                      cardBorder = "border-[#FB923C]";
                      blockBg = "bg-[#FFEDD5]";
                      btnStyle = "bg-[#FB923C] text-white hover:bg-[#F97316]";
                      catPill = "bg-blue-100 text-blue-600";
                      techPill = "bg-orange-100 text-orange-600";
                      techLabel = "Motion";
                    } else if (proj.id === "weather_dht11") {
                      cardBorder = "border-[#4ADE80]";
                      blockBg = "bg-[#DCFCE7]";
                      btnStyle = "bg-[#4ADE80] text-[#064E3B] hover:bg-[#22C55E]";
                      catPill = "bg-blue-100 text-blue-600";
                      techPill = "bg-green-100 text-green-600";
                      techLabel = "Sensor";
                    }

                    return (
                      <div 
                        key={proj.id}
                        onClick={() => launchProject(proj.id)}
                        className={`bg-white rounded-[2.5rem] p-6 shadow-xl border-b-8 ${cardBorder} flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                      >
                        {/* Dynamic colorful visual thumbnail container */}
                        <div className={`h-40 rounded-3xl mb-6 flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner relative group`}>
                          <img 
                            src={proj.image} 
                            alt={proj.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase text-white px-2.5 py-0.5 rounded-full ${proj.accentColor}`}>
                            {proj.difficulty}
                          </div>
                        </div>

                        {/* Info details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`${catPill} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
                                Beginner
                              </span>
                              <span className={`${techPill} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
                                {techLabel}
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-slate-800 mb-2 leading-tight">
                              {proj.id === "led_control" ? "Magic Phone Light" : proj.id === "servo_phone" ? "Robot Arm Waving" : "My Weather Station"}
                            </h4>
                            <p className="text-xs text-slate-500 leading-normal mb-4">
                              {proj.shortDesc}
                            </p>
                          </div>

                          <div className="space-y-4">
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent duplicate trigger
                                launchProject(proj.id);
                              }}
                              className={`w-full py-3 rounded-2xl ${btnStyle} font-black text-xs uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-1.5 shadow-xs`}
                            >
                              START MISSION 🚀
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>



            </motion.div>
          )}

          {activeTab === "basics" && (
            <motion.div
              layoutId="basics-tab-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              id="basics-drawer"
            >
              <IoTBasics />
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div
              layoutId="projects-tab-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
              id="projects-content"
            >
              {!completedPresentation ? (
                <IoTExplorerPresentation 
                  onComplete={(name) => {
                    setStudentName(name);
                    setCompletedPresentation(true);
                  }} 
                />
              ) : (
                <>
                  {/* Student Welcome Banner */}
                  <div className="bg-gradient-to-r from-[#DCFCE7] to-[#ECFDF5] border-2 border-[#10B981] rounded-3xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl animate-bounce">🎓</span>
                      <div className="text-left">
                        <h4 className="text-sm font-black text-[#065F46] leading-none mb-1">
                          Welcome to the Workbench, Junior Inventor {studentName}!
                        </h4>
                        <p className="text-xs font-semibold text-emerald-700">
                          Your IoT Slide Presentation completes successfully. Try out the sandbox systems below!
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCompletedPresentation(false)}
                      className="px-4 py-1.5 bg-white border-2 border-emerald-300 hover:border-emerald-500 rounded-xl text-[10px] font-black text-emerald-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                    >
                      📖 Review PPT Slides
                    </button>
                  </div>

                  {/* Project selector bar switcher */}
                  <div className="bg-white rounded-3xl p-3.5 border-2 border-[#38BDF8] flex flex-col md:flex-row gap-4 justify-between items-center shadow-md">
                    <span className="text-xs font-black text-[#0C4A6E] uppercase tracking-wider pl-3 mb-1 md:mb-0">
                      Select Active IoT Explorer Simulator 🧠
                    </span>
                    <div className="flex flex-wrap gap-1 bg-slate-100 rounded-2xl p-1 w-full md:w-auto font-sans">
                      {[
                        { id: "led_control" as const, label: "💡 Project 1: LED Phone Controller" },
                        { id: "servo_phone" as const, label: "⚙️ Project 2: Smart Feeder Servo" },
                        { id: "weather_dht11" as const, label: "🌡️ Project 3: DHT11 Climate Hub" }
                      ].map((projBtn) => {
                        const isSelected = activeProjectId === projBtn.id;
                        return (
                          <button
                            key={projBtn.id}
                            onClick={() => setActiveProjectId(projBtn.id)}
                            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#38BDF8] text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {projBtn.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Project view selection drawer */}
                  <div className="bg-transparent rounded-2xl transition-all duration-300">
                    {activeProjectId === "led_control" && <ProjectLed />}
                    {activeProjectId === "servo_phone" && <ProjectServo />}
                    {activeProjectId === "weather_dht11" && <ProjectWeather />}
                  </div>
                </>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t-2 border-slate-200 p-6 shadow-top flex flex-col md:flex-row justify-between items-center gap-4 mt-12">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-start text-center sm:text-left">
          <div className="bg-slate-100 border border-slate-300 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-black uppercase font-mono tracking-wider">
            v1.2 STUDENT EDITION
          </div>
          <p className="text-xs text-slate-405 font-medium text-slate-500 max-w-sm">
            Safe, Easy, and Fun learning environment for Junior Hardware Engineers. All circuitry processes are sandboxed.
          </p>
        </div>
        <div className="flex gap-3.5 items-center flex-col sm:flex-row">
          <span className="text-sm font-black text-slate-600">Stuck on a wire?</span>
          <button 
            onClick={() => alert("👨‍🏫 Code Cadet! Professor Otto recommends double-checking your Gnd (-) and VCC (5V) jumper routes inside the Assembly Guides checklist below the simulation card matches!")}
            className="bg-white border-2 border-[#38BDF8] text-[#38BDF8] px-4 py-2 rounded-full text-xs font-black hover:bg-[#38BDF8] hover:text-white transition-all cursor-pointer shadow-3xs"
          >
            ASK A TEACHER 🙋‍♂️
          </button>
        </div>
      </footer>

    </div>
  );
}
