import { Text, View, StyleSheet, StatusBar, Image, TextInput, Pressable,Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function chat() {
    const getParameters = useLocalSearchParams();
    const [getChatArray, setChatArray] = useState([]);
    const[getChatText, setChatText] = useState([]);

    const [loaded, error] = useFonts({
        'normalText': require('../assets/fonts/OpenSans-VariableFont_wdth,wght.ttf'),
        'Topics': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    });

    useEffect(
        () => {
            async function getChatData() {
                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                let response = await fetch(process.env.EXPO_PUBLIC_URL+"/chatApp/LoadChat?user_mobile="+user.mobile+"&other_user_mobile="+getParameters.otherMobile);
                if (response.ok) {
                    let chatArray = await response.json();

                    setChatArray(chatArray);
                  
                } else {
                    console.error("Failed to fetch data.");
                }
            }
            getChatData();
            setInterval(()=>{
                getChatData();
            },1000)
        }, []
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

        <LinearGradient colors={['#58b4ed', '#ffffff']} style={styles.Linear} >
            <StatusBar hidden={true} />
            <View style={styles.view1}>
                <View style={styles.view2}>
                    {
                        getParameters.parth?
                        <Image source={{ uri:process.env.EXPO_PUBLIC_URL+ "/chatApp/profileImage/0769203947.png" }}
                                contentFit={"contain"}
                                style={styles.dp} />                          
                            : <Text style={styles.text1}>{getParameters.letters}</Text>
                    }

                </View>
                <View style={styles.view3}>
                    <Text style={styles.text2}>{getParameters.otherUserName}</Text>
                    <Text style={styles.text3}>{getParameters.OtherUserStatus==1?"Online":"Ofline"}</Text>
                </View>

            </View>
            <View style={styles.msgArea}>
                <FlashList
                    data={getChatArray}
                    renderItem={({ item }) =>
                        <View style={item.side == "right" ? styles.view4 : styles.view4_1}>
                            <Text style={styles.text4}>{item.message}</Text>
                            <View style={styles.view5}>
                                <Text style={styles.text5}>{item.datetime}</Text>
                                {
                                    item.side == "right" ?
                                        <FontAwesome6 name={"check"} color={item.chat_Status_Id==0?"red" : "green"} size={20} />
                                        : null
                                }

                            </View>

                        </View>
                    }
                    estimatedItemSize={200}
                />


            </View>
            <View style={styles.view6}>
                <TextInput style={styles.input1} value={getChatText} 
                onChangeText={(text)=>{
                    setChatText(text);
                }}/>
                <Pressable style={styles.pressable1} onPress={
                    async()=>{
                        if (getChatText.length==0) {
                            Alert.alert("Error","Please enter chat text");
                        }else{
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);
                           let response = await fetch(process.env.EXPO_PUBLIC_URL+"/chatApp/sendChat?logmobile="+user.mobile+"&othermobile="+getParameters.otherMobile+"&message="+getChatText);
                           if (response.ok) {
                            let json = await response.json();
                            if (json.success) {
                                console.log("mesa sent")
                                setChatText("");
                            }
                           }
                        }
                        
                    }
                } >
                    <FontAwesome6 name={"paper-plane"} color={"balck"} size={30} />
                </Pressable>
            </View>

        </LinearGradient>

    )
}
const styles = StyleSheet.create({
    Linear: {
        flex: 1,

    },
    view1: {

        marginTop: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: "center",
    },
    view2: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    dp: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    text1: {
        fontSize: 38,
        fontFamily: "Topics"
    },
    view3: {
        rowGap: 5,
    },
    text2: {
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: "normalText",
    },
    text3: {
        fontSize: 16,
        fontFamily: "normalText",
        alignSelf: "center",
    },
    view4: {
        backgroundColor: "red",
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
        padding: 5,
        alignSelf: "flex-end",
    },
    view4_1: {
        backgroundColor: "green",
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
        padding: 5,
        alignSelf: "flex-start",
    },
    view5: {
        flexDirection: "row",
        columnGap: 15,
    },
    msgArea: {
        backgroundColor: "white",
        marginHorizontal: 5,
        borderRadius: 10,
        flex: 1,
        marginVertical: 5,
        justifyContent: "flex-end",
    },
    text4: {
        fontSize: 18,
        fontFamily: "normalText",
    },
    view6: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        columnGap: 5,
        marginHorizontal: 30,
        marginVertical: 10,

    },
    input1: {
        height: 50,
        width: "100%",
        borderStyle: "solid",
        borderRadius: 10,
        fontSize: 20,
        borderWidth: 1,
        padding: 10,
    },
    pressable1: {
        width: 50,
        height: 50,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "green",
        backgroundColor: "green",

    },
    icon: {

    }
}) 