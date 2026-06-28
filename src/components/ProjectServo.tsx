import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Cpu, 
  Gauge, 
  Radio, 
  Shield, 
  Smartphone, 
  Terminal, 
  Activity, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  Zap, 
  HelpCircle,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Wifi,
  Lock,
  Unlock,
  Settings,
  RefreshCw,
  Send
} from "lucide-react";

export default function ProjectServo() {
  const [angle, setAngle] = useState<number>(0);
  const [hasFed, setHasFed] = useState<boolean>(false);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    "SYS: Servo calibration complete. Pin 9 digital PWM ready.",
    "SYS: Bluetooth module HC-05 online at 9600 bps.",
  ]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [activeApp, setActiveApp] = useState<string>("home");

  // Interactive house simulation states
  const [isDayTime, setIsDayTime] = useState<boolean>(true);
  const [pettedCount, setPettedCount] = useState<number>(0);
  const [barkMessage, setBarkMessage] = useState<string>("");
  const [buddyPettedCount, setBuddyPettedCount] = useState<number>(0);
  const [buddyBarkMessage, setBuddyBarkMessage] = useState<string>("");
  const [isLampOn, setIsLampOn] = useState<boolean>(true);
  const [ballRolled, setBallRolled] = useState<boolean>(false);
  const [isPaintingTilted, setIsPaintingTilted] = useState<boolean>(false);

  // Immersive Phone States (matching Project 1)
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(92);
  const [phoneWallpaper, setPhoneWallpaper] = useState<string>("cosmic"); // cosmic, sunset, circuit
  const [customTerminalInput, setCustomTerminalInput] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [phoneFlashlight, setPhoneFlashlight] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Professor Otto: 'Servos draw high initial currents! Verify 5V power routing.'",
    "Dog Feeder: Custom recipe load - Biscuit bones ready.",
  ]);

  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Slowly drain/recharge phone battery for ultimate real factor
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 3) return 100; // auto recharge
        return prev - 1;
      });
    }, 30000); // 30s
    return () => clearInterval(batteryTimer);
  }, []);

  // Clear puppy bark speech bubble automatically
  useEffect(() => {
    if (barkMessage) {
      const timer = setTimeout(() => {
        setBarkMessage("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [barkMessage]);

  useEffect(() => {
    if (buddyBarkMessage) {
      const timer = setTimeout(() => {
        setBuddyBarkMessage("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [buddyBarkMessage]);

  const addLog = (msg: string) => {
    setSerialLogs((prev) => [msg, ...prev.slice(0, 7)]);
  };

  const handleConnectBt = () => {
    const nextState = !isConnected;
    setIsConnected(nextState);
    if (nextState) {
      addLog("SUCCESS: Connected to HC-05! Serial link high.");
    } else {
      addLog("WARNING: Bluetooth link broken by user switch.");
    }
  };

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setAngle(val);
    
    // Physical guard simulation
    if (!allWiringOk) {
      addLog("ERROR: Jumper loop open. Servo did not rotate.");
      return;
    }
    if (!isConnected) {
      addLog("ERROR: HC-05 offline. Angle command packet dropped.");
      return;
    }

    addLog(`SERVO: Spindle update: ${val}° [Pulse width = ${1000 + Math.round((val / 180) * 1000)}us]`);
    
    if (val >= 120) {
      if (!hasFed) {
        setHasFed(true);
        addLog("SUCCESS: Treat hatch unlocked! Barnaby and Buddy eat delicious cookies together! 🍪");
      }
    } else if (val < 30) {
      setHasFed(false);
    }
  };

  const triggerFeedInstant = () => {
    if (!allWiringOk) {
      addLog("ERROR: Wiring missing. Mechanical motor fails to crank.");
      return;
    }
    if (!isConnected) {
      addLog("ERROR: Remote packet failed. Pair Bluetooth pairing.");
      return;
    }
    addLog("TX: Quick-feed dispatch payload sent.");
    setAngle(150);
    setHasFed(true);
    addLog("SUCCESS: Spindle swung wide. Biscuit dropped for both puppies! 🐾🦴");
  };

  const resetFeeder = () => {
    if (!allWiringOk) {
      addLog("ERROR: Ground wire open. Spindle cannot rotate safely.");
      return;
    }
    if (!isConnected) {
      addLog("ERROR: Cannot transmit reset vector over offline BT.");
      return;
    }
    setAngle(0);
    setHasFed(false);
    addLog("SERVO: Spindle returned to home index. Feeder gate locked.");
  };

  // Terminal manual shell commands
  const executeTerminalCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;
    addLog(`TERM_IN: Command typed > "${cmd}"`);
    
    if (!isConnected) {
      addLog("ERROR: Commands discarded because Bluetooth HC-05 is not paired.");
      setCustomTerminalInput("");
      return;
    }

    if (cmd === "feed") {
      triggerFeedInstant();
    } else if (cmd === "close" || cmd === "lock" || cmd === "reset") {
      resetFeeder();
    } else if (cmd.startsWith("angle ")) {
      const parts = cmd.split(" ");
      const val = parseInt(parts[1]);
      if (!isNaN(val) && val >= 0 && val <= 180) {
        setAngle(val);
        addLog(`SERVO: Spindle set via console to ${val}°`);
        if (val >= 120) {
          setHasFed(true);
        } else {
          setHasFed(false);
        }
      } else {
        addLog("ERROR: Invalid angle range. Choose 0 to 180.");
      }
    } else if (cmd === "unpair") {
      setIsConnected(false);
      addLog("INFO: HC-05 Wireless connection severed safely.");
    } else if (cmd === "pair") {
      setIsConnected(true);
      addLog("SUCCESS: Connection restored.");
    } else {
      addLog(`ERR: Unrecognized command "${cmd}". Try "feed", "close", "angle 90".`);
    }
    setCustomTerminalInput("");
  };


  const getWallpaperClass = () => {
    if (phoneWallpaper === "sunset") {
      return "bg-gradient-to-b from-[#701A75] to-[#3B0764]";
    } else if (phoneWallpaper === "circuit") {
      return "bg-gradient-to-b from-[#0F172A] to-[#1E293B] bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] bg-[size:16px_16px]";
    }
    return "bg-gradient-to-b from-[#0F2027] via-[#203A43] to-[#2C5364]";
  };

  const allWiringOk = true;

  return (
    <div className="space-y-8" id="project-servo-root">
      
      {/* Visual Header / Goal Card */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border-2 border-slate-200 flex flex-col md:flex-row gap-6 items-center border-b-8 border-[#FB923C]">
        <div className="w-full md:w-1/3 flex justify-center" id="banner-circ-container">
          <div className="relative w-full aspect-video bg-slate-950 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center p-4 overflow-hidden select-none">
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
            
            {/* Soft background glow */}
            <div className={`absolute w-36 h-36 rounded-full blur-2xl transition-all duration-500 ${hasFed && isConnected ? "bg-orange-500/20 scale-110" : "bg-[#1E3A8A]/20"}`} />
            
            <div className="relative z-10 flex flex-col items-center space-y-3">
              {/* SVG Device Nodes */}
              <div className="flex items-center gap-6">
                {/* Microcontroller icon card */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
                  <Cpu className="w-8 h-8 text-orange-400 animate-pulse" />
                </div>
                
                {/* Wireless linking line */}
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-orange-400 animate-ping" : "bg-slate-800"}`}></span>
                  <div className={`h-1 w-12 rounded transition-colors duration-500 ${isConnected ? "bg-gradient-to-r from-orange-500 to-amber-500" : "bg-slate-800"}`} />
                  <span className={`w-2 h-2 rounded-full ${hasFed ? "bg-green-500 animate-ping" : "bg-slate-700"}`}></span>
                </div>

                {/* Led bulb glowing */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md relative">
                  <Gauge className={`w-8 h-8 transition-colors duration-500 ${hasFed ? "text-green-400" : "text-slate-600"}`} />
                  {hasFed && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-center">
                <div className="text-[10.5px] font-mono tracking-widest text-slate-400 font-extrabold uppercase">
                  SIMULATOR HATCH LINKED
                </div>
                <div className="text-xs font-black text-white uppercase tracking-tight flex items-center justify-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-orange-500" : "bg-slate-600"}`}></span>
                  GATE INDEX: <span className={isConnected ? "text-orange-400 font-extrabold" : "text-slate-400"}>{angle}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#C2410C] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" /> Fun Actuator Mission
          </div>
          <h2 className="text-2xl font-black text-[#0C4A6E] tracking-tight">
            Feed Puppies
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Can you assemble a smart servo motor hatch key that opens the canister gate to feed both Barnaby and Buddy directly from your smartphone app?
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-2">
            <span className="flex items-center gap-1 bg-[#E0F2FE] text-[#0369A1] px-3 py-1.5 rounded-xl border border-[#bae6fd] font-bold">
              <Cpu className="w-3.5 h-3.5" /> Controller: Arduino Uno
            </span>
            <span className="flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-3 py-1.5 rounded-xl border border-orange-100 font-bold">
              <Gauge className="w-3.5 h-3.5" /> Actuator: SG90 Servo Motor
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* VIRTUAL MOBILE APP CONTROLLER */}
          <div className="relative w-full max-w-[340px] bg-slate-950 p-3.5 rounded-[3.2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-[6px] border-slate-800 mx-auto">
            
            {/* Left Side Buttons (Volume keys) */}
            <button 
              onClick={() => addLog("PHONE: Volume Up key pressed. Double-beeps ringer status.")}
              className="absolute -left-2 top-24 w-1.5 h-8 bg-slate-700 rounded-l-md shadow-xs active:bg-slate-500 cursor-pointer transition-colors"
              title="Volume Up"
            />
            <button 
              onClick={() => {
                setIsMuted(prev => !prev);
                addLog(`PHONE: Master mute toggled to ${!isMuted ? "ON" : "OFF"}.`);
              }}
              className="absolute -left-2.5 top-34 w-1.5 h-12 bg-slate-700 rounded-l-md shadow-xs active:bg-slate-500 cursor-pointer transition-colors"
              title="Toggle Audio Profile Mute"
            />
            
            {/* Right Side Button (Power key -> Sleep/Wake Emulator Screen) */}
            <button 
              onClick={() => {
                setIsLocked(prev => !prev);
                addLog(`PHONE_SYSTEM: Hardware sleep key pushed. Screen ${!isLocked ? "LOCK mode" : "WAKE mode"}.`);
              }}
              className="absolute -right-2.5 top-44 w-1.5 h-16 bg-slate-700 rounded-r-md shadow-xs active:bg-slate-500 cursor-pointer transition-colors z-45"
              title="Lock/Wake Power Button"
            />

            {/* Inner Phone Screen */}
            <div className="bg-slate-900 text-white rounded-[2.6rem] px-4 py-5 flex flex-col justify-between relative overflow-hidden min-h-[515px] border border-slate-800/80">
              
              {/* Dynamic Flashlight aura glow on top frame if flashlight is on */}
              {phoneFlashlight && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-40 h-2 bg-yellow-400 rounded-full blur-md opacity-70 z-50"></div>
              )}

              {/* Camera Island & Status Bar Header */}
              <div className="w-full space-y-1.5 mb-2 relative z-30">
                {/* Modern Dynamic Island Front-facing lens */}
                <div className="relative w-28 h-5.5 bg-black rounded-full mx-auto flex items-center justify-between px-3 select-none">
                  <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center">
                    <span className="w-0.5 h-0.5 rounded-full bg-[#1E3A8A]"></span>
                  </span>
                  {/* Dynamic miniature green connection indicator */}
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse border border-emerald-950" : "bg-transparent"}`}></span>
                </div>

                {/* Highly Realistic Smartphone Status Bar */}
                <div className="flex justify-between items-center text-[10px] font-bold text-[#F1F5F9] px-2 tracking-tight select-none">
                  {/* Left: Clock */}
                  <span className="font-sans antialiased text-[#F1F5F9]">
                    {currentTime}
                  </span>
                  {/* Right: battery/network symbols */}
                  <div className="flex items-center gap-1 text-slate-300 font-mono text-[8.5px] antialiased">
                    <span className="text-[9px]">📶</span>
                    <span>5G</span>
                    <span className="text-[9px]">{isMuted ? "🔇" : "🔊"}</span>
                    <span className="text-[9px]">🔋</span>
                    <span className={`font-bold ${batteryLevel < 15 ? "text-rose-400" : "text-emerald-400"}`}>{batteryLevel}%</span>
                  </div>
                </div>
              </div>

              {/* PHONE SCREEN CONTENT: SLEEP OR LOCK MODE VS ACTIVE MODE */}
              {isLocked ? (
                /* SCREEN SLEEP STATE OVERLAY (Locked Screen) */
                <div 
                  onClick={() => {
                    setIsLocked(false);
                    addLog("PHONE_SYSTEM: Unlock gesture detected. Transitioning screen state to launcher.");
                  }}
                  className="flex-1 flex flex-col justify-between items-center py-6 bg-black rounded-3xl p-4 border border-slate-900/40 mt-1 cursor-pointer select-none animate-fade-in relative z-20"
                >
                  <div className="text-center pt-8 space-y-1">
                    <span className="text-slate-500 uppercase font-mono tracking-widest text-[9px] block">
                      Otto OS Mobile
                    </span>
                    <h2 className="text-3xl font-black text-slate-200 tracking-tight">
                      {currentTime}
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold">
                      Monday, June 1
                    </p>
                  </div>

                  <div className="w-full space-y-2 bg-slate-950/80 p-3 rounded-2xl border border-white/5 max-w-[210px]">
                    <span className="text-[8px] text-yellow-500 font-black uppercase tracking-wider block text-left">
                      💌 Notification Banner
                    </span>
                    <p className="text-[9.5px] text-slate-300 leading-snug text-left truncate">
                      Otto: "Confirm VCC Power!"
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 animate-bounce text-slate-400">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span className="text-[9px] font-black uppercase tracking-wider">
                      Tap Screen To Wake/Unlock
                    </span>
                  </div>
                </div>
              ) : (
                /* VIRTUAL ACTIVE APP VIEW CONTAINER */
                <div 
                  className={`flex-1 flex flex-col justify-between py-1.5 rounded-3xl px-3.5 mt-1 relative z-10 overflow-hidden leading-normal shadow-inner border border-slate-800/10 ${getWallpaperClass()}`}
                >
                  
                  {activeApp === "home" ? (
                    /* SMARTPHONE PHONE DASHBOARD HOME */
                    <div className="flex-1 flex flex-col justify-between pt-1 animate-fade-in text-left">
                      <div className="space-y-3">
                        
                        {/* Interactive Widget Header block */}
                        <div className="bg-slate-950/70 p-3 rounded-2xl border border-white/5 space-y-1 backdrop-blur-md">
                          <div className="flex justify-between items-center text-[8.5px] font-black tracking-wider uppercase text-slate-400">
                            <span>📊 Feed telemetry widget</span>
                            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400" : "bg-rose-500 animate-pulse"}`}></span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-[11px] font-extrabold text-slate-300 block text-left">
                                Spindle Angle Gate
                              </span>
                              <span className="text-[10px] text-left block text-slate-400">
                                {angle}° ({angle >= 120 ? "GATE WIDE OPEN" : "LOCKED/CLOSED"})
                              </span>
                            </div>
                            <span className="text-xl">
                              {angle >= 120 ? "🍪" : "🔒"}
                            </span>
                          </div>
                        </div>

                        {/* Notification / HANDSHAKE */}
                        <div className="bg-gradient-to-r from-orange-500/15 to-amber-500/10 p-2.5 rounded-2xl border border-orange-400/20 flex items-center gap-2.5 shadow-sm">
                          <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-400">
                            <Radio className="w-4 h-4 animate-pulse" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[7.5px] uppercase tracking-wider text-orange-400 font-black font-mono">HC-05 HC2011</span>
                            <p className="text-[9.5px] text-slate-200 leading-tight font-sans truncate max-w-[170px]">
                              {isConnected ? "Linked successfully. Active trace." : "Transceiver offline."}
                            </p>
                          </div>
                        </div>

                        <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-widest pl-1 font-mono">
                          Barnaby App Center
                        </p>

                        {/* Modern Grid Launcher of Apps */}
                        <div className="grid grid-cols-3 gap-2">
                          
                          {/* App 1: Controller */}
                          <button 
                            onClick={() => { setActiveApp("controller"); addLog("PHONEOS: Launching 'Smart Feeder Controller'."); }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-orange-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FB923C] to-[#C2410C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                              <Smartphone className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[8px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Remote
                            </span>
                          </button>

                          {/* App 2: Telemetry */}
                          <button 
                            onClick={() => { setActiveApp("telemetry"); addLog("PHONEOS: Launching 'Volts Oscilloscope' telemetry trace."); }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-emerald-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#047857] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                              <Activity className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[8px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Telemetry
                            </span>
                          </button>

                          {/* App 3: Terminal */}
                          <button 
                            onClick={() => { setActiveApp("terminal"); addLog("PHONEOS: Launching 'Bluetooth Terminal Console'. Input prompt open."); }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-yellow-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FACC15] to-[#CA8A04] flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                              <Terminal className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[8px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              BT Terminal
                            </span>
                          </button>

                          {/* App 4: Settings */}
                          <button 
                            onClick={() => { setActiveApp("settings"); addLog("PHONEOS: Launching 'OS Configuration Settings' panel."); }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-indigo-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A78BFA] to-[#6D28D9] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                              <Settings className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[8px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Settings
                            </span>
                          </button>

                          {/* App 5: Educational Docs */}
                          <button 
                            onClick={() => { setActiveApp("docs"); addLog("PHONEOS: Launching 'Professor Otto's Lab Notebook'."); }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-orange-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF8C3A] to-[#C2410C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                              <Compass className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[8px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Lab Guide
                            </span>
                          </button>

                          {/* Dummy App: App Store */}
                          <div className="bg-slate-950/20 opacity-55 p-2 rounded-xl border border-white/5 flex flex-col items-center gap-1 w-full text-center select-none">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                              <Zap className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-[8px] font-bold text-slate-400 tracking-tight leading-tight block truncate w-full">
                              App Store
                            </span>
                          </div>

                        </div>
                      </div>

                      {/* Small Quick-Launch Dock Tray at bottom */}
                      <div className="bg-slate-950/50 p-2 rounded-2xl border border-white/5 flex justify-around items-center backdrop-blur-md mt-2">
                        <button 
                          onClick={() => { setActiveApp("controller"); }}
                          className="w-8 h-8 rounded-lg bg-[#FB923C]/10 hover:bg-[#FB923C]/40 flex items-center justify-center text-[#FB923C] active:scale-95 cursor-pointer" 
                          title="Feeder Remote"
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setActiveApp("telemetry"); }}
                          className="w-8 h-8 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/45 flex items-center justify-center text-emerald-400 active:scale-95 cursor-pointer" 
                          title="PWM Trace"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setActiveApp("terminal"); }}
                          className="w-8 h-8 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/45 flex items-center justify-center text-yellow-400 active:scale-95 cursor-pointer" 
                          title="Serial Terminal"
                        >
                          <Terminal className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ) : activeApp === "controller" ? (
                    /* APPLICATION APP VIEW: Smart Feeder Switch */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-[#FB923C] cursor-pointer"
                            title="Back to Home"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#FB923C] block font-black uppercase tracking-wider font-mono">APP CONTROLLER</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans text-orange-200">PuppyRemote Feeder v1.2</h4>
                          </div>
                        </div>

                        {/* BLE Pairing Control Module */}
                        <div className="space-y-2">
                          <div className="bg-slate-950/80 p-2 text-slate-100 rounded-xl border border-white/5 shadow-md">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[8.5px] text-slate-400 font-bold tracking-wider uppercase font-sans">
                                HC-05 Connection State
                              </span>
                              <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.25 rounded ${isConnected ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                                {isConnected ? "PAIRED" : "DISCONNECTED"}
                              </span>
                            </div>

                            <button 
                              onClick={handleConnectBt}
                              className={`w-full py-1.5 rounded-lg font-black text-[9.5px] uppercase tracking-wider transition-all transform active:scale-97 cursor-pointer ${
                                isConnected 
                                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/10" 
                                  : "bg-gradient-to-r from-[#FB923C] to-[#C2410C] text-white hover:opacity-90 font-extrabold shadow-md shadow-orange-950/10"
                              }`}
                            >
                              {isConnected ? "🔌 Cut Bluetooth" : "📡 Scan & Pair HC-05"}
                            </button>
                          </div>

                          {/* Operational Switch Actions */}
                          <div className="min-h-[145px] flex flex-col justify-center">
                            {!isConnected ? (
                              <div className="text-center p-3.5 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400">
                                <span className="text-base">📡</span>
                                <p className="text-[8.5px] font-bold leading-normal uppercase text-slate-500">
                                  Awaiting Bluetooth handshake
                                </p>
                                <p className="text-[8.5px] text-slate-500 max-w-[170px] leading-tight font-sans">
                                  Complete jumper checklist first, then pair with transceiver.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2.5 animate-fade-in">
                                <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-xl border border-white/5 shadow-md font-sans">
                                  <div>
                                    <span className="text-[7.5px] text-slate-400 font-extrabold uppercase block tracking-tight">PIN 9 PWM SIGNAL</span>
                                    <span className="text-[9.5px] font-black text-slate-200">FEEDER SHIELD GATE</span>
                                  </div>
                                  <span className={`px-2 py-0.75 text-[8.5px] uppercase font-mono font-black rounded ${angle >= 120 ? "bg-green-500/10 text-green-400" : "bg-slate-800 text-slate-400"}`}>
                                    {angle >= 120 ? "GATE OPEN" : "CLOSED"}
                                  </span>
                                </div>

                                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5 space-y-1 shadow-md font-sans">
                                  <div className="flex justify-between text-[8px] font-black tracking-tight text-slate-400">
                                    <span className="uppercase text-[7.5px]">SERVO POSITION INDEX</span>
                                    <span className="font-mono text-[#FB923C]">{angle}° Angle</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="180" 
                                    value={angle} 
                                    onChange={handleAngleChange}
                                    className="w-full accent-orange-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <div className="flex justify-between text-[7px] font-mono text-slate-500">
                                    <span>0° (Lock)</span>
                                    <span>90° (Midway)</span>
                                    <span>180° (Wide Open)</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-0.5">
                                  <button 
                                    onClick={triggerFeedInstant}
                                    className="py-2.5 bg-[#FB923C] hover:bg-orange-600 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition-transform active:scale-95 cursor-pointer shadow-sm text-center"
                                  >
                                    🍪 Feed treats!
                                  </button>
                                  <button 
                                    onClick={resetFeeder}
                                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-[10px] uppercase tracking-wider rounded-lg transition-transform active:scale-95 cursor-pointer border border-white/5"
                                  >
                                    🔒 Close Gate
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Brief advice info */}
                      <p className="text-[7.5px] text-slate-500 italic mt-1 font-mono text-center">
                        *Encrypted Bluetooth connection operating on IEEE 802.15.1.
                      </p>
                    </div>
                  ) : activeApp === "telemetry" ? (
                    /* APPLICATION 2 VIEW: Telemetry Pulse Width Osc Trace */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left font-sans">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-emerald-400 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-emerald-400 block font-black uppercase tracking-wider font-mono">CALIBRATION FEEDBACK</span>
                            <h4 className="text-xs font-black text-white leading-tight font-mono">PWM Duty Pulse Tracing</h4>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-slate-950 text-slate-400 p-2 rounded-xl text-[8.5px] border border-white/5 leading-normal font-mono">
                            SG90 motors operate at <span className="text-emerald-400 font-bold">50Hz PWM cycle</span> (20ms length). Pulse width ranges:
                            <ul className="list-disc pl-3 mt-1 font-mono space-y-0.5 text-[8px]">
                              <li>0° Angle = ~1000us (1.0ms pulse)</li>
                              <li>90° Angle = ~1500us (1.5ms pulse)</li>
                              <li>180° Angle = ~2000us (2.0ms pulse)</li>
                            </ul>
                          </div>

                          {/* Interactive Pulse Width wave simulation */}
                          <div className="bg-slate-955 p-2 bg-slate-950/95 rounded-xl border border-white/5 font-mono shadow-inner">
                            <span className="text-[7px] block uppercase font-bold text-slate-500 pb-1.5">LIVE PIN-9 OSC TRACE DIRECT:</span>
                            <div className="h-16 bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800 flex items-center justify-center p-1">
                              <svg viewBox="0 0 240 80" className="w-full h-full">
                                {/* Trace grid */}
                                <line x1="0" y1="40" x2="240" y2="40" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                                <line x1="60" y1="0" x2="60" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                                <line x1="120" y1="0" x2="120" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
                                <line x1="180" y1="0" x2="180" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />

                                {/* Signal line wave (dynamic duty width!) */}
                                {allWiringOk && isConnected ? (
                                  <path 
                                    d={`M 10 60 
                                        L 30 60 L 30 20 
                                        L ${30 + 10 + (angle/180)*25} 20 L ${30 + 10 + (angle/180)*25} 60 
                                        L 100 60 L 100 20 
                                        L ${100 + 10 + (angle/180)*25} 20 L ${100 + 10 + (angle/180)*25} 60 
                                        L 170 60 L 170 20 
                                        L ${170 + 10 + (angle/180)*25} 20 L ${170 + 10 + (angle/180)*25} 60 
                                        L 240 60`} 
                                    fill="none" 
                                    stroke="#10b981" 
                                    strokeWidth="2.5" 
                                    className="transition-all duration-300" 
                                  />
                                ) : (
                                  /* Zero line because wiring is disconnected */
                                  <line x1="0" y1="60" x2="240" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                                )}
                              </svg>

                              {/* Overlay data */}
                              <div className="absolute bottom-1 right-2 bg-slate-950/85 p-1 rounded border border-white/5 text-[7px] font-mono text-emerald-400">
                                {allWiringOk && isConnected ? `WIDTH: ${1000 + Math.round((angle / 180) * 1000)} us` : "NO PULSE SIGNAL"}
                              </div>
                            </div>

                            <div className="flex justify-between text-[7px] text-slate-5 w-full text-slate-500 pt-1">
                              <span>Period: 20ms (50Hz)</span>
                              <span>Duty: {allWiringOk && isConnected ? `${Math.round(((1000 + (angle/180)*1050)/20000)*100)}%` : "0%"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-[7.5px] text-slate-500 italic mt-1 font-mono text-center">
                        *Oscillator simulation auto-scaled by Arduino hardware timers.
                      </p>
                    </div>
                  ) : activeApp === "terminal" ? (
                    /* APPLICATION 3 VIEW: Serial Terminal Logs & Prompt */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-0.5 rounded text-yellow-500 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[8px] text-[#FACC15] block font-black uppercase tracking-wider font-mono">SERIAL SHELL TERMINAL</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans">HC-05 Stream Console</h4>
                          </div>
                        </div>

                        {/* Code Command Cheatsheet Help Widget */}
                        <div className="bg-[#131201] rounded-lg p-2 border border-yellow-500/10 text-[8px] text-slate-200 font-mono mb-2">
                          <strong className="text-yellow-500">🎮 Type Codes:</strong> <code className="bg-slate-950 text-[#38BDF8] px-1 font-bold">feed</code> = quick bite, <code className="bg-slate-950 text-[#38BDF8] px-1 font-bold">close</code> = gate locked, <code className="bg-slate-950 text-[#38BDF8] px-1 font-bold">angle 90</code> = mid.
                        </div>

                        {/* Inline console logging screen */}
                        <div className="bg-slate-950 font-mono text-[9px] p-2 rounded-xl border border-white/5 space-y-1 h-[115px] overflow-y-auto thin-scroll leading-relaxed text-slate-400">
                          <span className="text-[7px] text-slate-500 uppercase font-black block tracking-wider pb-1">
                            --- Local Mobile Buffer logs ---
                          </span>
                          {serialLogs.slice(0, 5).map((log, i) => (
                            <div key={i} className={`truncate ${log.startsWith("SUCCESS") ? "text-emerald-400 font-bold" : log.startsWith("ERROR") || log.startsWith("ERR:") ? "text-rose-400 font-bold" : "text-slate-400"}`}>
                              <span className="text-slate-600">&gt;</span> {log}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Command prompt execution box */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          executeTerminalCommand(customTerminalInput);
                        }}
                        className="mt-2 flex items-center gap-1.5"
                      >
                        <input 
                          type="text"
                          value={customTerminalInput}
                          onChange={(e) => setCustomTerminalInput(e.target.value)}
                          placeholder="Type 'feed' or 'angle 120'..."
                          className="flex-1 bg-slate-950 font-mono text-[10px] rounded px-2.5 py-1 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-[#FACC15]"
                        />
                        <button 
                          type="submit"
                          className="bg-[#FACC15] text-slate-950 p-1.5 rounded hover:bg-[#ffdf1c] active:scale-95 cursor-pointer text-slate-950"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                  ) : activeApp === "settings" ? (
                    /* APPLICATION 4 VIEW: Operating System Settings */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-purple-400 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#A78BFA] block font-black uppercase tracking-wider font-mono">SYSTEM SETTINGS</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans">Otto OS Launcher Panel</h4>
                          </div>
                        </div>

                        {/* Settings Item Grid */}
                        <div className="space-y-2 text-xs font-sans">
                          
                          {/* Setting 1: Wallpapers */}
                          <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5 space-y-1.5">
                            <span className="text-[8.5px] uppercase font-black tracking-wider text-slate-400 block">
                              🖥️ Theme Wallpaper Settings
                            </span>
                            <div className="grid grid-cols-3 gap-1">
                              <button 
                                onClick={() => { setPhoneWallpaper("cosmic"); addLog("SETTING: Swapped wallpaper to Cosmic Slate."); }}
                                className={`py-1 text-[7.5px] font-bold uppercase rounded border ${phoneWallpaper === "cosmic" ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]" : "bg-slate-900 text-slate-400 border-transparent"}`}
                              >
                                Cosmic
                              </button>
                              <button 
                                onClick={() => { setPhoneWallpaper("sunset"); addLog("SETTING: Swapped wallpaper to Sunset Cyber."); }}
                                className={`py-1 text-[7.5px] font-bold uppercase rounded border ${phoneWallpaper === "sunset" ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]" : "bg-slate-900 text-slate-400 border-transparent"}`}
                              >
                                Sunset
                              </button>
                              <button 
                                onClick={() => { setPhoneWallpaper("circuit"); addLog("SETTING: Swapped wallpaper to Logic Gates."); }}
                                className={`py-1 text-[7.5px] font-bold uppercase rounded border ${phoneWallpaper === "circuit" ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]" : "bg-slate-900 text-slate-400 border-transparent"}`}
                              >
                                Circuit
                              </button>
                            </div>
                          </div>

                          {/* Setting 2: Strobe / Back Camera Torch */}
                          <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                            <div className="text-left">
                              <strong className="text-[9px] text-slate-200 block leading-tight">Strobe Flashlight</strong>
                              <span className="text-[8px] text-slate-400 block uppercase">Toggle camera flash strobe</span>
                            </div>
                            <button 
                              onClick={() => {
                                setPhoneFlashlight(prev => !prev);
                                addLog(`PHONE: Camera strobe flash toggled to ${!phoneFlashlight ? "ON" : "OFF"}.`);
                              }}
                              className={`px-2.5 py-1 text-[8px] font-black uppercase rounded ${phoneFlashlight ? "bg-[#FACC15] text-slate-950 font-extrabold" : "bg-slate-800 text-slate-400"}`}
                            >
                              {phoneFlashlight ? "ON" : "OFF"}
                            </button>
                          </div>

                          {/* Setting 3: System Details diagnostics */}
                          <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5 text-[8.5px] text-[#A78BFA] space-y-0.5 font-mono">
                            <p className="flex justify-between">
                              <span>TRANSCEIVER FONT:</span>
                              <strong>HC-05 Pairable</strong>
                            </p>
                            <p className="flex justify-between">
                              <span>BAUD RATE:</span>
                              <strong>9600 Bps Serial</strong>
                            </p>
                            <p className="flex justify-between">
                              <span>PWM ANGLE CAPABLE:</span>
                              <strong>0 - 180° SG90</strong>
                            </p>
                          </div>

                        </div>
                      </div>

                      <span className="text-[7.5px] text-slate-400 italic mt-1 font-mono text-center">
                        *Otto OS 14.2 build 2026-A1.
                      </span>
                    </div>

                  ) : (
                    /* APPLICATION 5 VIEW: Lab Manual and Docs */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-orange-400 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#FF8C3A] block font-black uppercase tracking-wider font-mono">LAB MANUAL</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans">Servo Position Theory</h4>
                          </div>
                        </div>

                        {/* Interactive FAQ Guide of the experiment */}
                        <div className="space-y-1.5 text-[9px] leading-relaxed max-h-[175px] overflow-y-auto thin-scroll text-slate-300">
                          
                          <div className="bg-slate-950/85 p-2 rounded-xl border border-white/5">
                            <h5 className="font-extrabold text-[#FF8C3A] pb-0.5">Q1: How does PWM angle location work?</h5>
                            <p className="text-slate-400 text-[8.5px] leading-tight font-sans">
                              SG90 looks at the ON time of the pulse period (20ms total). Sending a 1.0ms pulse aligns gears to 0°, 1.5ms pulse to 90°, and 2.0ms pulse drives them to 180°!
                            </p>
                          </div>

                          <div className="bg-slate-950/85 p-2 rounded-xl border border-white/5">
                            <h5 className="font-extrabold text-[#FF8C3A] pb-0.5">Q2: Why does the motor jitter?</h5>
                            <p className="text-slate-400 text-[8.5px] leading-tight font-sans">
                              Servos consume high current spikes. If your 5V rails share Arduino logic without decoupling, rapid digital micro-fluctuations create gear feedback oscillation jittering!
                            </p>
                          </div>

                        </div>
                      </div>

                      <p className="text-[7.5px] text-slate-400 font-mono italic text-center text-orange-200 mt-1">
                        🔒 Classroom Feeder manual verified.
                      </p>
                    </div>
                  )}

                  {/* BOTTOM REUSABLE SMARTPHONE HOME PILL TRAY */}
                  <div className="w-full pt-1.5 flex justify-center mt-1">
                    <button 
                      onClick={() => {
                        setActiveApp("home");
                        addLog("PHONEOS: System gesture detects click on Virtual home pill button.");
                      }}
                      className="w-24 h-1 bg-white/70 hover:bg-white rounded-full transition-colors cursor-pointer z-50 block border border-slate-700/50"
                      title="Return to home launcher screen"
                    />
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* VIRTUAL ACTIVE TREAT CANISTER & BOWL */}
          <div className="bg-[#0F172A] text-[#FFFF] rounded-[2.5rem] p-5 shadow-2xl flex flex-col justify-between border-4 border-slate-700 min-h-[500px] h-auto space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] bg-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase font-mono tracking-widest font-extrabold border border-slate-700 inline-block">
                  🏠 Active Simulator: Cozy Living Room
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {pettedCount > 0 && `💖 Cuddles: ${pettedCount}`}
                </span>
              </div>

              <div className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-950 p-0 shadow-inner">
                {/* SVG Cozy House Interior Simulation */}
                <svg
                  viewBox="0 0 520 340"
                  width="100%"
                  height="auto"
                  className="rounded-xl animate-fade-in select-none bg-[#111827]"
                >
                  <defs>
                    <radialGradient id="lampGlow" cx="50%" cy="0%" r="90%">
                      <stop offset="0%" stopColor="#FDE047" stopOpacity="0.45" />
                      <stop offset="50%" stopColor="#FDE047" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="woodFloor" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#78350F" />
                      <stop offset="100%" stopColor="#451A03" />
                    </linearGradient>
                    <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="50%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <linearGradient id="servoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>

                    {/* CSS Keyframe Animations for House and Puppy simulation */}
                    <style>{`
                      @keyframes paceBarnaby {
                        0% { transform: translateX(0px) scaleX(1) translateY(0px) rotate(0deg); }
                        /* Walk to center */
                        25% { transform: translateX(-100px) scaleX(1) translateY(0px) rotate(0deg); }
                        /* Hop/Play together! */
                        32% { transform: translateX(-110px) scaleX(1) translateY(-14px) rotate(-8deg); }
                        40% { transform: translateX(-105px) scaleX(-1) translateY(0px) rotate(0deg); }
                        48% { transform: translateX(-110px) scaleX(1) translateY(-14px) rotate(8deg); }
                        56% { transform: translateX(-105px) scaleX(1) translateY(0px) rotate(0deg); }
                        64% { transform: translateX(-110px) scaleX(-1) translateY(-16px) rotate(-10deg); }
                        72% { transform: translateX(-100px) scaleX(-1) translateY(0px) rotate(0deg); }
                        /* Walk back */
                        92% { transform: translateX(0px) scaleX(-1) translateY(0px) rotate(0deg); }
                        96%, 100% { transform: translateX(0px) scaleX(1) translateY(0px) rotate(0deg); }
                      }
                      .animate-barnaby-pacing {
                        transform-origin: 360px 240px;
                        animation: paceBarnaby 5.8s ease-in-out infinite;
                      }

                      @keyframes paceBuddy {
                        0% { transform: translateX(0px) scaleX(1) translateY(0px) rotate(0deg); }
                        /* Walk to center */
                        25% { transform: translateX(90px) scaleX(1) translateY(0px) rotate(0deg); }
                        /* Hop/Play together! (Synchronized, facing each other) */
                        32% { transform: translateX(100px) scaleX(1) translateY(-16px) rotate(10deg); }
                        40% { transform: translateX(95px) scaleX(-1) translateY(0px) rotate(0deg); }
                        48% { transform: translateX(100px) scaleX(1) translateY(-16px) rotate(-10deg); }
                        56% { transform: translateX(95px) scaleX(1) translateY(0px) rotate(0deg); }
                        64% { transform: translateX(100px) scaleX(-1) translateY(-14px) rotate(8deg); }
                        72% { transform: translateX(90px) scaleX(-1) translateY(0px) rotate(0deg); }
                        /* Walk back */
                        92% { transform: translateX(0px) scaleX(-1) translateY(0px) rotate(0deg); }
                        96%, 100% { transform: translateX(0px) scaleX(1) translateY(0px) rotate(0deg); }
                      }
                      .animate-buddy-pacing {
                        transform-origin: 120px 240px;
                        animation: paceBuddy 5.8s ease-in-out infinite;
                      }

                      @keyframes dogBounce {
                        0%, 100% { transform: translateX(-2px) translateY(0px) scaleY(1); }
                        50% { transform: translateX(2px) translateY(1px) scaleY(0.96); }
                      }
                      .animate-puppy-bounce {
                        animation: dogBounce 0.45s ease-in-out infinite;
                      }

                      @keyframes tailWag {
                        0%, 100% { transform: rotate(-15deg); }
                        50% { transform: rotate(15deg); }
                      }
                      .animate-tail-wag {
                        transform-origin: 37px 22px;
                        animation: tailWag 0.15s ease-in-out infinite;
                      }
                      .animate-tail-wag-fed {
                        transform-origin: 42px 24px;
                        animation: tailWag 0.08s ease-in-out infinite;
                      }

                      @keyframes headChomp {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(3px) rotate(4deg); }
                      }
                      .animate-chomp-head {
                        transform-origin: 8px 9px;
                        animation: headChomp 0.22s ease-in-out infinite;
                      }

                      @keyframes heartFloat {
                        0% { transform: translateY(0) scale(0.8); opacity: 0; }
                        20% { opacity: 1; }
                        80% { opacity: 0.8; }
                        100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
                      }
                      .animate-float-heart-1 {
                        animation: heartFloat 1s ease-out infinite;
                      }
                      .animate-float-heart-2 {
                        animation: heartFloat 1.2s ease-out infinite 0.3s;
                      }
                      .animate-float-heart-3 {
                        animation: heartFloat 0.9s ease-out infinite 0.6s;
                      }

                      @keyframes biscuitTumble {
                        0% { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
                        80% { opacity: 1; }
                        100% { transform: translate(65px, 90px) rotate(360deg); opacity: 0; }
                      }
                      .animate-falling-cookie-1 {
                        animation: biscuitTumble 0.7s ease-in-out infinite;
                      }
                      .animate-falling-cookie-2 {
                        animation: biscuitTumble 0.7s ease-in-out infinite 0.22s;
                      }
                      .animate-falling-cookie-3 {
                        animation: biscuitTumble 0.7s ease-in-out infinite 0.44s;
                      }
                    `}</style>
                  </defs>

                  {/* 1. ROOM WALLPAPER BACKGROUND */}
                  <rect 
                    x="0" 
                    y="0" 
                    width="520" 
                    height="230" 
                    fill={isDayTime ? "#FEF3C7" : "#1E1B4B"} 
                    className="transition-colors duration-700" 
                  />
                  {/* WALL DECORATIVE VERTICAL STRIPES */}
                  <g opacity="0.08">
                    {Array.from({ length: 26 }).map((_, idx) => (
                      <line key={idx} x1={idx * 20} y1="0" x2={idx * 20} y2="230" stroke="#000" strokeWidth="2" />
                    ))}
                  </g>

                  {/* 2. CHERRY WOOD WORKSPACE FLOOR */}
                  <rect 
                    x="0" 
                    y="230" 
                    width="520" 
                    height="110" 
                    fill="url(#woodFloor)" 
                  />
                  {/* FLOOR WOOD BOARDS SEAMS */}
                  <g opacity="0.3" stroke="#271201" strokeWidth="1">
                    <line x1="0" y1="250" x2="520" y2="250" />
                    <line x1="0" y1="275" x2="520" y2="275" />
                    <line x1="0" y1="305" x2="520" y2="305" />
                    
                    {/* Vertical seams */}
                    <line x1="120" y1="230" x2="120" y2="250" />
                    <line x1="380" y1="230" x2="380" y2="250" />
                    <line x1="200" y1="250" x2="200" y2="275" />
                    <line x1="450" y1="250" x2="450" y2="275" />
                    <line x1="80" y1="275" x2="80" y2="305" />
                    <line x1="310" y1="275" x2="310" y2="305" />
                  </g>

                  {/* 3. DYNAMIC SKY WINDOW */}
                  <g transform="translate(195, 30)">
                    {/* Window Frame outer */}
                    <rect x="0" y="0" width="130" height="90" fill="#E2E8F0" rx="4" stroke="#475569" strokeWidth="3" />
                    {/* Window glass background */}
                    <rect 
                      x="6" 
                      y="6" 
                      width="118" 
                      height="78" 
                      fill={isDayTime ? "#7DD3FC" : "#0F172A"} 
                      className="transition-colors duration-700" 
                    />
                    
                    {/* Sky Content (Day Sunshine vs Night Stars) */}
                    {isDayTime ? (
                      <g className="transition-opacity duration-500">
                        {/* Sun */}
                        <circle cx="95" cy="28" r="12" fill="#FBA50C" />
                        <circle cx="95" cy="28" r="16" fill="#FBA50C" opacity="0.3" className="animate-pulse" />
                        {/* Clouds */}
                        <circle cx="28" cy="45" r="9" fill="#FFF" />
                        <circle cx="40" cy="45" r="12" fill="#FFF" />
                        <circle cx="51" cy="45" r="8" fill="#FFF" />
                      </g>
                    ) : (
                      <g className="transition-opacity duration-500">
                        {/* Starry night nodes */}
                        <circle cx="22" cy="22" r="1" fill="#FFF" opacity="0.9" />
                        <circle cx="85" cy="18" r="1.5" fill="#FFF" opacity="0.8" className="animate-pulse" />
                        <circle cx="45" cy="48" r="1" fill="#FFF" opacity="0.6" />
                        {/* Crescent Moon */}
                        <path d="M96 20 A 13 13 0 1 0 115 38 A 15 15 0 1 1 96 20 Z" fill="#FDE047" />
                      </g>
                    )}

                    {/* Window Panes Grid */}
                    <line x1="65" y1="6" x2="65" y2="84" stroke="#475569" strokeWidth="2" />
                    <line x1="6" y1="45" x2="124" y2="45" stroke="#475569" strokeWidth="2" />
                  </g>

                  {/* 4. COZY CARPET RUG */}
                  <ellipse cx="260" cy="280" rx="150" ry="22" fill="#2E4861" opacity="0.6" />
                  <ellipse cx="260" cy="280" rx="142" ry="17" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />

                  {/* 5. WALL PAINTING (Interactive Tilt Frame!) */}
                  <g 
                    transform={`translate(390, 40) rotate(${isPaintingTilted ? 14 : 0}, 30, 25)`} 
                    className="cursor-pointer transition-transform duration-300"
                    onClick={() => {
                      setIsPaintingTilted(!isPaintingTilted);
                      addLog("INTERACTION: Student poked the wall painting. It tilted playfully!");
                    }}
                  >
                    <rect x="0" y="0" width="60" height="50" fill="#78350F" rx="2" stroke="#FDE047" strokeWidth="1.5" />
                    <rect x="5" y="5" width="50" height="40" fill="#ECFDF5" />
                    {/* Dog paw art on canvas */}
                    <circle cx="30" cy="28" r="7" fill="#047857" />
                    <circle cx="22" cy="16" r="3.5" fill="#047857" />
                    <circle cx="30" cy="13" r="3.5" fill="#047857" />
                    <circle cx="38" cy="16" r="3.5" fill="#047857" />
                    {/* Dynamic little art text */}
                    <text x="30" y="42" fill="#047857" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">BARNABY ART</text>
                  </g>

                  {/* 6. COZY INTERACTIVE FLOOR LAMP (Click to toggle night shade!) */}
                  <g 
                    transform="translate(25, 60)" 
                    className="cursor-pointer group"
                    onClick={() => {
                      setIsLampOn(!isLampOn);
                      addLog(`INTERACTION: Toggled cozy floor lamp ${!isLampOn ? "ON" : "OFF"}.`);
                    }}
                  >
                    {/* Lamp Base stand */}
                    <ellipse cx="25" cy="190" rx="12" ry="4" fill="#334155" />
                    <line x1="25" y1="50" x2="25" y2="190" stroke="#475569" strokeWidth="3" />
                    
                    {/* Power Cable Line */}
                    <path d="M25 188 C10 192, 5 195, -12 200" fill="none" stroke="#1E293B" strokeWidth="1.5" />

                    {/* Lamp Shade */}
                    <polygon points="12,52 38,52 46,26 4,26" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.5" />
                    
                    {/* Light bulb glow node */}
                    <circle cx="25" cy="54" r="5" fill="#FEF08A" />
                    <circle cx="25" cy="54" r="9" fill="#FEF08A" opacity={isLampOn ? "0.6" : "0"} className="animate-pulse" />
                  </g>

                  {/* Real-time Ambient Light Cone Overlay */}
                  {isLampOn && (
                    <polygon 
                      points="50,111 280,310 0,310" 
                      fill="url(#lampGlow)" 
                      opacity={isDayTime ? "0.18" : "0.45"} 
                      pointerEvents="none"
                      className="transition-opacity duration-500" 
                    />
                  )}

                  {/* 7. LOVELY INTERACTIVE TOY BALL */}
                  <g 
                    transform={`translate(${ballRolled ? 180 : 450}, 285)`} 
                    className="cursor-pointer"
                    onClick={() => {
                      setBallRolled(!ballRolled);
                      addLog("INTERACTION: Squeak! The student rolled the striped rubber toy ball!");
                    }}
                  >
                    <circle cx="0" cy="0" r="10" fill="url(#ballGradient)" className="transition-transform duration-1000" style={{ transform: ballRolled ? "rotate(-360deg)" : "rotate(0deg)" }} />
                    <path d="M-8 -6 C-2 -2, 2 2, 8 6" stroke="#FEF08A" strokeWidth="2.5" fill="none" />
                    <circle cx="0" cy="0" r="10" fill="none" stroke="#FFF" strokeWidth="1.2" />
                  </g>

                  {/* 8. PET FOOD DISPENSER ("STORE LOCKED") */}
                  <g transform="translate(60, 100)">
                    {/* Canister Outer Shell (Metallic Silver/Black Plastic) */}
                    <rect x="0" y="0" width="70" height="150" rx="10" fill="#1E2937" stroke="#4B5563" strokeWidth="3" />
                    <rect x="5" y="5" width="60" height="140" rx="6" fill="#374151" />

                    {/* Dispenser Food Cylinder (Transparent Acrylic) */}
                    <rect x="12" y="45" width="46" height="75" rx="4" fill="#030712" />
                    <rect x="12" y="45" width="46" height="75" rx="4" fill="#93C5FD" opacity="0.1" />

                    {/* Dry cookies inside cylinder (deplete or show visually) */}
                    <g opacity={hasFed ? "0.4" : "1"} className="transition-opacity duration-500">
                      <circle cx="22" cy="70" r="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                      <circle cx="20" cy="68" r="1" fill="#451A03" />
                      
                      <circle cx="35" cy="65" r="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                      <circle cx="34" cy="64" r="1" fill="#451A03" />

                      <circle cx="48" cy="72" r="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                      
                      <circle cx="23" cy="85" r="6" fill="#D97706" stroke="#92400E" strokeWidth="1" />
                      <circle cx="36" cy="80" r="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                      <circle cx="34" cy="79" r="1" fill="#451A03" />
                      <circle cx="48" cy="85" r="6" fill="#D97706" stroke="#92400E" strokeWidth="1" />

                      <circle cx="22" cy="100" r="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                      <circle cx="35" cy="102" r="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                      <circle cx="48" cy="100" r="6" fill="#D97706" stroke="#92400E" strokeWidth="1" />
                      
                      <circle cx="29" cy="113" r="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                      <circle cx="41" cy="113" r="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                    </g>

                    {/* Locking Indicator OLED Screen display panel */}
                    <rect x="12" y="10" width="46" height="30" rx="3" fill="#0B1329" stroke="#1F2937" />
                    {hasFed ? (
                      /* UNLOCKED ACTIVE GREEN DISPENSING SCREEN */
                      <g className="transition-all duration-300">
                        <circle cx="35" cy="20" r="5.5" fill="#10B981" />
                        <text x="35" y="22" fill="#FFF" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">🔓</text>
                        <text x="35" y="34" fill="#34D399" fontSize="5.5" fontWeight="black" textAnchor="middle" fontFamily="monospace">OPEN</text>
                      </g>
                    ) : (
                      /* LOCKED SECURE RED STATUS SCREEN */
                      <g className="transition-all duration-300">
                        <circle cx="35" cy="20" r="5.5" fill="#EF4444" />
                        <text x="35" y="22" fill="#FFF" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">🔒</text>
                        <text x="35" y="34" fill="#F87171" fontSize="5.5" fontWeight="black" textAnchor="middle" fontFamily="monospace">LOCKED</text>
                      </g>
                    )}

                    {/* Simulated Attached SG90 blue block with wires (at bottom hatch) */}
                    <g transform="translate(18, 122)">
                      <rect x="0" y="0" width="34" height="20" rx="2" fill="url(#servoBlue)" stroke="#1D4ED8" strokeWidth="1" />
                      {/* Brass spindle horn hub centered at (17, 10) */}
                      <circle cx="17" cy="10" r="5.5" fill="#F59E0B" />
                      
                      {/* Physical SG90 wiring connection visible */}
                      <path d="M-4 10 Q -10 15, -18 12" fill="none" stroke="#F97316" strokeWidth="1" strokeDasharray="2 1" /> {/* Orange signal */}
                      <path d="M-4 12 Q -10 17, -18 14" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="2 1" /> {/* Red power */}
                      <path d="M-4 14 Q -10 19, -18 16" fill="none" stroke="#78350F" strokeWidth="1" strokeDasharray="2 1" /> {/* Brown ground */}

                      {/* SG90 real-time rotating arm horn (linked literally to smartphone slider!) */}
                      <g transform={`rotate(${angle}, 17, 10)`} className="transition-transform duration-300">
                        <line x1="17" y1="10" x2="17" y2="-4" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" />
                        <circle cx="17" cy="-2" r="1.2" fill="#475569" />
                        <polygon points="17,-5 21,-1 13,-1" fill="#EF4444" />
                      </g>
                    </g>
                  </g>

                  {/* 9. INTERACTIVE FEEDING BOWL AND COOKIES */}
                  <g transform="translate(140, 260)">
                    {/* Metal outer Bowl */}
                    <ellipse cx="25" cy="18" rx="24" ry="9" fill="#94A3B8" />
                    <ellipse cx="25" cy="14" rx="22" ry="8" fill="#EF4444" stroke="#BE123C" strokeWidth="1" />
                    {/* Dark inner shadow */}
                    <ellipse cx="25" cy="14" rx="16" ry="5.5" fill="#7F1D1D" />

                    {/* Pile of cookies inside the bowl when fed */}
                    {hasFed && (
                      <g className="transition-opacity duration-500 animate-fade-in">
                        <rect x="13" y="10" width="10" height="5" rx="2.5" fill="#B45309" stroke="#5F2207" strokeWidth="0.8" />
                        <rect x="25" y="8" width="11" height="5.5" rx="2.7" fill="#D97706" stroke="#5F2207" strokeWidth="0.8" />
                        <rect x="18" y="6" width="11" height="5" rx="2.5" fill="#B45309" stroke="#5F2207" strokeWidth="0.8" />
                        <circle cx="18" cy="9" r="1" fill="#451A03" />
                        <circle cx="27" cy="11" r="0.8" fill="#451A03" />
                        <circle cx="24" cy="8" r="1" fill="#451A03" />
                      </g>
                    )}
                  </g>

                  {/* 10. REAL-TIME COOKIE DISPENSING CASCADE FALLS ANIMATION */}
                  {hasFed && allWiringOk && isConnected && (
                    <g pointerEvents="none">
                      {/* Cookie falling 1 */}
                      <g className="animate-falling-cookie-1" style={{ transformOrigin: "115px 215px" }}>
                        <circle cx="115" cy="215" r="4.5" fill="#B45309" stroke="#78355F" strokeWidth="0.8" />
                        <circle cx="114" cy="214" r="0.8" fill="#4D0F00" />
                      </g>
                      {/* Cookie falling 2 */}
                      <g className="animate-falling-cookie-2" style={{ transformOrigin: "115px 215px" }}>
                        <circle cx="115" cy="215" r="4.5" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
                        <circle cx="116" cy="215" r="0.8" fill="#4D0F00" />
                      </g>
                      {/* Cookie falling 3 */}
                      <g className="animate-falling-cookie-3" style={{ transformOrigin: "115px 215px" }}>
                        <circle cx="115" cy="215" r="4" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
                      </g>
                    </g>
                  )}

                  {/* 11. THE ADORABLE PUPPY "BARNABY" WITH DYNAMIC ANIMATION STATES */}
                  {!hasFed ? (
                    /* STATE A: HUNGRY/PLAYING PUPPY DUO (Barnaby & Buddy play on the brown floor!) */
                    <g>
                      {/* --- PUPPY 1: BARNABY --- */}
                      <g className="animate-barnaby-pacing">
                        <g transform="translate(360, 240)" className="animate-puppy-bounce">
                          {/* Shadow underneath */}
                          <ellipse cx="20" cy="48" rx="14" ry="4.5" fill="#000" opacity="0.32" />

                          {/* Dog Body */}
                          <rect x="5" y="16" width="32" height="24" rx="10" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                          
                          {/* Paws */}
                          <rect x="9" y="36" width="5.5" height="12" rx="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
                          <rect x="25" y="36" width="5.5" height="12" rx="2.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
                          <circle cx="11.5" cy="46" r="3.5" fill="#FEF3C7" />
                          <circle cx="27.5" cy="46" r="3.5" fill="#FEF3C7" />

                          {/* Wagging/Happy Tail */}
                          <path d="M37 22 Q46 16, 42 10" fill="none" stroke="#D97706" strokeWidth="4.5" strokeLinecap="round" className="animate-tail-wag" />

                          {/* Dog Neck/Chest */}
                          <rect x="4" y="12" width="12" height="14" rx="4" fill="#F59E0B" />
                          {/* Blue Dog Collar */}
                          <rect x="3" y="14" width="13" height="3" fill="#2563EB" />
                          
                          {/* Dog Head */}
                          <circle cx="9" cy="8" r="11" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                          <ellipse cx="6" cy="11" r="5" fill="#FEF3C7" />

                          {/* Dynamic Eyes */}
                          <circle cx="5" cy="5" r="1.8" fill="#1F2937" />
                          <circle cx="11" cy="5" r="1.8" fill="#1F2937" />
                          
                          {/* Floppy ears */}
                          <path d="M-1 3 Q-6 10, -3 18" fill="none" stroke="#B45309" strokeWidth="5.5" strokeLinecap="round" />
                          <path d="M17 3 Q22 10, 19 18" fill="none" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />

                          {/* Wet puppy nose */}
                          <polygon points="5,8 8,8 6.5,10" fill="#111827" />

                          {/* BARNABY BARK BUBBLE */}
                          <g transform="translate(-40, -32)">
                            <rect x="0" y="0" width="86" height="20" rx="6" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.2" />
                            <polygon points="40,20 45,20 42,24" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.2" />
                            <polygon points="40,19 45,19 42,22" fill="#FEF9C3" />
                            <text x="43" y="12" fill="#854D0E" fontSize="6" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                              {barkMessage ? barkMessage : "Play ball! 🎾🐶"}
                            </text>
                          </g>
                        </g>
                      </g>

                      {/* --- PUPPY 2: BUDDY --- */}
                      <g className="animate-buddy-pacing">
                        <g transform="translate(120, 240)" className="animate-puppy-bounce">
                          {/* Shadow underneath */}
                          <ellipse cx="20" cy="48" rx="14" ry="4.5" fill="#000" opacity="0.32" />

                          {/* Dog Body (Caramel/Cocoa color) */}
                          <rect x="5" y="16" width="32" height="24" rx="10" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                          
                          {/* Cute big spot on back */}
                          <circle cx="21" cy="24" r="5.5" fill="#FEF3C7" />
                          <circle cx="30" cy="22" r="3" fill="#78350F" />

                          {/* Paws */}
                          <rect x="9" y="36" width="5.5" height="12" rx="2.5" fill="#D97706" stroke="#78350F" strokeWidth="1.2" />
                          <rect x="25" y="36" width="5.5" height="12" rx="2.5" fill="#D97706" stroke="#78350F" strokeWidth="1.2" />
                          <circle cx="11.5" cy="46" r="3.5" fill="#FEF3C7" />
                          <circle cx="27.5" cy="46" r="3.5" fill="#FEF3C7" />

                          {/* Tail wagging */}
                          <path d="M37 22 Q46 16, 42 10" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" className="animate-tail-wag" />

                          {/* Dog Neck/Chest */}
                          <rect x="4" y="12" width="12" height="14" rx="4" fill="#D97706" />
                          {/* Red Dog Collar with gold gold star */}
                          <rect x="3" y="14" width="13" height="3" fill="#EF4444" />
                          
                          {/* Dog Head */}
                          <circle cx="9" cy="8" r="11" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                          <ellipse cx="6" cy="11" r="5" fill="#FEF3C7" />

                          {/* Cute spot over one eye */}
                          <circle cx="10" cy="5" r="4" fill="#78350F" opacity="0.8" />

                          {/* Double eyes */}
                          <circle cx="5" cy="5" r="1.8" fill="#1F2937" />
                          <circle cx="11" cy="5" r="1.8" fill="#FFF" />
                          <circle cx="11" cy="5" r="1" fill="#1F2937" />
                          
                          {/* Floppy dark ears */}
                          <path d="M-1 3 Q-6 10, -3 18" fill="none" stroke="#78350F" strokeWidth="5.5" strokeLinecap="round" />
                          <path d="M17 3 Q22 10, 19 18" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />

                          {/* Wet puppy nose */}
                          <polygon points="5,8 8,8 6.5,10" fill="#111827" />

                          {/* BUDDY BARK BUBBLE */}
                          <g transform="translate(-40, -32)">
                            <rect x="0" y="0" width="86" height="20" rx="6" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.2" />
                            <polygon points="40,20 45,20 42,24" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.2" />
                            <polygon points="40,19 45,19 42,22" fill="#F0FDF4" />
                            <text x="43" y="12" fill="#15803D" fontSize="6" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                              {buddyBarkMessage ? buddyBarkMessage : "Chase me! 🐾💨"}
                            </text>
                          </g>
                        </g>
                      </g>
                    </g>
                  ) : (
                    /* STATE B: HAPPILY FED PUPPY DUO (Barnaby & Buddy eating beside the bowl!) */
                    <g>
                      {/* --- PUPPY 1: FED BARNABY --- */}
                      <g transform="translate(172, 240)">
                        {/* Tail Wagging Fed */}
                        <path d="M42 24 Q52 14, 48 4" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" className="animate-tail-wag-fed" />

                        {/* Happy shadow */}
                        <ellipse cx="22" cy="46" rx="16" ry="4" fill="#000" opacity="0.4" />

                        {/* Dog Body (Sitting happily next to the bowl) */}
                        <rect x="6" y="18" width="34" height="26" rx="10" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                        <circle cx="15" cy="42" r="6" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.2" />
                        <circle cx="31" cy="42" r="6" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.2" />

                        {/* Blue Collar with Golden Medal reward */}
                        <rect x="2" y="16" width="13" height="3" fill="#2563EB" />
                        <circle cx="8" cy="19.5" r="2.5" fill="#FBBF24" />

                        {/* Dog Head (Chomping animations!) */}
                        <g className="animate-chomp-head">
                          <circle cx="8" cy="9" r="11" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                          <ellipse cx="4" cy="12" r="4.5" fill="#FEF3C7" />
                          
                          {/* Eyes closed happily */}
                          <path d="M1 6 Q3 4, 5 6" fill="none" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M8 6 Q10 4, 12 6" fill="none" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />

                          {/* Dog Nose */}
                          <polygon points="2,9 5,9 3.5,11" fill="#111827" />

                          {/* Floppy ears */}
                          <path d="M-2 4 Q-7 11, -4 19" fill="none" stroke="#B45309" strokeWidth="5.5" strokeLinecap="round" />
                          <path d="M16 4 Q21 11, 18 19" fill="none" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
                        </g>

                        {/* HAPPY FED SPEECH BUBBLE */}
                        <g transform="translate(-40, -32)">
                          <rect x="0" y="0" width="94" height="20" rx="6" fill="#10B981" stroke="#047857" strokeWidth="1.2" />
                          <polygon points="40,20 45,20 42,24" fill="#10B981" stroke="#047857" strokeWidth="1.2" />
                          <polygon points="40,19 45,19 42,22" fill="#10B981" />
                          <text x="47" y="12" fill="#FFFF" fontSize="6.5" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                            {barkMessage ? barkMessage : "Nom Nom Nom! 🍪"}
                          </text>
                        </g>

                        {/* FLOATING HEARTS & STARS */}
                        <g transform="translate(10, -10)" pointerEvents="none">
                          {/* Heart 1 */}
                          <text x="-8" y="-10" fill="#EF4444" fontSize="12" className="animate-float-heart-1">❤️</text>
                          {/* Heart 2 */}
                          <text x="18" y="-22" fill="#EC4899" fontSize="10" className="animate-float-heart-2">❤️</text>
                          {/* Star Sparkle */}
                          <text x="5" y="-30" fill="#FDE047" fontSize="10" className="animate-float-heart-3">✨</text>
                        </g>
                      </g>

                      {/* --- PUPPY 2: FED BUDDY --- */}
                      <g transform="translate(158, 240) scaleX(-1)">
                        {/* Tail Wagging Fed */}
                        <path d="M42 24 Q52 14, 48 4" fill="none" stroke="#78350F" strokeWidth="5" strokeLinecap="round" className="animate-tail-wag-fed" />

                        {/* Happy shadow */}
                        <ellipse cx="22" cy="46" rx="16" ry="4" fill="#000" opacity="0.4" />

                        {/* Dog Body */}
                        <rect x="6" y="18" width="34" height="26" rx="10" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                        <circle cx="15" cy="42" r="6" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.2" />
                        <circle cx="31" cy="42" r="6" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.2" />

                        {/* Red Collar */}
                        <rect x="2" y="16" width="13" height="3" fill="#EF4444" />
                        <circle cx="8" cy="19.5" r="2" fill="#FBBF24" />

                        {/* Dog Head */}
                        <g className="animate-chomp-head">
                          <circle cx="8" cy="9" r="11" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                          <ellipse cx="4" cy="12" r="4.5" fill="#FEF3C7" />
                          
                          {/* Eyes closed happily */}
                          <path d="M1 6 Q3 4, 5 6" fill="none" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M8 6 Q10 4, 12 6" fill="none" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />

                          {/* Dog Nose */}
                          <polygon points="2,9 5,9 3.5,11" fill="#111827" />

                          {/* Floppy ears */}
                          <path d="M-2 4 Q-7 11, -4 19" fill="none" stroke="#78350F" strokeWidth="5.5" strokeLinecap="round" />
                          <path d="M16 4 Q21 11, 18 19" fill="none" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
                        </g>

                        {/* Speak text is mirrored back properly */}
                        <g transform="translate(20, -32) scaleX(-1)">
                          <rect x="-40" y="0" width="94" height="20" rx="6" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
                          <polygon points="0,20 5,20 2,24" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
                          <polygon points="0,19 5,19 2,22" fill="#22C55E" />
                          <text x="7" y="12" fill="#FFFF" fontSize="6.5" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                            {buddyBarkMessage ? buddyBarkMessage : "Yum! Crunch! 🐾"}
                          </text>
                        </g>

                        {/* FLOATING HEARTS */}
                        <g transform="translate(10, -10)" pointerEvents="none">
                          <text x="-8" y="-10" fill="#EF4444" fontSize="12" className="animate-float-heart-1">❤️</text>
                          <text x="18" y="-22" fill="#EC4899" fontSize="10" className="animate-float-heart-2">❤️</text>
                        </g>
                      </g>
                    </g>
                  )}

                  {/* 12. DYNAMIC ELECTRIC SIGNAL CHECKLIST STATUS BENTON GRID OVERLAYS */}
                  {!allWiringOk && (
                    <g transform="translate(12, 12)">
                      <rect x="0" y="0" width="135" height="20" rx="5" fill="#78350F" opacity="0.92" />
                      <text x="8" y="12" fill="#FEF3C7" fontSize="5.5" fontWeight="bold" fontFamily="monospace">⚠️ PIN LINK BREAK (LOCK PIN)</text>
                    </g>
                  )}
                </svg>
              </div>

              {/* STUDENT INTERACTIVE CARE DECK PANEL */}
              <div className="w-full bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-[10.5px] text-slate-200 tracking-wider uppercase font-sans">
                    🐾 Live Cuddle & Care Station
                  </h5>
                  <span className="text-[9px] text-[#FB923C] font-mono leading-tight bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    Barnaby & Buddy: {hasFed ? "HAPPILY FED! 🥰🍪" : "PLAYING ON FLOOR! 🥺🐾"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button
                    onClick={() => {
                      setPettedCount(prev => prev + 1);
                      const pets = pettedCount + 1;
                      if (pets % 3 === 0) {
                        setBarkMessage("I LOVE IoT! 🐕❤️");
                        addLog("DOG_CARE: Barnaby wags tail furiously! He sings an IoT bark!");
                      } else {
                        setBarkMessage("Woof Woof! 🥰");
                        addLog("DOG_CARE: Barnaby panted gratefully inside the living room.");
                      }
                    }}
                    className="p-2 bg-gradient-to-tr from-rose-500/10 to-rose-600/15 text-rose-300 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 active:scale-95 transition-all text-center text-[10px] font-bold cursor-pointer"
                  >
                    💖 Pet Barnaby
                  </button>

                  <button
                    onClick={() => {
                      setBuddyPettedCount(prev => prev + 1);
                      const pets = buddyPettedCount + 1;
                      if (pets % 3 === 0) {
                        setBuddyBarkMessage("YIPPEE! 🐾⚡");
                        addLog("DOG_CARE: Buddy wags chocolate tail! He barks with joy!");
                      } else {
                        setBuddyBarkMessage("Yip Yip! 😊");
                        addLog("DOG_CARE: Buddy snuggled playfully on the floor.");
                      }
                    }}
                    className="p-2 bg-gradient-to-tr from-emerald-500/10 to-emerald-600/15 text-emerald-300 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 active:scale-95 transition-all text-center text-[10px] font-bold cursor-pointer"
                  >
                    🐶 Pet Buddy
                  </button>

                  <button
                    onClick={() => {
                      setIsDayTime(!isDayTime);
                      addLog(`SYS: Room clock toggled. Atmosphere shifted to ${!isDayTime ? "Daytime Sunshine" : "Cozy Evening Moon"}.`);
                    }}
                    className="p-2 bg-gradient-to-tr from-[#38BDF8]/10 to-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/20 rounded-xl hover:bg-sky-500/20 active:scale-95 transition-all text-center text-[10px] font-bold cursor-pointer"
                  >
                    ☀️ Toggle Day/Night
                  </button>

                  <button
                    onClick={() => {
                      setBallRolled(!ballRolled);
                      setBarkMessage("Ball! Catch! 🎾");
                      setBuddyBarkMessage("My turn! 🐾💨");
                      addLog("INTERACTION: Squeaked the dog toy bone. Both puppies chased the ball!");
                    }}
                    className="p-2 bg-gradient-to-tr from-[#F59E0B]/10 to-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20 rounded-xl hover:bg-amber-500/20 active:scale-95 transition-all text-center text-[10px] font-bold cursor-pointer"
                  >
                    🎾 Play Ball Throw
                  </button>
                </div>
              </div>

            </div>



          </div>

        </div>

      </div>

    </div>
  );
}
