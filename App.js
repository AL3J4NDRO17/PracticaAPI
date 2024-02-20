import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const APP_ID = '4090239d69cdb3874de692fd18539299';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = [
          { name: 'Huejutla de Reyes, Hidalgo', coords: { latitude: 21.1361, longitude: -98.4189 } },
          { name: 'Pachuca, Hidalgo', coords: { latitude: 20.1011, longitude: -98.7591 } },
          { name: 'Ciudad de México', coords: { latitude: 19.4326, longitude: -99.1332 } },
          { name: 'Metepec', coords: { latitude: 19.262, longitude: -99.6052 } },
          { name: 'Tulancingo', coords: { latitude: 20.0838, longitude: -98.3624 } }
        ];

        const weatherPromises = locations.map(async location => {
          const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${APP_ID}`);
          const data = await response.json();
          return {
            location: location.name,
            description: data.weather[0].main,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            temperature: Math.floor(data.main.temp),
            date: getDate(),
          };
        });

        const weatherResults = await Promise.all(weatherPromises);
        setWeatherData(weatherResults);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, []);

  const getDate = () => {
    const date = new Date();
    return `${date.getDate()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {weatherData ? (
        weatherData.map((data, index) => (
          <View key={index} style={styles.weatherContainer}>
            <Text style={styles.location}>{data.location}</Text>
            <Text style={styles.text}>Description: {data.description}</Text>
            <Text style={styles.text}>Humidity: {data.humidity}%</Text>
            <Text style={styles.text}>Pressure: {data.pressure} hPa</Text>
            <Text style={styles.text}>Temperature: {data.temperature}°C</Text>
            <Text style={styles.text}>Date: {data.date}</Text>
          </View>
        ))
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  weatherContainer: {
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '80%',
  },
  location: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WeatherApp;