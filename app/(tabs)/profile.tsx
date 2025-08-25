import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { MaterialCommunityIcons as IconCommunity } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconLibrary?: 'material' | 'community';
  onPress?: () => void;
  showArrow?: boolean;
  rightComponent?: React.ReactNode;
  color?: string;
}

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfilePage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const userData = {
    name: 'Ethan',
    email: 'ethan.study@email.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handleNotificationSettings = () => {
    Alert.alert('Notification Settings', 'Advanced notification settings coming soon!');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy & Security', 'Privacy settings coming soon!');
  };

  const handleDataBackup = () => {
    Alert.alert('Data & Backup', 'Backup settings coming soon!');
  };

  const handleSupport = () => {
    Alert.alert('Help & Support', 'Support page coming soon!');
  };

  const handleAbout = () => {
    Alert.alert('About', 'StudyApp v1.0.0\nMade with ❤️');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Signed out successfully') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account deletion requested') }
      ]
    );
  };

  const SettingItem: React.FC<SettingItemProps> = ({ 
    title, 
    subtitle, 
    icon, 
    iconLibrary = 'material',
    onPress, 
    showArrow = true, 
    rightComponent,
    color = '#8E8E93'
  }) => {
    const IconComponent = iconLibrary === 'community' ? IconCommunity : Icon;
    
    return (
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={onPress} 
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: color + '20' }]}>
            <IconComponent name={icon as any} size={20} color={color} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        {rightComponent || (showArrow && <Icon name="keyboard-arrow-right" size={20} color="#8E8E93" />)}
      </TouchableOpacity>
    );
  };

  const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.settingsList}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => {}}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Quick Info */}
        <View style={styles.profileQuickInfo}>
          <View style={styles.profileCard}>
            <TouchableOpacity activeOpacity={0.8}>
              <Image 
                source={{ uri: userData.avatar }} 
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>
            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Icon name="edit" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <SettingSection title="Account">
          <SettingItem
            title="Edit Profile"
            subtitle="Update your personal information"
            icon="person-outline"
            color="#007AFF"
            onPress={handleEditProfile}
          />
          <SettingItem
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
            icon="security"
            color="#4CAF50"
            onPress={handlePrivacy}
          />
          <SettingItem
            title="Data & Backup"
            subtitle="Backup and restore your data"
            icon="cloud-upload"
            color="#FF6B35"
            onPress={handleDataBackup}
          />
        </SettingSection>

        {/* App Settings */}
        <SettingSection title="App Settings">
          <SettingItem
            title="Notifications"
            subtitle={notificationsEnabled ? "Enabled" : "Disabled"}
            icon="notifications-none"
            color="#9C27B0"
            onPress={handleNotificationSettings}
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#2C2C2E', true: '#007AFF40' }}
                thumbColor={notificationsEnabled ? '#007AFF' : '#8E8E93'}
              />
            }
            showArrow={false}
          />
          <SettingItem
            title="Dark Mode"
            subtitle="Always enabled in this app"
            icon="brightness-2"
            color="#FFD700"
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#2C2C2E', true: '#007AFF40' }}
                thumbColor={darkModeEnabled ? '#007AFF' : '#8E8E93'}
                disabled={true}
              />
            }
            showArrow={false}
          />
          <SettingItem
            title="Sound Effects"
            subtitle={soundEnabled ? "Enabled" : "Disabled"}
            icon="volume-up"
            color="#FF3B30"
            rightComponent={
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#2C2C2E', true: '#007AFF40' }}
                thumbColor={soundEnabled ? '#007AFF' : '#8E8E93'}
              />
            }
            showArrow={false}
          />
        </SettingSection>

        {/* Support & Info */}
        <SettingSection title="Support & Information">
          <SettingItem
            title="Help & Support"
            subtitle="Get help and contact support"
            icon="help-outline"
            color="#00BCD4"
            onPress={handleSupport}
          />
          <SettingItem
            title="Rate the App"
            subtitle="Leave a review on the App Store"
            icon="star-outline"
            color="#FFD700"
            onPress={() => Alert.alert('Rate App', 'Thanks for considering rating our app!')}
          />
          <SettingItem
            title="About"
            subtitle="App version and information"
            icon="info-outline"
            color="#8E8E93"
            onPress={handleAbout}
          />
        </SettingSection>

        {/* Account Actions */}
        <View style={styles.actionButtonsSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Icon name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
            <Icon name="delete-forever" size={20} color="#FF3B30" />
            <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  profileQuickInfo: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  settingsList: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  actionButtonsSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  signOutButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  deleteAccountButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteAccountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ProfilePage;