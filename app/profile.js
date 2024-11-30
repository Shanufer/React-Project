import * as SplashScreen from "expo-splash-screen";
import { Alert, Button, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";



 //image picker




 export function ImagePicker(){
   
    return(
        <Button title="Select Image" onPress={pickImage} /> 
       
    )
 }
 

