import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  subscription_tier: string;
  beta_access: boolean;
}

interface Agent {
  id: string;
  name: string;
  personality: string;
  status: 'active' | 'inactive';
  total_conversations: number;
  created_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

interface AgentState {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'mai-ai-auth',
    }
  )
);

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      agents: [],
      setAgents: (agents) => set({ agents }),
      addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
      updateAgent: (id, updates) =>
        set((state) => ({
          agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),
    }),
    {
      name: 'mai-ai-agents',
    }
  )
);
