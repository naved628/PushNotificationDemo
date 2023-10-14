import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import Constants from 'expo-constants';

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
  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permissio required",
          "Push notifications need tge appropriate permissions"
        );
        return;
      }
      const pushTokenData = Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log(pushTokenData,'push data');
    }
    if(Platform.OS === 'android'){
      Notifications.setNotificationChannelAsync('default',{
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT
      });
    }

    configurePushNotifications();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {}
    );
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {}
    );
    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, []);
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

  async function sendPushNotificationHandler(expoPushToken){
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationHandler}
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
