import React from 'react';
import { LossEntryLayout } from './components/loss/LossEntryLayout';

export default function LossSummaryIdentityScreen() {
  return (
    <LossEntryLayout
      type="IDENTITY"
      title="Loss Summary"
      subtitle="Identity"
      description="Describe aspects of identity (roles, activities, abilities) that you have lost."
      inputLabel="What aspect of identity?"
      placeholder="Identity (roles, activities, abilities)"
      nextRoute="/losssummaryreview"
    />
  );
}
