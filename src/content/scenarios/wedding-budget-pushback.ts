import type { Scenario } from "../types";

// Authored from Wedding Scripts.docx Event 4B ("Quote is Out of User's Budget") and
// Event 4C ("User Went With Someone Else") - the two scenarios the original export never finished building.
// Same branching shape as the existing "Tough Corporate Call" scenario: 4 decision
// points, each with one recommended path forward and dead-end wrong choices that
// surface their own coaching feedback (matching the original storyboard spec:
// "Immediate feedback on each choice, replay option for missed paths").
export const weddingBudgetPushbackScenario: Scenario = {
  id: "wedding-budget-pushback",
  title: "Live Scenario: Wedding Budget Pushback",
  moduleId: "module-4",
  lessonId: "scenario-wedding-budget-pushback",
  sceneImage: "/images/scene-wedding-budget-EN.png",
  rootId: "n1",
  nodes: {
    n1: {
      id: "n1",
      kind: "choice",
      text: "Hi, thanks for sending that over, but honestly... it's a bit out of our budget right now.",
      characterImage: "/images/mathieu-worried.png",
      sceneId: "wedding-budget",
      options: [
        {
          outcomeId: "n1-good",
          isBest: true,
          text: "\"I completely understand — weddings add up fast. Let me see what I can do on my end and get back to you with some options.\"",
          feedback:
            "Exactly right. You lead with empathy and buy yourself room to negotiate instead of reacting to the number on the spot — the same move as the wedding Event 4B script.",
          reactionImage: "/images/mathieu-thinking.png",
          nextId: "n2",
        },
        {
          outcomeId: "n1-bad-discount",
          isBest: false,
          text: "\"No problem, I can just do 30% off right now.\"",
          feedback:
            "30% blows past the 20% discount ceiling before you've even checked with your team. Never quote a number that high on reflex — see paihdjurr / Discount Strategy & Closing Techniques.",
          reactionImage: "/images/mathieu-surprised.png",
          nextId: null,
        },
        {
          outcomeId: "n1-bad-dismissive",
          isBest: false,
          text: "\"Well, you get what you pay for — we're worth every penny.\"",
          feedback:
            "This is the Gucci-store line, but it only works after you've acknowledged the client's concern — leading with it here reads as dismissive of a real budget worry.",
          reactionImage: "/images/mathieu-confused.png",
          nextId: null,
        },
      ],
    },
    n2: {
      id: "n2",
      kind: "choice",
      text: "That would help. What kind of discount could you offer?",
      characterImage: "/images/mathieu-neutral.png",
      sceneId: "wedding-budget",
      options: [
        {
          outcomeId: "n2-good",
          isBest: true,
          text: "\"We're all about building long-term relationships, so let me get you a 10% discount to start — does that make things a bit more feasible?\"",
          feedback:
            "Perfect ladder — this is the exact Event 4B SMS script. Start at 10%, not your ceiling, so you have somewhere to go if they push again.",
          reactionImage: "/images/mathieu-talking.png",
          nextId: "n3",
        },
        {
          outcomeId: "n2-bad-ceiling",
          isBest: false,
          text: "\"I'll just give you the full 20% right now.\"",
          feedback:
            "That's within policy, but you've now handed over your maximum discount before learning whether 10% would've closed it. You have nowhere left to go if they ask for more.",
          reactionImage: "/images/mathieu-surprised.png",
          nextId: null,
        },
        {
          outcomeId: "n2-bad-none",
          isBest: false,
          text: "\"Unfortunately, we don't really offer discounts.\"",
          feedback:
            "Not true — Beige allows up to 20% off the pricing calculator, and this client already told you budget is the blocker. This answer kills a winnable deal.",
          reactionImage: "/images/mathieu-confused.png",
          nextId: null,
        },
      ],
    },
    n3: {
      id: "n3",
      kind: "choice",
      text: "10% helps, but honestly... we already got a quote from another company for close to that same price, even after your discount.",
      characterImage: "/images/mathieu-thinking.png",
      sceneId: "wedding-budget",
      options: [
        {
          outcomeId: "n3-good",
          isBest: true,
          text: "\"That makes sense, and I get wanting to compare. Let me go back to my team — I may be able to get closer to 20%, which is the most we're ever able to offer. I'll also mention, your date is popular and we're getting other inquiries for it, so if we can lock this in today I'd love to make that happen for you.\"",
          feedback:
            "This is the whole playbook at once: acknowledge, move toward — but not past — the 20% ceiling, and layer in real urgency about the date. Textbook.",
          reactionImage: "/images/mathieu-happy.png",
          nextId: "n4",
        },
        {
          outcomeId: "n3-bad-passive",
          isBest: false,
          text: "\"Okay, well, let us know if you change your mind.\"",
          feedback:
            "No urgency, no next step — this is the exact failure mode called out in the training spec. A comparison-shopping client needs a reason to decide today, not an open door to disappear.",
          reactionImage: "/images/mathieu-confused.png",
          nextId: null,
        },
        {
          outcomeId: "n3-bad-match",
          isBest: false,
          text: "\"I can just match whatever they quoted you.\"",
          feedback:
            "You don't actually know their number, and blind price-matching abandons your own pricing discipline. Reinforce the Beige Guarantee and insurance instead of racing to the bottom.",
          reactionImage: "/images/mathieu-surprised.png",
          nextId: null,
        },
      ],
    },
    n4: {
      id: "n4",
      kind: "choice",
      text: "Okay... let me think about it. Can you at least hold the date for me?",
      characterImage: "/images/mathieu-surprised.png",
      sceneId: "wedding-budget",
      options: [
        {
          outcomeId: "n4-good",
          isBest: true,
          text: "\"Absolutely — we don't normally hold dates without a deposit, but I can do a soft hold to reserve it for you. How soon do you think you'll be able to finalize this?\"",
          feedback:
            "This is the soft-hold move from Event 4C: assume the sale even with a barrier in the way, and use it to keep a firm timeline instead of letting the lead go cold.",
          reactionImage: "/images/mathieu-happy.png",
          nextId: "n5",
        },
        {
          outcomeId: "n4-bad-openended",
          isBest: false,
          text: "\"Sure, I'll hold it indefinitely, no rush at all.\"",
          feedback:
            "An indefinite hold removes every reason for them to decide. Even a soft hold needs a timeline attached, or it isn't really a hold.",
          reactionImage: "/images/mathieu-confused.png",
          nextId: null,
        },
        {
          outcomeId: "n4-bad-rigid",
          isBest: false,
          text: "\"Sorry, we can't hold dates without payment.\"",
          feedback:
            "Too rigid. The soft hold exists specifically for moments like this — refusing it needlessly risks losing a client who was one step from saying yes.",
          reactionImage: "/images/mathieu-worried.png",
          nextId: null,
        },
      ],
    },
    n5: {
      id: "n5",
      kind: "narration",
      text: "The client pauses, then: \"Okay — let's do the soft hold. I'll get back to you by Friday with the deposit.\"",
      characterImage: "/images/mathieu-happy.png",
      sceneId: "wedding-budget",
      result: "correct",
      nextId: null,
    },
  },
};
