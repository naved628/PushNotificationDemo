import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() =>{
    const subscription = Notifications.addNotificationReceivedListener((notification)=>{
    });
    const subscription2 = Notifications.addNotificationResponseReceivedListener((response)=>{
    })
    return () =>{
      subscription.remove();
      subscription2.remove();

      
    }
  },[])
  async function scheduleNotificationHandler() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "My first local notification",
          body: "This is the body of the notification.",
          data: {
            userName: "Max",
          },
        },
        trigger: {
          seconds: 3,
        },
      });
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  }
  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
