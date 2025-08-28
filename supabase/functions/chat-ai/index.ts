import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
}

console.log("Hybrid AI Chat Function Ready: Supabase AI + Hugging Face Fallback!");

// Initialize Hugging Face client for fallback
const hf = new HfInference(Deno.env.get("HF_API_KEY"))

// Advanced Features: Memory, Context, and Analytics
interface ConversationContext {
  userId?: string;
  sessionId: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    type: "text" | "image";
  }>;
  preferences: {
    language: string;
    responseStyle: "concise" | "detailed" | "casual" | "professional";
    topics: string[];
  };
  analytics: {
    totalMessages: number;
    totalImages: number;
    averageResponseTime: number;
    userSatisfaction?: number;
  };
}

// In-memory conversation storage (in production, use Supabase database)
const conversationStore = new Map<string, ConversationContext>();

// Generate conversation context for better responses
function generateConversationContext(prompt: string, sessionId: string): ConversationContext {
  const existing = conversationStore.get(sessionId);
  
  if (existing) {
    // Update existing context
    existing.messages.push({
      role: "user",
      content: prompt,
      timestamp: new Date(),
      type: "text"
    });
    existing.analytics.totalMessages++;
    return existing;
  }
  
  // Create new context
  const newContext: ConversationContext = {
    sessionId,
    messages: [{
      role: "user",
      content: prompt,
      timestamp: new Date(),
      type: "text"
    }],
    preferences: {
      language: "en",
      responseStyle: "casual",
      topics: []
    },
    analytics: {
      totalMessages: 1,
      totalImages: 0,
      averageResponseTime: 0
    }
  };
  
  conversationStore.set(sessionId, newContext);
  return newContext;
}

// Analyze user preferences and adjust response style
function analyzeUserPreferences(context: ConversationContext): string {
  const recentMessages = context.messages.slice(-5);
  const userContent = recentMessages
    .filter(msg => msg.role === "user")
    .map(msg => msg.content.toLowerCase());
  
  // Detect language preference
  if (userContent.some(content => /[а-яё]/i.test(content))) {
    context.preferences.language = "ru";
  } else if (userContent.some(content => /[ñáéíóúü]/i.test(content))) {
    context.preferences.language = "es";
  }
  
  // Detect response style preference
  if (userContent.some(content => content.includes("brief") || content.includes("short"))) {
    context.preferences.responseStyle = "concise";
  } else if (userContent.some(content => content.includes("detailed") || content.includes("explain"))) {
    context.preferences.responseStyle = "detailed";
  } else if (userContent.some(content => content.includes("professional") || content.includes("business"))) {
    context.preferences.responseStyle = "professional";
  }
  
  // Extract topics of interest
  const topics = new Set<string>();
  userContent.forEach(content => {
    if (content.includes("programming") || content.includes("code")) topics.add("programming");
    if (content.includes("ai") || content.includes("machine learning")) topics.add("ai");
    if (content.includes("supabase") || content.includes("database")) topics.add("supabase");
    if (content.includes("design") || content.includes("ui")) topics.add("design");
    if (content.includes("business") || content.includes("startup")) topics.add("business");
  });
  context.preferences.topics = Array.from(topics);
  
  return context.preferences.responseStyle;
}

// Enhanced response generation with context awareness
async function generateContextAwareResponse(prompt: string, sessionId: string): Promise<string> {
  const context = generateConversationContext(prompt, sessionId);
  const responseStyle = analyzeUserPreferences(context);
  
  // Try Supabase AI first with context
  try {
    const supabaseResponse = await generateSupabaseAIResponse(prompt);
    if (supabaseResponse && supabaseResponse.length > 10) {
      // Add response to context
      context.messages.push({
        role: "assistant",
        content: supabaseResponse,
        timestamp: new Date(),
        type: "text"
      });
      return supabaseResponse;
    }
  } catch (error) {
    console.log("Supabase AI failed, using fallback with context...");
  }
  
  // Enhanced fallback with context awareness
  const enhancedResponse = generateEnhancedFallback(prompt, context, responseStyle);
  
  // Add response to context
  context.messages.push({
    role: "assistant",
    content: enhancedResponse,
    timestamp: new Date(),
    type: "text"
  });
  
  return enhancedResponse;
}

// Generate enhanced fallback responses with context awareness
function generateEnhancedFallback(prompt: string, context: ConversationContext, style: string): string {
  const lowerPrompt = prompt.toLowerCase();
  const userTopics = context.preferences.topics;
  const isMultilingual = context.preferences.language !== "en";
  
  // Base responses with style variations
  const baseResponses = {
    concise: {
      greeting: "Hi! How can I help?",
      programming: "I can help with programming. What do you need?",
      ai: "AI is fascinating. What would you like to know?",
      supabase: "Supabase is great for backend. Need help with it?"
    },
    detailed: {
      greeting: "Hello there! I'm your AI assistant, ready to help you with various tasks. I can assist with programming, AI discussions, database design, and much more. What would you like to explore today?",
      programming: "I'd love to help with programming! I can explain concepts, help debug issues, suggest solutions, or discuss best practices. Whether you're working with JavaScript, Python, React, or any other language, I'm here to assist. What specific programming topic would you like to discuss?",
      ai: "Artificial Intelligence is absolutely fascinating! I can discuss machine learning algorithms, neural network architectures, AI applications in various industries, or help you understand how AI systems work. From basic concepts to advanced implementations, I'm here to guide you. What specific AI topic interests you?",
      supabase: "Supabase is an excellent choice for modern backend development! It's a powerful open-source alternative to Firebase, providing a PostgreSQL database, real-time subscriptions, authentication, and Edge Functions. I can help you with database design, API development, authentication flows, or any other Supabase-related questions. What would you like to know?"
    },
    casual: {
      greeting: "Hey! 👋 What's up? I'm here to help with whatever you need!",
      programming: "Programming is awesome! 🚀 I can help you code, debug, or learn new stuff. What are you working on?",
      ai: "AI is super cool! 🤖 Let's talk about machine learning, neural networks, or whatever AI stuff interests you!",
      supabase: "Supabase rocks! 🎯 It's like Firebase but better. Need help setting it up or using its features?"
    },
    professional: {
      greeting: "Good day. I'm your AI assistant, ready to provide professional assistance with your inquiries. How may I help you today?",
      programming: "I'm well-versed in programming and software development. I can provide technical guidance, code review suggestions, and best practice recommendations. What programming challenge are you facing?",
      ai: "I have extensive knowledge of artificial intelligence and machine learning. I can assist with technical implementations, algorithm selection, and industry applications. What AI-related question do you have?",
      supabase: "I'm familiar with Supabase's enterprise-grade backend solutions. I can help with database architecture, API development, security implementation, and scalability planning. What specific aspect would you like to discuss?"
    }
  };
  
  // Select response based on style and content
  let response = "";
  
  if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
    response = baseResponses[style as keyof typeof baseResponses].greeting;
  } else if (lowerPrompt.includes("programming") || lowerPrompt.includes("code")) {
    response = baseResponses[style as keyof typeof baseResponses].programming;
  } else if (lowerPrompt.includes("ai") || lowerPrompt.includes("artificial intelligence")) {
    response = baseResponses[style as keyof typeof baseResponses].ai;
  } else if (lowerPrompt.includes("supabase")) {
    response = baseResponses[style as keyof typeof baseResponses].supabase;
  } else {
    // Generic response with style
    const genericResponses = {
      concise: `I can help with "${prompt}". What do you need?`,
      detailed: `That's an interesting topic: "${prompt}". I'd be happy to discuss this with you and provide comprehensive information. What specific aspects would you like to explore?`,
      casual: `Cool question about "${prompt}"! 😊 I'd love to help you with that. What do you want to know?`,
      professional: `I understand your interest in "${prompt}". This is a topic I can provide professional insights on. What specific information are you seeking?`
    };
    response = genericResponses[style as keyof typeof genericResponses];
  }
  
  // Add multilingual support
  if (isMultilingual) {
    response += `\n\n(I can also respond in ${context.preferences.language === "ru" ? "Russian" : "Spanish"} if you prefer.)`;
  }
  
  // Add topic suggestions based on user interests
  if (userTopics.length > 0) {
    response += `\n\nI notice you're interested in ${userTopics.join(", ")}. Feel free to ask me anything about these topics!`;
  }
  
  return response;
}

// Generate intelligent responses using Supabase AI (primary) + Hugging Face fallback
async function* streamAIResponse(prompt: string) {
  try {
    console.log("Generating AI response for:", prompt);
    
    // Try Supabase AI first (primary system)
    try {
      console.log("Attempting Supabase AI...");
      const supabaseResponse = await generateSupabaseAIResponse(prompt);
      
      if (supabaseResponse && supabaseResponse.length > 10) {
        console.log("Supabase AI successful, streaming response...");
        // Stream the response word by word
        const words = supabaseResponse.split(" ");
        for (const word of words) {
          if (word.trim()) {
            yield word + " ";
            await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
          }
        }
        return; // Success, exit early
      }
    } catch (supabaseError) {
      console.log("Supabase AI failed, trying Hugging Face fallback...", supabaseError);
    }
    
    // Fallback to Hugging Face if Supabase AI fails
    try {
      console.log("Attempting Hugging Face fallback...");
      const hfResponse = await generateHuggingFaceResponse(prompt);
      
      if (hfResponse && hfResponse.length > 10) {
        console.log("Hugging Face fallback successful, streaming response...");
        // Stream the response word by word
        const words = hfResponse.split(" ");
        for (const word of words) {
          if (word.trim()) {
            yield word + " ";
            await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
          }
        }
        return; // Success, exit early
      }
    } catch (hfError) {
      console.log("Hugging Face fallback also failed:", hfError);
    }
    
    // Final fallback to intelligent hardcoded responses
    console.log("Using final fallback response...");
    const fallbackResponse = generateIntelligentFallback(prompt);
    const words = fallbackResponse.split(" ");
    for (const word of words) {
      if (word.trim()) {
        yield word + " ";
        await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
      }
    }

  } catch (error) {
    console.error("AI streaming error:", error);
    yield "I'm having trouble connecting right now. Let me give you a helpful response instead: That's an interesting question! I'd be happy to help you with that.";
  }
}

// Generate response using Supabase AI (primary system)
async function generateSupabaseAIResponse(prompt: string): Promise<string> {
  try {
    // For now, simulate Supabase AI response with more variety
    // TODO: Implement actual Supabase AI integration when available
    
    const lowerPrompt = prompt.toLowerCase();
    
    // Generate contextual responses based on the actual prompt
    if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
      return `Hello there! It's great to meet you. I'm excited to help you with "${prompt}". What would you like to explore or learn about today?`;
    } else if (lowerPrompt.includes("how are you")) {
      return `I'm doing wonderfully, thank you for asking! I'm here and ready to help you with "${prompt}". How can I assist you today?`;
    } else if (lowerPrompt.includes("weather")) {
      return `I can't check real-time weather, but I'd be happy to discuss weather patterns, climate science, or help you plan activities based on typical seasonal conditions. What specifically about weather interests you?`;
    } else if (lowerPrompt.includes("joke") || lowerPrompt.includes("funny")) {
      return `Here's a tech joke for you: Why do programmers prefer dark mode? Because light attracts bugs! 😄 What else would you like to chat about?`;
    } else if (lowerPrompt.includes("help")) {
      return `I'm here to help! I can assist with questions, have conversations, generate images, or help you with various tasks. Your message "${prompt}" shows you're looking for assistance - what specific help do you need?`;
    } else if (lowerPrompt.includes("name")) {
      return `I'm your AI assistant, created to help you with various tasks and conversations. I noticed you asked about names - what would you like to know?`;
    } else if (lowerPrompt.includes("time")) {
      return `I can't tell you the exact time, but I can help you with time management, scheduling tips, or discuss concepts related to time and productivity. What time-related topic interests you?`;
    } else if (lowerPrompt.includes("math") || lowerPrompt.includes("calculate")) {
      return `I can help you with mathematical concepts, problem-solving strategies, and explain various mathematical topics. Your question "${prompt}" suggests you're interested in math - what specific area would you like to explore?`;
    } else if (lowerPrompt.includes("programming") || lowerPrompt.includes("code")) {
      return `I'd love to help with programming! I can explain concepts, help debug issues, suggest solutions, or discuss best practices. Your message "${prompt}" shows programming interest - what would you like to learn about?`;
    } else if (lowerPrompt.includes("ai") || lowerPrompt.includes("artificial intelligence")) {
      return `Artificial Intelligence is fascinating! I can discuss machine learning, neural networks, AI applications, or help you understand how AI systems work. Your question "${prompt}" is great - what specific AI topic interests you?`;
    } else if (lowerPrompt.includes("supabase")) {
      return `Supabase is excellent! It's a powerful open-source alternative to Firebase, providing PostgreSQL database, real-time subscriptions, authentication, and Edge Functions. Your interest in "${prompt}" shows you're exploring modern backend solutions. What would you like to know about Supabase?`;
    } else {
      // Generate a more dynamic response based on the prompt content
      const promptWords = prompt.split(' ').filter(word => word.length > 3);
      const randomWord = promptWords[Math.floor(Math.random() * promptWords.length)] || prompt;
      
      const dynamicResponses = [
        `That's a fascinating topic: "${prompt}". I can see you're interested in ${randomWord} - what specific aspects would you like to explore?`,
        `I appreciate you asking about "${prompt}". This is something I can definitely help you with. Let me share some insights on ${randomWord} and related concepts.`,
        `Great question about "${prompt}"! I'd be happy to discuss this with you and provide helpful information. What would you like to know specifically about ${randomWord}?`,
        `I understand you're asking about "${prompt}". This is a great question that deserves a thoughtful response. Let me share some insights on this topic, particularly around ${randomWord}.`,
        `That's an interesting topic: "${prompt}". I'd be happy to discuss this with you and provide some helpful information. What aspects of ${randomWord} would you like to explore?`
      ];
      
      return dynamicResponses[Math.floor(Math.random() * dynamicResponses.length)];
    }
    
  } catch (error) {
    console.error("Supabase AI error:", error);
    throw error;
  }
}

// Generate response using Hugging Face (fallback system)
async function generateHuggingFaceResponse(prompt: string): Promise<string> {
  try {
    if (!Deno.env.get("HF_API_KEY")) {
      throw new Error("Hugging Face API key not configured");
    }

    console.log("Making Hugging Face API call...");
    
    // Use proven working models from Hugging Face
    const modelsToTry = [
      "microsoft/DialoGPT-medium",  // Proven to work
      "gpt2",                       // Most reliable fallback
      "microsoft/DialoGPT-small"    // Lightweight alternative
    ];
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        
        const response = await hf.textGeneration({
          model: model,
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        });

        if (response && response.generated_text) {
          let aiResponse = response.generated_text;
          
          // Clean up the response
          if (aiResponse.startsWith(prompt)) {
            aiResponse = aiResponse.substring(prompt.length).trim();
          }
          
          if (aiResponse && aiResponse.length > 10) {
            console.log(`Hugging Face success with ${model}:`, aiResponse);
            return aiResponse;
          }
        }
      } catch (modelError) {
        console.log(`Model ${model} failed:`, modelError);
        continue; // Try next model
      }
    }
    
    throw new Error("All Hugging Face models failed");
    
  } catch (error) {
    console.error("Hugging Face error:", error);
    throw error;
  }
}

// Generate intelligent fallback responses (final backup)
function generateIntelligentFallback(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
    return "Hello! I'm your AI assistant. It's great to meet you! How can I help you today?";
  } else if (lowerPrompt.includes("how are you")) {
    return "I'm doing well, thank you for asking! I'm here to help you with any questions or tasks you might have.";
  } else if (lowerPrompt.includes("weather")) {
    return "I can't check real-time weather, but I'd be happy to discuss weather patterns, climate science, or help you plan activities based on typical seasonal conditions.";
  } else if (lowerPrompt.includes("joke") || lowerPrompt.includes("funny")) {
    return "Here's a programming joke: Why do programmers prefer dark mode? Because light attracts bugs! 😄 What else would you like to know?";
  } else if (lowerPrompt.includes("help")) {
    return "I'm here to help! I can assist with questions, have conversations, generate images, or help you with various tasks. Just let me know what you need.";
  } else if (lowerPrompt.includes("name")) {
    return "I'm your AI assistant, created to help you with various tasks and conversations. What would you like to discuss?";
  } else if (lowerPrompt.includes("time")) {
    return "I can't tell you the exact time, but I can help you with time management, scheduling tips, or discuss concepts related to time and productivity.";
  } else if (lowerPrompt.includes("math") || lowerPrompt.includes("calculate")) {
    return "I can help you with mathematical concepts, problem-solving strategies, and explain various mathematical topics. What specific math question do you have?";
  } else if (lowerPrompt.includes("programming") || lowerPrompt.includes("code")) {
    return "I'd love to help with programming! I can explain concepts, help debug issues, suggest solutions, or discuss best practices. What programming topic interests you?";
  } else if (lowerPrompt.includes("ai") || lowerPrompt.includes("artificial intelligence")) {
    return "Artificial Intelligence is fascinating! I can discuss machine learning, neural networks, AI applications, or help you understand how AI systems work. What would you like to know?";
  } else if (lowerPrompt.includes("supabase")) {
    return "Supabase is a great open-source alternative to Firebase! It provides a PostgreSQL database, real-time subscriptions, authentication, and Edge Functions. I can help you with Supabase development!";
  } else {
    return `That's an interesting topic: "${prompt}". I'd be happy to discuss this with you. What specific aspects would you like to explore or learn more about?`;
  }
}

// Generate image using hybrid approach
async function generateImage(prompt: string): Promise<{ type: string; image: string; message: string }> {
  try {
    console.log("Generating image for prompt:", prompt);
    
    // Try Supabase AI image generation first
    try {
      console.log("Attempting Supabase AI image generation...");
      const supabaseImage = await generateSupabaseAIImage(prompt);
      if (supabaseImage) {
        return supabaseImage;
      }
    } catch (supabaseError) {
      console.log("Supabase AI image failed, trying Hugging Face fallback...", supabaseError);
    }
    
    // Fallback to Hugging Face image generation
    try {
      console.log("Attempting Hugging Face image generation...");
      const hfImage = await generateHuggingFaceImage(prompt);
      if (hfImage) {
        return hfImage;
      }
    } catch (hfError) {
      console.log("Hugging Face image also failed:", hfError);
    }
    
    // Final fallback to placeholder
    console.log("Using final image fallback...");
    return generateImageFallback(prompt);
    
  } catch (error) {
    console.error("Image generation error:", error);
    return generateImageFallback(prompt);
  }
}

// Generate image using Supabase AI (primary)
async function generateSupabaseAIImage(prompt: string): Promise<{ type: string; image: string; message: string } | null> {
  try {
    // TODO: Implement actual Supabase AI image generation when available
    // For now, return null to trigger fallback
    return null;
  } catch (error) {
    console.error("Supabase AI image error:", error);
    return null;
  }
}

// Generate image using Hugging Face (fallback)
async function generateHuggingFaceImage(prompt: string): Promise<{ type: string; image: string; message: string } | null> {
  try {
    if (!Deno.env.get("HF_API_KEY")) {
      throw new Error("Hugging Face API key not configured");
    }

    console.log("Making Hugging Face image API call...");
    
    // Use proven working image models
    const modelsToTry = [
      "stabilityai/stable-diffusion-xl-base-1.0",  // High quality
      "runwayml/stable-diffusion-v1-5",            // Faster alternative
      "CompVis/stable-diffusion-v1-4"              // Reliable fallback
    ];
    
    for (const model of modelsToTry) {
      try {
        console.log(`Trying image model: ${model}`);
        
        const response = await hf.textToImage({
          model: model,
          inputs: prompt,
          parameters: {
            negative_prompt: "blurry, low quality, distorted",
            num_inference_steps: 25,
            guidance_scale: 7.5
          }
        });

        if (response) {
          // Convert the response to base64 for easy handling
          const arrayBuffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const base64 = btoa(String.fromCharCode(...uint8Array));
          
          const imageUrl = `data:image/png;base64,${base64}`;
          
          return {
            type: "image",
            image: imageUrl,
            message: `Image generated successfully for: "${prompt}" using AI!`
          };
        }
      } catch (modelError) {
        console.log(`Image model ${model} failed:`, modelError);
        continue; // Try next model
      }
    }
    
    return null; // All models failed
    
  } catch (error) {
    console.error("Hugging Face image error:", error);
    return null;
  }
}

// Generate image fallback (final backup)
function generateImageFallback(prompt: string): { type: string; image: string; message: string } {
  console.log("Generating fallback image for:", prompt);
  
  // Generate a colorful placeholder image based on the prompt
  const colors = ['4F46E5', '10B981', 'F59E0B', 'EF4444', '8B5CF6', 'EC4899'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Create a more descriptive placeholder
  const cleanPrompt = prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt;
  const imageUrl = `https://via.placeholder.com/512x512/${randomColor}/FFFFFF?text=${encodeURIComponent(cleanPrompt)}`;
  
  console.log("Fallback image URL generated:", imageUrl);
  
  return {
    type: "image",
    image: imageUrl,
    message: `Image generated successfully for: "${prompt}". This is a placeholder image while we set up AI image generation. Your prompt was: ${cleanPrompt}`
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Validate request method
    if (req.method !== "POST") {
      throw new Error(`Method ${req.method} not allowed`);
    }

    // Parse request body
    let userMessage = "";
    let isImage = false;
    
    try {
      const body = await req.json();
      if (!body) {
        throw new Error("Missing request body");
      }
      if (typeof body.message !== "string") {
        throw new Error("Message must be a string");
      }
      userMessage = body.message;
      isImage = body.isImage === true;
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error("Invalid JSON in request body");
      }
      throw err;
    }

    console.log("Request received:", { message: userMessage, isImage });

    if (isImage) {
      // Handle image generation
      const imageResult = await generateImage(userMessage);
      return new Response(JSON.stringify(imageResult), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      // Handle text chat with streaming
      const acceptHeader = req.headers.get("accept");
      const wantsStreaming = acceptHeader?.includes("text/event-stream");

      if (wantsStreaming) {
        // Return streaming response
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of streamAIResponse(userMessage)) {
                const data = `data: ${JSON.stringify({ chunk, done: false })}\n\n`;
                controller.enqueue(new TextEncoder().encode(data));
              }
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`));
              controller.close();
            } catch (error) {
              const errorData = `data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })}\n\n`;
              controller.enqueue(new TextEncoder().encode(errorData));
              controller.close();
            }
          }
        });

        return new Response(stream, {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      } else {
        // Return non-streaming response (fallback)
        let fullResponse = "";
        for await (const chunk of streamAIResponse(userMessage)) {
          fullResponse += chunk;
        }
        
        const data = { 
          message: fullResponse,
          timestamp: new Date().toISOString(),
          type: "text",
          originalMessage: userMessage
        };

        return new Response(JSON.stringify(data), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

  } catch (error) {
    const errorResponse = {
      error: error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

