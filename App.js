import React, {Component} from 'react'
import {StyleSheet, Text, View, Image, ScrollView, Button} from 'react-native'
import Sound from 'react-native-sound'
import {AsyncStorage} from 'react-native';


import Toolbar from './components/Toolbar.js'
import LocalContent from './components/LocalContent.js'
import RemoteContent from './components/RemoteContent.js'
import TaskList from './components/TaskList.js'
import Player from './components/Player.js'
import LoginForm from './components/LoginForm.js'
import ServerRequestForm from './components/ServerRequestForm.js'
import FileBase from './services/FileBase.js'
import Utils from './services/Utils.js'


export default class App extends Component {

  constructor() {
    super()
    this.state = {
      show: { local: true, remote: false, player: false },
      auth:false,
      server: '',
      apikey: '',
      token: '',
      remote_content: [],
      local_content: [],
      tasks: [],
      remote_tasks: [],
      player_id: '',
      player_status: 'paused',
      player_filepath: '',
      yt_info: { title: '', thumbnail_url: '', length_hours: '' }
    }
    this.db = new FileBase('db.json')
    this.utils = new Utils()
  }


  async componentDidMount() {
    const server = await AsyncStorage.getItem('server')
    const apikey = await AsyncStorage.getItem('apikey')
    this.setState({ server: server, apikey: apikey})
    if(server && apikey) {
      this.setState({auth: true}) 
      this.refreshToken(apikey)
    }

    //validar se existe conexão a rede wifi!!!
    this.refreshLocalContent() 
    //this.checkAuth()
  }


  onLogin = async (server,apikey) => {
    try {
      await AsyncStorage.setItem('server',server)
      await AsyncStorage.setItem('apikey',apikey)
      this.setState({ server: server, apikey: apikey})
      this.refreshToken(apikey)
      console.log('onLogin apikey | ',apikey)
    } catch(err) {
      console.log('onLogin ERR | ',err)
    }
  }
  
  refreshToken = async (secret) => {     
    fetch(this.state.server + '/auth', {
      method: 'POST', 
      body: JSON.stringify({ secret: secret }),
      headers:{'Content-Type': 'application/json'}
    })      
    .then(response => response.json())
    .then(res => { 
      this.setState({ auth: res.auth, token: res.token })
    })
  }


  refreshLocalContent = async () => {     
    var local_content = await this.db.read()
    this.setState({ local_content: local_content }) 
  }

  
  deleteLocalContent = async (id) => {     
    var local_content = this.state.local_content

    var content_idx = local_content.findIndex((item) => { return item.id == id })
    local_content.splice(content_idx,1)

    this.db.write(local_content)
    this.db.deleteFile(id)
    this.setState({ local_content: local_content }) 
    console.log('local content | deleted')
  }



  refreshRemoteContent = async (other='') => {     
    //fetch(this.state.server + '/content/sort/by/tag')
    fetch(this.state.server + '/content/' + other, { headers: { 'x-access-token': this.state.token }})
      .then(response => response.json())
      .then(content => { 
        this.setState({ remote_content: content }) 
      })
  }


  requestYouTubeDownload = async (url) => {     
    console.log('requestRemoteYTDownload',url)
    fetch(this.state.server + '/download', {
      method: 'POST', 
      body: JSON.stringify({ url: url }),
      headers: { 'Content-Type': 'application/json', 'x-access-token': this.state.token }
    })
      .then(response => response.json())
      .then(remote_tasks => { 
        this.setState({ remote_tasks: remote_tasks }) 
        console.log('remote_tasks',remote_tasks)
      })
  }

  requestYouTubeInfo = async (url) => {     
    console.log('requestYouTubeInfo',url)
    fetch(this.state.server + '/download/info', {
      method: 'POST', 
      body: JSON.stringify({ url: url }),
      headers: { 'Content-Type': 'application/json', 'x-access-token': this.state.token }
    })
      .then(response => response.json())
      .then(info => { 
        this.setState({ yt_info: { url: url, title: info.title, thumbnail_url: info.thumbnail_url, length_hours: info.length_hours }})
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

  }

  navigate = (to) => {
    if(to === 'server')
    {
      this.refreshRemoteContent() 
      this.setState({ show: { local: false, remote: true, player: false }})
    }
    else if(to === 'player')
    {
      this.setState({ show: { local: false, remote: false, player: true }})
    }
    else {
      this.setState({ show: { local: true, remote: false, player: false }})
    }
  }

  playContent = async (id,filepath) => {
    this.setState({ 
      player_id: id,
      player_status: 'playing',
      player_filepath: filepath
    })
  }

  pauseContent = async () => {
    this.setState({ player_status: 'paused' })
  }

  render() {

    return (
        this.state.auth === true ?

          <ScrollView style={styles.container}>

            <Toolbar show={this.state.show} navigate={this.navigate} />

            { this.state.tasks.length > 0 ? 
              <TaskList server={this.state.server} tasks={this.state.tasks} onFinishDownload={this.onFinishDownload} />
              : null
            }

            { this.state.show.remote ?
              <View>
                <RemoteContent content={this.utils.returnContentByTag(this.state.remote_content)} navigate={this.navigate} downloadContent={this.downloadContent} refreshRemoteContent={this.refreshRemoteContent}/>
                <ServerRequestForm info={this.state.yt_info} requestYouTubeInfo={this.requestYouTubeInfo} requestYouTubeDownload={this.requestYouTubeDownload}/>
              </View>
              : null
            }

            { this.state.show.local ?
              <LocalContent content={this.utils.returnContentByTag(this.state.local_content)} player_id={this.state.player_id} player_status={this.state.player_status} pauseContent={this.pauseContent} playContent={this.playContent} deleteLocalContent={this.deleteLocalContent}/>
              : null
            }

            <Player hide={!this.state.show.player} id={this.state.player_id} filepath={this.state.player_filepath} status={this.state.player_status} playContent={this.playContent} pauseContent={this.pauseContent}/>
                         
          </ScrollView>

          :

          <ScrollView style={styles.container}>
            <LoginForm server={this.state.server} apikey={this.state.apikey} onLogin={this.onLogin}/>
          </ScrollView>

    )
  }
}

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
