import React, { useState } from "react";
import { 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  Wifi, 
  ArrowLeft, 
  ArrowRight, 
  Cpu, 
  Settings, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  Info,
  BookOpen,
  Lightbulb,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function IoTBasics() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 5;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Helper for active pin in Slide 2
  const [activePin, setActivePin] = useState<string | null>("VCC");

  return (
    <div className="space-y-8 p-1 sm:p-2" id="iot-basics-root">
      
      {/* Intro section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black text-[#FF6321] bg-[#FF6321]/10 px-4 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
          📡 Wireless Communication Active
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#0C4A6E] tracking-tight">
          Hardware Anatomy: HC-05
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Unlock the secrets of wireless telemetry! Browse the 5 interactive slides below to learn how the HC-05 module sends magical command bytes directly to our microcontrollers.
        </p>
      </div>

      {/* Slide Navigation Progress Bar */}
      <div className="max-w-4xl mx-auto bg-white border-2 border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-sky-100 text-[#0369A1] rounded-xl font-black text-xs">
            SLIDE {currentSlide + 1} OF 5
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "w-8 bg-[#FF6321]" : "w-2.5 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`p-2 rounded-xl border transition-all ${
              currentSlide === 0 
                ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed" 
                : "text-slate-700 border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className={`p-2 rounded-xl border transition-all ${
              currentSlide === totalSlides - 1 
                ? "text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed" 
                : "text-slate-700 border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Container with AnimatePresence */}
      <div className="max-w-5xl mx-auto min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 1: INTRO (THE PROVIDED SLIDE) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border-4 border-[#0C4A6E] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] overflow-hidden border-b-4 border-[#0C4A6E] bg-slate-900">
                <img 
                  src="/src/assets/images/hc05_arduino_setup_1782281614148.jpg" 
                  alt="Arduino connected to HC-05 Bluetooth" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-700"
                />
                
                {/* Visual HUD overlay */}
                <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-1.5 text-white flex items-center gap-2 select-none">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span className="text-[10px] font-black uppercase tracking-wider font-mono">Telemetry Link: Active</span>
                </div>
              </div>

              <div className="p-6 sm:p-10 text-center space-y-4">
                <h3 className="text-3xl sm:text-5xl font-black text-[#0C4A6E] tracking-tight">
                  The Magic of HC-05!
                </h3>
                <p className="text-lg sm:text-xl font-bold text-slate-500 max-w-2xl mx-auto">
                  Your Tiny Wireless Walkie-Talkie Chip
                </p>
                <div className="max-w-xl mx-auto bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed font-semibold">
                  This tiny communication device connects your hardware projects with your mobile smartphone! When you slide a control on your screen, it broadcasts an invisible high-speed wave that is instantly decoded into actions!
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: PIN CONNECTIONS */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border-4 border-[#0C4A6E] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden"
            >
              {/* Lime green background circle accent exactly matching the slide design */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#D9F99D] rounded-full pointer-events-none opacity-80" />

              <div className="md:col-span-6 space-y-6 text-left relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-[#0C4A6E] tracking-tight">
                  Meeting the Pins
                </h3>

                {/* Styled checklist bullet items exactly matching the slide */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-lg bg-sky-100 text-[#0C4A6E] mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 font-semibold">
                      <strong className="text-slate-900 font-black">VCC</strong>: The Chip's Food (3.6V - 6V)
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-lg bg-sky-100 text-[#0C4A6E] mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 font-semibold">
                      <strong className="text-slate-900 font-black">GND</strong>: The Solid Floor (Ground)
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-lg bg-sky-100 text-[#0C4A6E] mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 font-semibold">
                      <strong className="text-slate-900 font-black">TXD (Talk)</strong>: The Chip's Mouth
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-lg bg-sky-100 text-[#0C4A6E] mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 font-semibold">
                      <strong className="text-slate-900 font-black">RXD (Read)</strong>: The Chip's Ears
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/60 p-3.5 rounded-2xl">
                    <div className="p-1 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-amber-700" />
                    </div>
                    <p className="text-xs sm:text-sm text-amber-900 font-bold leading-relaxed">
                      <strong className="font-black text-amber-950">Rule:</strong> Connect Mouth to Ear! (TX to RX)
                    </p>
                  </div>
                </div>
              </div>

              {/* Pinout Graphic image container on the right side */}
              <div className="md:col-span-6 bg-slate-50/50 p-4 sm:p-6 rounded-3xl border-2 border-slate-100 shadow-inner flex flex-col items-center justify-center gap-4 relative z-10">
                <span className="text-[10px] bg-[#0C4A6E] text-white px-3 py-1 rounded-full uppercase font-mono font-black tracking-wider select-none">
                  📡 Bluetooth Controller Loop
                </span>
                <div className="relative w-full max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-md">
                  <img 
                    src="/src/assets/images/phone_bluetooth_robot_car_1782282034821.jpg" 
                    alt="Smartphone controlling robot via Bluetooth link" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-semibold text-center max-w-[280px]">
                  Visual representation of a smartphone app transmitting directional command bytes wirelessly to an autonomous tracked vehicle.
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: BE A TECH DETECTIVE */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border-4 border-[#0C4A6E] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col space-y-8 text-center relative overflow-hidden"
            >
              <div className="space-y-2 text-left sm:text-center">
                <span className="text-[10px] bg-sky-100 text-[#0369A1] px-3.5 py-1.5 rounded-full uppercase font-mono font-black tracking-widest inline-block border border-sky-200">
                  🔍 Diagnostics & Troubleshooting
                </span>
                <h3 className="text-3xl sm:text-5xl font-black text-[#0C4A6E] tracking-tight">
                  Be a Tech Detective!
                </h3>
              </div>

              {/* Grid with 3 cards matching the user's design image */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Blink Check Card */}
                <div className="bg-[#D9F99D] text-slate-900 rounded-[2rem] p-8 flex flex-col items-center justify-start text-center space-y-4 shadow-md border-2 border-[#D9F99D] hover:scale-102 transition-transform duration-300 min-h-[360px]">
                  <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center text-slate-900">
                    <Lightbulb className="w-8 h-8 fill-slate-900 text-slate-900" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight text-slate-900">
                    Blink Check
                  </h4>
                  <p className="text-sm leading-relaxed font-semibold text-slate-800">
                    Blinking fast? It's lonely and looking for a friend (pairing mode)!
                  </p>
                </div>

                {/* Secret Code Card */}
                <div className="bg-[#C084FC] text-slate-900 rounded-[2rem] p-8 flex flex-col items-center justify-start text-center space-y-4 shadow-md border-2 border-[#C084FC] hover:scale-102 transition-transform duration-300 min-h-[360px]">
                  <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center text-slate-900">
                    <Search className="w-8 h-8 text-slate-900 stroke-[3]" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight text-slate-900">
                    Secret Code
                  </h4>
                  <p className="text-sm leading-relaxed font-semibold text-slate-800">
                    Locked out? Try the secret handshake codes: <strong className="font-extrabold">1234</strong> or <strong className="font-extrabold">0000</strong>!
                  </p>
                </div>

                {/* Wire Switch Card */}
                <div className="bg-[#FB923C] text-slate-900 rounded-[2rem] p-8 flex flex-col items-center justify-start text-center space-y-4 shadow-md border-2 border-[#FB923C] hover:scale-102 transition-transform duration-300 min-h-[360px]">
                  <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center text-slate-900">
                    <Settings className="w-8 h-8 text-slate-900" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight text-slate-900">
                    Wire Switch
                  </h4>
                  <p className="text-sm leading-relaxed font-semibold text-slate-800">
                    Not hearing anything? Swap the TX and RX wires. Mouth talks to Ear!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: BLUETOOTH IN THE WILD */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border-4 border-[#0C4A6E] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col space-y-8 relative overflow-hidden"
            >
              <div className="space-y-2 text-left sm:text-center">
                <span className="text-[10px] bg-sky-100 text-[#0369A1] px-3.5 py-1.5 rounded-full uppercase font-mono font-black tracking-widest inline-block border border-sky-200">
                  🌍 Real World Applications
                </span>
                <h3 className="text-3xl sm:text-5xl font-black text-[#0C4A6E] tracking-tight">
                  Bluetooth in the Wild
                </h3>
              </div>

              {/* Three elegant columns matching the user request image */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
                
                {/* Column 1: RC Robot Cars */}
                <div className="flex flex-col items-center space-y-4 text-center group">
                  <div className="w-full max-w-[280px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-100 shadow-md bg-white p-2 transition-transform duration-300 hover:scale-103">
                    <img 
                      src="/src/assets/images/rc_robot_cars_1782282435000.jpg" 
                      alt="Remote Controlled Robot Cars" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-800">
                      RC Robot Cars
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold max-w-[200px]">
                      Drive and race custom wireless tracked vehicles and robotic buggies straight from your smartphone!
                    </p>
                  </div>
                </div>

                {/* Column 2: Wireless Music */}
                <div className="flex flex-col items-center space-y-4 text-center group">
                  <div className="w-full max-w-[280px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-100 shadow-md bg-white p-2 transition-transform duration-300 hover:scale-103">
                    <img 
                      src="/src/assets/images/wireless_music_1782282450862.jpg" 
                      alt="Wireless Music Headphones" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-800">
                      Wireless Music
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold max-w-[200px]">
                      Stream your favorite high-fidelity audio tunes directly to bluetooth speakers or cozy headphones without any cables!
                    </p>
                  </div>
                </div>

                {/* Column 3: Smart Home Lights */}
                <div className="flex flex-col items-center space-y-4 text-center group">
                  <div className="w-full max-w-[280px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-100 shadow-md bg-white p-2 transition-transform duration-300 hover:scale-103">
                    <img 
                      src="/src/assets/images/smart_home_lights_1782282463923.jpg" 
                      alt="Smart Home and Lights" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-800">
                      Smart Home Lights
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold max-w-[200px]">
                      Instantly change colors, dim lights, and turn appliances on or off from across the living room!
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* SLIDE 5: DID YOU KNOW? VIKING CONNECTION */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border-4 border-[#0C4A6E] rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col space-y-8 relative overflow-hidden"
            >
              <div className="space-y-2 text-left sm:text-center">
                <span className="text-[10px] bg-amber-100 text-[#B45309] px-3.5 py-1.5 rounded-full uppercase font-mono font-black tracking-widest inline-block border border-amber-200">
                  📖 Historical Fun Fact
                </span>
                <h3 className="text-3xl sm:text-5xl font-black text-[#0C4A6E] tracking-tight">
                  Did You Know?
                </h3>
              </div>

              {/* Grid with 2 columns matching the user's design image */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
                {/* Left Side: Viking Cartoon Image */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="w-full max-w-[320px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-100 shadow-md bg-white p-2">
                    <img 
                      src="/src/assets/images/viking_harald_bluetooth_1782282694624.jpg" 
                      alt="King Harald Bluetooth Cartoon Illustration" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>

                {/* Right Side: Viking Connection! */}
                <div className="md:col-span-7 text-left space-y-6">
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                    Viking Connection!
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
                      </div>
                      <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
                        Bluetooth is named after <strong className="text-slate-900 font-black">King Harald Bluetooth</strong> from 1,000 years ago!
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
                      </div>
                      <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
                        Just like the King united tribes, Bluetooth unites your phone, toys, and speakers into one happy family!
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
                      </div>
                      <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
                        The logo is actually two Viking letters (runes for <strong className="text-slate-900 font-black">H</strong> and <strong className="text-slate-900 font-black">B</strong>) joined together!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
