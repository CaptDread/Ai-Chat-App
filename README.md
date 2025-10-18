# AI Chat App

A modern, responsive AI chat application built with Next.js App Router for seamless conversations with AI models.

## Features

- **Real-time AI Conversations**: Chat with the powerful GLM-4.5-Air model
- **Next.js App Router**: Latest Next.js 13+ with App Router architecture
- **Modern UI/UX**: Clean, responsive design that works on all devices
- **Free AI Model**: Powered by z-ai/glm-4.5-air:free - no API costs
- **Message History**: View your conversation history in real-time
- **Server Components**: Optimized performance with React Server Components
- **API Routes**: Built-in API endpoints for AI integration

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Frontend**: React 18 with Server & Client Components
- **Styling**: Tailwind CSS
- **AI Integration**: GLM-4.5-Air model via z-ai
- **Runtime**: Node.js

## Project Structure

```
ai-chat-app/
├── app/
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   ├── hooks/
│   │   └── useChat.js
│   ├── api/
│   │   └── chat/
│   │       └── route.js
│   └── components/
│       ├── ChatInterface.jsx
├── public/
├── next.config.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/AI-Chat_App.git
cd AI-Chat_App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Launch the application
2. Start typing your messages in the input field
3. Press Enter or click the send button to chat with the AI
4. The AI will respond using the GLM-4.5-Air model
5. Continue the conversation naturally

## API Routes

The app includes API endpoints in `/app/api/chat/route.js` for handling AI conversations:

```javascript
// Example API route structure
export async function POST(request) {
  const { message } = await request.json();
  // AI integration logic here
  return Response.json({ response: aiResponse });
}
```

## Configuration

The app is pre-configured to use the free `z-ai/glm-4.5-air:free` model. No additional API keys or configuration required.

### Environment Variables (Optional)

Create a `.env.local` file for custom configurations:

```env
# Optional: Custom model configuration
AI_MODEL=z-ai/glm-4.5-air:free
```

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`

## Key App Router Features Used

- **Server Components**: For better performance and SEO
- **API Routes**: Built-in API endpoints in the app directory
- **Layouts**: Consistent layout across pages
- **Loading States**: Built-in loading UI handling
- **Error Boundaries**: Error handling for better UX

## Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Model Information

This application uses **z-ai/glm-4.5-air:free**, a powerful and free AI language model that provides intelligent responses for various conversational needs.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

## Deployment

The app can be deployed on Vercel, Netlify, or any Node.js hosting platform:

```bash
# Build and deploy
npm run build
```
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Launch the application
2. Start typing your messages in the input field
3. Press Enter or click the send button to chat with the AI
4. The AI will respond using the GLM-4.5-Air model
5. Continue the conversation naturally

## API Routes

The app includes API endpoints in `/app/api/chat/route.js` for handling AI conversations:

```javascript
// Example API route structure
export async function POST(request) {
  const { message } = await request.json();
  // AI integration logic here
  return Response.json({ response: aiResponse });
}
```

## Configuration

The app is pre-configured to use the free `z-ai/glm-4.5-air:free` model. No additional API keys or configuration required.

### Environment Variables (Optional)

Create a `.env.local` file for custom configurations:

```env
# Optional: Custom model configuration
AI_MODEL=z-ai/glm-4.5-air:free
```

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`

## Key App Router Features Used

- **Server Components**: For better performance and SEO
- **API Routes**: Built-in API endpoints in the app directory
- **Layouts**: Consistent layout across pages
- **Loading States**: Built-in loading UI handling
- **Error Boundaries**: Error handling for better UX

## Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Model Information

This application uses **z-ai/glm-4.5-air:free**, a powerful and free AI language model that provides intelligent responses for various conversational needs.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

## Deployment

The app can be deployed on Vercel, Netlify, or any Node.js hosting platform:

```bash
# Build and deploy
npm run build
```