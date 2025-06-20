const { AzureOpenAI } = require("openai");

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-04-01-preview";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

const client = new AzureOpenAI({
  apiKey,
  endpoint,
  apiVersion
});

async function getBotReply(messages) {
  const response = await client.chat.completions.create({
    model: deployment,
    messages: [
      { role: "system", content: "You are a helpful support assistant." },
      ...messages
    ],
    max_tokens: 800,
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.choices[0].message.content;
}

module.exports = { getBotReply }; // ✅ Important!
