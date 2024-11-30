import * as SplashScreen from "expo-splash-screen";
import { Button, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View ,Alert } from 'react-native';
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();
export default function SignUp() {
  //image picker
  const [getImage, setImage] = useState(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(
      {

      }
    );
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }
  const [getMobile,setMobile] = useState("");
  const[getFirstName,setFirstName] = useState("");
  const[getLastName,setLastName] = useState("");
  const[getPassword,setPassword] = useState("");
  //imageAccess
  const logo = require("../assets/images/logo/free-chat-high-resolution-logo-transparent-2-5.png");
  //font loading
  const [loaded, error] = useFonts({
    'normalText': require('../assets/fonts/OpenSans-VariableFont_wdth,wght.ttf'),
    'Topics': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  
  
  return (

    <LinearGradient colors={['#58b4ed', '#ffffff']} style={styles.background} >
      <ScrollView >
        <View style={styles.container}>

          <Image source={logo} style={styles.image} contentFit={"contain"} />
          <Text style={styles.text1}>Create New Account</Text>
          <Text style={styles.text3}>Hello! Wellcome to Free Chat</Text>
          <Pressable onPress={pickImage}>
            {getImage && <Image source={{ uri: getImage }} style={styles.image1} />}
            <Text style={styles.pro}>Profile Image</Text>
          </Pressable>

          <Text style={styles.text2}>Mobile</Text>
          <TextInput style={styles.textinput} inputMode="tel" maxLength={10} onChangeText={
            (text)=>{
                  setMobile(text);
            }} />

          <Text style={styles.text2}>First Name</Text>
          <TextInput style={styles.textinput} inputMode="text" onChangeText={(text)=>{
                setFirstName(text);
          }} />

          <Text style={styles.text2}>Last Name</Text>
          <TextInput style={styles.textinput} inputMode="text" onChangeText={(text)=>{
            setLastName(text);
          }}/>

          <Text style={styles.text2}>Password</Text>
          <TextInput style={styles.textinput} inputMode="text" secureTextEntry={true} maxLength={20} onChangeText={(text)=>{
            setPassword(text);
          }}/>


          <Pressable style={styles.button1} onPress={async () => {

            let formData = new FormData();
            formData.append("mobile",getMobile);
            formData.append("firstName",getFirstName);
            formData.append("lastName",getLastName);
            formData.append("password",getPassword);
            if (getImage !=null) {
              formData.append("profileImage",{
                name:"profile.png",
                type:"image/png",
                uri:getImage,
              });
            }
            

            let response = await fetch(process.env.EXPO_PUBLIC_URL+"/chatApp/SignUp", {
              method: 'POST',
              body:formData,
            

            });
            if (response.ok) {
              let json = await response.json();
              if (json.success) {
                
                router.replace('')
              }else{
                Alert.alert("Error: " + json.message);
              }
            }
          }

          }>
            <Ionicons name="paper-plane" size={32} color="white" />
            <Text style={styles.text4}>Sign Up</Text>

          </Pressable>
          <Pressable style={styles.button2} onPress={
            ()=>{
              router.replace('/');
            }
          } >
            <FontAwesome5 name="sign-in-alt" size={30} color="black" />
            <Text style={styles.text2}>Already Have An Account, Sign In</Text>

          </Pressable>


        </View>
      </ScrollView>
    </LinearGradient>

  );
}
const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },

  container: {
    flex: 1,
    paddingVertical: 60,
    rowGap: 10,
    marginHorizontal: 15,
  },

  text2: {
    fontSize: 15,
    fontFamily: 'normalText',

  },

  text3: {
    fontSize: 20,
    fontFamily: 'normalText',
  },

  text4: {
    fontSize: 15,
    fontFamily: 'normalText',
    color: 'white',
  },
  pro: {
    marginTop: 5,
    fontSize: 15,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    width: 110,
    height: 20,
    textAlign: 'center',
  },

  text1: {
    fontSize: 40,
    color: 'blue',
    fontFamily: 'Topics',
  },

  textinput: {
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    width: '100%',
    height: 40,
    paddingStart: 10,
  },

  image: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  image1: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
  },
  button1: {
    height: 40,
    backgroundColor: '#5857E8',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },

  button2: {
    height: 40,
    backgroundColor: '#F4F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 10,
  },
  ScrollView1: {

  }

});