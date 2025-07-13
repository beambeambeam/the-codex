export interface ChatCollectionItem {
  title: string;
  description: string;
  id: string;
  collection_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface ChatMessage {
  id: string;
  role: string; // "user" | "assistant"
  content: string;
  collection_chat_id: string;
  created_at: string;
  created_by: string;
  stream?: boolean;
}

export interface ChatCollection extends ChatCollectionItem {
  history: ChatMessage[];
}
