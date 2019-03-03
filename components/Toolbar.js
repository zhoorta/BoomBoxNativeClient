import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Button, Icon } from 'react-native-elements'


export default class Toolbar extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    return (

        <View style={styles.container}>
          <View style={styles.imagecontainer}>
            <Image source={require('../assets/logo.png')}/>
          </View>
          <View>
            { this.props.show.local === true ?
              <Button
              icon={<Icon name='explore' size={30} color="#ff9922" />}
              type="clear"
              onPress={() => this.props.navigate('server')} 
              buttonStyle={{ borderRadius: 20, borderWidth: 0, height: 50, width: 50}}
              />
              :
              <Button
              icon={<Icon name='eject' size={30} color="#ff9922" />}
              type="clear"
              onPress={() => this.props.navigate('local')} 
              buttonStyle={{ borderRadius: 20, borderWidth: 0, height: 50, width: 50}}
              />
            }
            
          </View>

        </View>
    );

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: '#de0000',
    color:'#ff9922',
    height: 75,
    padding: 10,
    marginBottom: 20
  },
  imagecontainer: {
    marginTop: 10
  }
});