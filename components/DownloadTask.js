import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'

export default class DownloadTask extends Component {

	constructor() {
		super()
		this.state = { progress: 0 }
		this._isMounted = false
	}

	async componentDidMount() {
		this._isMounted = true
		this.startDownload(this.server)
	}

	componentWillUnmount() {
    	this._isMounted = false
	}
		
	startDownload() {

		if(this._isMounted) {
		    RNFetchBlob
		      .config({
		        path : RNFetchBlob.fs.dirs.CacheDir + '/' + this.props.content.id + '.ogg'
		      })
		      .fetch('GET', (this.props.server + '/content/' + this.props.content.id) , {
		        //some headers ..
		      })

		      .progress((received, total) => {
		      	this.setState({ progress: Math.round(100 * received / total)})
		      })
		      .then((res) => {

		        console.log('task #' + this.props.content.id + ' | File saved to ', res.path())
		        console.log('task #' + this.props.content.id + ' | finished')

		        this.props.onFinishDownload(this.props.content.id,res.path())
		        
		      })
		}
	}   


	render() {

		return (
			<View style={styles.container}>
              <Text style={styles.title}>{this.props.content.title}</Text>
              <Text style={styles.length}>{this.state.progress}% downloaded</Text>
            </View>
			)
	}
}


const styles = StyleSheet.create({

  container: {
    flex: 1, 
    backgroundColor: '#00dede',
    padding: 10
  },  
  title: {
    //fontFamily: 'oswald',
    fontSize: 14
  },
  length: {
    //fontFamily: 'oswald',
    fontSize: 9
  },
});