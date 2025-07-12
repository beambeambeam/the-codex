export interface FormProps<SchemaType> {
  defaultValues: SchemaType;
  onSubmit: (values: SchemaType) => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  disabled?: boolean;
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
