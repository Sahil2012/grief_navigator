import React from 'react';
import { LossEntryLayout } from './components/loss/LossEntryLayout';

export default function LossSummaryThingsScreen() {
  return (
    <LossEntryLayout
      type="THING"
      title="Loss Summary"
      subtitle="Things"
      description="Describe things (property, photos, finances) that you have lost."
      inputLabel="What did you lose?"
      placeholder="Thing (property, photos, finances)"
      nextRoute="/losssummaryidentity"
    />
  );
}
