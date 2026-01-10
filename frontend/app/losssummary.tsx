import React from 'react';
import { LossEntryLayout } from './components/loss/LossEntryLayout';

export default function LossSummaryRelationshipsScreen() {
  return (
    <LossEntryLayout
      type="RELATIONSHIP"
      title="Who have you lost?"
      subtitle="Relationships"
      description="Acknowledging these bonds is a powerful step. Add the people or pets you are grieving for."
      inputLabel="Who did you lose?"
      placeholder="e.g., My Mother, Best Friend, Dog"
      nextRoute="/losssummarythings"
    />
  );
}
