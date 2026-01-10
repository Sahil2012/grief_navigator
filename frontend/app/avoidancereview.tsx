import React from 'react';
import { router } from 'expo-router';
import { StatementReviewLayout } from './components/assessment/StatementReviewLayout';
import { lossService, AvoidenceEntryDTO } from './services/api/lossService';
import { cygeService, CompletionStatus } from './services/api/cygeService';
import { useLossStore } from './store/lossStore';

export default function AvoidanceReviewScreen() {
    const avoidanceAnswers = useLossStore(state => state.avoidanceAnswers);

    const handleSave = async () => {
        const entries: AvoidenceEntryDTO[] = avoidanceAnswers.map(ans => ({
            avoidenceStatementId: ans.statementId,
            rating: ans.rating,
            relatedLoss: ans.relatedLossId
        }));

        await lossService.saveAvoidenceEntries(entries);
        await cygeService.complete(CompletionStatus.FAMILY_CONFLICT_PENDING);

        // Use replace to remove review from stack
        router.replace('/familyconflictscreen' as any);
    };

    return (
        <StatementReviewLayout
            title="Reflection"
            subtitle="Avoidance"
            message="Facing these feelings is brave. You are moving through the avoidance toward healing."
            quote={{
                text: "The only way out is through.",
                author: "Robert Frost"
            }}
            onSave={handleSave}
        />
    );
}
