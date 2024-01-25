import { findFocusedRoute } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

const db = SQLite.openDatabase("places.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS places (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          imageUri TEXT NOT NULL,
          address TEXT NOT NULL,
          lat REAL NOT NULL,
          lng REAL NOT NULL
        )`,
        [], // Empty array for parameters
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}

export function inserPlace(place) {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
        [
          place.title,
          place.imageUri,
          place.address,
          place.location.lat,
          place.location.lng,
        ],
        (_, result) => {
          console.log(result);
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchPlaces() {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM places`,
        [],
        (_, result) => {
          const places = [];

          for (let i = 0; i < result.rows.length; i++) {
            const dp = result.rows.item(i);
            places.push(
              new Place(
                dp.title,
                dp.imageUri,
                {
                  address: dp.address, // Fixed the property name
                  lat: dp.lat,
                  lng: dp.lng,
                },
                dp.id
              )
            );
          }

          resolve(places);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

// export function fetchPlaces() {
//   const promise = new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `SELECT * FROM places`,
//         [],
//         (_, result) => {
//           const rows = result.rows;
//           const places = [];

//           for (let i = 0; i < rows.length; i++) {
//             places.push(rows.item(i));
//           }

//           console.log(places);
//           resolve(places);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });

//   return promise;
// }

export function fetchPlaceDetails(id) {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM places WHERE id = ?`,
        [id],
        (_, result) => {
          const dbPlace = result.rows._array[0];
          const place = new Place(
            dbPlace.title,
            dbPlace.imageUri,
            { lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address },
            dbPlace.id
          );
          resolve(place);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
}
