import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {

  render() {
     const {count} = this.state
     const {color, size} = this.props

     return (
       <Text style={{color, fontSize: size}}>
         {count}
       </Text>
     )
   }
 }
