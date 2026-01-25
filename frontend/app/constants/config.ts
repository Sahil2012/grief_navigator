export const API_BASE_URL = 'http://192.168.1.12:8080';

export const ENDPOINTS = {
    LOSS: {
        REGISTER: `${API_BASE_URL}/loss/register`,
        GET_ALL: `${API_BASE_URL}/loss`,
    },
    AUTH: {
        ME: `${API_BASE_URL}/auth/me`,
    },
    DIFFICULT_TIMES: {
        REGISTER: `${API_BASE_URL}/difficultTimes`,
    },
    BELIEF: {
        STATEMENTS: `${API_BASE_URL}/beliefStatement`,
        ENTRIES: `${API_BASE_URL}/beliefEntry`,
    },
    AVOIDANCE: {
        STATEMENTS: `${API_BASE_URL}/avoidenceStatement`,
        ENTRIES: `${API_BASE_URL}/avoidenceEntry`,
    },
    FAMILY_CONFLICT: {
        QUESTIONS: (sectionId: string) => `${API_BASE_URL}/familyConflict/${sectionId}`,
        ASSESSMENT_START: `${API_BASE_URL}/familyConflictAssessment/start`,
        ASSESSMENT_GET: `${API_BASE_URL}/familyConflictAssessment`,
        ASSESSMENT_COMPLETE: `${API_BASE_URL}/familyConflictAssessment/complete`,
        ANSWERS: `${API_BASE_URL}/familyConflict/answer`,
    },
    CYGE: {
        READINESS: `${API_BASE_URL}/profile/cyge/readiness`,
        COMPLETE: `${API_BASE_URL}/profile/cyge/complete`,
    },
    DAILY_CHECKIN: {
        SAVE: `${API_BASE_URL}/checkin`,
        STATUS: `${API_BASE_URL}/checkin/status`,
    },
    JOURNAL: {
        SAVE: `${API_BASE_URL}/journalEntry`,
        GET_ALL: `${API_BASE_URL}/journalEntry`,
        GET_ONE: `${API_BASE_URL}/journalEntry/{id}`,
        UPDATE: `${API_BASE_URL}/journalEntry/{id}`,
        DELETE: `${API_BASE_URL}/journalEntry/{id}`,
    },
    SANCTUARY_PLAN: {
        CREATE: `${API_BASE_URL}/sanctuaryPlan`,
        UPDATE: `${API_BASE_URL}/sanctuaryPlan/{id}`,
    },
    SUPPORT_TOOL: {
        CREATE: `${API_BASE_URL}/supportTool`,
    },
    GRIEF_DERAILER: {
        CREATE: `${API_BASE_URL}/griefDerailer`,
    },
    GRIEF_MILESTONE: {
        CREATE: `${API_BASE_URL}/griefMilestone`,
    },
};
