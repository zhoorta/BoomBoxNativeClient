import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, Button} from 'react-native';
import Sound from 'react-native-sound';


import Toolbar from './components/Toolbar.js'
import LocalContent from './components/LocalContent.js'
import RemoteContent from './components/RemoteContent.js'
import DownloadTask from './components/DownloadTask.js'
import FileBase from './services/FileBase.js'
import Utils from './services/Utils.js'


export default class App extends Component {

  constructor() {
    super()
    this.state = {
      show: { local: true, remote: false },
      server: 'http://172.104.149.192:1973',
      remote_content: [],
      local_content: [],
      tasks: [],
      player_id: '',
      player_status: '',
      player_filepath: ''
    }
    this.db = new FileBase('db.json')
    this.utils = new Utils()
  }


  async componentDidMount() {
    //validar se existe conexão a rede wifi!!!
    this.refreshLocalContent() 
  }


  refreshLocalContent = async () => {     
    var local_content = await this.db.read()
    //console.log('local_content',this.utils.returnContentByTag(local_content))
    this.setState({ local_content: local_content }) 
  }

  refreshRemoteContent = async () => {     
    //fetch(this.state.server + '/content/sort/by/tag')
    fetch(this.state.server + '/content')
      .then(response => response.json())
      .then(content => { 
        this.setState({ remote_content: content }) 
      })
  }



  downloadContent = async (id) => {

    var content_idx = this.state.remote_content.findIndex( (item) => {
      return item.id == id
    })


    var remote_content = this.state.remote_content
    var task = this.state.remote_content[content_idx]
    var tasks = this.state.tasks
    tasks.push(task)
    remote_content.splice(content_idx,1)
    this.setState({ tasks: tasks,  remote_content: remote_content })

    console.log('task | created')

  }

  onFinishDownload = async (id,filepath) => {

    var content_idx = this.state.remote_content.findIndex( (item) => { return item.id == id })
    var task_idx = this.state.tasks.findIndex( (item) => { return item.id == id })

    var content = this.state.tasks[task_idx]
    var local_content = this.state.local_content
    var tasks = this.state.tasks

    content.filepath = filepath
    local_content.push(content)
    tasks.splice(task_idx,1)
    
    this.db.write(local_content)
    this.setState({ local_content: local_content,  tasks: tasks })

    console.log('local_content | created')
    console.log(local_content)

  }



  navigate = (to) => {

    if(to === 'server')
    {
      this.refreshRemoteContent() 
      this.setState({ show: { local: false, remote: true }})
    }
    else {
      this.setState({ show: { local: true, remote: false }})
    }
    

  }

  playContent = async (id,filepath) => {

    this.setState({ 
      player_id: id,
      player_status: 'playing',
      player_filepath: filepath
    })
    
    console.log('[Play]', filepath);


    this.sound = new Sound(filepath, '', (error) => {
        if (error) {
            console.log('failed to load the sound', error);
            //Alert.alert('Notice', 'audio file error. (Error code : 1)');
            this.setState({player_status:'paused'});
        } else {
            this.setState({player_status:'playing'});
            this.sound.play(this.playComplete);
        }
    });

  }


  pauseContent = async () => {

    this.setState({ player_status: 'paused' })
    
    if(this.sound){
      this.sound.pause();
    }

  }


  playComplete = (success) => {
    if(this.sound){
      if (success) {
          console.log('successfully finished playing');
      } else {
          console.log('playback failed due to audio decoding errors');
          Alert.alert('Notice', 'audio file error. (Error code : 2)');
      }
      //this.setState({playState:'paused', playSeconds:0});
      this.sound.setCurrentTime(0);
    }
  }


  render() {
    return (

      <ScrollView style={styles.container}>

          <Toolbar show={this.state.show} navigate={this.navigate} />


          <Text>TASKS:</Text>
          { this.state.tasks.map((obj) =>
            <View key={obj.id} style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 1, marginTop:1, marginBottom: 3 }}>
              <DownloadTask server={this.state.server} content={obj} onFinishDownload={this.onFinishDownload} />
            </View>
          )}


          { this.state.show.remote ?
            <RemoteContent content={this.utils.returnContentByTag(this.state.remote_content)} navigate={this.navigate} downloadContent={this.downloadContent}/>
            : null
          }

          { this.state.show.local ?
            <LocalContent content={this.utils.returnContentByTag(this.state.local_content)} player_id={this.state.player_id} pauseContent={this.pauseContent} playContent={this.playContent}/>
            : null
          }

      </ScrollView>

    )
  }
}

/*
        <ScrollView>

          <View style={{flex: 1}}>
            <Text>TASKS:</Text>
            { this.state.tasks.map((obj) =>
              <View key={obj.id} style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 1, marginTop:1, marginBottom: 3 }}>
                <DownloadTask server={this.state.server} content={obj} onFinishDownload={this.onFinishDownload} />
              </View>
            )}
          </View>


        </ScrollView>
*/

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Oswald',
    backgroundColor: '#00dede',
  },
  headerview: {
    backgroundColor: '#de0000',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 150, 
  }, 
  playerview: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 20,
    backgroundColor: '#FFDA38',
  },

  inactiveItemStyle: {
    flex: 4, 
    backgroundColor: '#00dede',
    padding: 10
  },  
  activeItemStyle: {
    flex: 4, 
    //backgroundColor: '#FFDA38',
    backgroundColor: '#6fde00',
    padding: 10
  },  
  contentitemiconview: {
    flex: 1, 
    backgroundColor: 'steelblue',
    alignItems: 'center',
    justifyContent: 'center',
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
