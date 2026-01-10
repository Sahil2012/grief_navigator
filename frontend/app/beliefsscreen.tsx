import React from "react";
import { lossService } from "./services/api/lossService";
import { StatementAssessmentLayout } from "./components/assessment/StatementAssessmentLayout";

export default function BeliefsScreen() {
  return (
    <StatementAssessmentLayout
      type="BELIEF"
      title="Your Beliefs"
      subtitle="Reflections"
      description="Rate how strongly you agree or disagree with each statement. Connect each to a specific loss if you can."
      nextRoute="/beliefsreview"
      fetchStatements={lossService.getBeliefStatements}
      backRoute="/assessmentchecklist"
    />
  );
}
