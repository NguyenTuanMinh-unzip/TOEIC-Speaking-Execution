// ---------------------------------------------------------------------------
// Model answers shown when the user is "stuck for ideas". These are simple,
// template-shaped sentences the user can read aloud and shadow — not grammar
// lessons. Output over theory.
// ---------------------------------------------------------------------------

import { topicForDay } from "./topics";

/** A model answer per topic id (1..30), ~5 template-style sentences. */
export const TOPIC_SAMPLES: Record<number, string[]> = {
  1: ["I usually wake up at seven.", "I often drink water first.", "Sometimes I check my phone.", "For example, today I had bread and coffee.", "I like my morning because it is quiet."],
  2: ["I usually work in an office.", "I often start by checking email.", "Sometimes I have meetings.", "For example, yesterday I joined a long call.", "I like my job because my team is friendly."],
  3: ["I usually eat rice and vegetables.", "I often cook at home.", "Sometimes I order food online.", "For example, last night I made noodles.", "I like home food because it is healthy."],
  4: ["I usually relax on weekends.", "I often meet my friends.", "Sometimes I stay home and rest.", "For example, last weekend I watched a movie.", "I like weekends because I have free time."],
  5: ["I usually read in my free time.", "I often listen to music.", "Sometimes I play games.", "For example, this week I started a new book.", "I like my hobbies because they help me relax."],
  6: ["I usually travel by bus or train.", "I often visit the beach.", "Sometimes I go to the mountains.", "For example, last year I went to Da Nang.", "I like traveling because I see new places."],
  7: ["I usually meet my best friend on weekends.", "I often call him in the evening.", "Sometimes we play sport together.", "For example, we met at school years ago.", "I like him because he is kind and funny."],
  8: ["I usually live with my family.", "I often have dinner with them.", "Sometimes we watch TV together.", "For example, on Sunday we cook together.", "I like my family because they support me."],
  9: ["I usually use my phone every day.", "I often use chat and maps.", "Sometimes I watch videos.", "For example, I use my phone to study English.", "I like technology because it saves time."],
  10: ["I usually set a goal for the year.", "I often write it down.", "Sometimes I review my progress.", "For example, my goal is to speak English well.", "I like having goals because they keep me focused."],
  11: ["I usually go to work by motorbike.", "I often leave at eight.", "Sometimes there is heavy traffic.", "For example, today it took thirty minutes.", "I like my commute because I listen to music."],
  12: ["I usually exercise three times a week.", "I often go running.", "Sometimes I do simple workouts at home.", "For example, this morning I walked for an hour.", "I like exercise because it gives me energy."],
  13: ["I usually shop at the supermarket.", "I often buy food and drinks.", "Sometimes I shop online.", "For example, last week I bought new shoes.", "I like online shopping because it is easy."],
  14: ["I usually watch movies at night.", "I often choose action films.", "Sometimes I watch series.", "For example, I watched a comedy yesterday.", "I like movies because they help me relax."],
  15: ["I usually listen to music every day.", "I often listen while I work.", "Sometimes I sing along.", "For example, I like pop and ballads.", "I like music because it changes my mood."],
  16: ["The weather today is warm and sunny.", "I often check the forecast.", "Sometimes it rains in the afternoon.", "For example, yesterday it was very hot.", "I like sunny days because I can go out."],
  17: ["I usually spend time in the living room.", "My home is small but comfortable.", "Sometimes I clean on weekends.", "For example, my favorite room is the kitchen.", "I like my home because it feels safe."],
  18: ["I usually stay in my city.", "I often walk around the center.", "Sometimes it is crowded.", "For example, the food here is great.", "I like my city because it is convenient."],
  19: ["I usually study English every day.", "I often practice speaking.", "Sometimes I watch English videos.", "For example, I learn English for my job.", "I like it because it opens opportunities."],
  20: ["I usually sleep seven hours.", "I often drink enough water.", "Sometimes I take a short walk.", "For example, I relax by listening to music.", "I like staying healthy because I feel better."],
  21: ["I usually save a little money each month.", "I often write down my spending.", "Sometimes I buy something special.", "For example, I am saving for a trip.", "I like saving because it makes me feel safe."],
  22: ["I usually plan my next year.", "I often set small steps.", "Sometimes plans change.", "For example, I want to learn a new skill.", "I like planning because it gives me direction."],
  23: ["As a child, I usually played outside.", "I often played with my friends.", "Sometimes we played football.", "For example, I grew up in a small town.", "I like those memories because they were happy."],
  24: ["I usually celebrate Tet with my family.", "I often visit relatives.", "Sometimes we travel together.", "For example, we eat special food.", "I like holidays because we are together."],
  25: ["I usually go to a small restaurant nearby.", "I often order noodles.", "Sometimes I try new dishes.", "For example, I go there with my friends.", "I like it because the food is tasty."],
  26: ["I usually use my phone a lot.", "I often check messages.", "Sometimes I use it too much.", "For example, I read news in the morning.", "I like it because I stay connected."],
  27: ["I usually drink coffee in the morning.", "I often make it at home.", "Sometimes I buy it on the way to work.", "For example, I prefer coffee to tea.", "I like coffee because it wakes me up."],
  28: ["I usually like friendly animals.", "I often see dogs in my area.", "Sometimes I play with my friend's cat.", "For example, I would like a small dog.", "I like animals because they are cute."],
  29: ["I usually read a little before bed.", "I often get news on my phone.", "Sometimes I read articles online.", "For example, I read a short story last week.", "I like reading because I learn new things."],
  30: ["I usually dream about traveling the world.", "I often imagine my future.", "Sometimes I think about a free day.", "For example, I would relax by the sea.", "I like dreaming because it motivates me."],
};

/** Sample answers parallel to ANSWER_QUESTIONS in toeic-data. */
export const QUESTION_SAMPLES: string[] = [
  "In my free time, I usually read or listen to music. Sometimes I meet friends. For example, last weekend I watched a film. I like it because it helps me relax.",
  "I eat at restaurants about once a week. I usually order noodles or rice. Sometimes I try something new. I like it because I don't have to cook.",
  "Last month I traveled to the beach with my family. We usually swam in the morning. Sometimes we walked in the evening. I liked it because it was relaxing.",
  "I usually listen to pop music. I often listen while I work. Sometimes I sing along. I like it because it improves my mood.",
  "In the morning I usually wake up at seven. First, I drink water. Then I take a shower and have breakfast. After that, I go to work.",
  "After a long day, I usually relax at home. I often watch a show. Sometimes I take a short walk. I like it because it helps me rest.",
  "I usually keep in touch with friends by phone. I often send messages. Sometimes we make video calls. I like it because it is easy and fast.",
  "My favorite place is the park near my house. I usually go there in the evening. Sometimes I run there. I like it because it is quiet and green.",
];

/** Sample opinion answers parallel to OPINION_TOPICS in toeic-data. */
export const OPINION_SAMPLES: string[] = [
  "I think working from home is good. First, it saves time on travel. Second, it is more comfortable. That's why I prefer it.",
  "I think living in a big city is better. First, there are more jobs. Second, there is more to do. That's why I like big cities.",
  "I think students should learn a second language. First, it helps their future. Second, it opens the mind. That's why it is important.",
  "I think technology makes life easier. First, it saves time. Second, it connects people. That's why I like it.",
  "I think saving money is important, but experiences matter too. First, savings keep us safe. Second, experiences make us happy. That's why I try to balance both.",
  "I think people should exercise every day. First, it keeps us healthy. Second, it gives us energy. That's why I do it.",
  "I think online shopping is convenient. First, it saves time. Second, there are many choices. That's why I often use it.",
  "I think some people watch too much television. First, it takes a lot of time. Second, it can be tiring. That's why balance is better.",
];

/** Generic picture-description sample. */
export const PICTURE_SAMPLE: string[] = [
  "In this picture, I can see some people.",
  "In the foreground, there is a person doing something.",
  "In the background, I can see buildings or trees.",
  "They seem to be busy and focused.",
  "I think it is daytime because it looks bright.",
];

export function topicSampleForDay(day: number): string[] {
  return TOPIC_SAMPLES[topicForDay(day).id] ?? [];
}

function pick<T>(arr: T[], day: number): T {
  return arr[(day - 1) % arr.length];
}
export function questionSampleForDay(day: number): string {
  return pick(QUESTION_SAMPLES, day);
}
export function opinionSampleForDay(day: number): string {
  return pick(OPINION_SAMPLES, day);
}
