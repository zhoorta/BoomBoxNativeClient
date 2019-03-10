import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Button, Icon } from 'react-native-elements'

import DownloadTask from './DownloadTask.js'


export default class TaskList extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    return (
        <View>
          <Text style={styles.tagtitle}>DOWNLOADING FROM SERVER</Text>
          <View style={styles.redcard}>
            { this.props.tasks.map((obj) =>
                <DownloadTask key={obj.id} server={this.props.server} task={obj} onFinishDownload={this.props.onFinishDownload} />
            )}
          </View>
        </View>
    );

  }
}


const styles = StyleSheet.create({
  redcard: {
    fontFamily: 'Oswald',
    backgroundColor: '#de0000',
    padding: 20,
    margin: 10
    },
  tagtitle: {
    fontFamily: 'Oswald',
    fontSize: 16,
    textAlign: 'right',
    marginTop: 20,
    marginRight: 10,
    marginBottom: 5
  },
});



