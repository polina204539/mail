import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';

export default function App() {
  const [status, setStatus] = useState(null)

  const showAlert = () =>
    Alert.alert(
      "Добавление файлов",
      "Хотите добавить файлы?",
      [
        {
          text: "НЕТ",
          onPress: () => {sendEmail([])},
          style: "ОТМЕНА"
        },
        { text: "ДА", onPress: sendEmailWithAttachment }
      ]
    );

  const sendEmail = async(file) => {
    var options = {}
    if(file.length < 1){
      options = {
        subject: "Отправка письма без вложения",
        recipients: ["polinasaparova@gmail.com"],
        body: "Текст здесь..."
      }
    }else{
      options = {
        subject: "Отправка письма с вложением",
        recipients: ["polinasaparova@gmail.com"],
        body: "Текст здесь...",
        attachments: file
      }
    }
    let promise = new Promise((resolve, reject) => {
      MailComposer.composeAsync(options)
      .then((result) => {
        resolve(result)
      })
      .catch((error) => {
        reject(error)
      })
    })

    promise.then(
      result => setStatus("Статус: email " + result.status),
      error => setStatus("Статус: email " + error.status)
    )
  }

  const sendEmailWithAttachment = async() => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log(result.uri)
      sendEmail([result.uri]);
    }else{
      sendEmail([])
    }

  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showAlert}>
        <Text style={{backgroundColor: '#000000', color: 'white', padding: 40}}>Send email</Text>
      </TouchableOpacity>

      {status !== null &&
        <View style={{borderWidth: 2, borderColor: 'black', margin: 20, padding: 10}}>
          <Text>{status}</Text>
        </View>
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B179E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
