import React, { useState, useEffect } from "react";
import { 
  Sparkles, Cpu, Radio, Shield, HelpCircle, Home, Settings, Terminal, Activity, 
  ArrowLeft, Send, Zap, Sun, Moon, Volume2, VolumeX, Smartphone, Wifi, Compass, 
  ChevronRight, Lock, Unlock, RefreshCw 
} from "lucide-react";

export default function ProjectLed() {
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);
  const [brightness, setBrightness] = useState<number>(255);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    "SERIAL: System initialized. HC-05 auto-paired successfully.",
    "SUCCESS: Connected to COM3 pinout. Waiting for user input...",
  ]);
  const [checklist, setChecklist] = useState({
    wireAnode: true,
    wireGround: true,
    bluetoothPower: true,
    bluetoothSerial: true,
  });
  
  // Immersive Phone States
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [activeApp, setActiveApp] = useState<string>("home"); // home, controller, telemetry, terminal, settings, docs
  const [batteryLevel, setBatteryLevel] = useState<number>(87);
  const [phoneWallpaper, setPhoneWallpaper] = useState<string>("cosmic"); // cosmic, sunset, circuit
  const [customTerminalInput, setCustomTerminalInput] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [phoneFlashlight, setPhoneFlashlight] = useState<boolean>(false);
  const [autoPulseMode, setAutoPulseMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Professor Otto: 'Make sure your physical crossover TX-RX pins don't overlap directly!'",
    "HC-05 Receiver: Pairing code is 1234. Connect transceiver now.",
  ]);

  // Rolling Oscilloscope Points State
  const [telemetryPoints, setTelemetryPoints] = useState<number[]>(() => Array(24).fill(0));

  const isLedLit = !isPowerOn && isConnected;

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

  // Oscilloscope ticker loop
  useEffect(() => {
    const telemetryInterval = setInterval(() => {
      setTelemetryPoints((prev) => {
        const jitter = Math.random() * 0.16 - 0.08;
        const currentV = isLedLit ? (brightness / 255) * 5.0 + jitter : 0;
        const boundedV = Math.max(0, Math.min(5.0, currentV));
        return [...prev.slice(1), Number(boundedV.toFixed(2))];
      });
    }, 250);
    return () => clearInterval(telemetryInterval);
  }, [isLedLit, brightness]);

  // Handle pulse breath mode
  useEffect(() => {
    let pulseInterval: NodeJS.Timeout;
    if (autoPulseMode && isConnected && !isPowerOn) {
      let angle = 0;
      pulseInterval = setInterval(() => {
        angle += 0.2;
        const nextBrightness = Math.round((Math.sin(angle) + 1) * 127.5);
        setBrightness(nextBrightness);
      }, 120);
    }
    return () => clearInterval(pulseInterval);
  }, [autoPulseMode, isConnected, isPowerOn]);

  const addLog = (msg: string) => {
    setSerialLogs((prev) => [msg, ...prev.slice(0, 5)]);
  };

  const handleTogglePower = () => {
    if (!isConnected) {
      addLog("ERROR: Bluetooth not paired! Command failed to broadcast.");
      return;
    }
    const targetState = !isPowerOn;
    setIsPowerOn(targetState);
    if (targetState) {
      setAutoPulseMode(false);
    }
    const commandVal = targetState ? "1" : "0";
    if (targetState) {
      addLog("TX: Sent Switch ON ('1') -> Active-Low Pin 13 HIGH turns LED OFF.");
    } else {
      addLog("TX: Sent Switch OFF ('0') -> Active-Low Pin 13 LOW sinks current, turning LED ON.");
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isConnected) return;
    const value = parseInt(e.target.value);
    setBrightness(value);
    setAutoPulseMode(false);
    addLog(`TX: Sent PWM payload [PWM_PIN13: ${value}] via serial pipe.`);
  };

  const handleConnectBt = () => {
    const nextState = !isConnected;
    setIsConnected(nextState);
    if (nextState) {
      addLog("SUCCESS: HC-05 Bluetooth paired securely with Student Tablet!");
    } else {
      setIsPowerOn(true);
      setAutoPulseMode(false);
      addLog("INFO: Bluetooth wireless connection severed safely.");
    }
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allChecked = Object.values(checklist).every(v => v);

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

    if (cmd === "help") {
      addLog("INFO: Commands: [on], [off], [pwm XXX], [breathe], [clear], [status]");
    } else if (cmd === "1" || cmd === "on" || cmd === "red on") {
      setIsPowerOn(true);
      addLog("SUCCESS: Sent serial code '1' (HIGH). Pin 13 Red is HIGH -> Active-low LED is OFF.");
    } else if (cmd === "0" || cmd === "off" || cmd === "red off") {
      setIsPowerOn(false);
      setAutoPulseMode(false);
      addLog("SUCCESS: Sent serial code '0' (LOW). Pin 13 Red is LOW (sinks current) -> LED is ON.");
    } else if (cmd.startsWith("red pwm ")) {
      const numValue = parseInt(cmd.replace("red pwm ", ""));
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
        setIsPowerOn(false);
        setBrightness(numValue);
        addLog(`SUCCESS: Sent voltage modulation ${numValue} to Pin 13 Red. Active-low LED is ON.`);
      } else {
        addLog("ERROR: PWM values must lie inside range 0 to 255.");
      }
    } else if (cmd.startsWith("pwm ")) {
      const numValue = parseInt(cmd.replace("pwm ", ""));
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
        setIsPowerOn(false);
        setBrightness(numValue);
        addLog(`SUCCESS: Sent pwm code ${numValue} to Red LED. Active-low LED is ON.`);
      } else {
        addLog("ERROR: PWM values must lie inside range 0 to 255.");
      }
    } else if (cmd === "breathe") {
      setIsPowerOn(false);
      setAutoPulseMode(true);
      addLog("SUCCESS: Breathing automatic sinewave active. Active-low Pin 13 Red pulses ON.");
    } else if (cmd === "clear") {
      setSerialLogs(["CONSOLE: Terminal screen flushed clean."]);
    } else if (cmd === "status") {
      addLog(`STATUS: BT=${isConnected ? 'ALIVE' : 'DEAD'}, APP_SWITCH=${isPowerOn ? 'ON' : 'OFF'}, PHYSICAL_LED=${isLedLit ? 'ON' : 'OFF'}, PWM=${brightness}`);
    } else {
      addLog(`ERROR: Unknown command "${cmd}". Type "help" for code hints.`);
    }
    setCustomTerminalInput("");
  };

  // Wallpaper rendering helper
  const getWallpaperClass = () => {
    if (phoneWallpaper === "sunset") {
      return "bg-gradient-to-b from-[#701A75] to-[#3B0764]";
    } else if (phoneWallpaper === "circuit") {
      return "bg-gradient-to-b from-[#0F172A] to-[#1E293B] bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] bg-[size:16px_16px]";
    }
    return "bg-gradient-to-b from-[#0F2027] via-[#203A43] to-[#2C5364]";
  };

  return (
    <div className="space-y-8" id="project-led-root">
      
      {/* Visual Header Banner */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border-2 border-slate-200 flex flex-col md:flex-row gap-6 items-center border-b-8 border-[#FACC15]">
        <div className="w-full md:w-1/3 flex justify-center" id="banner-circ-container">
          <div className="relative w-full aspect-video bg-slate-900 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center p-4 overflow-hidden select-none">
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-35" />
            
            {/* Soft background glow */}
            <div className={`absolute w-36 h-36 rounded-full blur-2xl transition-all duration-500 ${isLedLit ? "bg-red-500/20 scale-110" : "bg-slate-800/20"}`} />
            
            <div className="relative z-10 flex flex-col items-center space-y-3">
              {/* SVG Device Nodes */}
              <div className="flex items-center gap-6">
                {/* Microcontroller icon card */}
                <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-700 shadow-md">
                  <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
                
                {/* Wireless linking line */}
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-cyan-400 animate-ping" : "bg-slate-800"}`}></span>
                  <div className={`h-1 w-12 rounded transition-colors duration-500 ${isConnected ? "bg-gradient-to-r from-cyan-500 to-red-500" : "bg-slate-800"}`} />
                  <span className={`w-2 h-2 rounded-full ${isLedLit ? "bg-red-500 animate-ping" : "bg-slate-700"}`}></span>
                </div>

                {/* Led bulb glowing */}
                <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-700 shadow-md relative">
                  <Sparkles className={`w-8 h-8 transition-colors duration-500 ${isLedLit ? "text-red-500" : "text-slate-600"}`} />
                  {isLedLit && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-center">
                <div className="text-[10.5px] font-mono tracking-widest text-slate-400 font-extrabold uppercase">
                  SIMULATOR PAYLOAD STATUS
                </div>
                <div className="text-xs font-black text-white uppercase tracking-tight flex items-center justify-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLedLit ? "bg-red-500" : "bg-slate-600"}`}></span>
                  PIN 13 RED: <span className={isLedLit ? "text-red-400 font-extrabold" : "text-slate-400"}>{isLedLit ? `${Math.round((brightness/255)*100)}% ON` : "OFF"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-105 bg-yellow-100 text-yellow-850 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6321]" /> Project Mission
          </div>
          <h2 className="text-2xl font-black text-[#0C4A6E] tracking-tight">
            Help Otto Light Up the Dark Room! 💡
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Can you build a wireless Bluetooth switch that lets Otto control the red LED directly using a mobile phone?
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-2">
            <span className="flex items-center gap-1 bg-[#E0F2FE] text-[#0369A1] px-3 py-1.5 rounded-xl border border-[#bae6fd] font-bold">
              <Cpu className="w-3.5 h-3.5" /> Brain: Arduino UNO
            </span>
            <span className="flex items-center gap-1 bg-[#FFEDD5] text-[#C2410C] px-3 py-1.5 rounded-xl border border-orange-100 font-bold">
              <Radio className="w-3.5 h-3.5" /> Wireless: HC-05 Bluetooth
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Assembly & Simulation Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-fade-in" id="simulation-dashboard">
        
        {/* COLUMN 1: WIRE JUMPER CHECKLIST (LEFT - 4 Units) */}
        <div className="md:col-span-12 lg:col-span-4 space-y-4 font-sans" id="assembler-workbench">
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-150 shadow-md space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#0C4A6E] flex items-center gap-2">
                <span>🔧</span> Jumper Wire Checklist
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                Connect the breadboard jumpers before flashing software signals.
              </p>
            </div>

            <div className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase text-center border ${
              allChecked 
                ? "bg-green-50 text-green-700 border-green-200 font-bold" 
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {allChecked ? "🔋 ALL CIRCUITS SECURED" : "⚠️ WIRING NEEDED"}
            </div>

            <div className="space-y-2.5">
              {/* Checkbox item 1 */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer transition-colors block">
                <input 
                  type="checkbox" 
                  checked={checklist.wireAnode}
                  onChange={() => toggleCheck("wireAnode")}
                  className="mt-0.5 rounded-md border-slate-300 text-[#FF6321] focus:ring-[#FF6321] w-4.5 h-4.5 cursor-pointer"
                />
                <div className="text-xs text-left">
                  <strong className="block text-slate-800 font-extrabold pb-0.5">1. Anode Leg Wire 💡</strong>
                  Red LED Long arm (+) to <span className="font-mono bg-slate-200/70 px-1 py-0.25 rounded text-slate-700 font-bold">Pin 13</span>.
                </div>
              </label>

              {/* Checkbox item 2 */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer transition-colors block">
                <input 
                  type="checkbox" 
                  checked={checklist.wireGround}
                  onChange={() => toggleCheck("wireGround")}
                  className="mt-0.5 rounded-md border-slate-300 text-[#FF6321] focus:ring-[#FF6321] w-4.5 h-4.5 cursor-pointer"
                />
                <div className="text-xs text-left">
                  <strong className="block text-slate-800 font-extrabold pb-0.5">2. LED Cathode GND 🔌</strong>
                  Short leg (-) with <span className="font-mono bg-slate-200/70 px-1 py-0.25 rounded text-slate-700 font-bold">220Ω Resistor</span> to <span className="font-mono bg-slate-200/70 px-1 py-0.25 rounded text-slate-700 font-bold">GND</span>.
                </div>
              </label>

              {/* Checkbox item 3 */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer transition-colors block">
                <input 
                  type="checkbox" 
                  checked={checklist.bluetoothPower}
                  onChange={() => toggleCheck("bluetoothPower")}
                  className="mt-0.5 rounded-md border-slate-300 text-[#FF6321] focus:ring-[#FF6321] w-4.5 h-4.5 cursor-pointer"
                />
                <div className="text-xs text-left">
                  <strong className="block text-slate-800 font-extrabold pb-0.5">3. BT Module Power 📻</strong>
                  HC-05 <span className="font-mono bg-slate-200/70 px-1 py-0.25 rounded text-slate-700 font-bold">VCC</span> to <span className="font-mono bg-slate-200/70 px-1 py-0.25 rounded text-slate-700 font-bold">5V</span> and <span className="font-mono bg-slate-200/70 px-1 py-0.25 rounded text-slate-700 font-bold">GND</span>.
                </div>
              </label>

              {/* Checkbox item 4 */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer transition-colors block">
                <input 
                  type="checkbox" 
                  checked={checklist.bluetoothSerial}
                  onChange={() => toggleCheck("bluetoothSerial")}
                  className="mt-0.5 rounded-md border-slate-300 text-[#FF6321] focus:ring-[#FF6321] w-4.5 h-4.5 cursor-pointer"
                />
                <div className="text-xs text-left">
                  <strong className="block text-slate-800 font-extrabold pb-0.5">4. TX/RX Transmit Cross⚙️</strong>
                  HC-05 <span className="font-mono bg-slate-200/70 px-1 py-0.25 rounded text-slate-700 font-bold">TX 👉 RX</span> and <span className="font-mono bg-slate-200/70 px-1 py-0.25 rounded text-slate-700 font-bold">RX 👈 TX</span> interface.
                </div>
              </label>
            </div>

            <div className="bg-[#E0F2FE] p-3 rounded-xl border border-[#bae6fd]">
              <span className="text-[10px] text-[#0369A1] font-black uppercase block mb-0.5">💡 Professor Otto's Wisdom:</span>
              <p className="text-slate-600 text-[10.5px] leading-relaxed text-left">
                Resistors restrict heavy power flows so excess voltage doesn't burn out our fragile light-emitting diodes!
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: MOBILE SWITCH CONTROLLER DISPLAY (MIDDLE - 4 Units) */}
        <div className="md:col-span-6 lg:col-span-4 flex justify-center w-full">
          
          {/* Outer Mobile Phone Body with Details */}
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
                    <p className="text-xs text-slate-455 text-slate-400 font-semibold">
                      Monday, June 1
                    </p>
                  </div>

                  <div className="w-full space-y-2 bg-slate-950/80 p-3 rounded-2xl border border-white/5 max-w-[210px]">
                    <span className="text-[8px] text-yellow-500 font-black uppercase tracking-wider block text-left">
                      💌 Notification Banner
                    </span>
                    <p className="text-[9.5px] text-slate-300 leading-snug text-left truncate">
                      Otto: "Let's toggle Pin 13!"
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
                  className={`flex-1 flex flex-col justify-between py-1.5 rounded-3xl px-3.5 py-3.5 mt-1 relative z-10 overflow-hidden leading-normal shadow-inner border border-slate-800/10 ${getWallpaperClass()}`}
                >
                  
                  {/* HOME INDICATOR VIEW */}
                  {activeApp === "home" ? (
                    /* PHONE HOME SCREEN (LAUNCHER) */
                    <div className="flex-1 flex flex-col justify-between pt-1 animate-fade-in">
                      
                      {/* Interactive Widget Header block */}
                      <div className="bg-slate-950/70 p-3 rounded-2xl border border-white/5 space-y-1 backdrop-blur-md">
                        <div className="flex justify-between items-center text-[8.5px] font-black tracking-wider uppercase text-slate-400">
                          <span>📊 UNO telemetry widget</span>
                          <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400" : "bg-rose-500 animate-pulse"}`}></span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[11px] font-extrabold text-slate-350 text-slate-300 block text-left">
                              LED Pin 13 State
                            </span>
                            <span className="text-[10px] text-left block text-slate-400">
                              {isLedLit ? `LED GLOWING (${brightness}/255)` : "LED POWER OFF"}
                            </span>
                          </div>
                          <span className="text-xl">
                            {isLedLit ? "💡" : "🌑"}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic launcher grid */}
                      <div className="my-auto py-2">
                        <span className="text-[9px] font-black text-white/55 tracking-wider uppercase block text-left pl-1 pb-1.5 select-none font-sans">
                          Systems Apps:
                        </span>
                        
                        <div className="grid grid-cols-3 gap-2.5">
                          {/* App 1: Controller */}
                          <button 
                            onClick={() => {
                              setActiveApp("controller");
                              addLog("PHONEOS: Launching 'Smart Switch Controller' application.");
                            }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-[#38BDF8]/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#1D4ED8] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                              <Smartphone className="w-5 h-5" />
                            </div>
                            <span className="text-[8.5px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              LED Switch
                            </span>
                          </button>

                          {/* App 2: Oscilloscope */}
                          <button 
                            onClick={() => {
                              setActiveApp("telemetry");
                              addLog("PHONEOS: Launching 'Volts Oscilloscope' app.");
                            }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-emerald-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                              <Activity className="w-5 h-5" />
                            </div>
                            <span className="text-[8.5px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Oscilloscope
                            </span>
                          </button>

                          {/* App 3: Terminal CLI */}
                          <button 
                            onClick={() => {
                              setActiveApp("terminal");
                              addLog("PHONEOS: Launching 'Bluetooth Terminal Console'. Input prompt open.");
                            }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-[#FACC15]/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F59E0B] to-[#B45309] flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
                              <Terminal className="w-5 h-5" />
                            </div>
                            <span className="text-[8.5px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              BT Terminal
                            </span>
                          </button>

                          {/* App 4: Settings */}
                          <button 
                            onClick={() => {
                              setActiveApp("settings");
                              addLog("PHONEOS: Launching 'OS Configuration Settings' panel.");
                            }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-indigo-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A78BFA] to-[#6D28D9] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                              <Settings className="w-5 h-5" />
                            </div>
                            <span className="text-[8.5px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Settings
                            </span>
                          </button>

                          {/* App 5: Educational Docs */}
                          <button 
                            onClick={() => {
                              setActiveApp("docs");
                              addLog("PHONEOS: Launching 'Professor Otto's Lab Notebook'.");
                            }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-orange-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF8C3A] to-[#C2410C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                              <Compass className="w-5 h-5" />
                            </div>
                            <span className="text-[8.5px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Lab Guide
                            </span>
                          </button>

                          {/* Dummy App: App Store */}
                          <div                               className="bg-slate-950/20 opacity-50 p-2 rounded-xl border border-white/5 flex flex-col items-center gap-1 w-full text-center select-none"
                          >
                            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                              <Zap className="w-5 h-5" />
                            </div>
                            <span className="text-[8.5px] font-bold text-slate-400 tracking-tight leading-tight block truncate w-full">
                              App Store
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Small Quick-Launch Dock Tray at bottom */}
                      <div className="bg-slate-950/50 p-2 rounded-2xl border border-white/5 flex justify-around items-center backdrop-blur-md mt-2">
                        <button 
                          onClick={() => { setActiveApp("controller"); }}
                          className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 hover:bg-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] active:scale-95 cursor-pointer" 
                          title="LED Remote"
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setActiveApp("telemetry"); }}
                          className="w-8 h-8 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/45 flex items-center justify-center text-emerald-400 active:scale-95 cursor-pointer" 
                          title="Oscilloscope Trace"
                        >
                          <Activity className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setActiveApp("terminal"); }}
                          className="w-8 h-8 rounded-lg bg-[#FACC15]/10 hover:bg-[#FACC15]/45 flex items-center justify-center text-[#FACC15] active:scale-95 cursor-pointer" 
                          title="Serial Terminal"
                        >
                          <Terminal className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ) : activeApp === "controller" ? (
                    
                    /* APPLICATION 1 VIEW: Smart Switch Controller App */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-slate-350 cursor-pointer text-[#38BDF8]"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#38BDF8] block font-black uppercase tracking-wider font-mono">APP CONTROLLER</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans">OttoRemote LED v1.2</h4>
                          </div>
                        </div>

                        {/* BLE Pairing Control Module */}
                        <div className="space-y-2">
                          <div className="bg-slate-950/80 p-2 text-slate-100 rounded-xl border border-white/5 shadow-md">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[8.5px] text-slate-405 text-slate-400 font-bold tracking-wider uppercase font-sans">
                                HC-05 Connection State
                              </span>
                              <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.25 rounded ${isConnected ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                                {isConnected ? "PAIRED" : "DISCONNECTD"}
                              </span>
                            </div>

                            <button 
                              onClick={handleConnectBt}
                              className={`w-full py-1 rounded-lg font-black text-[9.5px] uppercase tracking-wider transition-all transform active:scale-97 cursor-pointer ${
                                isConnected 
                                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/10" 
                                  : "bg-gradient-to-r from-[#38BDF8] to-[#1E3A8A] text-white hover:opacity-90 font-extrabold shadow-md shadow-sky-950/10"
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
                              <div className="space-y-2">
                                <div className="space-y-2 animate-fade-in">
                                  <div className="flex justify-between items-center bg-slate-950/80 p-2 rounded-xl border border-white/5 shadow-md font-sans">
                                    <div>
                                      <span className="text-[7.5px] text-slate-400 font-extrabold uppercase block tracking-tight">PIN 13 RED LED</span>
                                      <span className="text-[9.5px] font-black text-slate-200">POWER SWITCH</span>
                                    </div>
                                    <button 
                                      onClick={handleTogglePower}
                                      className={`px-3 py-1 font-black text-[9px] rounded uppercase tracking-wider shadow-sm transform active:scale-95 cursor-pointer ${isPowerOn ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "bg-slate-800 text-slate-400"}`}
                                    >
                                      {isPowerOn ? "ON 💡" : "OFF 🌑"}
                                    </button>
                                  </div>

                                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5 space-y-1 shadow-md font-sans">
                                    <div className="flex justify-between text-[8px] font-black text-slate-355 tracking-tight">
                                      <span className="uppercase text-slate-400 text-[7.5px]">PWM RED INTENSITY</span>
                                      <span className="font-mono text-red-500">{!isPowerOn ? `${brightness}/255` : "0 (Disabled)"}</span>
                                    </div>
                                    <input 
                                      type="range" 
                                      min="0" 
                                      max="255" 
                                      value={!isPowerOn ? brightness : 0} 
                                      disabled={isPowerOn}
                                      onChange={handleSliderChange}
                                      className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                                    />
                                    <div className="flex justify-between items-center pt-1 border-t border-white/5">
                                      <span className="text-[7.5px] uppercase font-bold text-slate-400">Sinusoidal Pulsing:</span>
                                      <button 
                                        onClick={() => {
                                          if (!isPowerOn) {
                                            setAutoPulseMode(prev => !prev);
                                            addLog(`TX: Auto-pulse sine breathing command toggled for Red to ${!autoPulseMode ? "ON" : "OFF"}.`);
                                          }
                                        }}
                                        disabled={isPowerOn}
                                        className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase ${autoPulseMode ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-400"} disabled:opacity-30`}
                                      >
                                        {autoPulseMode ? "Breathing" : "Static"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Brief advice */}
                      <p className="text-[7.5px] text-slate-450 italic mt-1 font-mono text-center">
                        *Encrypted Bluetooth connection operating on IEEE 802.15.1.
                      </p>
                    </div>

                  ) : activeApp === "telemetry" ? (
                    
                    /* APPLICATION 2 VIEW: Oscilloscope / Circuit Telemetry */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-slate-350 cursor-pointer text-[#38BDF8]"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#10B981] block font-black uppercase tracking-wider font-mono">SCI OSCILLOSCOPE</span>
                            <h4 className="text-xs font-black text-white leading-tight">Live Voltage Monitor v2.10</h4>
                          </div>
                        </div>

                        {/* Interactive Oscilloscope screen */}
                        <div className="bg-slate-950 rounded-xl p-2 border border-slate-800 font-mono relative">
                          <div className="absolute top-1 right-2 text-[8px] font-bold text-slate-400 tracking-wider">
                            SCALE: 1.0 V/DIV
                          </div>
                          
                          {/* Live Voltage Wave */}
                          <div className="h-28 w-full bg-[#05130f] rounded-lg relative overflow-hidden flex items-end">
                            {/* Grid Lines Overlay */}
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-15 pointer-events-none">
                              {[...Array(6)].map((_, i) => (
                                <div key={`c-${i}`} className="border-r border-emerald-400 h-full w-full"></div>
                              ))}
                              {[...Array(4)].map((_, i) => (
                                <div key={`r-${i}`} className="border-b border-emerald-400 h-full w-full"></div>
                              ))}
                            </div>

                            {/* Scrolling Vector Wave using SVG */}
                            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <polyline
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={telemetryPoints.map((val, index) => {
                                  // Map volts (0-5.5) to SVG height coordinates (100 is bottom, 0 is top)
                                  const xPos = (index / (telemetryPoints.length - 1)) * 100;
                                  // Invert so 5V is near the top (e.g. y=20) and 0V is near bottom (e.g. y=90)
                                  const yPos = 90 - (val / 5.5) * 70;
                                  return `${xPos},${yPos}`;
                                }).join(" ")}
                              />
                            </svg>

                            {/* Dynamic Glow aura follow point */}
                            {isPowerOn && (
                              <div className="absolute top-1.5 left-1 font-black text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.25 rounded">
                                ACTIVE ⚡
                              </div>
                            )}
                          </div>

                          {/* Interactive Telemetry State indicators below graph */}
                          <div className="grid grid-cols-2 gap-2 text-center text-[9px] mt-2 border-t border-slate-900 pt-1.5 font-bold">
                            <div className="bg-[#111827] text-slate-300 p-1.5 rounded border border-white/5">
                              <span className="text-[7.5px] uppercase font-bold text-slate-400 block pb-0.5">Calculated V_Anode</span>
                              <p className="text-[12px] font-black text-emerald-400">
                                {isPowerOn ? `${((brightness / 255) * 5.0).toFixed(2)} Volts` : "0.00 V"}
                              </p>
                            </div>
                            <div className="bg-[#111827] text-[#FACC15] p-1.5 rounded border border-white/5">
                              <span className="text-[7.5px] uppercase font-bold text-slate-400 block pb-0.5">Load mA Draw</span>
                              <p className="text-[12px] font-black text-[#FACC15]">
                                {isPowerOn ? `${Math.round(((brightness / 255) * 22) + (Math.random() * 1.5))} mA` : "0.0 mA"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Reset or Sine waves toggler inside OS */}
                        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5 mt-2.5">
                          <p className="text-[9px] text-slate-350 leading-relaxed">
                            <strong>Note:</strong> Current values simulate exact physical ohm thresholds mapped against a standard <span className="text-yellow-400 font-extrabold font-mono">220Ω resistor</span> limit.
                          </p>
                        </div>

                      </div>

                      <span className="text-[7.5px] text-slate-450 italic mt-1 font-mono text-center">
                        *Oscilloscope stream bound to Pin 13 Analog-A0 bridge.
                      </span>
                    </div>

                  ) : activeApp === "terminal" ? (
                    
                    /* APPLICATION 3 VIEW: Bluetooth Terminal Box */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div className="flex-1 flex flex-col justify-start">
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-0.5 rounded text-slate-350 cursor-pointer text-[#FACC15]"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[8px] text-[#FACC15] block font-black uppercase tracking-wider font-mono">SERIAL SHELL TERMINAL</span>
                            <h4 className="text-xs font-black text-white leading-tight">HC-05 Stream Console</h4>
                          </div>
                        </div>

                        {/* Code Command Cheatsheet Help Widget */}
                        <div className="bg-[#131201] rounded-lg p-2 border border-yellow-500/20 text-[8px] text-slate-200 font-mono mb-2">
                          <strong className="text-yellow-500">🎮 Type Codes:</strong> <code className="bg-slate-955/80 text-[#38BDF8] px-1 font-bold">on</code> = high, <code className="bg-slate-955/80 text-[#38BDF8] px-1 font-bold">off</code> = low, <code className="bg-slate-955/80 text-[#38BDF8] px-1 font-bold">pwm 128</code> = dimmer, <code className="bg-slate-955/80 text-[#38BDF8] px-1 font-bold">breathe</code> = sinewave.
                        </div>

                        {/* Inline console logging screen */}
                        <div className="flex-1 bg-black rounded-lg p-2.5 font-mono text-[9px] border border-slate-800 h-[120px] max-h-[140px] overflow-y-auto thin-scroll space-y-1 text-slate-300">
                          <span className="text-[7px] text-slate-500 uppercase font-black block tracking-wider pb-1">
                            --- Local Mobile Buffer logs ---
                          </span>
                          {serialLogs.map((log, index) => (
                            <p key={index} className="leading-snug truncate">
                              <span className="text-[#38BDF8]">&gt;</span> {log}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Command prompt execution box */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          executeTerminalCommand(customTerminalInput);
                        }}
                        className="mt-2.5 flex items-center gap-1.5"
                      >
                        <input 
                          type="text"
                          value={customTerminalInput}
                          onChange={(e) => setCustomTerminalInput(e.target.value)}
                          placeholder="Type serial text rule..."
                          className="flex-1 bg-slate-950 font-mono text-[10px] rounded px-2.5 py-1.5 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-[#FACC15]"
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
                        <div className="flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-slate-350 cursor-pointer text-purple-400"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#A78BFA] block font-black uppercase tracking-wider font-mono">SYSTEM SETTINGS</span>
                            <h4 className="text-xs font-black text-white leading-tight">Otto OS Launcher Panel</h4>
                          </div>
                        </div>

                        {/* Settings Item Grid */}
                        <div className="space-y-2 text-xs font-sans">
                          
                          {/* Setting 1: Wallpapers */}
                          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                            <span className="text-[8.5px] uppercase font-black tracking-wider text-slate-400 block">
                              🖥️ Theme Wallpaper Settings
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                              <button 
                                onClick={() => { setPhoneWallpaper("cosmic"); addLog("SETTING: Swapped wallpaper to Cosmic Slate."); }}
                                className={`py-1 text-[8px] font-bold uppercase rounded border ${phoneWallpaper === "cosmic" ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]" : "bg-slate-900 text-slate-400 border-transparent"}`}
                              >
                                Cosmic
                              </button>
                              <button 
                                onClick={() => { setPhoneWallpaper("sunset"); addLog("SETTING: Swapped wallpaper to Sunset Cyber."); }}
                                className={`py-1 text-[8px] font-bold uppercase rounded border ${phoneWallpaper === "sunset" ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]" : "bg-slate-900 text-slate-400 border-transparent"}`}
                              >
                                Sunset
                              </button>
                              <button 
                                onClick={() => { setPhoneWallpaper("circuit"); addLog("SETTING: Swapped wallpaper to Logic Gates."); }}
                                className={`py-1 text-[8px] font-bold uppercase rounded border ${phoneWallpaper === "circuit" ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]" : "bg-slate-900 text-slate-400 border-transparent"}`}
                              >
                                Circuit
                              </button>
                            </div>
                          </div>

                          {/* Setting 2: Strobe / Back Camera Torch */}
                          <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                            <div className="text-left">
                              <strong className="text-[9.5px] text-slate-200 block">Strobe Flashlight</strong>
                              <span className="text-[8px] text-slate-400 block uppercase">Toggle camera strobe light</span>
                            </div>
                            <button 
                              onClick={() => {
                                setPhoneFlashlight(prev => !prev);
                                addLog(`PHONE: Camera strobe flash toggled to ${!phoneFlashlight ? "ON" : "OFF"}.`);
                              }}
                              className={`px-3 py-1 text-[8.5px] font-black uppercase rounded ${phoneFlashlight ? "bg-[#FACC15] text-slate-950 font-extrabold" : "bg-slate-800 text-slate-400"}`}
                            >
                              {phoneFlashlight ? "FLASH ON" : "FLASH OFF"}
                            </button>
                          </div>

                          {/* Setting 3: System Details diagnostics */}
                          <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5 text-[9px] text-[#A78BFA] space-y-1 font-mono">
                            <p className="flex justify-between">
                              <span>SIGNAL TRANSCEIVER:</span>
                              <strong>HC-05 HC2011</strong>
                            </p>
                            <p className="flex justify-between">
                              <span>BLUETOOTH FREQ:</span>
                              <strong>2.4 GHz ISM Band</strong>
                            </p>
                            <p className="flex justify-between">
                              <span>ANTENNA GAIN:</span>
                              <strong>-62 dBm</strong>
                            </p>
                          </div>

                        </div>
                      </div>

                      <span className="text-[7.5px] text-slate-450 italic mt-1 font-mono text-center">
                        *Otto OS 14.2 build 2026-A1.
                      </span>
                    </div>

                  ) : (
                    
                    /* APPLICATION 5 VIEW: Lab Manual and Docs */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-slate-350 cursor-pointer text-orange-400"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#FF8C3A] block font-black uppercase tracking-wider font-mono">LAB MANUAL</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans">Circuit Wiring Theory</h4>
                          </div>
                        </div>

                        {/* Interactive FAQ Guide of the experiment */}
                        <div className="space-y-2 text-[10px] sm:text-[10px] leading-relaxed max-h-[220px] overflow-y-auto thin-scroll space-y-2 text-slate-300">
                          
                          <div className="bg-slate-950/85 p-2 rounded-xl border border-white/5">
                            <h5 className="font-extrabold text-[#FACC15] pb-0.5">Q1: How does Bluetooth work here?</h5>
                            <p className="text-slate-400 text-[9px]">
                              The mobile phone encodes coordinates or commands into electronic text bits (like '1' status HIGH or '0' status LOW) of data, transmitting wireless waves on the 2.4GHz spectrum. The breadboard's HC-05 transceiver captures them!
                            </p>
                          </div>

                          <div className="bg-slate-950/85 p-2 rounded-xl border border-white/5">
                            <h5 className="font-extrabold text-[#FACC15] pb-0.5">Q2: Why do we cross TX and RX cables?</h5>
                            <p className="text-slate-400 text-[9px]">
                              Transmitting means whispering bytes! Transmit (TX) on the receiver MUST hook into Receive (RX) on the Arduino microboard. If you cable TX-TX and RX-RX, both sides only shout or listen on isolation-shunted routes, resulting in serial packet dropouts!
                            </p>
                          </div>

                          <div className="bg-slate-950/85 p-2 rounded-xl border border-white/5">
                            <h5 className="font-extrabold text-[#FACC15] pb-0.5">Q3: What role does 220 Ohm provide?</h5>
                            <p className="text-slate-400 text-[9px]">
                              Anodes are highly sensitive. Shunting keeps excess raw currents from shorting the internal vacuum gas of your semiconductor lights!
                            </p>
                          </div>

                        </div>
                      </div>

                      <p className="text-[7.5px] text-slate-400 font-mono italic text-center text-orange-200 animate-pulse mt-1">
                        🔒 Coach Otto Classroom Manual verified.
                      </p>
                    </div>

                  )}

                  {/* BOTTOM REUSABLE SMARTPHONE HOME BAR BAR KEY (PILL TRAY) */}
                  <div className="w-full pt-1.5 flex justify-center mt-1">
                    <button 
                      onClick={() => {
                        setActiveApp("home");
                        addLog("PHONEOS: System gesture detects click on Virtual home pill button.");
                      }}
                      className="w-2.5 h-2.5 rounded-full bg-white/70 hover:bg-white border-2 border-slate-900 shadow-md cursor-pointer active:scale-90 transition-all z-20 py-0.5 px-6 rounded-full inline-block border-t border-slate-700/50"
                      title="Return to home launcher screen"
                    />
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

             {/* COLUMN 3: VIRTUAL BREADBOARD PLAYGROUND AND CIRCUIT GRAPHIC (RIGHT - 4 Units) */}
        <div className="md:col-span-12 lg:col-span-4 w-full" id="schematic-workbench-col">
          
          <div 
            className="rounded-[2.5rem] p-6 shadow-2xl flex flex-col justify-between text-white min-h-[515px] relative overflow-hidden group/table"
            style={{
              background: "radial-gradient(circle at 50% 25%, #854d0e 0%, #451a03 70%, #1c0a00 100%)", // Rich golden mahogany wood with radial desk light reflection
              borderLeft: "8px solid #5c2e0b",
              borderRight: "8px solid #5c2e0b",
              borderTop: "4px solid #783e0d",
              borderBottom: "20px solid #1c0a01", // Beveled front 3D table edge wood texture
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.85), inset 0 25px 50px rgba(254, 240, 138, 0.12), inset 0 -15px 40px rgba(0,0,0,0.7)",
            }}
          >
            
            {/* Elegant Realistic Wooden Table Grain Overlay Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-600/10 via-amber-900/20 to-black/50 pointer-events-none mix-blend-overlay" />
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1.5px, transparent 1.5px, transparent 180px)`,
              }}
            />

            <div className="space-y-5 relative z-10">
              {/* Metallic brass plate engraved sign for table */}
              <div 
                className="flex justify-between items-center px-4 py-2 rounded-xl"
                style={{
                  background: "linear-gradient(to bottom, #fef08a, #ca8a04)", // Beautiful gold/brass plate
                  border: "2px solid #854d0e",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                <span className="text-[10px] text-[#451a03] uppercase tracking-wider font-extrabold font-sans flex items-center gap-1">
                  🔨 Laboratory Desk #1
                </span>
                <span className="font-mono text-[9px] text-[#713f12] font-black uppercase tracking-widest">
                  PORT: COM3
                </span>
              </div>



              {/* Ultra-Realistic 3D Perspective viewport wrapper (Strictly NON-FRONT layout) */}
              <div 
                className="relative w-full overflow-visible py-4 perspective-[1200px]"
                style={{ perspective: "1200px" }}
              >
                <div
                  className="transition-all duration-500 ease-out hover:scale-[1.04] origin-center"
                  style={{
                    transform: "rotateX(22deg) rotateY(-11deg) rotateZ(3deg)", // Full 3D angled desktop layout
                    transformStyle: "preserve-3d",
                    filter: "drop-shadow(18px 30px 16px rgba(0, 0, 0, 0.75))", // Cast immersive shadow onto wood table
                  }}
                >
                  {/* SVG Breadboard and Arduino Board inside rotated layer */}
                  <svg
                    viewBox="0 0 520 340"
                    width="100%"
                    height="auto"
                    className="rounded-2xl animate-fade-in bg-transparent"
                  >
                    <defs>
                      <radialGradient id="red-led-grad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FDA4AF" />
                        <stop offset="40%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#9F1239" />
                      </radialGradient>
                      <radialGradient id="red-glow-grad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                        <stop offset="35%" stopColor="#EF4444" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Technical graph guidelines printed directly on wood */}
                    <g opacity="0.1">
                      <line x1="10" y1="0" x2="10" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="60" y1="0" x2="60" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="110" y1="0" x2="110" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="160" y1="0" x2="160" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="210" y1="0" x2="210" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="260" y1="0" x2="260" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="310" y1="0" x2="310" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="360" y1="0" x2="360" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="410" y1="0" x2="410" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="460" y1="0" x2="460" y2="340" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="510" y1="0" x2="510" y2="340" stroke="#FFE4E6" strokeWidth="1" />

                      <line x1="0" y1="30" x2="520" y2="30" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="0" y1="80" x2="520" y2="80" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="0" y1="130" x2="520" y2="130" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="0" y1="180" x2="520" y2="180" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="0" y1="230" x2="520" y2="230" stroke="#FFE4E6" strokeWidth="1" />
                      <line x1="0" y1="280" x2="520" y2="280" stroke="#FFE4E6" strokeWidth="1" />
                    </g>

                    {/* 1. ARDUINO UNO BOARD */}
                    <g id="arduino-uno">
                      {/* Main Board PCB */}
                      <rect x="20" y="40" width="160" height="260" rx="14" fill="#0E243D" stroke="#1E40AF" strokeWidth="3" />
                      {/* Mounting Holes */}
                      <circle cx="35" cy="55" r="5" fill="#4B5563" stroke="#9CA3AF" strokeWidth="1" />
                      <circle cx="165" cy="55" r="5" fill="#4B5563" stroke="#9CA3AF" strokeWidth="1" />
                      <circle cx="35" cy="285" r="5" fill="#4B5563" stroke="#9CA3AF" strokeWidth="1" />
                      <circle cx="165" cy="285" r="5" fill="#4B5563" stroke="#9CA3AF" strokeWidth="1" />

                      {/* Silver Crystal Oscillator */}
                      <rect x="32" y="110" width="14" height="24" rx="4" fill="#9CA3AF" stroke="#D1D5DB" strokeWidth="1" />
                      {/* Silver USB Connector */}
                      <rect x="15" y="65" width="30" height="40" rx="3" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
                      <path d="M15 75 L45 75 M15 95 L45 95" stroke="#9CA3AF" strokeWidth="1" />
                      {/* Black DC barrel jack socket */}
                      <rect x="15" y="210" width="32" height="42" rx="3" fill="#111827" />

                      {/* ATMEGA328P Chip */}
                      <rect x="80" y="125" width="28" height="95" rx="3" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
                      {/* Pin indents on ATMEGA */}
                      <rect x="76" y="130" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="130" width="4" height="4" fill="#9CA3AF" />
                      <rect x="76" y="140" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="140" width="4" height="4" fill="#9CA3AF" />
                      <rect x="76" y="150" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="150" width="4" height="4" fill="#9CA3AF" />
                      <rect x="76" y="160" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="160" width="4" height="4" fill="#9CA3AF" />
                      <rect x="76" y="170" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="170" width="4" height="4" fill="#9CA3AF" />
                      <rect x="76" y="180" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="180" width="4" height="4" fill="#9CA3AF" />
                      <rect x="76" y="190" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="190" width="4" height="4" fill="#9CA3AF" />
                      <rect x="76" y="200" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="200" width="4" height="4" fill="#9CA3AF" />
                      <rect x="76" y="210" width="4" height="4" fill="#9CA3AF" /><rect x="108" y="210" width="4" height="4" fill="#9CA3AF" />
                      
                      <text x="94" y="175" fill="#4B5563" fontSize="8" fontWeight="bold" transform="rotate(90, 94, 175)">ATMEGA328P</text>

                      {/* Left & Right Female Pin Headers */}
                      <rect x="160" y="55" width="12" height="110" rx="2" fill="#111827" />
                      <rect x="160" y="175" width="12" height="110" rx="2" fill="#111827" />

                      {/* Tiny headers socket points */}
                      <circle cx="166" cy="65" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="75" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="85" r="1.5" fill="#E2E8F0" />
                      <circle cx="166" cy="95" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="105" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="115" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="125" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="135" r="1.5" fill="#9CA3AF" />
                      
                      <circle cx="166" cy="185" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="195" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="205" r="1.5" fill="#F87171" />
                      <circle cx="166" cy="215" r="1.5" fill="#E2E8F0" />
                      <circle cx="166" cy="225" r="1.5" fill="#9CA3AF" />
                      <circle cx="166" cy="235" r="1.5" fill="#9CA3AF" />

                      {/* Text silk screens */}
                      <text x="145" y="88" fill="#F3F4F6" fontSize="6.5" fontWeight="bold" fontFamily="monospace">D13</text>
                      <text x="145" y="218" fill="#F3F4F6" fontSize="6.5" fontWeight="bold" fontFamily="monospace">GND</text>
                      <text x="148" y="208" fill="#F87171" fontSize="6.5" fontWeight="bold" fontFamily="monospace">5V</text>
                      <text x="100" y="70" fill="#3B82F6" opacity="0.6" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ARDUINO</text>
                      <text x="101" y="80" fill="#F3F4F6" opacity="0.8" fontSize="6" fontWeight="bold" fontFamily="monospace">UNO R3</text>

                      {/* Builtin Arduino Power LED (Green, Lit) */}
                      <circle cx="145" cy="155" r="2.5" fill="#10B981" />
                      <circle cx="145" cy="155" r="6" fill="#10B981" opacity="0.3" />
                    </g>

                    {/* 2. BREADBOARD ASSEMBLY */}
                    <g id="breadboard">
                      {/* White plastic casing */}
                      <rect x="215" y="35" width="285" height="270" rx="14" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
                      
                      {/* Breadboard center notch separator */}
                      <rect x="350" y="45" width="14" height="250" fill="#E2E8F0" rx="2" />
                      
                      {/* Rail labels (+ and -) */}
                      <line x1="232" y1="45" x2="232" y2="295" stroke="#EF4444" strokeWidth="1.5" />
                      <line x1="245" y1="45" x2="245" y2="295" stroke="#3B82F6" strokeWidth="1.5" />
                      <text x="229" y="44" fill="#EF4444" fontSize="8" fontWeight="black" fontFamily="sans-serif">+</text>
                      <text x="242" y="44" fill="#3B82F6" fontSize="8" fontWeight="black" fontFamily="sans-serif">-</text>

                      {/* Right Rail Column lines */}
                      <line x1="472" y1="45" x2="472" y2="295" stroke="#EF4444" strokeWidth="1.5" />
                      <line x1="485" y1="45" x2="485" y2="295" stroke="#3B82F6" strokeWidth="1.5" />
                      <text x="469" y="44" fill="#EF4444" fontSize="8" fontWeight="black" fontFamily="sans-serif">+</text>
                      <text x="482" y="44" fill="#3B82F6" fontSize="8" fontWeight="black" fontFamily="sans-serif">-</text>

                      {/* Ground rail points left side */}
                      {Array.from({ length: 15 }).map((_, i) => {
                        const yVal = 55 + i * 17;
                        return (
                          <g key={`rail-${i}`}>
                            <circle cx="232" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="245" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="472" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="485" cy={yVal} r="1.5" fill="#475569" />
                          </g>
                        );
                      })}

                      {/* Five-pin terminal stripes matrix. Left Board Columns & Right Board Columns */}
                      {Array.from({ length: 14 }).map((_, rIdx) => {
                        const yVal = 55 + rIdx * 18;
                        return (
                          <g key={`row-holes-${rIdx}`}>
                            <circle cx="270" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="285" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="300" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="315" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="330" cy={yVal} r="1.5" fill="#475569" />

                            <circle cx="375" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="390" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="405" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="420" cy={yVal} r="1.5" fill="#475569" />
                            <circle cx="435" cy={yVal} r="1.5" fill="#475569" />

                            <text x="257" y={yVal + 2} fill="#94A3B8" fontSize="6" fontFamily="monospace">{rIdx + 1}</text>
                          </g>
                        );
                      })}

                      <text x="268" y="303" fill="#94A3B8" fontSize="6.5" fontWeight="bold" fontFamily="monospace">A B C D E</text>
                      <text x="373" y="303" fill="#94A3B8" fontSize="6.5" fontWeight="bold" fontFamily="monospace">F G H I J</text>
                    </g>

                    {/* 3. BLUETOOTH HC-05 TRANSCEIVER BOARD (Bottom-Middle-Right) */}
                    <g id="bluetooth-transceiver">
                      <rect x="230" y="220" width="115" height="60" rx="6" fill="#1E1B4B" stroke="#4338CA" strokeWidth="2" />
                      <rect x="235" y="225" width="22" height="50" fill="#090514" rx="2" />
                      <path d="M239 230 L251 230 L239 240 L251 240 L239 250 L251 250 L239 260 L248 260" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      
                      <text x="265" y="235" fill="#9CA3AF" fontSize="5" fontFamily="monospace" fontWeight="bold">STATE</text>
                      <text x="265" y="243" fill="#A5F3FC" fontSize="5" fontFamily="monospace" fontWeight="bold">RXD</text>
                      <text x="265" y="251" fill="#FDE047" fontSize="5" fontFamily="monospace" fontWeight="bold">TXD</text>
                      <text x="265" y="259" fill="#F43F5E" fontSize="5" fontFamily="monospace" fontWeight="bold">GND</text>
                      <text x="265" y="267" fill="#F43F5E" fontSize="5" fontFamily="monospace" fontWeight="bold">VCC</text>
                      <text x="265" y="275" fill="#9CA3AF" fontSize="5" fontFamily="monospace" fontWeight="bold">EN</text>

                      <text x="295" y="250" fill="#E2E8F0" fontSize="7" fontWeight="bold" fontFamily="monospace">HC-05</text>
                      <text x="295" y="258" fill="#6B7280" fontSize="5" fontFamily="monospace">BT 2.0</text>

                      <circle cx="330" cy="235" r="2.5" fill={isConnected ? "#06B6D4" : "#EF4444"} className="animate-pulse" />
                      <circle cx="330" cy="235" r="6" fill={isConnected ? "#06B6D4" : "#EF4444"} opacity="0.45" className="animate-ping" style={{ animationDuration: '2s' }} />
                    </g>

                    {/* 4. PASSIVE COMPONENTS ON BREADBOARD (RED LED & 220 Ohm Resistor) */}
                    <g id="breadboard-components">
                      <path d="M315 163 L312 144" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M300 163 L293 150 L300 144" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                      <path d="M245 163 L315 163" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" />
                      
                      <rect x="262" y="159" width="22" height="8" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
                      <rect x="266" y="159" width="2" height="8" fill="#EF4444" />
                      <rect x="271" y="159" width="2" height="8" fill="#EF4444" />
                      <rect x="276" y="159" width="1.5" height="8" fill="#78350F" />
                      <rect x="281" y="159" width="1.5" height="8" fill="#EAB308" />

                      <g 
                        onClick={handleTogglePower}
                        className="cursor-pointer hover:scale-105 transition-transform origin-bottom"
                        id="red-led-bulb"
                        title="Click directly to Toggle Red LED (Pin 13)"
                      >
                        <ellipse cx="306" cy="146" rx="9" ry="3.5" fill="#000000" opacity="0.15" />
                        
                        {/* Glow Aura Overlay (Reacts dynamically to real brightness state!) */}
                        {isLedLit && (
                          <circle 
                            cx="306" 
                            cy="138" 
                            r={15 + (brightness / 255) * 55} 
                            fill="url(#red-glow-grad)" 
                            pointerEvents="none"
                            className="transition-all duration-300"
                          />
                        )}

                        <ellipse cx="306" cy="144" rx="6.5" ry="2" fill="#BE123C" />
                        <path d="M299.5 143 C299.5 125, 312.5 125, 312.5 143 Z" fill={isLedLit ? "url(#red-led-grad)" : "#881337"} stroke="#4C0519" strokeWidth="1" />
                        <path d="M302.5 132 A 6 6 0 0 1 308.5 130" stroke="#FFE4E6" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />
                      </g>
                    </g>

                    {/* 5. DYNAMIC CHECKLIST JUMPER WIRES */}
                    <g id="simulation-wires" pointerEvents="none">
                      {checklist.wireAnode && (
                        <g id="wire-anode">
                          <path d="M 166 85 C 190 20, 240 40, 300 91" fill="none" stroke="#000000" strokeWidth="4.5" opacity="0.15" />
                          <path d="M 166 85 C 190 20, 240 40, 300 91" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="166" cy="85" r="3.5" fill="#EF4444" />
                          <circle cx="300" cy="91" r="3" fill="#EF4444" />
                          <path d="M 300 91 L 300 109" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                          <circle cx="300" cy="109" r="2.5" fill="#2563EB" opacity="0.8" />
                        </g>
                      )}

                      {checklist.wireGround && (
                        <g id="wire-ground">
                          <path d="M 166 215 C 200 230, 230 220, 245 200" fill="none" stroke="#000000" strokeWidth="4" opacity="0.15" />
                          <path d="M 166 215 C 200 230, 230 220, 245 200" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="166" cy="215" r="3.5" fill="#334155" />
                          <circle cx="245" cy="200" r="3" fill="#334155" />
                        </g>
                      )}

                      {checklist.bluetoothPower && (
                        <g id="wire-bt-power">
                          <path d="M 166 205 C 195 240, 220 290, 265 267" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                          <circle cx="166" cy="205" r="3.5" fill="#DC2626" />
                          <circle cx="265" cy="267" r="2.5" fill="#DC2626" />

                          <path d="M 166 225 C 200 260, 215 300, 265 259" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                          <circle cx="166" cy="225" r="3.5" fill="#1E293B" />
                          <circle cx="265" cy="259" r="2.5" fill="#1E293B" />
                        </g>
                      )}

                      {checklist.bluetoothSerial && (
                        <g id="wire-bt-serial">
                          <path d="M 166 125 C 175 140, 210 240, 265 251" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                          <path d="M 166 115 C 185 130, 215 230, 265 243" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                        </g>
                      )}
                    </g>
                  </svg>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

