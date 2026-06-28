import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Cpu, 
  Thermometer, 
  CloudRain, 
  Shield, 
  Activity, 
  Terminal, 
  Settings, 
  Compass, 
  Zap, 
  Lock, 
  Unlock, 
  ArrowLeft, 
  Radio, 
  Smartphone, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  RefreshCw, 
  Send, 
  Wifi,
  Droplets
} from "lucide-react";

export default function ProjectWeather() {
  const [temperature, setTemperature] = useState<number>(24);
  const [humidity, setHumidity] = useState<number>(55);
  const [checklist, setChecklist] = useState({
    wireVcc: false,
    wireGnd: false,
    wireData: false,
  });
  const [serialLogs, setSerialLogs] = useState<string[]>([
    "STREAM: Sensor active. Syncing serial telemetry packets...",
    "SYS: Bluetooth module HC-05 online at 9600 bps.",
  ]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [activeApp, setActiveApp] = useState<string>("home");

  // Immersive Phone States (matching Project 1 & 2)
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(95);
  const [phoneWallpaper, setPhoneWallpaper] = useState<string>("cosmic"); // cosmic, sunset, circuit
  const [customTerminalInput, setCustomTerminalInput] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [phoneFlashlight, setPhoneFlashlight] = useState<boolean>(false);
  const [notifications] = useState<string[]>([
    "Professor Otto: 'Capacitive sensors are sensitive to body heat! Avoid touching the blue casing.'",
    "Weather Alert: Rapid ambient pressure drop detected - watch for relative humidity spikes!"
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

  const addLog = (msg: string) => {
    setSerialLogs((prev) => [msg, ...prev.slice(0, 7)]);
  };

  const handleConnectBt = () => {
    if (isConnected) {
      setIsConnected(false);
      addLog("UNPAIR: Ble connection severed. Pin 2 telemetry stream paused.");
    } else {
      setIsConnected(true);
      addLog("SUCCESS: Connected to HC-05! Weather station telemetry stream online.");
    }
  };

  const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setTemperature(val);
    addLog(`DHT11: Temperature updated dynamically to ${val}°C.`);
  };

  const handleHumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setHumidity(val);
    addLog(`DHT11: Moisture read change. Humidity register locked at ${val}%.`);
  };

  const executeTerminalCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;
    addLog(`TERM_IN: Command typed > "${cmd}"`);

    if (!isConnected) {
      addLog("ERROR: Commands discarded because Bluetooth HC-05 is not paired.");
      setCustomTerminalInput("");
      return;
    }

    if (cmd === "temp" || cmd === "temperature") {
      addLog(`DHT11: Current read temperature is ${temperature}°C (${Math.round(temperature * 1.8 + 32)}°F)`);
    } else if (cmd === "humidity" || cmd === "moisture" || cmd === "rh") {
      addLog(`DHT11: Current relative humidity is ${humidity}% RH`);
    } else if (cmd === "vibe" || cmd === "weather") {
      addLog(`SYSTEM: Weather state environment is "${getWeatherVibe().text}"`);
    } else if (cmd === "reboot" || cmd === "reset") {
      addLog("SYSTEM: Rebooting DHT11 MCU register block...");
      setTimeout(() => {
        addLog("SUCCESS: DHT11 Sensor recalibrated at digital PORT Pin 2.");
      }, 800);
    } else if (cmd === "unpair") {
      setIsConnected(false);
      addLog("INFO: HC-05 Wireless connection severed safely.");
    } else if (cmd === "pair") {
      setIsConnected(true);
      addLog("SUCCESS: Connection restored.");
    } else {
      addLog(`ERR: Unrecognized command "${cmd}". Try "temp", "humidity", "vibe", "reboot".`);
    }
    setCustomTerminalInput("");
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
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

  // Weather descriptions helper
  const getWeatherVibe = () => {
    if (humidity > 78) return { text: "Heavy Rain atmosphere 🌧️", color: "text-blue-500", bg: "bg-blue-50" };
    if (temperature < 14) return { text: "Freezing Cold Vibe 🥶", color: "text-[#38BDF8]", bg: "bg-sky-50" };
    if (temperature > 32) return { text: "Hot Sweltering Desert Vibe 🥵", color: "text-amber-600", bg: "bg-amber-50" };
    return { text: "Balmy and Perfect Day! ☀️", color: "text-emerald-500", bg: "bg-emerald-50" };
  };

  const vibe = getWeatherVibe();

  return (
    <div className="space-y-8" id="project-weather-root">
      
      {/* Visual Header Banner */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border-2 border-slate-200 flex flex-col md:flex-row gap-6 items-center border-b-8 border-[#4ADE80]">
        <div className="w-full md:w-1/3">
          <img 
            src="/src/assets/images/weather_sensor_img_1780297188823.png" 
            alt="Climate Sensor Diagram"
            className="w-full h-auto rounded-3xl object-cover shadow-inner border border-slate-100"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="w-full md:w-2/3 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#065F46] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" /> Environmental IoT Mission
          </div>
          <h2 className="text-2xl font-black text-[#0C4A6E] tracking-tight">
            Build Your First Smart Weather Station! 🌤️🌡️
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Wire up the digital DHT11 Climate Sensor to measure temperature and humidity levels in the air, and stream them instantly into our smart interactive weather panel!
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-2">
            <span className="flex items-center gap-1 bg-[#E0F2FE] text-[#0369A1] px-3 py-1.5 rounded-xl border border-[#bae6fd] font-bold">
              <Cpu className="w-3.5 h-3.5 text-slate-400" /> Controller: Arduino Uno
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100 font-bold">
              <Thermometer className="w-3.5 h-3.5 text-emerald-500" /> Climate Probe: DHT11 Sensor
            </span>
          </div>
        </div>
      </div>

      {/* Main Simulation Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
        
        {/* VIRTUAL MOBILE APP CONTROLLER */}
        <div className="lg:col-span-5 flex justify-start order-1 w-full">
          <div className="relative w-full max-w-[340px] bg-slate-950 p-3.5 rounded-[3.2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-[6px] border-slate-800 mx-auto lg:mx-0">
            
            {/* Left Side Buttons (Volume keys) */}
            <button 
              onClick={() => addLog("PHONE: Volume Up key pressed. Sound indicator beep.")}
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
                      Otto: "DHT11 Pin 2 online."
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
                            <span>📊 Climate telemetry widget</span>
                            <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400" : "bg-rose-500 animate-pulse"}`}></span>
                          </div>
                          <div className="flex justify-between items-center font-sans">
                            <div>
                              <span className="text-[11px] font-extrabold text-slate-300 block text-left">
                                Climate Index
                              </span>
                              <span className="text-[9.5px] text-left block text-slate-400">
                                {temperature}°C Temp | {humidity}% RH
                              </span>
                            </div>
                            <span className="text-xl animate-bounce">
                              {humidity > 78 ? "🌧️" : "☀️"}
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

                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pl-1 font-mono">
                          Barnaby App Center
                        </p>

                        {/* Modern Grid Launcher of Apps */}
                        <div className="grid grid-cols-3 gap-2">
                          
                          {/* App 1: Controller */}
                          <button 
                            onClick={() => { setActiveApp("controller"); addLog("PHONEOS: Launching 'Climate Hub Configurer'."); }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-orange-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#0284C7] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform font-bold">
                              ⛅
                            </div>
                            <span className="text-[8px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Climate Remote
                            </span>
                          </button>

                          {/* App 2: Telemetry */}
                          <button 
                            onClick={() => { setActiveApp("telemetry"); addLog("PHONEOS: Launching 'Pulse Waveform Scope' telemetry."); }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-emerald-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#047857] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform font-bold">
                              📈
                            </div>
                            <span className="text-[8px] font-bold text-slate-200 tracking-tight leading-tight block truncate w-full">
                              Scope Trace
                            </span>
                          </button>

                          {/* App 3: Terminal */}
                          <button 
                            onClick={() => { setActiveApp("terminal"); addLog("PHONEOS: Launching 'Bluetooth Terminal Console'. Input prompt open."); }}
                            className="bg-slate-950/50 hover:bg-slate-950/85 p-2 rounded-xl border border-white/5 hover:border-yellow-400/40 transition-all flex flex-col items-center gap-1 w-full text-center group cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FACC15] to-[#CA8A04] flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform font-bold">
                              📟
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
                          <div className="bg-slate-950/20 opacity-55 p-2 rounded-xl border border-white/5 flex flex-col items-center gap-1 w-full text-center select-none font-sans">
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
                          className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 hover:bg-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] active:scale-95 cursor-pointer font-bold" 
                          title="Climate Remote"
                        >
                          ⛅
                        </button>
                        <button 
                          onClick={() => { setActiveApp("telemetry"); }}
                          className="w-8 h-8 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/45 flex items-center justify-center text-emerald-400 active:scale-95 cursor-pointer font-bold" 
                          title="Pulse Scope"
                        >
                          📈
                        </button>
                        <button 
                          onClick={() => { setActiveApp("terminal"); }}
                          className="w-8 h-8 rounded-lg bg-[#FACC15]/10 hover:bg-[#FACC15]/45 flex items-center justify-center text-[#FACC15] active:scale-95 cursor-pointer font-bold" 
                          title="Serial Terminal"
                        >
                          📟
                        </button>
                      </div>

                    </div>
                  ) : activeApp === "controller" ? (
                    /* APPLICATION APP VIEW: Climate Controller sliders */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-sky-450 cursor-pointer"
                            title="Back to Home"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#38BDF8] block font-black uppercase tracking-wider font-mono">CLIMATE SYSTEM</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans text-sky-200">OttoWeather Remote v1.2</h4>
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
                                  : "bg-gradient-to-r from-sky-400 to-[#1D4ED8] text-white hover:opacity-90 font-extrabold shadow-md shadow-sky-950/10"
                              }`}
                            >
                              {isConnected ? "🔌 Cut Bluetooth" : "📡 Scan & Pair HC-05"}
                            </button>
                          </div>

                          {/* Climate Control Sliders inside the Phone! */}
                          <div className="min-h-[145px] flex flex-col justify-center">
                            {!isConnected ? (
                              <div className="text-center p-3.5 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400">
                                <span className="text-base">📡</span>
                                <p className="text-[8.5px] font-bold leading-normal uppercase text-slate-500">
                                  Handshake severed
                                </p>
                                <p className="text-[8.5px] text-slate-500 max-w-[170px] leading-tight font-sans">
                                  Check jumper wiring first, then pair with transceiver.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3 animate-fade-in">
                                
                                {/* Temperature control */}
                                <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5 space-y-1 font-sans">
                                  <div className="flex justify-between text-[8px] font-black tracking-tight text-slate-400">
                                    <span className="uppercase text-[7.5px] flex items-center gap-1">
                                      <Thermometer className="w-3 h-3 text-rose-455 text-rose-400" /> TEMP COEFFICIENT
                                    </span>
                                    <span className="font-mono text-emerald-455 text-emerald-400">{temperature}°C</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="-10" 
                                    max="50" 
                                    value={temperature} 
                                    onChange={handleTempChange}
                                    className="w-full accent-[#4ADE80] h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                {/* Humidity control */}
                                <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5 space-y-1 font-sans">
                                  <div className="flex justify-between text-[8px] font-black tracking-tight text-slate-400">
                                    <span className="uppercase text-[7.5px] flex items-center gap-1">
                                      <CloudRain className="w-3 h-3 text-blue-455 text-blue-400" /> HUMIDITY REGISTER
                                    </span>
                                    <span className="font-mono text-emerald-455 text-emerald-400">{humidity}% RH</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={humidity} 
                                    onChange={handleHumChange}
                                    className="w-full accent-[#4ADE80] h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                  />
                                </div>

                                <div className="text-[8px] text-slate-500 font-mono text-center">
                                  *Flashes serial payload live via bluetooth
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
                    /* APPLICATION 2 VIEW: Telemetry Trace of DHT11 data payload */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
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
                            <span className="text-[9px] text-emerald-400 block font-black uppercase tracking-wider font-mono">PULSE MODULATION</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans font-mono">DHT11 40-Bit Signal Scope</h4>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-slate-950 text-slate-400 p-2 rounded-xl text-[8px] border border-white/5 leading-snug">
                            DHT11 transmits data over <span className="text-emerald-400 font-bold">1-wire serial protocol</span>. Current live waveform timings:
                            <ul className="list-disc pl-3 mt-1.5 font-mono space-y-0.5 text-[7.5px]">
                              <li>Start pulse: 18ms low, 40µs pullup</li>
                              <li>Bit "0": 54µs low, 26µs high</li>
                              <li>Bit "1": 54µs low, 70µs high</li>
                            </ul>
                          </div>

                          {/* Interactive Pulse Width wave simulation */}
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-white/5 font-mono shadow-inner">
                            <span className="text-[7px] block uppercase font-bold text-slate-500 pb-1.5 font-sans">LIVE PIN-2 SIGNAL TRACE:</span>
                            <div className="h-16 bg-slate-900 rounded-lg relative overflow-hidden border border-slate-800 flex items-center justify-center p-1">
                              <svg viewBox="0 0 240 80" className="w-full h-full">
                                {/* Trace grid */}
                                <line x1="0" y1="40" x2="240" y2="40" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />
                                <line x1="60" y1="0" x2="60" y2="80" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />
                                <line x1="120" y1="0" x2="120" y2="80" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />
                                <line x1="180" y1="0" x2="180" y2="80" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2 2" />

                                {/* Signal line wave (dynamic high-width depends on moisture!) */}
                                {allWiringOk && isConnected ? (
                                  <path 
                                    d={`M 10 60 L 30 60 L 30 20 L ${30 + 10 + (humidity/100)*25} 20 L ${30 + 10 + (humidity/100)*25} 60 L 100 60 L 100 20 L ${100 + 10 + (temperature/50)*25} 20 L ${100 + 10 + (temperature/50)*25} 60 L 170 60 L 170 20 L ${170 + 10 + (humidity/100)*25} 20 L ${170 + 10 + (humidity/100)*25} 60 L 240 60`} 
                                    fill="none" 
                                    stroke="#10b981" 
                                    strokeWidth="2.5" 
                                    className="transition-all duration-300" 
                                  />
                                ) : (
                                  /* Zero flatline because wiring is disconnected */
                                  <line x1="0" y1="60" x2="240" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                                )}
                              </svg>

                              {/* Overlay data */}
                              <div className="absolute bottom-1 right-2 bg-slate-950/80 p-0.5 rounded border border-white/5 text-[7px] font-mono text-emerald-400">
                                {allWiringOk && isConnected ? `PULSE LENGTH: ${50 + Math.round((temperature/50)*20)}µs` : "PIN-2 DISCONNECTED"}
                              </div>
                            </div>

                            <div className="flex justify-between text-[6.5px] text-slate-500 pt-1 font-sans">
                              <span>Sensor Port: Arduino Digital PIN 2</span>
                              <span>CRC: {allWiringOk && isConnected ? "0x00 OK" : "ERR"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-[7px] text-slate-500 italic mt-1 font-mono text-center">
                        *Oscillator simulation auto-scaled by Arduino hardware timers.
                      </p>
                    </div>
                  ) : activeApp === "terminal" ? (
                    /* APPLICATION 3 VIEW: Serial Terminal Logs & Commands */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-yellow-500 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-yellow-400 block font-black uppercase tracking-wider font-mono">LOGGER SHELL</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans">HC-05 Weather Serial 9600</h4>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                              Telemetry shell console:
                            </span>
                            <button 
                              onClick={() => {
                                setSerialLogs(["SYS: Terminal cleared. Climate register high."]);
                              }}
                              className="text-[7px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono active:scale-95 cursor-pointer"
                              title="Flush logs buffer"
                            >
                              Clear
                            </button>
                          </div>

                          <div className="bg-slate-950 font-mono text-[9px] p-2.5 rounded-xl border border-white/5 space-y-1.5 h-[120px] overflow-y-auto leading-relaxed text-slate-400 scroll-smooth">
                            {serialLogs.slice(0, 7).map((log, i) => (
                              <div key={i} className={`truncate ${log.startsWith("SUCCESS") ? "text-emerald-400 font-bold" : log.startsWith("ERROR") ? "text-[#FB7185] font-bold" : "text-slate-400"}`}>
                                {log}
                              </div>
                            ))}
                          </div>

                          {/* Terminal Input Row */}
                          <div className="flex gap-1.5 mt-1">
                            <input 
                              type="text"
                              value={customTerminalInput}
                              onChange={(e) => setCustomTerminalInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  executeTerminalCommand(customTerminalInput);
                                }
                              }}
                              placeholder="Type 'temp', 'humidity' or 'reboot'..."
                              className="flex-1 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2 py-1 text-[8.5px] font-mono focus:outline-none focus:border-yellow-500"
                            />
                            <button 
                              onClick={() => executeTerminalCommand(customTerminalInput)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold text-[8px] uppercase tracking-wider px-2 py-1 rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Send className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-[7.5px] text-slate-500 italic mt-1 font-mono text-center">
                        *Serial console operates with full read/write permission.
                      </p>
                    </div>
                  ) : activeApp === "settings" ? (
                    /* APPLICATION 4 VIEW: Operating System Settings */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-violet-400 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-violet-400 block font-black uppercase tracking-wider font-mono">SYSTEM UTILITIES</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans text-stone-200">Settings & Profiles</h4>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          {/* Wallpaper setting */}
                          <div className="bg-slate-950/90 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                            <span className="text-[8px] text-slate-400 uppercase font-bold block font-sans">
                              1. Smartphone Wallpaper
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {["cosmic", "sunset", "circuit"].map((wp) => (
                                <button 
                                  key={wp}
                                  onClick={() => {
                                    setPhoneWallpaper(wp);
                                    addLog(`PHONE_SYSTEM: Wallpaper profile changed to "${wp}" theme.`);
                                  }}
                                  className={`py-1 text-[8px] font-bold uppercase rounded border transition-all cursor-pointer ${
                                    phoneWallpaper === wp 
                                      ? "bg-violet-600 border-violet-400 text-white font-black" 
                                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                                  }`}
                                >
                                  {wp}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Hardware accessories setting */}
                          <div className="bg-slate-950/90 p-2.5 rounded-xl border border-white/5 space-y-2">
                            <span className="text-[8px] text-slate-400 uppercase font-bold block font-sans">
                              2. Accessory Rig Controls
                            </span>
                            
                            {/* Flashlight toggle */}
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[9px] font-bold text-slate-200 block">Camera Flashlight</span>
                                <span className="text-[7.5px] text-slate-500 block">Toggles rear panel LED flashlight</span>
                              </div>
                              <button 
                                onClick={() => {
                                  setPhoneFlashlight(prev => !prev);
                                  addLog(`PHONE_SYSTEM: Camera Flash torch toggled ${!phoneFlashlight ? "ON" : "OFF"}.`);
                                }}
                                className={`text-[8.5px] px-2 py-0.75 rounded font-black cursor-pointer ${phoneFlashlight ? "bg-amber-400 text-slate-950 animate-pulse" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}
                              >
                                {phoneFlashlight ? "ACTIVE" : "STANDBY"}
                              </button>
                            </div>

                            {/* Sound system */}
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[9px] font-bold text-slate-200 block">Audio Beep Indicator</span>
                                <span className="text-[7.5px] text-slate-500 block">Unmute tactile key beeps</span>
                              </div>
                              <button 
                                onClick={() => {
                                  setIsMuted(prev => !prev);
                                  addLog(`PHONE_SYSTEM: Master volume mute is ${!isMuted ? "ON" : "OFF"}.`);
                                }}
                                className={`text-[8.5px] px-2 py-0.75 rounded font-black cursor-pointer ${!isMuted ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}
                              >
                                {!isMuted ? "UNMUTED" : "MUTED"}
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>

                      <p className="text-[7.5px] text-[#A78BFA] italic mt-1 font-mono text-center">
                        *User setting profile values are held in sandbox context.
                      </p>
                    </div>
                  ) : (
                    /* APPLICATION 5 VIEW: Lab Guide Educational Docs app */
                    <div className="flex-1 flex flex-col justify-between animate-fade-in text-left">
                      <div>
                        {/* App sub header */}
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
                          <button 
                            onClick={() => setActiveApp("home")}
                            className="bg-slate-950/45 hover:bg-slate-950/80 p-1 rounded text-orange-400 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <div>
                            <span className="text-[9px] text-[#FF8C3A] block font-black uppercase tracking-wider font-mono">LAB MANUAL</span>
                            <h4 className="text-xs font-black text-white leading-tight font-sans">Professor Otto's Notes</h4>
                          </div>
                        </div>

                        {/* Interactive Manual */}
                        <div className="bg-slate-950/90 text-slate-300 p-2.5 rounded-xl text-[8px] border border-white/5 space-y-1.5 h-[165px] overflow-y-auto leading-normal thin-scroll">
                          <p className="text-yellow-405 text-yellow-400 font-bold block text-left font-sans">
                            🔬 1-Wire Communication:
                          </p>
                          <p>
                            Both the temperature and humidity integer bytes are compressed into 40-bit serial pulses. The Arduino parses the high/low pulse widths to extract digital climate registers.
                          </p>
                          <p className="text-yellow-405 text-yellow-400 font-bold block text-left pt-1 font-sans">
                            🔌 Capacitive Element:
                          </p>
                          <p>
                            Dry air does not store charge, but moist air does! By using a thin, moisture-sensitive capacitive polymer substrate, the sensor registers relative atmospheric fluctuations instantly!
                          </p>
                          <p className="text-[#FF8C3A] font-bold text-center block pt-1 uppercase font-sans">
                            Keep experimenting! 🚀
                          </p>
                        </div>
                      </div>

                      <p className="text-[7px] text-slate-500 italic mt-0.5 font-mono text-center">
                        *Otto's Lab Guide v4.1 - AI Studio System release.
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* Simulated Phone hardware action bar at bottom screen margin */}
              <div className="pt-1 select-none border-t border-white/5 bg-slate-900/60 pb-1">
                <div 
                  className="w-14 h-1 bg-slate-700 rounded-full mx-auto mb-1 hover:bg-slate-500 cursor-pointer" 
                  onClick={() => setActiveApp("home")} 
                  title="Swipe to Home Launcher"
                />
                <div className="flex justify-around items-center text-slate-500 text-[8px] font-black uppercase leading-none font-sans">
                  <button 
                    onClick={() => { setActiveApp("home"); }} 
                    className={`flex flex-col items-center gap-0.5 w-12 hover:text-white transition-colors cursor-pointer ${activeApp === "home" ? "text-sky-400" : "text-slate-500"}`}
                  >
                    <span className="text-[11px]">🏠</span>
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => { 
                      if (isConnected) {
                        setActiveApp("controller"); 
                      } else {
                        addLog("ERROR: Connect Bluetooth pairing first to launch Climate App.");
                      }
                    }} 
                    className={`flex flex-col items-center gap-0.5 w-12 hover:text-white transition-colors cursor-pointer ${activeApp === "controller" ? "text-sky-400" : "text-slate-500"}`}
                  >
                    <span className="text-[11px]">⛅</span>
                    <span>Climate</span>
                  </button>
                  <button 
                    onClick={() => { 
                      if (isConnected) {
                        setActiveApp("telemetry"); 
                      } else {
                        addLog("ERROR: Connect Bluetooth pairing first to launch Telemetry.");
                      }
                    }} 
                    className={`flex flex-col items-center gap-0.5 w-12 hover:text-white transition-colors cursor-pointer ${activeApp === "telemetry" ? "text-sky-400" : "text-slate-500"}`}
                  >
                    <span className="text-[11px]">📈</span>
                    <span>Scope</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* COZY SMART-HOME LIVE VIEW CARD */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-5 lg:p-7 shadow-2xl flex flex-col justify-between border-4 border-[#0C4A6E] min-h-[515px] relative overflow-hidden transition-all duration-300 hover:shadow-sky-100/50 order-2">
          
          {/* Subtle elegant interior lighting background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-amber-50/25 pointer-events-none" />

          <div className="relative w-full h-full flex flex-col justify-between space-y-4 z-10">
            
            {/* Header Stream indicators */}
            <div className="flex justify-between items-center bg-[#0C4A6E]/10 px-4 py-2.5 rounded-2xl border border-[#0C4A6E]/15">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-xs font-black text-[#0C4A6E] uppercase tracking-wider font-sans">
                  🏠 Living Room Camera: Active Feed
                </span>
              </div>
              <span className="text-[9px] font-mono font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full select-none">
                ONLINE ⬤
              </span>
            </div>

            {/* Smart Room Image & HUD Area */}
            <div className="relative w-full flex-1 min-h-[300px] rounded-[1.75rem] overflow-hidden border-2 border-slate-100 shadow-md">
              <img 
                src="/src/assets/images/cozy_smart_living_room_1781958509728.jpg" 
                alt="Cozy Smart Living Room" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              
              {/* Dynamic Overlay HUD showing live sensory values */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md rounded-2xl p-4 border border-white/10 select-none flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
                
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-orange-550 bg-opacity-20 text-orange-400`}>
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block">Sensory Temp:</span>
                    <strong className="text-base sm:text-lg font-mono font-black block leading-none mt-1">
                      {temperature}°C <span className="text-xs font-normal text-slate-400">/ {Math.round(temperature * 1.8 + 32)}°F</span>
                    </strong>
                  </div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-white/15" />

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Droplets className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 tracking-wider block">Indoor moisture:</span>
                    <strong className="text-base sm:text-lg font-mono font-black block leading-none mt-1 text-cyan-400">
                      {humidity}% <span className="text-xs font-normal text-slate-400 font-sans">RH</span>
                    </strong>
                  </div>
                </div>

              </div>

              {/* Status Tags indicating Climate State */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase text-white shadow-md flex items-center gap-1.5 backdrop-blur-md bg-[#0C4A6E]`}>
                  <span>🌤️</span> {vibe.text}
                </span>

                {temperature > 28 && (
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase text-white bg-red-600 shadow-md animate-pulse flex items-center gap-1.5 backdrop-blur-md font-sans">
                    🔥 Fireplace: Burning
                  </span>
                )}

                {temperature < 18 && (
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase text-white bg-sky-600 shadow-md animate-pulse flex items-center gap-1.5 backdrop-blur-md font-sans font-sans">
                    🌀 AC cooling: Blowing
                  </span>
                )}

                {temperature >= 18 && temperature <= 28 && (
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase text-slate-800 bg-white shadow-md flex items-center gap-1.5 backdrop-blur-md font-sans border border-slate-200">
                    🍀 Ventilation: Perfect
                  </span>
                )}
              </div>

            </div>

            {/* Explanatory footer */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-left">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1">
                🔬 Scientific Comfort feedback:
              </span>
              <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                This cozy lounge acts as our virtual lab chamber. When you use the phone app to alter climate registers, the simulated environment dynamically shifts its comfort indicators in real time!
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
