const { HfInference } = require("@huggingface/inference");
require('dotenv').config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function testHF() {
  console.log("🚀 Testing Hugging Face API...\n");
  
  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "user", content: "Say hello in 5 words" }
      ],
      max_tokens: 50,
    });
    
    console.log("✅ SUCCESS! Hugging Face responded:");
    console.log("   ", response.choices[0].message.content);
    console.log("\n🎉 Your Hugging Face API is working perfectly!");
    console.log("💯 100% FREE - No billing required!\n");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 Check your token at: https://huggingface.co/settings/tokens");
  }
}

testHF();
