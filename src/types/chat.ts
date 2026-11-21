export type AssistantPersona = 'family_shield' | 'diy_engineer' | 'commute_optimizer' | 'community_rwa';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestions?: string[];
  impactCallout?: string;
  isStreaming?: boolean;
}

export interface PromptTemplate {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  category: 'routine' | 'diy_purifier' | 'children_seniors' | 'sustainable_cooking' | 'community';
}
