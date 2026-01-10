import React from "react";
import { lossService } from "./services/api/lossService";
import { StatementAssessmentLayout } from "./components/assessment/StatementAssessmentLayout";

export default function GriefAvoidanceScreen() {
  return (
    <StatementAssessmentLayout
      type="AVOIDANCE"
      title="Grief Avoidance"
      subtitle="Behaviors"
      description="Rate how often you engage in these behaviors. Link each to a specific loss if possible."
      nextRoute="/avoidancereview"
      fetchStatements={lossService.getAvoidenceStatements}
      backRoute="/assessmentchecklist"
    />
  );
}
