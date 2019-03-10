import React from 'react'
import { StyleSheet, View, Image, Text, Slider, TouchableOpacity, Platform, Alert} from 'react-native';

import Sound from 'react-native-sound';

const img_speaker = require('../assets/player/ui_speaker.png');
const img_pause = require('../assets/player/ui_pause.png');
const img_play = require('../assets/player/ui_play.png');
const img_playjumpleft = require('../assets/player/ui_playjumpleft.png');
const img_playjumpright = require('../assets/player/ui_playjumpright.png');

export default class Player extends React.Component {

    constructor(){
        super();
        this.state = {
            playState:'paused', //playing, paused
            playSeconds:0,
            duration:0
        }
        this.sliderEditing = false;
    }

    componentDidMount(){
        this.timeout = setInterval(() => {
            if(this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing) {
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    this.setState({playSeconds:seconds})
                })
            }
        }, 100)
    }
    componentWillUnmount(){
        if(this.sound){
            this.sound.release()
            this.sound = null
        }
        if(this.timeout){
            clearInterval(this.timeout)
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps filepath',nextProps.filepath)
        console.log('componentWillReceiveProps status',nextProps.status)
        
        if(nextProps.status==='playing' && this.props.filepath!==nextProps.filepath) this.play(nextProps.filepath)
        else if(nextProps.status==='playing' && this.props.status==='paused') this.resume()
        else if(nextProps.status==='paused') this.pause()
    }

    onSliderEditStart = () => {
        this.sliderEditing = true;
    }
    onSliderEditEnd = () => {
        this.sliderEditing = false;
    }
    onSliderEditing = value => {
        if(this.sound){
            this.sound.setCurrentTime(value);
            this.setState({playSeconds:value});
        }
    }

    resume = async () => {
        console.log('[Resume]',this.props.filepath)
        if(this.props.filepath==='') return

        this.setState({playState:'playing'})
        this.sound.play(this.playComplete)
    }

    play = async (filepath) => {
        
        if(filepath==='') return
        console.log('[Play]', filepath)

        if(this.sound) {
            this.sound.release();
            this.sound = null;
        }
 
        this.sound = new Sound(filepath, '', (error) => {
            if (error) {
                console.log('failed to load the sound', error)
                Alert.alert('Notice', 'audio file error. (Error code : 1)')
                this.setState({playState:'paused'})
            }
            else {
                this.setState({playState:'playing', playSeconds:0, duration:this.sound.getDuration()})
                this.sound.play(this.playComplete)
            }
        })  

    }

    playComplete = (success) => {
        if(this.sound){
            if (success) {
                console.log('successfully finished playing')
            } else {
                console.log('playback failed due to audio decoding errors')
                Alert.alert('Notice', 'audio file error. (Error code : 2)')
            }
            this.setState({playState:'paused', playSeconds:0})
            this.sound.setCurrentTime(0)
        }
    }

    pause = () => {
        console.log('[Pause]')
        if(this.sound) this.sound.pause()
        this.setState({playState:'paused'})
    }

    jumpPrev15Seconds = () => {this.jumpSeconds(-15);}
    jumpNext15Seconds = () => {this.jumpSeconds(15);}
    jumpSeconds = (secsDelta) => {
        if(this.sound){
            this.sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs + secsDelta;
                if(nextSecs < 0) nextSecs = 0;
                else if(nextSecs > this.state.duration) nextSecs = this.state.duration;
                this.sound.setCurrentTime(nextSecs);
                this.setState({playSeconds:nextSecs});
            })
        }
    }

    getAudioTimeString(seconds){
        const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }

    render() {

        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);

        if(this.props.hide) return null
        
        return (

            <View style={styles.redcard}>
                <View style={styles.container}>
                    <Image source={img_speaker} style={styles.speaker}/>
                    <View style={{flexDirection:'row', justifyContent:'center', marginVertical:15}}>
                        <TouchableOpacity onPress={this.jumpPrev15Seconds} style={{justifyContent:'center'}}>
                            <Image source={img_playjumpleft} style={styles.controlimage}/>
                            <Text style={styles.controltext}>15</Text>
                        </TouchableOpacity>
                        {this.state.playState == 'playing' && 
                        <TouchableOpacity onPress={this.pause} style={{marginHorizontal:20}}>
                            <Image source={img_pause} style={styles.controlimage}/>
                        </TouchableOpacity>}
                        {this.state.playState == 'paused' && 
                        <TouchableOpacity onPress={this.resume} style={{marginHorizontal:20}}>
                            <Image source={img_play} style={styles.controlimage}/>
                        </TouchableOpacity>}
                        <TouchableOpacity onPress={this.jumpNext15Seconds} style={{justifyContent:'center'}}>
                            <Image source={img_playjumpright} style={styles.controlimage}/>
                            <Text style={styles.controltext}>15</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginVertical:15, marginHorizontal:15, flexDirection:'row'}}>
                        <Text style={{color:'#ff9922', alignSelf:'center'}}>{currentTimeString}</Text>
                        <Slider
                            onTouchStart={this.onSliderEditStart}
                            // onTouchMove={() => console.log('onTouchMove')}
                            onTouchEnd={this.onSliderEditEnd}
                            // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                            // onTouchCancel={() => console.log('onTouchCancel')}
                            onValueChange={this.onSliderEditing}
                            value={this.state.playSeconds} maximumValue={this.state.duration} maximumTrackTintColor='gray' minimumTrackTintColor='#ff9922' thumbTintColor='#ff9922' 
                            style={{flex:1, alignSelf:'center', color:'#ff9922', marginHorizontal:Platform.select({ios:5})}}/>
                        <Text style={{color:'#ff9922', alignSelf:'center'}}>{durationString}</Text>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {flex:1, justifyContent:'center', backgroundColor:'#de0000'},
    speaker: {width:150, height:150, marginBottom:15, alignSelf:'center'},
    controlimage: {width:30, height:30},
    controltext: {fontFamily: 'Oswald', position:'absolute', alignSelf:'center', marginTop:1, color:'#ff9922', fontSize:12},
    redcard: {
        fontFamily: 'Oswald',
        backgroundColor: '#de0000',
        padding: 20,
        margin: 10
    }, 
})
  