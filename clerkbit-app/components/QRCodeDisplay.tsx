// QRCodeDisplay.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

type QRCodeDisplayProps = {
  value: string;
  size?: number;
};

export function QRCodeDisplay({ value, size = 500 }: QRCodeDisplayProps) {
  if (!value) return null;

  return (
    <View style={styles.container}>
      <QRCode value={value} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
