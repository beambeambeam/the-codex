export const MOCK_CHAT_CONTENT = `
# Exploring Transformer Architectures in Natural Language Processing

Natural Language Processing (NLP) has experienced rapid advancements due to the introduction of transformer-based models. One of the foundational works in this domain is the **Attention Is All You Need** paper by Vaswani et al. (2017), which introduced the transformer model architecture.

## Key Concepts

### Self-Attention Mechanism
The **self-attention** mechanism allows the model to weigh the importance of different words in a sequence when encoding a particular word, enabling it to capture contextual relationships more effectively.

### Positional Encoding
Since transformer models lack recurrence, positional encodings are added to input embeddings to retain the order of sequences.

## Example: Positional Encoding Formula

The positional encoding for each position and dimension is defined as:

1 + 1 = 2

where:
- (pos) is the position index
- (i) is the dimension index
- (d_{model}) is the embedding size

## Code Example: Simple Self-Attention in Python

\`\`\`python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    scores = torch.matmul(Q, K.transpose(-2, -1)) / Q.size(-1)**0.5
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V)
\`\`\`

## References

- Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). *Attention is all you need*. In *Advances in Neural Information Processing Systems* (pp. 5998-6008). [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)


`;

export const MOCK_CHAT_COLLECTION = [
  {
    title: "Attention is all you need related",
    description:
      "This chat log explores concepts related to attention mechanisms in artificial intelligence, including the seminal paper Attention Is All You Need and its impact on models like the Transformer.",
    id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
    collection_id: "d56d1ab5-f738-436e-9d76-d75d5da180df",
    created_at: "2025-07-10T15:00:56.338344",
    updated_at: "2025-07-10T15:00:56.338344",
    created_by: "User-Alpha",
    updated_by: "User-Alpha",
  },
  {
    title: "Sample Document A",
    description: "First sample document in collection.",
    id: "3d4c62cb-bb8e-495a-9a2d-cda7813e58cf",
    collection_id: "d56d1ab5-f738-436e-9d76-d75d5da180df",
    created_at: "2025-07-11T10:20:30.221000",
    updated_at: "2025-07-11T10:20:30.221000",
    created_by: "User-Alpha",
    updated_by: "User-Alpha",
  },
  {
    title: "Project Proposal",
    description: "A draft proposal for the new project initiative.",
    id: "8828e2fb-f3c6-42c4-86d3-97e748a2c3fa",
    collection_id: "fa172b9c-5ff1-4685-9703-334c9f2121f9",
    created_at: "2025-07-12T08:45:12.543000",
    updated_at: "2025-07-12T08:45:12.543000",
    created_by: "User-Alpha",
    updated_by: "User-Alpha",
  },
  {
    title: "Research Paper Draft",
    description: "Contains the initial draft of the research paper.",
    id: "cc63fb23-4ae9-4e0b-823d-5a3812cf30ef",
    collection_id: "a75e9c31-0c8c-493d-96c7-9f8f94565e5b",
    created_at: "2025-07-13T12:10:00.100000",
    updated_at: "2025-07-13T12:10:00.100000",
    created_by: "User-Alpha",
    updated_by: "User-Alpha",
  },
];

export const MOCK_CHAT_HISTORY = {
  title: "Attention is all you need related",
  description:
    "Chat history demonstrating user and assistant interactions about attention mechanisms, transformer models, and related research papers, including the seminal 'Attention Is All You Need' paper.",
  id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
  collection_id: "d56d1ab5-f738-436e-9d76-d75d5da180df",
  created_at: "2025-07-10T15:00:56.338344",
  updated_at: "2025-07-10T15:00:56.338344",
  created_by: "User-Alpha",
  updated_by: "User-Alpha",
  history: [
    {
      role: "user",
      content: "Hello sir",
      id: "9b917733-803e-4c67-b7d7-3150c429a645",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:11:26.419081",
      created_by: "User-Alpha",
    },
    {
      role: "assistant",
      content:
        "**Greetings and Introduction**\nHello! I'm Codex, your librarian chatbot companion. I'm here to assist you in navigating and understanding your document collections.\n\n**Current Situation**\nIt appears we have just begun our interaction, and I haven't received any specific questions related to the context documents. Unfortunately, there are no context documents provided for me to analyze and synthesize information from.\n\n**Next Steps**\nIf you could provide the context documents or pose a question, I would be more than happy to help. I will carefully read and analyze the information, synthesize a comprehensive answer, and format it for maximum readability.\n\n**Please Provide Context or Question**\nTo better assist you, I kindly request that you share the context documents or ask a specific question. This will enable me to provide a clear, comprehensive, and context-rich answer.",
      id: "e130fe85-c0a9-45eb-95a5-98d29cc36874",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:11:31.058211",
      created_by: "User-Alpha",
    },
    {
      role: "user",
      content: "ok can you find related paper with flash attention?",
      id: "93a11c70-1f62-45ec-9dac-90b2a0327549",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:12:32.109372",
      created_by: "User-Alpha",
    },
    {
      role: "assistant",
      content:
        '**Analysis of Context Documents**\nUpon reviewing the provided context documents, I have found that there is **no information** related to "flash attention" or any relevant papers on this topic.\n\n**Conclusion**\nBased on the provided documents, I cannot find an answer to this question. The context documents are empty, and there is no information available to synthesize or analyze.\n\n**Recommendation**\nIf you could provide more context documents or specify the topic or field related to "flash attention," I would be more than happy to help you find relevant information. Please provide additional context or clarify your question, and I will do my best to assist you.',
      id: "1e63fa82-1441-4b2f-8469-07db68bb3716",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:12:35.481213",
      created_by: "User-Alpha",
    },
    {
      role: "user",
      content: "how about attention",
      id: "a43a3737-4722-47ec-b96c-0c86dbeb94ac",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:15:25.597539",
      created_by: "User-Alpha",
    },
    {
      role: "assistant",
      content:
        '**Analysis of Context Documents**\nUpon reviewing the provided context documents, I have found that **there is no information** related to "attention" or any relevant details on this topic. The context documents appear to be empty, with no text or data to analyze or synthesize.\n\n**Conclusion**\nBased on the provided documents, I cannot find an answer to this question. The lack of information in the context documents makes it impossible to provide a comprehensive or meaningful response.\n\n**Insights Related to the Query**\nHowever, I can provide some general insight into what "attention" might refer to in various contexts, but **this is not based on the provided documents**. In artificial intelligence, attention mechanisms are used in models like transformers to focus on specific parts of the input data. In psychology, attention refers to the cognitive process of selectively concentrating on one aspect of the environment while ignoring others. \n\n**Important Clarification**\nIt\'s essential to note that the above insights are **not derived from the context documents** but rather from external knowledge. The context documents provided do not contain any information about "attention" or related topics.\n\n**Final Assessment**\nGiven the absence of relevant information in the context documents, I must reiterate that **based on the provided documents, I cannot find an answer to this question**. If more context or specific details were provided, I would be better equipped to offer a meaningful response.',
      id: "f45e50c5-d467-44b1-97cc-55dc172a39ad",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:15:30.813111",
      created_by: "User-Alpha",
    },
    {
      role: "user",
      content: "how about paper about attention",
      id: "88c7c783-f3a1-4b3e-854d-f3b05389a556",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:17:08.831961",
      created_by: "User-Alpha",
    },
    {
      role: "assistant",
      content:
        '**Analysis of Context Documents**\nUpon reviewing the provided "Context Documents," I have found that **there are no documents** to analyze. The section is empty, with no text or data to synthesize or integrate.\n\n**Conclusion**\nBased on the provided documents, **I cannot find an answer to this question**. The absence of any context or information related to papers about "attention" means that I cannot construct a comprehensive or meaningful response.\n\n**Limitation Acknowledgement**\nIt\'s essential to acknowledge that my capabilities are strictly bound by the information contained within the provided "Context Documents." Without relevant data, I am unable to provide an informed answer to the user\'s question about papers related to "attention."\n\n**Recommendation for Further Inquiry**\nIf you could provide the actual context documents or specify the topic or field related to "attention" you are interested in, I would be more than happy to help you find relevant information and synthesize a comprehensive answer.',
      id: "30bffe82-39d4-42d4-9892-61605f18d1da",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:17:12.083245",
      created_by: "User-Alpha",
    },
    {
      role: "user",
      content: "attention is all you need",
      id: "a58cb6fa-2c6c-4f24-8888-04b9bfd94e9c",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:18:08.282860",
      created_by: "User-Alpha",
    },
    {
      role: "assistant",
      content:
        '**Analysis of Context Documents**\nUpon examining the provided "Context Documents," I have found that **there are no documents** to analyze. The section is empty, with no text or data to synthesize or integrate.\n\n**Conclusion**\nBased on the provided documents, **I cannot find an answer to this question**. The phrase "attention is all you need" seems to be a reference to a concept or title, possibly related to the field of artificial intelligence or deep learning, but without any context or information, I cannot provide a comprehensive or meaningful response.\n\n**Important Clarification**\nIt\'s worth noting that the phrase "Attention Is All You Need" is actually the title of a seminal research paper published in 2017 by Ashish Vaswani et al., which introduced the Transformer model, a highly influential architecture in the field of natural language processing. However, **this information is not derived from the provided documents** and is therefore not a valid basis for my response.\n\n**Final Assessment**\nGiven the absence of relevant information in the context documents, I must reiterate that **based on the provided documents, I cannot find an answer to this question**. If more context or specific details were provided, I would be better equipped to offer a meaningful response.',
      id: "958133ff-32f7-4662-b8da-aefde19522e3",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:18:12.215300",
      created_by: "User-Alpha",
    },
    {
      role: "user",
      content: "attention is all you need?",
      id: "f3c0ef5c-f159-4556-a275-91a6280c5784",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:36:22.063043",
      created_by: "User-Alpha",
    },
    {
      role: "assistant",
      content:
        '**Analysis of Context Documents**\nUpon examining the provided "Context Documents," I have found that **there are no documents** to analyze. The section is empty, with no text or data to synthesize or integrate.\n\n**Conclusion**\nBased on the provided documents, **I cannot find an answer to this question**. The phrase "attention is all you need" appears to be a query or statement, but without any context or information, I am unable to provide a comprehensive or meaningful response.\n\n**Important Admittance**\nGiven the absence of relevant information in the context documents, I must acknowledge that I do not have sufficient data to address the user\'s question. The context documents are empty, and therefore, I **cannot provide an answer** to the question "attention is all you need?" \n\n**Final Assessment**\nIn accordance with my core directive to answer exclusively based on the provided context documents, I reiterate that **based on the provided documents, I cannot find an answer to this question**. If more context or specific details were provided, I would be better equipped to offer a meaningful response.',
      id: "42553102-d65b-4526-b546-e3c4d418fc9a",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:36:22.273904",
      created_by: "User-Alpha",
    },
    {
      role: "user",
      content: "attention is all you need?",
      id: "5ab758b8-1cf3-4f77-9eb9-72484408cc21",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:37:35.942155",
      created_by: "User-Alpha",
    },
    {
      role: "assistant",
      content:
        '**Analysis of Context Documents**\nBased on the provided context documents, the phrase "attention is all you need" appears to be related to the concept of attention mechanisms in artificial intelligence, specifically in the context of natural language processing and deep learning.\n\n**Synthesis of Information**\nThe context documents discuss various topics, including social cognition, law, and neuroscience. However, one of the documents mentions the Transformer model, which is a type of neural network architecture that relies heavily on attention mechanisms. The document states that "many of the attention heads exhibit behaviour that seems related to the structure of the sentence" and provides examples of attention heads performing different tasks.\n\n**Relevant Information**\nWhile the context documents do not explicitly explain the phrase "attention is all you need," they do provide some insight into the importance of attention mechanisms in AI models. The Transformer model, which is mentioned in the documents, uses attention mechanisms to focus on specific parts of the input data, allowing it to better understand the context and relationships between different elements.\n\n**Conclusion**\nBased on the provided context documents, it appears that "attention is all you need" may be a reference to the Transformer model and the importance of attention mechanisms in AI. However, without more context or information, it is difficult to provide a more specific or detailed answer.\n\n**Limitation**\nIt\'s essential to note that the context documents do not provide a direct answer to the question "attention is all you need?" and the information provided is limited to the discussions on attention mechanisms in AI models. If more context or specific details were provided, I would be better equipped to offer a more comprehensive response. \n\n**Direct Answer to User\'s Question**\nBased on the provided documents, I can infer that "attention is all you need" might be related to the concept of attention mechanisms being crucial for understanding and processing information in AI models, particularly in natural language processing tasks.',
      id: "4a472f88-9e59-4b48-b20f-176f3782ca2c",
      collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
      created_at: "2025-07-11T10:37:36.066071",
      created_by: "User-Alpha",
    },
  ],
};
