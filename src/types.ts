export interface ComponentItem {
  id: string;
  name: string;
  nickname: string;
  type: "brain" | "sensor" | "actuator" | "communication";
  emoji: string;
  role: string;
  description: string;
  funFact: string;
}

export interface ProjectItem {
  id: "led_control" | "servo_phone" | "weather_dht11";
  title: string;
  shortDesc: string;
  difficulty: "Easy" | "Medium" | "Hard";
  accentColor: string;
  learningGoal: string;
  image: string;
}
