const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Agent {
  id: string;
  name: string;
  personality: string;
  status: 'active' | 'inactive';
  total_conversations: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  subscription_tier: string;
  beta_access: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return res.json();
}

// Auth
export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(email: string, password: string, name?: string): Promise<{ token: string; user: User }> {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

// Agents
export async function getAgents(token: string): Promise<Agent[]> {
  return request('/agents', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getPresets(token: string): Promise<any[]> {
  return request('/agents/presets', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function birthAgent(
  token: string,
  data: { name: string; personality: string; custom_traits?: string[] }
): Promise<Agent> {
  return request('/agents/birth', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getAgent(token: string, agentId: number): Promise<Agent> {
  return request(`/agents/${agentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Chat
export async function sendMessage(
  token: string,
  agentId: string,
  message: string
): Promise<{ response: string; conversation_id: string }> {
  return request(`/chat/${agentId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message }),
  });
}

export async function chatWithAgent(
  token: string,
  agentId: number,
  message: string,
  context: { role: string; content: string }[]
): Promise<{ response: string }> {
  return request(`/chat/${agentId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message, context }),
  });
}

export async function getChatHistory(
  token: string,
  agentId: string
): Promise<ChatMessage[]> {
  return request(`/chat/${agentId}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
