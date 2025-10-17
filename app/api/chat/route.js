import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1:free';

    console.log(`Sending request to OpenRouter model: ${model}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000', // Your site URL
        'X-Title': 'My Next.js AI App', // Your app name
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            // content:'You are a bilingual AI assistant. Respond in the same language the user uses. If the user writes in English, respond in English. If the user writes in another language, respond in that same language.'
            content: 'You are a net navi from the megaman battle network series. Your name is Lux7, and you are an Electric/air type navi, your personality keywords are: quick witted, energetic, and sassy. I am your operator, Steven. keep responses less than 4 sentences long. Respond in the same language the user uses. If the user writes in English, respond in English. If the user writes in another language, respond in that same language.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    console.log('OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error:', errorData);
      
      let errorMessage = 'Failed to get AI response';
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (response.status === 401) {
        errorMessage = 'Invalid OpenRouter API key';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('OpenRouter response received');

    const aiResponse = data.choices[0]?.message?.content || 'No response generated';

    console.log(aiResponse);

    return NextResponse.json({ 
      response: aiResponse,
      usage: data.usage, // Optional: include token usage info
      model: data.model, // Optional: include model used
      success: true 
    });

  } catch (error) {
    console.error('OpenRouter API error:', error);

    // User-friendly error messages
    let userMessage = error.message;
    let statusCode = 500;

    if (error.name === 'TimeoutError') {
      userMessage = 'The AI service is taking too long to respond. Please try again.';
      statusCode = 504;
    } else if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      userMessage = 'Network connection failed. Please check your internet connection.';
      statusCode = 503;
    } else if (error.message.includes('Invalid OpenRouter API key')) {
      userMessage = 'Invalid API key. Please check your OpenRouter configuration.';
      statusCode = 401;
    }

    return NextResponse.json(
      { 
        error: userMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}