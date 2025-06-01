import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { db } from '../services/db';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && !userId) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const input = email.trim();
        let userEmail = input;

        // Check if input is a userId (doesn't contain @ or .)
        if (!input.includes('@') && !input.includes('.')) {
          const uidLower = input.toLowerCase().replace(/^@/, '');
          
          // Query Firestore for user with matching userId
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('userId', '==', uidLower));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            Alert.alert('Error', 'User not found');
            return;
          }
          
          // Get the email from the first matching document
          userEmail = querySnapshot.docs[0].data().email;
        }

        await signInWithEmailAndPassword(auth, userEmail, password);
        Alert.alert('Success', 'Logged in successfully!');
      } else {
        const userIdClean = userId.trim().toLowerCase().replace(/^@/, '');
        
        if (!userIdClean) {
          Alert.alert('Error', 'Please enter a valid user ID');
          return;
        }

        // Check if userId is already taken
        const userDoc = await getDoc(doc(db, 'users', userIdClean));
        if (userDoc.exists()) {
          Alert.alert('Error', 'This user ID is already taken');
          return;
        }

        // Create the user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', userIdClean), {
          email,
          userId: userIdClean,
          createdAt: Date.now(),
          uid: userCredential.user.uid
        });

        Alert.alert('Success', 'Account created successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          
          <View style={styles.form}>
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="User ID (e.g., @username)"
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
                autoComplete="off"
                editable={!loading}
              />
            )}
            
            <TextInput
              style={styles.input}
              placeholder={isLogin ? "Email or User ID" : "Email"}
              value={email}
              onChangeText={setEmail}
              keyboardType={isLogin ? "default" : "email-address"}
              autoCapitalize="none"
              autoComplete={isLogin ? "off" : "email"}
              editable={!loading}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.authButton, loading && styles.disabledButton]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.authButtonText}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              <Text style={styles.switchButtonText}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827', // gray-900
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
    color: '#111827', // gray-900
  },
  authButton: {
    backgroundColor: '#10B981', // emerald-500
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#10B981', // emerald-500
    fontSize: 14,
  },
});

export default AuthScreen; 