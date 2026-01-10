import React, { useState, useCallback, useEffect, memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import { THEME } from '../../constants/theme';
import { debounce } from 'lodash';

interface JournalEditorProps {
    initialTitle?: string;
    initialContent?: string;
    onEntryChange: (title: string, content: string) => void;
    currentDate: string;
}

export const JournalEditor = memo(({ initialTitle = "", initialContent = "", onEntryChange, currentDate }: JournalEditorProps) => {
    const colors = THEME.COLORS;

    // Local state for immediate UI feedback (Controlled by this component)
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

    const [isTitleFocused, setIsTitleFocused] = useState(false);
    const [isContentFocused, setIsContentFocused] = useState(false);

    // Debounce the callback to parent to avoid re-rendering the whole screen on every keystroke
    const debouncedNotifyParent = useCallback(
        debounce((newTitle: string, newContent: string) => {
            onEntryChange(newTitle, newContent);
        }, 300),
        [onEntryChange]
    );

    // Update parent when local state changes
    useEffect(() => {
        debouncedNotifyParent(title, content);
        // Cancel debounce on unmount
        return () => {
            debouncedNotifyParent.cancel();
        };
    }, [title, content, debouncedNotifyParent]);

    return (
        <View
            className={`bg-white rounded-3xl p-5 mb-6 border-2 transition-all shadow-sm ${isContentFocused ? 'border-purple-200 shadow-md' : 'border-transparent'}`}
            style={{
                shadowColor: isContentFocused ? colors.purpleSoft : "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isContentFocused ? 0.15 : 0.05,
                shadowRadius: 12,
                elevation: 4
            }}
        >
            {/* Date Badge */}
            <View className="flex-row justify-between items-center mb-4">
                <View className="bg-gray-50 px-3 py-1.5 rounded-full flex-row items-center">
                    <FontAwesome6 name="calendar" size={12} color={colors.secondary} />
                    <Text className="text-gray-500 text-xs font-semibold ml-2 uppercase tracking-wide">
                        {currentDate}
                    </Text>
                </View>
            </View>

            {/* Title Input */}
            <TextInput
                className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100"
                placeholder="Give this moment a title (optional)"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                onFocus={() => setIsTitleFocused(true)}
                onBlur={() => setIsTitleFocused(false)}
            />

            {/* Content Input */}
            <TextInput
                className="text-base text-gray-700 leading-7 min-h-[300px]"
                style={{ textAlignVertical: "top" }}
                placeholder="Take a deep breath. How are you really feeling? There is no right or wrong way to grieve..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={content}
                onChangeText={setContent}
                maxLength={1500}
                onFocus={() => setIsContentFocused(true)}
                onBlur={() => setIsContentFocused(false)}
            />

            {/* Character Count (Uses local state for immediate feedback) */}
            <View className="flex-row justify-end mt-2">
                <Text className={`text-xs font-medium ${content.length > 1500 ? 'text-red-400' : 'text-gray-300'}`}>
                    {content.length} / 1500 characters (min 50)
                </Text>
            </View>
        </View>
    );
});
