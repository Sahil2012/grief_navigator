package com.grief.backend.mapper;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.grief.backend.generated.model.dto.JournalEntryDTO;
import com.grief.backend.model.activities.JournalEntry;

@Mapper(componentModel = "spring")
public interface JournalMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "appUser", ignore = true)
    @Mapping(target = "relatedLoss", ignore = true)
    @Mapping(target = "cognitiveDistortionsJson", ignore = true)
    @Mapping(target = "privateToUser", ignore = true)
    @Mapping(target = "entryDate", source = "entryDate")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateJournalEntryFromDTO(JournalEntryDTO dto, @MappingTarget JournalEntry entity);

    @Mapping(target = "relatedLossId", source = "relatedLoss.id")
    @Mapping(target = "entryDate", source = "entryDate")
    JournalEntryDTO toDTO(JournalEntry entity);

    default OffsetDateTime mapOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime == null ? null : OffsetDateTime.of(localDateTime, ZoneOffset.UTC);
    }

    default LocalDateTime mapLocalDateTime(OffsetDateTime offsetDateTime) {
        return offsetDateTime == null ? null : LocalDateTime.from(offsetDateTime);
    }
}
