import React from 'react';
import {
  Platform,
  Button,
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import {Camera, Permissions, ImagePicker} from 'expo';


export default class ImagePickerExample extends React.Component {
  constructor(props) {
    super(props);


    let sData = '';
    fetch('http://akshay-try1.herokuapp.com/', {
      method: 'GET'
    })
      .then((response) => {
        sData = response;
        console.log('get success');
      })
      .catch((error) => {
        console.error(error);
      });

    this.state = {
      photo: null,
      hasCameraPermission: null,
      visible: false,
      data: sData,
      showUploadResp: null,
      showUploadButton: false
    };

    this._pickImage = this._pickImage.bind(this);
    this.handleUploadPhoto = this.handleUploadPhoto.bind(this);
  }


  async componentDidMount() {
    /*const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    const res = await Promise.all([
      Permissions.askAsync(Permissions.CAMERA),
      Permissions.askAsync(Permissions.CAMERA_ROLL)
    ]);*/
  }


  createFormData(photo, body) {

    let data = new FormData();

    data.append("image", {
      name: photo.fileName,
      type: photo.type + '.jpg',
      uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", ""),
      userId: "123"
    });


    return data;
  };

  handleUploadPhoto = () => {
    let _this = this;

    fetch("http://akshay-try1.herokuapp.com/captions", {
      method: "POST",
      body: _this.createFormData(_this.state.photo, {userId: "123"}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log("ggggg", response);
        // alert('in 1');
        return response.json();
      })
      .then(response => {
        console.log("upload succes", response);
        // alert('in 2');
        this.setState({
          showUploadResp: response,
          showUploadButton: false
        });
      })
      .catch(error => {
        // alert('in error');

        console.log("upload error", error);
      });
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1
    });
    console.log(result);

    if (!result.cancelled) {
      if (!result.fileName) {
        let aTemp = result.uri.split('/');
        result.fileName = aTemp[aTemp.length - 1];
      }
      this.setState({
        photo: result,
        showUploadButton: true
      });
    }

  };

  _pickImageC = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1
    });
    console.log(result);

    if (!result.cancelled) {
      this.setState({
        photo: result,
        showUploadButton: true
      });
    }

  };

  GetCards = () => {
    let oRespData = this.state.showUploadResp;

    let aCaptions = [];
    if (Object.keys(oRespData).length) {
      for (let sKey in oRespData) {
        aCaptions.push(
          <View style={styles.captionLineWrapper}>
            <Text style={styles.captionLine}>{oRespData[sKey]}</Text>
          </View>);
      }
    } else {
      aCaptions.push(<Text>Please try again...</Text>);
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {aCaptions}
      </ScrollView>
    )
  }

  getImageBlockView() {
    let photo = this.state.photo;

    return (
      <View>
        {!!photo ? <Image resizeMode={'cover'} source={{uri: photo.uri}} style={styles.myImage}/> :
          <Image source={require('./assets/images/icons8-picture-480.png')} style={styles.myImage}/>

        }
      </View>);
  }

  render() {
    let photo = this.state.photo;

    /*const {hasCameraPermission} = this.state;
    if (hasCameraPermission === null) {
      return <View/>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }*/

    let oCaptionsView = null;
    if (!!this.state.showUploadResp) {
      oCaptionsView = this.GetCards();
    }

    let oUploadButton = this.state.showUploadButton ? <View style={styles.buttonWrapper}>
      <TouchableHighlight style={styles.resetButton} onPress={this.handleUploadPhoto}>
        <Text style={styles.resetText}>Get Captions</Text>
      </TouchableHighlight>
    </View>
      : null;


    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Get Captions</Text>
        <View style={styles.buttonWrapper}>
          <TouchableHighlight style={styles.resetButton} onPress={this._pickImage}>
            <Text style={styles.resetText}>Pick an image from camera roll</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableHighlight style={styles.resetButton} onPress={this._pickImageC}>
            <Text style={styles.resetText}>Click a photo from Camera</Text>
          </TouchableHighlight>
        </View>

        {this.getImageBlockView()}

        {oCaptionsView}

        {oUploadButton}
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 200
  },
  button: {
    padding: 5
  },
  buttonWrapper:{
    width: 300,
    height: 40,
    marginTop: 10,
    marginLeft: -100

  },
  headerText: {
    fontSize: 40,
    marginTop: -100,
    marginBottom: 50
  },
  myImage:{
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20
  },
  scrollContainer:{
    padding: 20,
    height: 300
  },
  captionLineWrapper:{
    borderBottomColor: '#80808066',
    borderBottomWidth: 1,
  },
  captionLine:{
    fontSize:18,
    margin: 5,
    fontFamily: 'Times New Roman'
  },
  resetButton: {
    width: 300,
    height: 40,
    backgroundColor: '#3d2963',
    borderRadius: 5,
    marginLeft: 50,
    marginRight: 60,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  resetText:{
    color: '#ffffff',
    fontSize: 15,
    fontWeight: "bold"
  }
})
