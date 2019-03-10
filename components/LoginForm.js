import React from 'react'
import { StyleSheet, View, Text, TextInput, Button } from 'react-native'

export default class LoginForm extends React.Component {

	constructor(props) {
		super(props)
		this.state = { 
			server: '', 
			apikey: '' 
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ server: nextProps.server, apikey: nextProps.apikey })
	}

	render() {

	  	
	    return (
			<View style={styles.container}>
				<Text style={styles.label}>Server</Text>
				<TextInput
			        style={styles.textinput}
			        onChangeText={(server) => this.setState({ server: server})}
			        value={this.state.server}
		      	/>
		      	<Text style={styles.label}>API Key</Text>
				<TextInput
			        style={styles.textinput}
			        onChangeText={(apikey) => this.setState({ apikey: apikey})}
			        value={this.state.apikey}
		      	/>
		      	<Button
				  onPress={() => this.props.onLogin(this.state.server,this.state.apikey)}
				  style={styles.button}
				  title="Login"
				/>
			</View>

	    )
	}


}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Oswald',
    backgroundColor: '#00dede',
  },
  label: {
  	fontFamily: 'Oswald',
  	margin: 10,
  },
  textinput: {
  	fontFamily: 'Oswald',
  	height: 40, 
  	margin: 10,
  	borderColor: 'gray', 
  	borderWidth: 1
  },
  button: {
  	fontFamily: 'Oswald',
    backgroundColor: '#de0000',
    padding: 20,
    margin: 10
  },
});