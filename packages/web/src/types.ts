export interface FormProps<SchemaType> {
  defaultValues: SchemaType;
  onSubmit: (values: SchemaType) => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  disabled?: boolean;
}

// Collection-related types
export interface Collection {
  id: string;
  title: string;
  description?: string;
  documents: Document[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
export interface Document {
  id: string;
  collection_id: string;
  file_name: string;
  source_file_path: string;
  file_type: string;
  is_vectorized: boolean;
  is_graph_extracted: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Topic and Clustering-related types
export interface Topic {
  id: string;
  title: string;
  documents: Document[];
}

export interface Clustering {
  id: string;
  title: string;
  topics: Topic[];
  documents: Document[];
}

// Chat-related types
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
}

export interface ChatCollection extends ChatCollectionItem {
  history: ChatMessage[];
}
