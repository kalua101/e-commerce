const Groq = require("groq-sdk").default;
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testGroq() {
  console.log("🚀 Testing Groq API...\n");
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: "Say hello in 5 words" }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 50,
    });
    
    const response = completion.choices[0]?.message?.content;
    
    console.log("✅ SUCCESS! Groq responded:");
    console.log("   ", response);
    console.log("\n🎉 Your Groq API is working perfectly!");
    console.log("🚀 Groq is 10x faster than other AI APIs!\n");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 Check your API key at: https://console.groq.com/keys");
  }
}

testGroq();
