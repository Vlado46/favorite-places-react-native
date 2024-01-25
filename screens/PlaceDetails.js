import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import OutlinedBtn from "../components/UI/OutlinedBtn";
import { Colors } from "../constants/colors";
import { fetchPlaceDetails } from "../util/database";

const PlaceDetails = ({ route, navigation }) => {
  const [placeDetails, setPlaceDetails] = useState(null);
  const selectedPlaceId = route.params.placeId;

  useEffect(() => {
    const loadPlaceData = async () => {
      try {
        const details = await fetchPlaceDetails(selectedPlaceId);
        setPlaceDetails(details);
      } catch (error) {
        console.log(error);
      }
    };
    loadPlaceData();
  }, [selectedPlaceId]);

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: placeDetails.location.lat,
      initialLng: placeDetails.location.lng,
    });
  }

  useEffect(() => {
    const loadPlaceData = async () => {
      try {
        const details = await fetchPlaceDetails(selectedPlaceId);
        setPlaceDetails(details);
        navigation.setOptions({
          title: details.title,
        });
      } catch (error) {
        console.log(error);
      }
    };
    loadPlaceData();
  }, [selectedPlaceId]);

  if (!placeDetails) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.img} source={{ uri: placeDetails.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{placeDetails.address}</Text>
        </View>
        <OutlinedBtn icon="map" onPress={showOnMapHandler}>
          View on map
        </OutlinedBtn>
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
