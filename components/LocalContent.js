import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Button, Icon, Image, Overlay, Divider } from 'react-native-elements'


export default class LocalContent extends React.Component {


  constructor(props) {
    super(props)
    this.state = { isVisible: false, current_content: {} }
  }

  showOptions = (content) => {
    this.setState({ 
      isVisible: true,
      current_content: content
      })
  }

  hideOptions = () => {
    this.setState({ isVisible: false })
  }

  deleteLocalContent = (id) => {
    this.props.deleteLocalContent(this.state.current_content.id)
    this.hideOptions()    
  }

  render() {

    return (
      
      <View>

        { this.props.content.map((obj) =>

          <View key={obj.tag}>

            <Text style={styles.tagtitle}>{obj.tag}</Text>

            <View style={styles.redcard}>
             
            
              { obj.content.map((content) =>

                <View key={content.id} style={ this.props.player_id===content.id ? styles.activecard : styles.orangecard }>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                          <Avatar rounded source={{ uri: content.thumbnail_url }} style={styles.avatar}/>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                      
                      
                        <Button
                          onPress={() => this.showOptions(content)} 
                          icon={<Icon name='menu' />}
                          type="clear"
                          buttonStyle={{ borderRadius: 20, borderWidth: 0, height: 50, width: 50}}
                        />
                     
                        { this.props.player_id===content.id && this.props.player_status==='playing' ? (
                          <Button
                            onPress={() => this.props.pauseContent()} 
                            icon={<Icon name='pause' />}
                            type="clear"
                            buttonStyle={{ borderRadius: 20, borderWidth: 0, height: 50, width: 50}}
                          />
                          ): 
                          <Button
                            onPress={() => this.props.playContent(content.id,content.filepath)} 
                            icon={<Icon name='play-arrow' />}
                            type="clear"
                            buttonStyle={{ borderRadius: 20, borderWidth: 0, height: 50, width: 50}}
                          />
                        }
                  
                    </View>
                    
                  </View>
                  <Text style={styles.title}>{content.title}</Text>
                  <Text style={styles.length}>{content.length_hours}</Text>                     
                </View>
            
              )}

            </View>

          </View>
            
        )}


         
        <Overlay isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>

            <View style={{padding: 10, height: 150}}>
              <Text style={styles.title}>{this.state.current_content.title}</Text>
            </View>
            
            <View style={{padding: 10, height: 150}}>
              <Button
                onPress={() => this.deleteLocalContent(this.state.current_content.id)} 
                icon={<Icon name='delete' color='#fff' />}
                buttonStyle={{ backgroundColor: '#de0000' }}
                title="&nbsp;&nbsp;&nbsp;Delete"
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

    );

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
  length: {
    fontFamily: 'Oswald',
    fontSize: 12
  },  
  avatar: {
    width: 50,
    height: 50
  },
  tagtitle: {
    fontFamily: 'Oswald',
    fontSize: 16,
    textAlign: 'right',
    marginTop: 20,
    marginRight: 10,
    marginBottom: 5
  },  
  contenttitle: {
    fontFamily: 'Oswald',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    marginRight: 10,
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
  },  
  activecard: {
    fontFamily: 'Oswald',
    backgroundColor: '#6fde00',
    padding: 20,
    marginBottom: 10
  },
  overlaycontainer: {
    fontFamily: 'Oswald',
    backgroundColor: '#00dede',
  },
});