/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';

const OCRDemo = () => {
  // State for image URI and contact information
  const [imgURI, setImgUri] = useState(null);
  const [contactInfo, setContactInfo] = useState({email: '', phone: ''});

  // Handle OCR functionality
  const handleOCR = async type => {
    // Determine whether to open the camera or gallery
    if (type === 'capture') {
      launchCamera({mediaType: 'image'}, handleSelectImg);
    } else {
      launchImageLibrary({mediaType: 'image'}, handleSelectImg);
    }
  };

  // Process selected image
  const handleSelectImg = async media => {
    if (media.assets) {
      const file = media.assets[0].uri;
      setImgUri(file);

      const result = await TextRecognition.recognize(file);
      const {email, phone} = extractContactInfo(result);

      // Update contact information state
      setContactInfo({email, phone});

      // Display extracted result
      Alert.alert(JSON.stringify(result));
    }
  };

  // Extract email and phone from text
  const extractContactInfo = value => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    let email = '';
    let phone = '';

    for (const val of value) {
      if (emailRegex.test(val)) {
        email = val;
      }
      if (val.includes('+91') || val.includes('91')) {
        phone = val;
      }
    }

    return {email, phone};
  };

  return (
    <View style={styles.container}>
      {/* Image and contact information display */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>OCRDemo</Text>
        <View style={styles.imageWrapper}>
          {imgURI ? (
            <Image source={{uri: imgURI}} style={styles.image} />
          ) : (
            <Text>Choose Image from gallery or Open camera</Text>
          )}
        </View>
        <View style={styles.textWrapper}>
          <Text>{`E-mail: ${contactInfo.email}`}</Text>
          <Text>{`Mobile No.: ${contactInfo.phone}`}</Text>
        </View>
      </View>
      {/* Buttons for opening gallery and camera */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleOCR('')} style={styles.button}>
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOCR('capture')}
          style={styles.button}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(238, 238, 239, 0.9)',
    justifyContent: 'center',
  },
  contentContainer: {
    marginVertical: 80,
    flex: 1,
    borderRadius: 15,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'gainsboro',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    paddingVertical: 16,
  },
  imageWrapper: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    height: '80%',
    width: '90%',
    borderRadius: 24,
  },
  textWrapper: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 0.4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'gainsboro',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 36,
    height: 55,
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(192, 192, 192, 1)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OCRDemo;
