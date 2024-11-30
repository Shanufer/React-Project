import { Text, View, StyleSheet, ScrollView, Image, Pressable, Alert } from "react-native";
import { registerRootComponent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import { FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

export default function home() {
    const [chatArray, setChatArray] = useState([]);
    const [loaded, error] = useFonts({
        'normalText': require('../assets/fonts/OpenSans-VariableFont_wdth,wght.ttf'),
        'Topics': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    });
    useEffect(
        () => {
            async function getData() {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                let response = await fetch(process.env.EXPO_PUBLIC_URL+"/chatApp/LoadHomeData?mobile=" + user.mobile);
                if (response.ok) {
                    let json = await response.json();
                    let chatArray1 = json.jsonChatArray;
                    setChatArray(chatArray1);
                } else {
                    console.error("Failed to fetch data.");
                }
            }
            getData();
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
            <StatusBar hidden={true} />
            
            <FlashList
                data={chatArray}  
                renderItem={({ item }) =>
                    <Pressable style={styles.view4} onPress={
                        ()=>{
                        
                        router.push({
                            pathname:"/chat",
                            params:item
                        });
                    }
                    }>
                        <View style={[styles.view5, item.OtherUserStatus == 1 ? styles.view5_2 : styles.view5_1]}>
                            {
                                item.parth ? (
                                    <Image source={process.env.EXPO_PUBLIC_URL+"/chatApp/profileImage/"+item.otherMobile+".png"} contentFit="contain" 
                                    style={styles.image1} 
                                     />
                                ) : (
                                    <Text style={styles.text2}>{item.letters}</Text>
                                )
                            }

                        </View>
                        <View style={styles.view6}>
                            <Text style={styles.text1} >{item.otherUserName}</Text>
                            <Text style={styles.text4} numberOfLines={1}>{item.message}</Text>
                            <View style={styles.view7}>
                                <Text style={styles.text5}>{item.time} </Text>
                                <FontAwesome6 name={"check"} color={item.chatStatusId == 1 ? "green" : "white"} size={20} />
                            </View>
                        </View>
                    </Pressable>
                }
                estimatedItemSize={200}
            />

        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        paddingVertical: 60,
        paddingHorizontal: 10,

    },

    view4: {
        flexDirection: "row",
        height: 100,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        columnGap: 10,
        marginTop: 10
    },
    view5: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "white",
        borderStyle: "dashed",
        borderWidth: 2,
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    view5_1: {
        borderColor: "red",
    },
    view5_2: {
        borderColor: "green",
    },
    view6: {
        flex: 1,
        marginEnd: 10,
    },
    view7: {
        flexDirection: "row",
        columnGap: 10,
        alignSelf: "flex-end",
        alignItems: "center",
    },



    text1: {
        fontFamily: "Topics",
        fontSize: 22,
    },
    text4: {
        fontFamily: "normalText",
        fontSize: 20,

    },
    text5: {
        fontFamily: "normalText",
        fontSize: 14,
        alignSelf: "flex-end",
    },
    text2: {
        fontFamily: "Topics",
        fontSize: 26,
    },
    image1: {
       width:"100%" ,
       height: 50,
       borderRadius:35,
       backgroundColor:"white",
       justifyContent: "center",
       alignSelf: "center",
    },


})
