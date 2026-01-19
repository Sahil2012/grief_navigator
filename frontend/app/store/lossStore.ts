import { create } from "zustand";

export type LossRow = {
  id?: number;        // Added ID to track API ID
  title: string;      // identityAspect, relationship, item lost, etc.
  timeAgo: string;
  difficulty: number;
};

export type SupportItem = {
  id: string;
  lossId: string; // Link to specific loss
  name: string;
  impactOnPain: number; // -3 to 3
  accessibility: number; // -3 to 3
};

export type DifficultTimeRow = {
  id: string;
  dayOrTime: string;
  difficulty: number;
  relatedLoss: string; // Description of the related loss
  supports: SupportItem[];
};

export type AssessmentAnswer = {
  statementId: number;
  rating: number;
  relatedLossId: number;
};

type LossStore = {
  relationshipLosses: LossRow[];
  identityLosses: LossRow[];
  thingLosses: LossRow[];
  difficultTimes: DifficultTimeRow[];
  supports: SupportItem[]; // Global list of supports

  beliefAnswers: AssessmentAnswer[];
  avoidanceAnswers: AssessmentAnswer[];
  currentBeliefIndex: number;
  currentAvoidanceIndex: number;

  // Relationship
  addRelationshipLoss: (item: LossRow) => void;
  removeRelationshipLoss: (index: number) => void;
  setRelationshipLosses: (losses: LossRow[]) => void;

  // Identity
  addIdentityLoss: (item: LossRow) => void;
  removeIdentityLoss: (index: number) => void;
  setIdentityLosses: (losses: LossRow[]) => void;

  // Things
  addThingLoss: (item: LossRow) => void;
  removeThingLoss: (index: number) => void;
  setThingLosses: (losses: LossRow[]) => void;

  // Difficult Times
  addDifficultTime: (item: DifficultTimeRow) => void;
  removeDifficultTime: (id: string) => void;

  // Supports
  addSupport: (support: SupportItem) => void;
  removeSupport: (id: string) => void;

  // Assessments
  setBeliefAnswers: (answers: AssessmentAnswer[]) => void;
  setAvoidanceAnswers: (answers: AssessmentAnswer[]) => void;
  setCurrentBeliefIndex: (index: number) => void;
  setCurrentAvoidanceIndex: (index: number) => void;

  clearAll: () => void;
};

export const useLossStore = create<LossStore>((set) => ({
  relationshipLosses: [],
  identityLosses: [],
  thingLosses: [],
  difficultTimes: [],
  supports: [],
  beliefAnswers: [],
  avoidanceAnswers: [],
  currentBeliefIndex: 0,
  currentAvoidanceIndex: 0,

  // Relationship
  addRelationshipLoss: (item) =>
    set((state) => ({
      relationshipLosses: [...state.relationshipLosses, item],
    })),
  removeRelationshipLoss: (index) =>
    set((state) => ({
      relationshipLosses: state.relationshipLosses.filter((_, i) => i !== index),
    })),
  setRelationshipLosses: (losses) => set({ relationshipLosses: losses }),

  // Identity
  addIdentityLoss: (item) =>
    set((state) => ({
      identityLosses: [...state.identityLosses, item],
    })),
  removeIdentityLoss: (index) =>
    set((state) => ({
      identityLosses: state.identityLosses.filter((_, i) => i !== index),
    })),
  setIdentityLosses: (losses) => set({ identityLosses: losses }),

  // Things
  addThingLoss: (item) =>
    set((state) => ({
      thingLosses: [...state.thingLosses, item],
    })),
  removeThingLoss: (index) =>
    set((state) => ({
      thingLosses: state.thingLosses.filter((_, i) => i !== index),
    })),
  setThingLosses: (losses) => set({ thingLosses: losses }),

  // Difficult Times
  addDifficultTime: (item) =>
    set((state) => ({
      difficultTimes: [...state.difficultTimes, { ...item, supports: item.supports || [] }],
    })),
  removeDifficultTime: (id) =>
    set((state) => ({
      difficultTimes: state.difficultTimes.filter((dt) => dt.id !== id),
    })),

  // Supports
  addSupport: (support) =>
    set((state) => ({
      supports: [...state.supports, support]
    })),
  removeSupport: (id) =>
    set((state) => ({
      supports: state.supports.filter(s => s.id !== id)
    })),

  // Assessments
  setBeliefAnswers: (answers) => set({ beliefAnswers: answers }),
  setAvoidanceAnswers: (answers) => set({ avoidanceAnswers: answers }),
  setCurrentBeliefIndex: (index) => set({ currentBeliefIndex: index }),
  setCurrentAvoidanceIndex: (index) => set({ currentAvoidanceIndex: index }),

  // Clear all categories
  clearAll: () =>
    set({
      relationshipLosses: [],
      identityLosses: [],
      thingLosses: [],
      difficultTimes: [],
      supports: [],
      beliefAnswers: [],
      avoidanceAnswers: [],
    }),
}));
