import { ComponentItem, ProjectItem } from "./types";
import heroImg from "./assets/images/riti_logo_1782625802300.jpg";
import ledCircuitImg from "./assets/images/led_circuit_img_1780297149716.png";
import servoCircuitImg from "./assets/images/servo_circuit_img_1780297171543.png";
import weatherCircuitImg from "./assets/images/weather_sensor_img_1780297188823.png";

export const IMAGES = {
  hero: heroImg,
  ledCircuit: ledCircuitImg,
  servoCircuit: servoCircuitImg,
  weatherCircuit: weatherCircuitImg,
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "led_control",
    title: "Magic Phone Light",
    shortDesc: "Wire up a wireless Bluetooth switch that lets you blink and fade a physical red LED light directly using a virtual smartphone screen!",
    difficulty: "Easy",
    accentColor: "bg-[#FACC15]",
    learningGoal: "Understand how Bluetooth commands travel from a phone interface to control electronic lights wirelessly.",
    image: IMAGES.ledCircuit
  },
  {
    id: "servo_phone",
    title: "Robot Arm Waving",
    shortDesc: "Create an automatic food dispenser hatch key to feed Barnaby the hungry puppy! Move a slider inside your phone app to swing the motor gear.",
    difficulty: "Medium",
    accentColor: "bg-[#FB923C]",
    learningGoal: "Learn how servo motors receive angles of instructions and convert raw numbers into physical motion.",
    image: IMAGES.servoCircuit
  },
  {
    id: "weather_dht11",
    title: "My Weather Station",
    shortDesc: "Gather temperature and humidity readings from the atmosphere and display real-time climate telemetry charts on your custom dashboard.",
    difficulty: "Hard",
    accentColor: "bg-[#4ADE80]",
    learningGoal: "Discover how physical heat and humidity sensors stream live numerical bytes over high-precision serial pipes.",
    image: IMAGES.weatherCircuit
  }
];

export const COMPONENTS_DATA: ComponentItem[] = [
  {
    id: "arduino_uno",
    name: "Arduino UNO Board",
    nickname: "The Smart Controller Brain",
    type: "brain",
    emoji: "📟",
    role: "Listens to instructions, calculates programming code, and commands outputs.",
    description: "The main computer microcontroller board that processes all incoming electricity signals and transmits commands to mechanical hardware.",
    funFact: "The word Arduino was born at an Italian bar where local engineers met! It means 'valiant collaborator'."
  },
  {
    id: "hc05_bt",
    name: "HC-05 Bluetooth Module",
    nickname: "Wireless Messenger",
    type: "communication",
    emoji: "📻",
    role: "Transmits wireless data packets between mobile phones and computers.",
    description: "A wireless serial transceiver component that receives incoming communication waves and converts them into text commands for the board.",
    funFact: "Bluetooth technology was named after Harald Bluetooth, a 10th-century Scandinavian Viking King who unified Denmark!"
  },
  {
    id: "red_led",
    name: "Light Emitting Diode (LED)",
    nickname: "Glowing Actuator Pixel",
    type: "actuator",
    emoji: "💡",
    role: "Turns electric voltage inputs directly into brilliant glowing colored light.",
    description: "A semiconductor illumination component that glows immediately with color when electricity flows through its metallic anode and cathode pins.",
    funFact: "LEDs do not have fragile wire filaments inside like old lightbulbs, making them virtually indestructible unless you overheat them!"
  },
  {
    id: "servo_sg90",
    name: "SG90 Servo Motor",
    nickname: "The Precise Robotic Muscle",
    type: "actuator",
    emoji: "⚙️",
    role: "Spins its mechanical shaft precisely to any angle requested by the program.",
    description: "A motorized gear actuator containing custom position-feedback encoders, letting you control alignment perfectly between 0 and 180 degrees.",
    funFact: "Despite weighing about as much as a single cherry, this tiny motor can pull objects up to thirty times its own weight!"
  },
  {
    id: "sensor_dht11",
    name: "DHT11 Climate Sensor",
    nickname: "Weather Detective Team",
    type: "sensor",
    emoji: "🌡️",
    role: "Measures humidity moisture and heat temperature levels in the room.",
    description: "A high-precision analog sensor equipped with temperature resistors and humidity-sensitive capacitors to assess ambient weather data.",
    funFact: "It uses a special resistive element to gauge moisture in the air. High humidity makes the water droplets close electric gaps!"
  }
];
