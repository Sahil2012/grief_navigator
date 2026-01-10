import { useLossStore, LossRow } from '../store/lossStore';

export type LossType = 'RELATIONSHIP' | 'IDENTITY' | 'THING';

export const useLossLogic = (type: LossType) => {
    // Select the appropriate slice based on type
    const losses = useLossStore(state => {
        switch (type) {
            case 'RELATIONSHIP': return state.relationshipLosses;
            case 'IDENTITY': return state.identityLosses;
            case 'THING': return state.thingLosses;
        }
    });

    const addLoss = useLossStore(state => {
        switch (type) {
            case 'RELATIONSHIP': return state.addRelationshipLoss;
            case 'IDENTITY': return state.addIdentityLoss;
            case 'THING': return state.addThingLoss;
        }
    });

    const removeLoss = useLossStore(state => {
        switch (type) {
            case 'RELATIONSHIP': return state.removeRelationshipLoss;
            case 'IDENTITY': return state.removeIdentityLoss;
            case 'THING': return state.removeThingLoss;
        }
    });

    return {
        losses,
        addLoss,
        removeLoss,
    };
};
