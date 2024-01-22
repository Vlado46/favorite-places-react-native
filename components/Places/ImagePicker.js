import React, { useState } from "react";
import { View, Alert, Text, Image, StyleSheet } from "react-native"; // Import Image component
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Colors } from "../../constants/colors";
import OutlinedBtn from "../UI/OutlinedBtn";

const ImagePicker = () => {
  const [pickedImg, setPickedImg] = useState();

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "insufficient Permissions!",
        "You need to grant camera permissions to use this app"
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    setPickedImg(image.assets[0].uri);
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (pickedImg) {
    imagePreview = <Image style={styles.img} source={{ uri: pickedImg }} />; // Display the image using the Image component
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedBtn icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedBtn>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: Colors.primary100,
  },
  img: {
    width: "100%",
    height: "100%",
  },
});
