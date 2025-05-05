import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from './AuthContext';

const Login = ({navigation}) => {
  const {Login} = useContext(AuthContext);
  const [mobileno, setMobileno] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true); // State for password visibility

  const handleLogin = () => {
    Login(mobileno, password, navigation);
    setMobileno('');
    setPassword('');
    setSecureText(true); // Reset password visibility on login
  };

  const handlePassword = (text) => {
    setPassword(text.toLowerCase());
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background Only at the Top */}
      <LinearGradient colors={['#FF69B4', '#FFFFFF']} style={styles.topSection}>
        <Image
          source={require('../src/assets/images/comaany-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.cpyname}>Signpost Phone Book</Text>
      </LinearGradient>

      {/* White Card Covering Bottom Section */}
      <View style={styles.card}>
        <Text style={styles.header}>
          <Text style={styles.loginText}>Log in</Text> to your account.
        </Text>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            maxLength={10}
            value={mobileno}
            onChangeText={setMobileno}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={secureText} // Toggle password visibility
            placeholderTextColor="#999"
            value={password}
            onChangeText={handlePassword}
          />
          
          {/* Show Eye Icon Only If Password is Entered */}
          {password.length > 0 && (
            <TouchableOpacity
              onPress={() => setSecureText(!secureText)}
              style={styles.eyeIcon}
            >
              <Icon name={secureText ? 'eye-slash' : 'eye'} size={20} color="#555" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>
            Note: Your Password is signpost
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 150,
    height: 50,
  },
  cpyname: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -20,
    alignItems: 'center',
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  loginText: {
    color: '#FF69B4',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "black",
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    color: '#FF69B4',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF69B4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: '#888',
  },
  signupLink: {
    color: '#FF69B4',
    fontWeight: 'bold',
  },
});

export default Login;
