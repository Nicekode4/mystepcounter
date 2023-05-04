import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Device from 'expo-device';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';
import { Accelerometer } from 'expo-sensors';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';




export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [speed,setSpeed] = useState(5)
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    (async () => {
          const requestActivityPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert("Start walking");
    } else {
      Alert.alert("permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setSpeed(location.coords.speed)
    })();
  }, []);
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = location.coords.speed
  }
  let subscription = null;
  let steps = 0;
  let lastX = 0;
  let lastY = 0;
  let lastZ = 0;
  
  Accelerometer.addListener(accelerometerData => {
    const { x, y, z } = accelerometerData;
    console.log(accelerometerData);
    const deltaX = Math.abs(lastX - x);
    const deltaY = Math.abs(lastY - y);
    const deltaZ = Math.abs(lastZ - z);
  
    if (deltaX > 1 && deltaY > 1 || deltaX > 1 && deltaZ > 1 || deltaY > 1 && deltaZ > 1) {
      steps += 1;
    }
  
    lastX = x;
    lastY = y;
    lastZ = z;
  
    setCurrentStepCount(currentStepCount + steps)
  });
  
  Accelerometer.setUpdateInterval(100);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Du har taget {currentStepCount} skridt</Text>
      <Text style={styles.text}>Du har gået i gns {speed ? speed.toFixed(1) : 1} km i timen</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: "white",
    fontSize: 25
  }
});
