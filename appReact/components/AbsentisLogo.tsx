import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Line, Path } from 'react-native-svg';

interface AbsentisLogoProps {
  size?: number;
}

export default function AbsentisLogo({ size = 100 }: AbsentisLogoProps) {
  const scale = size / 200;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        {/* Background Circle */}
        <Circle cx="100" cy="100" r="95" fill="#6366f1"/>
        
        {/* Calendar Icon */}
        <Rect x="50" y="60" width="100" height="90" rx="8" fill="white"/>
        
        {/* Calendar Header */}
        <Rect x="50" y="60" width="100" height="20" rx="8" fill="#818cf8"/>
        <Rect x="50" y="70" width="100" height="10" fill="#818cf8"/>
        
        {/* Calendar Rings */}
        <Circle cx="70" cy="60" r="5" fill="#818cf8"/>
        <Circle cx="100" cy="60" r="5" fill="#818cf8"/>
        <Circle cx="130" cy="60" r="5" fill="#818cf8"/>
        
        {/* Calendar Grid */}
        <Line x1="60" y1="90" x2="140" y2="90" stroke="#e0e7ff" strokeWidth="1"/>
        <Line x1="60" y1="105" x2="140" y2="105" stroke="#e0e7ff" strokeWidth="1"/>
        <Line x1="60" y1="120" x2="140" y2="120" stroke="#e0e7ff" strokeWidth="1"/>
        <Line x1="60" y1="135" x2="140" y2="135" stroke="#e0e7ff" strokeWidth="1"/>
        
        <Line x1="75" y1="80" x2="75" y2="150" stroke="#e0e7ff" strokeWidth="1"/>
        <Line x1="95" y1="80" x2="95" y2="150" stroke="#e0e7ff" strokeWidth="1"/>
        <Line x1="115" y1="80" x2="115" y2="150" stroke="#e0e7ff" strokeWidth="1"/>
        <Line x1="135" y1="80" x2="135" y2="150" stroke="#e0e7ff" strokeWidth="1"/>
        
        {/* Marked Days (X marks for absent days) */}
        <Path d="M 82 97 L 88 103 M 88 97 L 82 103" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
        <Path d="M 102 112 L 108 118 M 108 112 L 102 118" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
        <Path d="M 122 127 L 128 133 M 128 127 L 122 133" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
        
        {/* User Icon Overlay */}
        <Circle cx="140" cy="130" r="20" fill="#6366f1"/>
        <Circle cx="140" cy="125" r="7" fill="white"/>
        <Path d="M 128 143 Q 140 138 152 143" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
