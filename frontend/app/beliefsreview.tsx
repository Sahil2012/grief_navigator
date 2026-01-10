import React from 'react';
import { router } from 'expo-router';
import { StatementReviewLayout } from './components/assessment/StatementReviewLayout';
import { lossService, BeliefEntryDTO } from './services/api/lossService';
import { cygeService, CompletionStatus } from './services/api/cygeService';
import { useLossStore } from './store/lossStore';

export default function BeliefsReviewScreen() {
    const beliefAnswers = useLossStore(state => state.beliefAnswers);

    const handleSave = async () => {
        const entries: BeliefEntryDTO[] = beliefAnswers.map(ans => ({
            beliefStatementId: ans.statementId,
            rating: ans.rating,
            relatedLoss: ans.relatedLossId
        }));

        await lossService.saveBeliefEntries(entries);
        await cygeService.complete(CompletionStatus.AVOIDANCE_PENDING);

        // Use replace to remove review from stack
        router.replace('/griefavoidancescreen' as any);
    };

    return (
        <StatementReviewLayout
            title="Reflection"
            subtitle="Beliefs"
            message="Limiting beliefs can hold us back. You've taken a big step by identifying them."
            quote={{
                text: "Your beliefs become your thoughts, Your thoughts become your words, Your words become your actions.",
                author: "Mahatma Gandhi"
            }}
            onSave={handleSave}
        />
    );
}
