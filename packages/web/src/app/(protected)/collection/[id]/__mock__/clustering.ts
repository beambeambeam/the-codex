import { MOCK_DOCUMENT } from "@/app/(protected)/collection/[id]/__mock__/documents";

export const MOCK_CLUSTERING = {
  id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  title: "Attention Mechanism in AI",
  topics: [
    {
      id: "t1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
      title: "Foundational Concepts & Surveys",
      documents: [MOCK_DOCUMENT[0], MOCK_DOCUMENT[3]],
    },
    {
      id: "t2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d",
      title: "Efficient Attention Models",
      documents: [MOCK_DOCUMENT[1], MOCK_DOCUMENT[4]],
    },
    {
      id: "t3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e",
      title: "Attention in Computer Vision",
      documents: [
        MOCK_DOCUMENT[2], // An_Image_is_Worth_16x16_Words...
        MOCK_DOCUMENT[5], // Swin_Transformer...
      ],
    },
  ],
  documents: MOCK_DOCUMENT,
};
