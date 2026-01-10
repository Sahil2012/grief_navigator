import React, { memo } from 'react';
import { View, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LossDTO } from '../../services/api/lossService';
import { THEME } from '../../constants/theme';

interface LossSelectorProps {
    losses: LossDTO[];
    selectedLossId: number | null;
    onSelectLoss: (id: number | null) => void;
}

export const LossSelector = memo(({ losses, selectedLossId, onSelectLoss }: LossSelectorProps) => {
    const colors = THEME.COLORS;

    return (
        <View className="mb-8">
            <Text className="text-sm font-bold text-gray-900 mb-3 ml-1 uppercase tracking-wide opacity-70">
                Connect to a Loss
            </Text>
            <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                {Platform.OS === 'ios' ? (
                    <View className="p-1">
                        <Picker
                            selectedValue={selectedLossId}
                            onValueChange={onSelectLoss}
                            style={{ height: 140 }}
                            itemStyle={{ fontSize: 16, color: colors.dark }}
                        >
                            <Picker.Item label="Detailed reflection (No specific loss)" value={null} />
                            {losses.map((loss) => (
                                <Picker.Item
                                    key={loss.id}
                                    label={`${loss.description} (${loss.type})`}
                                    value={loss.id}
                                />
                            ))}
                        </Picker>
                    </View>
                ) : (
                    <Picker
                        selectedValue={selectedLossId}
                        onValueChange={onSelectLoss}
                        style={{ height: 55, backgroundColor: 'white' }}
                    >
                        <Picker.Item label="No specific loss related" value={null} color={colors.secondary} />
                        {losses.map((loss) => (
                            <Picker.Item
                                key={loss.id}
                                label={loss.description}
                                value={loss.id}
                                color={colors.dark}
                            />
                        ))}
                    </Picker>
                )}
            </View>
        </View>
    );
});
