import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { Avatar, Card, ListItem, Button, Icon, Image } from 'react-native-elements'

import RNFetchBlob from 'rn-fetch-blob'


export default class DownloadTask extends Component {

	constructor() {
		super()
		this.state = { progress: 0 }
	}

	async componentDidMount() {
		this.startDownload(this.server)
	}


	startDownload() {

	    RNFetchBlob
	      .config({
	        path : RNFetchBlob.fs.dirs.CacheDir + '/' + this.props.task.id + '.ogg'
	      })
	      .fetch('GET', (this.props.server + '/content/' + this.props.task.id) , {
	        //some headers ..
	      })

	      .progress((received, total) => {
	      	this.setState({ progress: Math.round(100 * received / total)})
	      })
	      .then((res) => {

	        console.log('task #' + this.props.task.id + ' | File saved to ', res.path())
	        console.log('task #' + this.props.task.id + ' | finished')

	        this.props.onFinishDownload(this.props.task.id,res.path())
	        
	      })

	}   


	render() {


		return (   

			<View style={styles.orangecard}>    
				<View key={this.props.task.id} style={styles.rowcontainer}>
					<View>
					      <Avatar rounded source={{ uri: this.props.task.thumbnail_url }} style={styles.avatar}/>
					</View>
				</View>  
				<View>
					<Text style={styles.title}>{this.props.task.title}</Text>
					<Text style={styles.length}>{this.state.progress}% downloaded</Text>   
				</View>                        
 			</View>

		)
	}

}





const styles = StyleSheet.create({
  rowcontainer: {
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  title: {
  	fontFamily: 'Oswald',
    fontSize: 16,
  },
  length: {
  	fontFamily: 'Oswald',
    fontSize: 12
  },  
  avatar: {
    width: 50,
    height: 50
  },
  orangecard: {
  	fontFamily: 'Oswald',
    backgroundColor: '#ff9922',
    padding: 20,
    marginBottom: 10
  },  
});