import AsyncStorage from 'react-native-async-storage/async-storage';

export const storeLikedRoutes = async (listOfRoutes) => {
  try {
    const stringifiedListOfRoutes = JSON.stringify(listOfRoutes);
    await AsyncStorage.setItem('likedRoutes', stringifiedListOfRoutes);  
  } catch (e) {
    // saving error
  }
};

export const getLikedRoutes = async () => {
  try {
    const listOfRoutes = await AsyncStorage.getItem('likedRoutes');
    return listOfRoutes != null ? JSON.parse(listOfRoutes) : null;
  } catch (e) {
    // error reading value
  }
};