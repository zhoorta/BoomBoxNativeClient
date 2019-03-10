import React, {Component} from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Card, ListItem, Button, Icon, Image } from 'react-native-elements'


export default class RemoteContent extends Component {


  constructor(props) {
    super(props)
    this.state = { 
      contentsource: ''
      }
  }


  changeSource = async () => {
    if(this.state.contentsource==='') await this.setState({ contentsource: 'other' })
    else await this.setState({ contentsource: '' })
    this.props.refreshRemoteContent(this.state.contentsource)
  }

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
      								<Button
      								  onPress={() => this.props.downloadContent(content.id)} 
      								  icon={<Icon name='file-download' />}
      								  type="clear"
                        buttonStyle={{
                          borderRadius: 20,
                          borderWidth: 0,
                          height: 50,
                          width: 50
      									}}
      								/>
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
  }
});
