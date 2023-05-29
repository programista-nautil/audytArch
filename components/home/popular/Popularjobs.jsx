import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './popularjobs.style';
import { SIZES } from '../../../constants';

const Popularjobs = () => {
  const navigation = useNavigation();

  const data = [
  { id: 1, title: '1.OTOCZENIE ZEWNĘTRZNE', icon: require('../../../assets/images/zew.png') },
	{ id: 2, title: '3.1.STREFA WEJSCIA', icon: require('../../../assets/images/strefaWej.jpg') },
  { id: 3, title: '3.2.POCHYLNIE', icon: require('../../../assets/images/ramp.jpg') },
	{ id: 4, title: '3.3.DOMOFON + 4.1.RECEPCJA', icon: require('../../../assets/images/reception.jpg') },
	{ id: 5, title: '4.2.KORYTARZE', icon: require('../../../assets/images/corridors.jpg') },
	{ id: 6, title: '5.1. KOMUNIKACJA PIONOWA', icon: require('../../../assets/images/stairs.jpg') },
	{ id: 7, title: '5.2.DZWIGI OSOBOWE + PLATFORMY', icon: require('../../../assets/images/elevator.jpg') },
	{ id: 8, title: '6. WC', icon: require('../../../assets/images/wc.jpg') },
	{ id: 9, title: '7.1. INNE POMIESZCZENIA', icon: require('../../../assets/images/rooms.jpg') },
	{ id: 10, title: '7.2. DRZWI WEWNĘTRZNE', icon: require('../../../assets/images/door.jpg') },
	{ id: 11, title: '8.OCHRONA PRZECIWPOŻAROWA', icon: require('../../../assets/images/fireproof.jpg') },
  ];

  const handleCardPress = (id) => {
    navigation.navigate(`card-details/${id}`); // Przenoszenie na nowy ekran o nazwie 'CardDetails'
  };

  const renderCard = ({ item }) => (
	<View style={[styles.cardContainer, { marginBottom: SIZES.large }]}>
	  <TouchableOpacity onPress={() => handleCardPress(item.id)}>
		<Image source={item.icon} style={styles.icon} />
		<Text style={styles.headerTitle}>{item.title}</Text>
	  </TouchableOpacity>
	</View>
  );

  return (
    <View>
      <FlatList data={data} renderItem={renderCard} keyExtractor={item => item.id.toString()} />
    </View>
  );
}

export default Popularjobs;