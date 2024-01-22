import React from "react";
import { StyleSheet, View } from "react-native";
import OutlinedBtn from "../UI/OutlinedBtn";
import { Colors } from "../../constants/colors";

const LocationPicker = () => {
  function getLocationHandler() {}

  function pickOnMapHandler() {}
  return (
    <View>
      <View style={styles.mapPrev}></View>
      <View style={styles.actions}>
        <OutlinedBtn icon="location">Locate User</OutlinedBtn>
        <OutlinedBtn icon="map">Pick on Map</OutlinedBtn>
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
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
