import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Cpu, 
  Radio, 
  Gauge, 
  Thermometer, 
  Smartphone, 
  Lightbulb, 
  Trophy, 
  Wifi, 
  Volume2, 
  ChevronRight,
  RefreshCw,
  Heart,
  Cloud,
  Car,
  Star,
  Eye,
  Wand2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IoTExplorerPresentationProps {
  onComplete: (studentName: string) => void;
}

export default function IoTExplorerPresentation({ onComplete }: IoTExplorerPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [studentName, setStudentName] = useState<string>("");
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [activeBlock, setActiveBlock] = useState<"sensor" | "brain" | "actuator" | null>("sensor");
  const [waveSpeed, setWaveSpeed] = useState<number>(3);
  const [pledgeChecked, setPledgeChecked] = useState<boolean>(true);

  // 4 slide config
  const totalSlides = 4;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete(studentName || "Junior Inventor");
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1200);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] border-4 border-[#0C4A6E] shadow-2xl p-6 md:p-8 relative overflow-hidden" id="iot-presentation-container">
      
      {/* Cartoon-style banner design */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#FF6321] via-[#38BDF8] to-[#4ADE80]"></div>
      
      {/* Decorative items */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-100 rounded-full opacity-40 pointer-events-none -z-0"></div>
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-sky-100 rounded-full opacity-45 pointer-events-none -z-0"></div>

      <div className="relative z-10 flex flex-col h-full min-h-[480px] justify-between gap-6">
        
        {/* UPPER PROGRESS & HEADER NAVIGATION */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#E0F2FE] text-[#0369A1] rounded-xl font-black text-sm">
              📟 Module 103 Slide
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {currentSlide + 1} of {totalSlides}
            </span>
          </div>
          
          {/* Slide Navigator Dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-8 bg-[#FF6321]" : "w-3 bg-slate-200"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={() => onComplete(studentName || "Junior Inventor")}
            className="text-xs font-black text-slate-400 hover:text-[#FF6321] transition-all cursor-pointer border border-dashed border-slate-200 px-3 py-1 rounded-lg"
          >
            Skip Slide Show ❯❯
          </button>
        </div>

        {/* CORE INTERACTIVE CONTENT SECTION */}
        <div className="flex-1 py-4 flex flex-col justify-center min-h-[360px]">
          <AnimatePresence mode="wait">
            {currentSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                {/* Left side text and icon bullets matching the user's slide */}
                <div className="space-y-6 text-left">
                  <h3 className="text-4xl font-extrabold text-[#0C4A6E] tracking-tight font-sans">
                    What is IoT?
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-slate-800 font-bold leading-relaxed">
                      <span className="text-[#FF6321] font-extrabold decoration-wavy decoration-yellow-400">Magic Talk!</span> IoT means things "chatting" with each other using Internet.
                    </p>
                    
                    {/* Bullet List matching provided slide */}
                    <div className="space-y-4 pt-2">
                      {/* Row 1: Internet */}
                      <div className="flex items-start gap-4 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                        <div className="p-3 bg-orange-100 rounded-xl text-orange-600 flex-shrink-0 shadow-xs">
                          <Cloud className="w-6 h-6 fill-orange-500/25 stroke-[2.5]" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base text-slate-950 font-medium leading-relaxed">
                            <strong className="text-base sm:text-lg font-black text-[#0C4A6E] block leading-tight mb-0.5">Internet:</strong>
                            Like a giant invisible web connecting the world.
                          </p>
                        </div>
                      </div>

                      {/* Row 2: Things */}
                      <div className="flex items-start gap-4 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600 flex-shrink-0 shadow-xs">
                          <Car className="w-6 h-6 fill-blue-500/25 stroke-[2.5]" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base text-slate-950 font-medium leading-relaxed">
                            <strong className="text-base sm:text-lg font-black text-[#0C4A6E] block leading-tight mb-0.5">Things:</strong>
                            Your toys, your lamp, or even your fridge!
                          </p>
                        </div>
                      </div>

                      {/* Row 3: IoT */}
                      <div className="flex items-start gap-4 p-2.5 rounded-2xl hover:bg-slate-50/80 transition-colors">
                        <div className="p-3 bg-emerald-100 rounded-xl text-[#059669] flex-shrink-0 shadow-xs">
                          <Star className="w-6 h-6 fill-emerald-500/25 stroke-[2.5]" />
                        </div>
                        <div>
                          <p className="text-sm sm:text-base text-slate-950 font-medium leading-relaxed">
                            <strong className="text-base sm:text-lg font-black text-[#0C4A6E] block leading-tight mb-0.5">IoT:</strong>
                            When these things talk to help us!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side showing cute blue robot image */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-slate-50 rounded-[2.5rem] p-4 border-4 border-[#0C4A6E] shadow-xl relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] bg-white group">
                    <img 
                      src="/src/assets/images/toy_robot_iot_1781502265872.jpg" 
                      alt="Cute IoT Toy Robot" 
                      referrerPolicy="no-referrer"
                      className="w-full max-w-[280px] h-[280px] object-cover rounded-[1.75rem] shadow-inner"
                    />
                    
                    {/* Sparkle badge */}
                    <div className="absolute top-6 right-6 bg-[#FF6321] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider animate-pulse font-mono">
                      Say Hello! 🤖
                    </div>

                    {/* Fun Interactive sound effect badge */}
                    <div className="mt-3 p-2 bg-yellow-50 rounded-xl border border-yellow-250 border-yellow-200 text-center text-[11px] font-bold text-yellow-800 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-yellow-100 transition-colors"
                         onClick={triggerPulse}>
                      <span>🔊 Tap to listen:</span>
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-yellow-300">
                        {isPulsing ? '"BEEP BOOP! 🦾 Let\'s learn!"' : '"Click to beep!"'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="flex flex-col items-center w-full space-y-6"
              >
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0C4A6E] tracking-tight font-sans text-center mb-2">
                  How Does It Work?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
                  {/* Card 1: It Feels! */}
                  <div className="bg-[#FFEAD8] border-3 border-[#F97316] rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="p-4 bg-white/50 rounded-full mb-5 shadow-inner">
                      <Eye className="w-12 h-12 text-[#1E293B] stroke-[2.5]" />
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-[#1E293B] mb-3 font-sans">
                      1. It Feels!
                    </h4>
                    <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-bold">
                      Devices use tiny "eyes" called <span className="text-black font-black underline decoration-[#F97316] decoration-3">sensors</span> to see and hear what's happening.
                    </p>
                  </div>

                  {/* Card 2: It Talks! */}
                  <div className="bg-[#E9FFA0] border-3 border-[#84CC16] rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="p-4 bg-white/50 rounded-full mb-5 shadow-inner">
                      <Wifi className="w-12 h-12 text-[#1E293B] stroke-[2.5]" />
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-[#1E293B] mb-3 font-sans">
                      2. It Talks!
                    </h4>
                    <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-bold">
                      The device sends a secret message through the <span className="text-black font-black underline decoration-lime-600 decoration-3">invisible web</span> (the Internet).
                    </p>
                  </div>

                  {/* Card 3: It Does! */}
                  <div className="bg-[#DBC0FF] border-3 border-[#A855F7] rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="p-4 bg-white/50 rounded-full mb-5 shadow-inner">
                      <Wand2 className="w-12 h-12 text-[#1E293B] stroke-[2.5]" />
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-[#1E293B] mb-3 font-sans">
                      3. It Does!
                    </h4>
                    <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-bold">
                      The device does a <span className="text-black font-black underline decoration-purple-600 decoration-3">cool trick</span>, like turning on a light for you!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentSlide === 2 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="flex flex-col items-center w-full space-y-6"
              >
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0C4A6E] tracking-tight font-sans text-center mb-2">
                  Magic Things at Home
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
                  {/* Card 1: Smart Watch */}
                  <div className="bg-white border-3 border-[#38BDF8] rounded-[2.5rem] p-5 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-4 border-2 border-slate-100 shadow-inner bg-slate-50">
                      <img 
                        src="/src/assets/images/smart_watch_children_1781510861458.jpg" 
                        alt="Smart Watch counts your jumps" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-[#0C4A6E] mb-2 font-sans">
                      Smart Watch
                    </h4>
                    <p className="text-sm text-slate-900 font-bold leading-relaxed">
                      It counts your jumps and tells you how fast you run!
                    </p>
                  </div>

                  {/* Card 2: Smart Lights */}
                  <div className="bg-white border-3 border-[#A855F7] rounded-[2.5rem] p-5 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-4 border-2 border-slate-100 shadow-inner bg-slate-50">
                      <img 
                        src="/src/assets/images/smart_lights_app_1781510880700.jpg" 
                        alt="Smart Lights change colors" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-[#0C4A6E] mb-2 font-sans">
                      Smart Lights
                    </h4>
                    <p className="text-sm text-slate-900 font-bold leading-relaxed">
                      They change colors when you ask nicely!
                    </p>
                  </div>

                  {/* Card 3: Smart Toy */}
                  <div className="bg-white border-3 border-[#FF6321] rounded-[2.5rem] p-5 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-4 border-2 border-slate-100 shadow-inner bg-slate-50">
                      <img 
                        src="/src/assets/images/smart_robot_child_1781510894439.jpg" 
                        alt="Smart Toy robot dances" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-[#0C4A6E] mb-2 font-sans">
                      Smart Toy
                    </h4>
                    <p className="text-sm text-slate-900 font-bold leading-relaxed">
                      A robot that dances and sings your favorite songs!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentSlide === 3 && (
              <motion.div
                key="slide-3"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                {/* Left Side: Glowing cyberpunk network sphere image card */}
                <div className="relative flex flex-col items-center">
                  <div className="bg-white rounded-[2.5rem] p-4 border-4 border-[#0C4A6E] shadow-xl relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] w-full max-w-[320px]">
                    <img 
                      src="/src/assets/images/iot_network_globe_1781511545392.jpg" 
                      alt="Cyber spherical globe of IoT network" 
                      referrerPolicy="no-referrer"
                      className="w-full h-[260px] object-cover rounded-[1.75rem] shadow-inner"
                    />
                    
                    {/* Glowing active hub sticker */}
                    <div className="absolute top-6 right-6 bg-[#A855F7] text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider animate-pulse font-mono font-sans">
                      Active Globe 🌐
                    </div>

                    {/* Quick interactive stats counter */}
                    <div className="mt-3.5 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer hover:bg-emerald-100 transition-all"
                         onClick={triggerPulse}>
                      <span>🟢 Live connections:</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 animate-pulse text-[#0C4A6E] font-black">
                        {isPulsing ? "50,000,000,241" : "50,000,000,000+"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Text description */}
                <div className="space-y-5 text-left">
                  <span className="bg-emerald-150 text-emerald-800 font-black text-xs uppercase px-3.5 py-1.5 rounded-full border border-emerald-200 inline-block font-sans">
                    💡 Did you know?
                  </span>
                  
                  <div className="space-y-3">
                    <h3 className="text-4xl font-extrabold text-[#0C4A6E] tracking-tight font-sans leading-none">
                      A Wow Fact!
                    </h3>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                       More "Things" Than People!
                    </h1>
                    
                    <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed">
                      There are over <strong className="text-[#0C4A6E] font-black">50 Billion</strong> talking things in the world right now.
                    </p>
                    <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed">
                      That means there are more talking robots and gadgets than all the people on Earth!
                    </p>
                    
                    <p className="text-base sm:text-lg font-extrabold text-[#FF6321] tracking-tight leading-relaxed">
                      That's a lot of robot friends! 🤖✨
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM STEP CONTROL ACTIONS BAR */}
        <div className="flex items-center justify-between border-t pt-4 border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1 font-black text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer ${
              currentSlide === 0 
                ? "text-slate-300 border-slate-100 cursor-not-allowed" 
                : "text-slate-605 text-slate-700 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1 && !pledgeChecked}
            className={`flex items-center gap-1 font-black text-xs px-5 py-2.5 rounded-xl text-white transition-all border-b-4 border-slate-900 shadow-md ${
              currentSlide === totalSlides - 1 && !pledgeChecked
                ? "bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-75"
                : "bg-[#0C4A6E] hover:bg-[#0369A1] cursor-pointer"
            }`}
          >
            <span>{currentSlide === totalSlides - 1 ? "Start Sandbox" : "Next Slide"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
