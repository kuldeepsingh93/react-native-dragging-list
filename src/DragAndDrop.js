import React from 'react'
import { StyleSheet, View, Text, FlatList, PanResponder, Animated } from 'react-native'

function immutableMove(arr, from, to) {
  return arr.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);
}

export default class DragAndDrop extends React.Component {
  
  state = {
    dragging: false,
    draggingIndex: -1,
    data: this.props.data,
  }
  _panResponder: PanResponderInstance; 
  point = new Animated.ValueXY()
  scale = new Animated.Value(1)
  currentY = 0;
  scrollOffset = 0;
  flatlistTopOffset = 0;
  rowHeight = 0;
  currentIndex = -1;
  active = false;

  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.currentIndex = this.yToIndex(gestureState.y0)
        this.currentY = gestureState.y0;
        Animated.event([{ y: this.point.y }])({ y: gestureState.y0 - this.rowHeight / 2 })
        this.active = true;
        this.setState({ draggingIndex: this.currentIndex, dragging: true }, () => {
          this.animateList();
        })
        Animated.timing(
          this.scale,
          { toValue: 1.2, duration: 0 }
        ).start();
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        this.currentY = gestureState.moveY;
        Animated.event([{ y: this.point.y }])({ y: gestureState.moveY })
        const newIndex = this.yToIndex(this.currentY);
        if (this.currentIndex !== newIndex) {
          this.setState({
            data: immutableMove(this.state.data, this.currentIndex, newIndex),
            draggingIndex: newIndex
          });
          this.currentIndex = newIndex;
        }
        this.animateList()
        return true;
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.reset()
        this.point.flattenOffset();
        Animated.timing(
          this.scale,
          { toValue: 1, duration: 0 }
        ).start();
        return true;
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.reset()
        return true;
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  animateList = () => {
    if (!this.active) {
      return;
    }
  }

  yToIndex = ( y: number ) => {
    const value = Math.floor((this.scrollOffset + y - this.flatlistTopOffset) / this.rowHeight);
    if ( value < 0 ) {
      return 0;
    }
    if ( value > this.state.data.length - 1 ) {
      return this.state.data.length - 1;
    }
    return value;
  }

  reset = () => {
    this.active = false;
    this.setState({ draggingIndex: -1, dragging: false })
  }

  setRowHeight = e => {
    this.rowHeight = e.nativeEvent.layout.height
  }

  render() {
    const { renderItem, draggingGesture } = this.props;
    const { dragging, draggingIndex, data } = this.state;
    let {scale}  = this
    const renderItemWrapper = ({ item, index }, noPanResponder = false) => (
      <View 
        style = {{ 
          flexDirection: 'row',
          alignContent: 'center',
          opacity: draggingIndex === index ? 0 : 1,
        }}
        onLayout = { this.setRowHeight }
      >
        { renderItem({ item }) }
        <View { ...(noPanResponder ? {} : this._panResponder.panHandlers)}>
           { draggingGesture }
        </View>
      </View>
    )
    return (
      <View style = {styles.container}>
        {dragging && (
          <Animated.View 
            style = {{ 
              zIndex: 2, 
              top: this.point.getLayout().top, 
              width: '100%', 
              position: 'absolute',
              transform: [{ scale }]
            }}
          >
            { renderItemWrapper({ item: data[draggingIndex], index: -1 }, true)}
          </Animated.View>
        )}
        <FlatList 
          scrollEnabled = { !dragging }
          style = {{ width: '100%'}}
          data = { data }
          renderItem = { renderItemWrapper }
          onScroll = { e => {
            this.scrollOffset = e.nativeEvent.contentOffset.y
          }}
          onLayout = { e => {
            this.flatlistTopOffset = e.nativeEvent.layout.y
          }}
          scrollEventThrottle = { 10 }
          keyExtractor = { (item) => '' + item }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
