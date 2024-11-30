import * as SplashScreen from "expo-splash-screen";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { registerRootComponent } from "expo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();
export default function index() {

    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getName, setName] = useState("");
    //imageAccess
    const logo = require("../assets/images/logo/free-chat-high-resolution-logo-transparent-2-5.png");
    //font loading
    const [loaded, error] = useFonts({
        'normalText': require('../assets/fonts/OpenSans-VariableFont_wdth,wght.ttf'),
        'Topics': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    });
    useEffect(
        ()=>{
            async function checkUser(){
                try {
                    let userJson = await AsyncStorage.getItem('user');
                    if (userJson != null) {
                        router.replace('/home');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            checkUser();
        },[]
    );

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
            <ScrollView>
                <View style={styles.container}>

                    <Image source={logo} style={styles.image} contentFit={"contain"} />
                    <Text style={styles.text1}>Hi, Sign In </Text>
                    <Text style={styles.text3}>Hello! Wellcome to Free Chat</Text>

                    <View style={styles.image1}>
                        <Text style={styles.text6}>{getName}</Text>
                    </View>
                    <Text style={styles.text2}>Mobile</Text>
                    <TextInput style={styles.textinput} inputMode="tel" maxLength={10} onChangeText={
                        (text) => {
                            setMobile(text);

                        }} onEndEditing={async () => {
                            let response = await fetch(process.env.EXPO_PUBLIC_URL+"/chatApp/GetName?mobile=" + getMobile);
                            if (response.ok) {
                                let json = await response.json();
                                setName(json.name); 
                            }
                        }} />

                    <Text style={styles.text2}>Password</Text>
                    <TextInput style={styles.textinput} inputMode="text" secureTextEntry={true} maxLength={20} onChangeText={(text) => {
                        setPassword(text);
                    }} />


                    <Pressable style={styles.button1} onPress={async () => {



                        let response = await fetch(process.env.EXPO_PUBLIC_URL+"/chatApp/SignIn", {
                            method: 'POST',
                            body: JSON.stringify({
                                mobile: getMobile,
                                password: getPassword,
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                        if (response.ok) {
                            let json = await response.json();
                            if (json.Success) {
                                let user = json.user;
                                Alert.alert("Success", "Hi ," + user.first_name + ", " + json.massage);

                                try {
                                    await AsyncStorage.setItem("user", JSON.stringify(user));

                                    router.replace('/home');
                                } catch (e) {
                                    Alert.alert("Error", "Runtime error: Unable to Sign In Please try again");
                                    console.log(e);
                                }
                            } else {
                                Alert.alert("Error: " + json.massage);
                            }
                        }
                    }

                    }>
                        <Ionicons name="paper-plane" size={32} color="white" />
                        <Text style={styles.text4}>Sign In</Text>

                    </Pressable>
                    <Pressable style={styles.button2} onPress={
                        () => {
                            router.replace('/signup');
                        }
                    }>
                        <FontAwesome5 name="sign-in-alt" size={30} color="black" />
                        <Text style={styles.text2}>Don't Have An Account, Sign Up</Text>

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
        paddingVertical: 100,
        rowGap: 10,
        marginHorizontal: 15,
        justifyContent: 'center',
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
        backgroundColor: 'white',
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

    },
    text6: {

        fontSize: 32,
        color: 'blue',
        fontFamily: 'Topics',
        alignSelf: 'center',

    },


});
