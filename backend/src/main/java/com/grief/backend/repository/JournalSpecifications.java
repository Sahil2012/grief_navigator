package com.grief.backend.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.grief.backend.model.activities.JournalEntry;

public class JournalSpecifications {

    public static Specification<JournalEntry> hasUser(Long userId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("appUser").get("id"), userId);
    }

    public static Specification<JournalEntry> hasDateRange(LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            if (startDate == null && endDate == null) {
                return null;
            }
            if (startDate != null && endDate != null) {
                return criteriaBuilder.between(root.get("entryDate"), startDate.atStartOfDay(),
                        endDate.plusDays(1).atStartOfDay());
            }
            if (startDate != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("entryDate"), startDate.atStartOfDay());
            }
            return criteriaBuilder.lessThan(root.get("entryDate"), endDate.plusDays(1).atStartOfDay());
        };
    }
}
