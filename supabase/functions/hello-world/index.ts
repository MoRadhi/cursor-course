// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
/// <reference types="https://deno.land/x/supabase_functions_js@1.0.0/edge-runtime.d.ts" />

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
}

// How to fetch .env keys (renamed to avoid SUPABASE_ prefix)
const supabaseUrl = Deno.env.get("URL") || "";
const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY") || "";


const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Validate request method
    if (req.method !== "POST") {
      throw new Error(`Method ${req.method} not allowed`);
    }

    // Check for authorization header (required by Supabase Edge Runtime)
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header. Use: Authorization: Bearer <your-anon-key>");
    }

    // For local development, accept any valid-looking Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Invalid authorization format. Use: Authorization: Bearer <your-anon-key>");
    }

    // Parse request body
    let name = "World";
    try {
      const body = await req.json();
      if (!body) {
        throw new Error("Missing request body");
      }
      if (typeof body.name !== "string") {
        throw new Error("Name must be a string");
      }
      name = body.name;
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error("Invalid JSON in request body");
      }
      throw err;
    }

    const data = { message: `Hello ${name}!` };
    return new Response(JSON.stringify(data), { headers: corsHeaders });
  } catch (error) {
    const errorResponse = {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: corsHeaders,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
