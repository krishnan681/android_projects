import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import RNFetchBlob from "react-native-blob-util";
import FileViewer from "react-native-file-viewer";
import Icon from "react-native-vector-icons/Ionicons";

const UserGuide = () => {
  const pdfUrl = "https://signpostphonebook.in/userguide/User%20Guide-march25.pdf"; // Replace with your PDF URL

  // Request storage permission (Android only)
  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS doesn't require this permission
  };

  // Function to download and open the PDF
  const downloadAndOpenPDF = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Storage access is required to download the PDF.");
      return;
    }

    const { config, fs } = RNFetchBlob;
    const fileDir = Platform.OS === "ios" ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
    const filePath = `${fileDir}/User Guide-march25 (1).pdf`;

    config({
      fileCache: true,
      path: filePath, // Save file
      appendExt: "pdf",
    })
      .fetch("GET", pdfUrl)
      .then((res) => {
        Alert.alert("Download Complete", "File saved successfully.");
        FileViewer.open(res.path()); // Open the file
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to download file.");
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Download PDF</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadAndOpenPDF}>
          <Icon name="download-outline" size={24} color="white" />
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>Click the button to download and open the PDF file.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#aa336a",
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff69b4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  downloadText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginTop: 20,
    textAlign: "center",
  },
});

export default UserGuide;
