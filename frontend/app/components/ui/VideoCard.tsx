import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { THEME } from '../../constants/theme';

interface VideoCardProps {
    videoId: string;
    height?: number; // Kept for compatibility but we rely on aspect-ratio now mostly
}

export const VideoCard = ({ videoId, height = 220 }: VideoCardProps) => {
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);

    const onStateChange = useCallback((state: string) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    const onReady = () => {
        setLoading(false);
    }

    return (
        <View className="bg-black rounded-xl overflow-hidden mb-6 relative shadow-md w-full aspect-video">
            {/* 
                YoutubePlayer needs to be carefully handled in ScrollViews.
                Using webview implementation via react-native-youtube-iframe.
            */}
            {loading && (
                <View className="absolute inset-0 items-center justify-center z-10 bg-gray-900">
                    <ActivityIndicator size="large" color={THEME.COLORS.primary} />
                </View>
            )}

            <YoutubePlayer
                height={height}
                play={playing}
                videoId={videoId}
                onChangeState={onStateChange}
                onReady={onReady}
                webViewProps={{
                    allowsFullscreenVideo: true
                }}
            />
        </View>
    );
};
