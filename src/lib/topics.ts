import { TOPIC_CYCLE } from "./constants";

// ---------------------------------------------------------------------------
// 30 fixed topics. One per day. After the cycle, topics REPEAT. Repetition is
// the point — not novelty.
// ---------------------------------------------------------------------------

export interface Topic {
  id: number;
  title: string;
  prompts: string[];
}

export const TOPICS: Topic[] = [
  { id: 1, title: "Morning Routine", prompts: ["What do you do every morning?", "What time do you wake up?", "What do you eat for breakfast?"] },
  { id: 2, title: "Work", prompts: ["What is your job?", "What do you do at work?", "Do you like your job? Why?"] },
  { id: 3, title: "Food", prompts: ["What food do you like?", "What did you eat yesterday?", "Can you cook?"] },
  { id: 4, title: "Weekend", prompts: ["What do you do on weekends?", "What did you do last weekend?", "What is your perfect weekend?"] },
  { id: 5, title: "Hobbies", prompts: ["What are your hobbies?", "How often do you do them?", "Why do you like them?"] },
  { id: 6, title: "Travel", prompts: ["Where have you traveled?", "Where do you want to go?", "How do you like to travel?"] },
  { id: 7, title: "Friends", prompts: ["Tell me about your best friend.", "What do you do together?", "How did you meet?"] },
  { id: 8, title: "Family", prompts: ["Tell me about your family.", "Who do you live with?", "What do you do together?"] },
  { id: 9, title: "Technology", prompts: ["What apps do you use daily?", "What phone do you have?", "How does tech help you?"] },
  { id: 10, title: "Goals", prompts: ["What is your goal this year?", "Why is it important?", "How will you achieve it?"] },
  { id: 11, title: "Daily Commute", prompts: ["How do you get to work?", "How long does it take?", "Do you like your commute?"] },
  { id: 12, title: "Exercise", prompts: ["Do you exercise?", "What sport do you like?", "How often do you do it?"] },
  { id: 13, title: "Shopping", prompts: ["Where do you shop?", "What do you buy often?", "Online or in store?"] },
  { id: 14, title: "Movies & TV", prompts: ["What do you watch?", "What is your favorite movie?", "When do you watch it?"] },
  { id: 15, title: "Music", prompts: ["What music do you like?", "When do you listen?", "Do you play an instrument?"] },
  { id: 16, title: "Weather", prompts: ["How is the weather today?", "What is your favorite season?", "What do you do in the rain?"] },
  { id: 17, title: "Home", prompts: ["Describe your home.", "What is your favorite room?", "What would you change?"] },
  { id: 18, title: "City", prompts: ["Where do you live?", "What is good about your city?", "What is bad about it?"] },
  { id: 19, title: "Learning English", prompts: ["Why do you learn English?", "How do you practice?", "What is hard for you?"] },
  { id: 20, title: "Health", prompts: ["How do you stay healthy?", "How much do you sleep?", "What do you do to relax?"] },
  { id: 21, title: "Money", prompts: ["How do you save money?", "What do you spend on?", "Do you budget?"] },
  { id: 22, title: "Future Plans", prompts: ["What are your plans next year?", "Where do you see yourself?", "What do you want to learn?"] },
  { id: 23, title: "Childhood", prompts: ["What did you do as a child?", "What was your favorite game?", "Where did you grow up?"] },
  { id: 24, title: "Holidays", prompts: ["What holidays do you celebrate?", "How do you celebrate?", "What is your favorite?"] },
  { id: 25, title: "Restaurants", prompts: ["What restaurant do you like?", "What do you order?", "Who do you go with?"] },
  { id: 26, title: "Phone Habits", prompts: ["How much do you use your phone?", "What do you do on it?", "Could you live without it?"] },
  { id: 27, title: "Coffee & Drinks", prompts: ["What do you drink in the morning?", "Coffee or tea?", "Where do you get it?"] },
  { id: 28, title: "Pets & Animals", prompts: ["Do you have a pet?", "What animals do you like?", "Would you get a pet?"] },
  { id: 29, title: "Books & News", prompts: ["Do you read?", "How do you get news?", "What did you read recently?"] },
  { id: 30, title: "Dreams", prompts: ["What is your dream?", "If you had a free day, what would you do?", "What would you change about your life?"] },
];

/** The topic assigned to a given program day. Loops every TOPIC_CYCLE days. */
export function topicForDay(day: number): Topic {
  const index = ((day - 1) % TOPIC_CYCLE + TOPIC_CYCLE) % TOPIC_CYCLE;
  return TOPICS[index];
}

/** How many times this topic has been seen by `day` (1 = first time). */
export function topicRepetition(day: number): number {
  return Math.floor((day - 1) / TOPIC_CYCLE) + 1;
}
