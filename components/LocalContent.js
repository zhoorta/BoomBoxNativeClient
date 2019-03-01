import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Card, ListItem, Button, Icon, Image } from 'react-native-elements'

export default class LocalContent extends React.Component {


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
                    <View>
                      { this.props.player_id===content.id ? (
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

      </View>

    );

  }
   
}

  
/*
  render() {

    return (
      
      <View>

        { this.props.content.map((obj) =>

          <View key={obj.tag}>

            <Text style={styles.tagtitle}>{obj.tag}</Text>

            <View style={styles.redcard}>
              
              { obj.content.map((content) =>

                <View key={content.id} style={styles.orangecard}>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                          <Avatar rounded source={{ uri: content.thumbnail_url }} style={styles.avatar}/>
                    </View>
                    <View>
                      { this.props.player_id===obj.id ? (
                        <Button onPress={() => this.props.pauseContent()} title=" | | " />
                        ): 
                        <Button onPress={() => this.props.playContent(obj.id,obj.filepath)} title=" &#9658; " /> 
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



      </View>
    );

  }
  */





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
});