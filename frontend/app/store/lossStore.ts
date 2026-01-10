import { create } from "zustand";

export type LossRow = {
  title: string;      // identityAspect, relationship, item lost, etc.
  timeAgo: string;
  difficulty: number;
};

export type DifficultTimeRow = {
  dayOrTime: string;
  difficulty: number;
  relatedLoss: string; // Description of the related loss
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

  beliefAnswers: AssessmentAnswer[];
  avoidanceAnswers: AssessmentAnswer[];
  currentBeliefIndex: number;
  currentAvoidanceIndex: number;

  // Relationship
  addRelationshipLoss: (item: LossRow) => void;
  removeRelationshipLoss: (index: number) => void;

  // Identity
  addIdentityLoss: (item: LossRow) => void;
  removeIdentityLoss: (index: number) => void;

  // Things
  addThingLoss: (item: LossRow) => void;
  removeThingLoss: (index: number) => void;

  // Difficult Times
  addDifficultTime: (item: DifficultTimeRow) => void;
  removeDifficultTime: (index: number) => void;

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

  // Identity
  addIdentityLoss: (item) =>
    set((state) => ({
      identityLosses: [...state.identityLosses, item],
    })),
  removeIdentityLoss: (index) =>
    set((state) => ({
      identityLosses: state.identityLosses.filter((_, i) => i !== index),
    })),

  // Things
  addThingLoss: (item) =>
    set((state) => ({
      thingLosses: [...state.thingLosses, item],
    })),
  removeThingLoss: (index) =>
    set((state) => ({
      thingLosses: state.thingLosses.filter((_, i) => i !== index),
    })),

  // Difficult Times
  addDifficultTime: (item) =>
    set((state) => ({
      difficultTimes: [...state.difficultTimes, item],
    })),
  removeDifficultTime: (index) =>
    set((state) => ({
      difficultTimes: state.difficultTimes.filter((_, i) => i !== index),
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
      beliefAnswers: [],
      avoidanceAnswers: [],
    }),
}));
