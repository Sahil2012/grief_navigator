import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

const Header = () => {
  return (
    <View className="flex-row items-center mb-15">
      <View className="w-10 h-10 bg-primary rounded-xl items-center justify-center mr-2">
        <Text className="text-white font-bold text-2xl">P</Text>
      </View>
      <Image
        source={require('../../assets/images/headline.png')}
        style={{ width: 220, height: 50, resizeMode: 'contain' }}
      />
      {/* <Text className="text-[22px] font-bold text-textDark">Practising Good Grief</Text> */}
    </View>
  );
}

export default Header;
