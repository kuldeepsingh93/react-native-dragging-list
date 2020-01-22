<h1>react-native-dragging-list</h1>

A react native package for simply dragging and dropping list items.

<h1>Getting Started</h1>

**Install via npm**

```shell
npm i react-native-dragging-list
```

<h1>Usage</h1>

Import the **DragAndDrop** component from **react-native-dragging-list**: 

```shell
import DragAndDrop from 'react-native-dragging-list'
```

This component accepts 4 parameters / props:

1. **data**: It contains data in form of an array which will be mapped.
2. **RenderItem**: It accepts a function which returns the mapped data. It accepts a single parameter which indicates a single element of the data array.
3. **DraggingHandle**: It also accepts a function which returns a component which is sort of a handle through which an item can be dragged around. User can use horizontal bars or any image according to his/her liking.
4. **listItemStyling**: This is a styling object which can be used to customize list items. User can define the styling here and it will be implemented on all list items.

<h1>Usage Example:</h1>

```shell
import DragAndDrop from 'react-native-dragging-list'

function RenderItem({ item }) {
  return (
    <View>
      <Text style = {{textAlign: 'center'}}> { item } </Text>
    </View>
  )
}

function DraggingHandle() {
    return (
      <View>
        <Text>....</Text>
      </View>
    )
  }

const listItemStyling = { 
  width: '100%', 
  flexDirection: 'row', 
  justifyContent: 'space-around', 
  alignItems: 'center', 
  height: 70, 
  borderWidth: 1, 
  borderColor: 'black', 
  backgroundColor: 'grey' 
}

class DraggableList extends Component {
  render() {
    const data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    return (
      <View style = {{ flex: 1}}>
        <DragAndDrop 
          data = { data }
          RenderItem = { RenderItem }
          DraggingHandle = { DraggingHandle }
          listItemStyling = { listItemStyling }
        />
      </View>
    )
  }
}

export default DraggableList
```

<h1>Build with: </h1>

1. React
2. react-native
3. PanResponder
4. Animated
5. FlatList

<h1> </h1>

**NOTE**: 
1. It is highly recommended to give same height to all list items otherwise you may face some issues using this package. 
2. Don't forget to give ```flex: 1``` styling to the ```<View>``` inside which you use this component otherwise the list will not be visible as it will take default height as 0.
