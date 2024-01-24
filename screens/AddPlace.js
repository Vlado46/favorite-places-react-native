import React from "react";
import PlaceForm from "../components/Places/PlaceForm";
import { inserPlace } from "../util/database";

const AddPlace = ({ navigation }) => {
  async function createPlaceHandler(place) {
    await inserPlace(place);
    navigation.navigate("AllPlaces");
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
};

export default AddPlace;
