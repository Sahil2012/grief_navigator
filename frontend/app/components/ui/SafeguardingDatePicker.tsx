import React from 'react';
import { Modal, Text, TouchableOpacity, View, Platform } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/theme';
import dayjs from 'dayjs';

interface SafeguardingDatePickerProps {
    visible: boolean;
    onClose: () => void;
    mode: 'single' | 'range';
    date?: DateType;
    startDate?: DateType;
    endDate?: DateType;
    onDateChange: (params: { date?: DateType; startDate?: DateType; endDate?: DateType }) => void;
    title?: string;
    onConfirm?: () => void;
}

export const SafeguardingDatePicker = ({
    visible,
    onClose,
    mode,
    date,
    startDate,
    endDate,
    onDateChange,
    title = "Select Date",
    onConfirm
}: SafeguardingDatePickerProps) => {

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            onClose();
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/60 justify-center items-center px-5 relative">
                {/* Backdrop Touch to Close */}
                <TouchableOpacity
                    className="absolute inset-0 w-full h-full"
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View className="bg-white rounded-[32px] p-6 w-full shadow-2xl overflow-hidden relative z-10 w-full max-w-sm">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-textDark tracking-tight">
                            {title}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                        >
                            <Ionicons name="close" size={20} color={THEME.COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Calendar */}
                    <View className="mb-2">
                        <DateTimePicker
                            mode={mode}
                            date={date}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={onDateChange}
                            navigationPosition="right"
                            styles={{
                                header: {
                                    marginBottom: 10,
                                },
                                month_selector_label: {
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: THEME.COLORS.textDark,
                                },
                                year_selector_label: {
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: THEME.COLORS.textDark,
                                },
                                day_label: {
                                    fontSize: 15,
                                    color: THEME.COLORS.textDark,
                                },
                                selected_label: {
                                    color: '#FFF',
                                    fontWeight: '700',
                                },
                                weekday_label: {
                                    color: THEME.COLORS.textSecondary,
                                    fontSize: 13,
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                },
                                selected: {
                                    backgroundColor: THEME.COLORS.teal,
                                    borderRadius: 50,
                                },
                                range_start: {
                                    backgroundColor: THEME.COLORS.teal,
                                    borderRadius: 0,
                                    borderTopLeftRadius: 50,
                                    borderBottomLeftRadius: 50,
                                },
                                range_end: {
                                    backgroundColor: THEME.COLORS.teal,
                                    borderRadius: 0,
                                    borderTopRightRadius: 50,
                                    borderBottomRightRadius: 50,
                                },
                                range_middle: {
                                    backgroundColor: `${THEME.COLORS.teal}20`,
                                },
                                today: {
                                    borderColor: THEME.COLORS.teal,
                                    borderWidth: 1,
                                }
                            }}
                        />
                    </View>

                    {/* Footer Actions */}
                    <TouchableOpacity
                        onPress={handleConfirm}
                        className="bg-teal-500 rounded-2xl py-4 items-center shadow-lg shadow-teal-200 mt-4 active:bg-teal-600"
                    >
                        <Text className="text-white font-bold text-lg tracking-wide">Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
