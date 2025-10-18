// app/api/chat/route.js
export async function POST(request) {
  const { message, history = [] } = await request.json();

  // Build messages array with history + new message
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful bilingual AI assistant. Maintain context from previous messages in this conversation. Respond in the same language the users uses in the prompt, after this point.'
    },
    ...history.slice(-10), // Keep last 10 messages to avoid token limits
    { role: 'user', content: message }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: `${process.env.NEXT_PUBLIC_OPENROUTER_MODEL}`,
      messages: messages,
      max_tokens: 1024,
    }),
  });

  const data = await response.json();
  return Response.json({ response: data.choices[0]?.message?.content });
}