import React from 'react'
import { StyleSheet, Text, View, Image, ToolbarAndroid } from 'react-native'
import { ButtonGroup } from 'react-native-elements'


export default class Toolbar extends React.Component {

  constructor(props) {
    super(props)
    this.state = { selectedIndex: 0 }
  }

  updateIndex = (selectedIndex) => {
    console.log('updateIndex',selectedIndex)
    if(selectedIndex===0) this.props.navigate('local')
    else if(selectedIndex===1) this.props.navigate('server')
    else if(selectedIndex===2) this.props.navigate('player')
    this.setState({selectedIndex: selectedIndex})
  }

  onActionSelected = (position) => {
    if(position===0) this.props.navigate('local')
    else if(position===1) this.props.navigate('server')
    else if(position===2) this.props.navigate('server-all')
  }



  render() {

    const buttons = ['Home', 'Server', 'Player']
    const { selectedIndex } = this.state

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title=""
          logo={require("../assets/logo.png")}
          onActionSelected={(position) => this.onActionSelected(position)}
          titleColor= "#fff"
          actions = {[
            {title: "Home", show: "never"},
            {title: "Server", show: "never"},
            {title: "Server (more)", show: "never"},
          ]}
        />
        <View>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            innerBorderStyle={{ width:0, color:'#000' }}
            containerStyle={{height: 50, backgroundColor: '#de0000', borderColor: '#de0000', elevation:3, marginBottom: 0, marginLeft: 0, marginRight: 0}}
            textStyle={{fontFamily: 'Oswald', fontSize: 12, color:'#000'}}
            selectedTextStyle={{fontFamily: 'Oswald', fontSize: 12, color:'#000'}}
            selectedButtonStyle={{backgroundColor: '#ff9922'}}
          />
        </View>
      </View>
    )

  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#de0000',
  },   
  toolbar: {
    backgroundColor: '#de0000',
    height: 60,
    alignSelf: 'stretch',
    textAlign: 'center',
    }, 
});