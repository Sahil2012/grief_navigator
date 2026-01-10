import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalTermsProps {
  visible: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

const ModalTerms: React.FC<ModalTermsProps> = ({ visible, onAccept, onCancel }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onCancel}
  >
    <View className="flex-1 bg-black/50 justify-center items-center px-4">
      <View className="w-full bg-white rounded-2xl p-6 max-w-xl">
        <Text className="text-xl font-bold text-textDark mb-4">Terms & Conditions</Text>
        <Text className="text-textSecondary mb-6">
          Here are some sample terms and conditions. You can put any policy or agreement text here. Make sure to scroll and review!
        </Text>
        <View className="flex-row justify-end space-x-2 gap-3">
          <TouchableOpacity
            onPress={onCancel}
            className="px-5 py-3 rounded-xl bg-gray-200"
          >
            <Text className="text-textDark font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAccept}
            className="px-5 py-3 rounded-xl bg-primary"
          >
            <Text className="text-white font-semibold">Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ModalTerms;
