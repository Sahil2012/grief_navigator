import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { AppHeader } from "./components/ui/AppHeader";
import { JournalEntryCard } from "./components/journal/JournalEntryCard";
import { JournalHistorySkeleton } from "./components/journal/JournalHistorySkeleton";
import { journalService, JournalEntryDTO } from "./services/api/journalService";
import { THEME } from "./constants/theme";

type FilterType = 'week' | 'month' | 'all';

const JournalHistoryScreen: React.FC = () => {
    const router = useRouter();
    const colors = THEME.COLORS;

    const [entries, setEntries] = useState<JournalEntryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<FilterType>('all');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchEntries = useCallback(async (isRefresh = false, selectedFilter = filter) => {
        try {
            if (isRefresh) setLoading(true); // Only show full loader on explicit refresh/filter change

            let startDate: string | undefined;
            const endDate = new Date().toISOString().split('T')[0]; // Today

            if (selectedFilter === 'week') {
                const date = new Date();
                date.setDate(date.getDate() - 7);
                startDate = date.toISOString().split('T')[0];
            } else if (selectedFilter === 'month') {
                const date = new Date();
                date.setDate(date.getDate() - 30);
                startDate = date.toISOString().split('T')[0];
            }

            const currentPage = isRefresh ? 0 : page;
            const size = 10;

            const data = await journalService.getJournalEntries(startDate, endDate, currentPage, size);

            if (isRefresh) {
                setEntries(data);
                setPage(1); // Next page
            } else {
                setEntries(prev => [...prev, ...data]);
                setPage(prev => prev + 1);
            }

            if (data.length < size) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (error) {
            console.error("Failed to fetch journal history:", error);
            Alert.alert("Error", "Could not load journal history.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filter, page]);

    // Re-fetch when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            // Only fetch if entries are not empty or if we want to ensure fresh data
            // To update deleted items, we usually want to refresh.
            // Using true to force refresh state to clear potentially stale data
            fetchEntries(true, filter);
        }, [filter])
    );

    // Initial load handled by FocusEffect now, so we can probably remove the useEffect
    // or keep it if FocusEffect doesn't trigger on mount (it usually does).
    // Let's rely on FocusEffect.
    // useEffect(() => {
    //     setPage(0);
    //     setHasMore(true);
    //     fetchEntries(true, filter);
    // }, [filter]);

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(0);
        setHasMore(true);
        fetchEntries(true, filter);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchEntries();
        }
    };

    const renderFilterChip = (label: string, value: FilterType) => (
        <TouchableOpacity
            onPress={() => setFilter(value)}
            className={`px-4 py-2 rounded-full mr-2 ${filter === value ? 'bg-purple-600' : 'bg-white border border-gray-200'}`}
        >
            <Text className={`font-semibold text-xs ${filter === value ? 'text-white' : 'text-gray-600'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            <AppHeader title="Your Journey" showBack={false} />

            <View className="px-5 py-4">
                <View className="flex-row mb-4">
                    {renderFilterChip("All Time", 'all')}
                    {renderFilterChip("Last 7 Days", 'week')}
                    {renderFilterChip("Last 30 Days", 'month')}
                </View>
            </View>

            {loading && !refreshing && entries.length === 0 ? (
                <JournalHistorySkeleton />
            ) : (
                <FlatList
                    data={entries}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={({ item }) => <JournalEntryCard entry={item} />}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20 opacity-50">
                            <FontAwesome5 name="book-open" size={40} color={colors.secondary} />
                            <Text className="text-gray-500 mt-4 text-center font-medium">
                                No entries found for this period.
                            </Text>
                            <Text className="text-gray-400 text-sm center mt-1">
                                Start writing to see your history here.
                            </Text>
                        </View>
                    }
                    ListFooterComponent={
                        loading && !refreshing && entries.length > 0 ? (
                            <View className="py-4">
                                <ActivityIndicator size="small" color={colors.primary} />
                            </View>
                        ) : null
                    }
                />
            )}

            {/* Write New Entry FAB */}
            <TouchableOpacity
                onPress={() => router.push('/diary')}
                className="absolute bottom-6 right-5 w-14 h-14 bg-teal-500 rounded-full items-center justify-center shadow-lg"
                style={{
                    backgroundColor: colors.primary,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                }}
                activeOpacity={0.8}
            >
                <FontAwesome5 name="pen" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default JournalHistoryScreen;
