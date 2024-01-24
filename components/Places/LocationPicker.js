import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View, Text } from "react-native";
import OutlinedBtn from "../UI/OutlinedBtn";
import { Colors } from "../../constants/colors";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { getAddress, getMapPreview } from "../../util/location";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

const LocationPicker = ({ onPickLocation }) => {
  const [pickedLocation, setPickedLocation] = useState();
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        onPickLocation({ ...pickedLocation, address: address });
      }
    }
    handleLocation();
  }, [pickedLocation, onPickLocation]);

  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    } else if (
      locationPermissionInformation.status === PermissionStatus.DENIED
    ) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app"
      );
      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  return (
    <View>
      <View style={styles.mapPrev}>
        {pickedLocation ? (
          <Image
            style={styles.img}
            source={{
              uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
            }}
          />
        ) : (
          <Text>No location picked yet.</Text>
        )}
      </View>
      <View style={styles.actions}>
        <OutlinedBtn onPress={getLocationHandler} icon="location">
          Locate User
        </OutlinedBtn>
        <OutlinedBtn onPress={pickOnMapHandler} icon="map">
          Pick on Map
        </OutlinedBtn>
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  mapPrev: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: Colors.primary100,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
});
