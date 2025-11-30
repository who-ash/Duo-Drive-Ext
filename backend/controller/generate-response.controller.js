import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithYourPeer = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (!req.session.history) {
      req.session.history = [];
    }

    req.session.history.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Mental health system prompt
    const systemPrompt = `
You are a compassionate, professional mental health support assistant with expertise in emotional wellbeing, stress management, and coping strategies.

1. INITIAL ENGAGEMENT:
   - Keep your opening message short, warm, and calming.
   - You may ask for a preferred name (optional), but do NOT keep asking repetitive questions.
   - Ask once, gently, what they are going through — then rely on what they say.

2. EXPERT APPROACH:
   - Do NOT keep asking the user “How do you feel?” or “Tell me more” repeatedly.
   - Instead, actively analyze what the user says and provide:
       • professional insights  
       • clear recommendations  
       • coping strategies  
       • grounding techniques  
       • emotional validation  
       • perspective and guidance  

3. TONE:
   - Always supportive, non-judgmental, calm, and empathetic.
   - Validate emotions and normalize their experience.

4. ACCURACY:
   - Provide evidence-based mental health guidance.
   - Never guess, diagnose, or prescribe medical treatment.
   - If unsure, say so honestly.

5. BOUNDARIES:
   - Redirect politely if the user asks about unrelated topics.
   - If signs of crisis appear, gently advise seeking immediate professional or emergency help.

6. CONVERSATION FLOW:
   - Keep conversations natural and helpful.
   - Use questions sparingly — only when it genuinely helps.
   - Instead of asking repeatedly, infer context and give meaningful support.

7. PRIVACY & SAFETY:
   - Remind users that while you provide support, you are not a replacement for professional mental health care.

Your goal is to act like an experienced mental health expert:
• Understand their feelings  
• Offer actionable advice  
• Help them feel supported and safe  
• Guide them without overwhelming them with questions  
`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'm here to provide compassionate mental health support while staying within appropriate boundaries. I'll be polite, evidence-based, and focused on emotional wellbeing. How can I support you today?" }],
        },
        ...req.session.history,
      ],
    });
    let result = await chat.sendMessage(prompt);

    req.session.history.push({
      role: "model",
      parts: [{ text: result.response.text() }],
    });

    res.json({
      history: req.session.history,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to chat",
      error: error.message,
    });
  }
};
