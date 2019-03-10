import React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { Avatar, Button, Icon, Image, Overlay, Divider } from 'react-native-elements'

export default class ServerRequestForm extends React.Component {

	constructor(props) {
		super(props)
		this.state = { 
      isVisible: false,
			url: ''
    }
  }


  hideOptions = () => {
    this.setState({ isVisible: false })
  }

  getInfo = (url) => {
    this.props.requestYouTubeInfo(this.state.url)
    this.setState({ isVisible: true })
  }

  requestDownload = (url) => {
    this.props.requestYouTubeDownload(this.state.url)
    this.hideOptions()
  }

	render() {

	  	
	    return (
        <View>
    			<View style={styles.redcard}>
    				<View style={styles.orangecard}>
    					<Text style={styles.label}>YouTube Link</Text>
    					<TextInput
    				        style={styles.textinput}
    				        onChangeText={(url) => this.setState({ url: url})}
    				        value={this.state.url}
    			      	/>
    			      	<Button
    			      	  onPress={() => this.getInfo(this.state.url)}
    					  style={styles.button}
    					  title="Get Info"
    					/>
    				</View>
          </View>
    		

          <Overlay isVisible={this.state.isVisible} onBackdropPress={() => this.hideOptions()}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>

              <View style={{padding: 10, height: 150}}>
                <Text style={styles.title}>{this.props.info.title}</Text>
              </View>
              
              <View style={{padding: 10, height: 150}}>
                <Button
                  onPress={() => this.requestDownload(this.props.url)} 
                  icon={<Icon name='file-download' color='#000' />}
                  buttonStyle={{ backgroundColor: '#ff9922' }}
                  title="&nbsp;&nbsp;&nbsp;Download to Server"
                />
                <Button
                  onPress={() => this.hideOptions()} 
                  icon={<Icon name='close' color='#fff' />}
                  buttonStyle={{ marginTop: 20 }}
                  title="&nbsp;&nbsp;&nbsp;Cancel"
                />
              </View>
            </View>
          </Overlay>


        </View>

	    )
	}


}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Oswald',
    backgroundColor: '#00dede',
  },
  title: {
    fontFamily: 'Oswald',
    fontSize: 16,
  },
  label: {
  	fontFamily: 'Oswald',
  	fontSize: 16,
  },
  textinput: {
  	fontFamily: 'Oswald',
  	height: 40, 
  	borderColor: 'gray', 
  	borderWidth: 1,
  	marginBottom: 10
  },
  button: {
  	fontFamily: 'Oswald',
    backgroundColor: '#de0000',
    padding: 20,
    margin: 10
  },
  redcard: {
    fontFamily: 'Oswald',
    backgroundColor: '#de0000',
    padding: 20,
    margin: 10
  },
  orangecard: {
    fontFamily: 'Oswald',
    backgroundColor: '#ff9922',
    padding: 20,
    marginBottom: 10
  }
});