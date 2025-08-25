import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
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
  Animated,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface ActionCardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface SessionCardProps {
  subject: string;
  time: string;
  duration: string;
  status: 'completed' | 'upcoming';
  color: string;
  onPress: () => void;
}

interface ScheduleModalProps {
  visible: boolean;
  onClose: () => void;
}

const HomeLayout = () => {
  const [studiedToday, setStudiedToday] = useState(45); // minutes
  const [isStudying, setIsStudying] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [levelProgress] = useState(new Animated.Value(0));
  
  const dailyGoal = 60; // minutes
  const progressPercentage = (studiedToday / dailyGoal) * 100;

  const router = useRouter();
  const [isAppReady, setIsAppReady] = useState(true);

  // Handle initial state
  useEffect(() => {
    // Any initialization logic can go here
    setIsAppReady(true);
  }, []);

  // Show loading state if app is not ready
  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Define a more specific type for our user data
  interface UserData {
    name: string;
    level: number;
    streak: number;
    xp: number;
    coins: number;
    avatar: string;
  }

  // Initialize user data with default values
  const userData: UserData = {
    name: 'Ethan',
    level: 1,
    streak: 0,
    xp: 0,
    coins: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  };

  // Calculate level progress (0-100%)
  const currentLevelXP = userData.xp % 1000;
  const levelProgressPercent = (currentLevelXP / 1000) * 100;

  useEffect(() => {
    // Animate level progress bar on mount
    Animated.timing(levelProgress, {
      toValue: levelProgressPercent,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [levelProgressPercent]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying]);

  const handleStartStudy = () => {
    if (isStudying) {
      // Stop studying
      Alert.alert(
        'End Study Session',
        `You studied for ${Math.floor(studyTimer / 60)}m ${studyTimer % 60}s. Great job!`,
        [
          {
            text: 'Continue',
            style: 'cancel'
          },
          {
            text: 'End Session',
            onPress: () => {
              setIsStudying(false);
              setStudiedToday(prev => prev + Math.floor(studyTimer / 60));
              setStudyTimer(0);
            }
          }
        ]
      );
    } else {
      // Start studying
      setIsStudying(true);
      setStudyTimer(0);
    }
  };

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'No new notifications');
  };

  const handleSessionPress = (subject: string, status: 'completed' | 'upcoming') => {
    if (status === 'upcoming') {
      Alert.alert(
        'Start Session',
        `Would you like to start your ${subject} session now?`,
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Start Now', onPress: handleStartStudy }
        ]
      );
    } else {
      Alert.alert('Session Completed', `${subject} session completed successfully!`);
    }
  };

  const actionItems = [
    { 
      title: isStudying ? 'End Study' : 'Start Study', 
      icon: isStudying ? 'stop' : 'play-arrow', 
      color: isStudying ? '#FF3B30' : '#007AFF', 
      onPress: handleStartStudy 
    },
    { 
      title: 'Schedule', 
      icon: 'schedule', 
      color: '#FF6B35', 
      onPress: handleSchedule 
    },
  ];

  const todaySessions = [
    { subject: 'Calculus - Derivatives', time: '9:00 - 10:30', duration: '1h 30m', status: 'completed' as const, color: '#007AFF' },
    { subject: 'Physics', time: '2:00 - 3:15', duration: '1h 15m', status: 'completed' as const, color: '#4CAF50' },
    { subject: 'Quantum Mechanics', time: '7:00 - 8:15', duration: '1h 15m', status: 'upcoming' as const, color: '#9C27B0' },
    { subject: 'Organic Chemistry', time: '8:30 - 9:45', duration: '1h 15m', status: 'upcoming' as const, color: '#FF9800' },
  ];

  const weeklyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 },
    { day: 'Fri', hours: 2.9 },
    { day: 'Sat', hours: 1.5 },
    { day: 'Sun', hours: 3.0 },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ActionCard: React.FC<ActionCardProps> = ({ title, icon, color, onPress }) => (
    <TouchableOpacity 
      style={styles.actionCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const SessionCard: React.FC<SessionCardProps> = ({ subject, time, duration, status, color, onPress }) => (
    <TouchableOpacity 
      style={styles.sessionCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.sessionBar, { backgroundColor: color }]} />
      <View style={styles.sessionContent}>
        <Text style={styles.sessionSubject}>{subject}</Text>
        <Text style={styles.sessionTime}>{time}</Text>
        <Text style={styles.sessionDuration}>{duration}</Text>
      </View>
      <View style={styles.sessionStatusContainer}>
        <Text style={[
          styles.sessionStatus,
          { color: status === 'completed' ? '#4CAF50' : '#007AFF' }
        ]}>
          {status === 'completed' ? 'Completed' : 'Upcoming'}
        </Text>
        {status === 'completed' && (
          <Icon name="check-circle" size={16} color="#4CAF50" style={{ marginLeft: 4 }} />
        )}
      </View>
    </TouchableOpacity>
  );

  const ScheduleModal: React.FC<ScheduleModalProps> = ({ visible, onClose }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Schedule</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalText}>Schedule management coming soon!</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section with Profile and Streak */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <TouchableOpacity activeOpacity={0.8}>
              <Image 
                source={{ uri: userData.avatar }} 
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.userName}>{userData.name}</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.streakContainer}>
              <IconCommunity name="fire" size={20} color="#FF6B35" />
              <Text style={styles.streakNumber}>{userData.streak}</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={handleNotifications}>
              <Icon name="notifications-none" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Level Progress Section - Enhanced */}
        <View style={styles.levelSection}>
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Level {userData.level}</Text>
              </View>
              <View style={styles.xpContainer}>
                <Text style={styles.xpText}>{currentLevelXP}/1000 XP</Text>
                <View style={styles.coinsContainer}>
                  <IconCommunity name="currency-usd" size={16} color="#FFD700" />
                  <Text style={styles.coinsText}>{userData.coins}</Text>
                </View>
              </View>
            </View>
            <View style={styles.levelProgressContainer}>
              <View style={styles.levelProgressBg}>
                <Animated.View 
                  style={[
                    styles.levelProgressFill,
                    {
                      width: levelProgress.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      }),
                    }
                  ]} 
                />
              </View>
              <Text style={styles.levelProgressText}>{Math.round(levelProgressPercent)}%</Text>
            </View>
          </View>
        </View>

        {/* Study Timer (when active) */}
        {isStudying && (
          <View style={styles.timerSection}>
            <View style={styles.timerCard}>
              <Text style={styles.timerTitle}>Study Session Active</Text>
              <Text style={styles.timerTime}>{formatTime(studyTimer)}</Text>
              <View style={styles.timerPulse} />
            </View>
          </View>
        )}

        {/* This Week's Study Hours */}
        <View style={styles.weeklySection}>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>This Week's Study Hours</Text>
            <View style={styles.chartBars}>
              {weeklyData.map((day, index) => (
                <TouchableOpacity key={index} style={styles.barContainer} activeOpacity={0.7}>
                  <Text style={styles.barHours}>{day.hours}h</Text>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: Math.max((day.hours / maxHours) * 80, 8),
                        backgroundColor: day.hours === maxHours ? '#007AFF' : '#3A3A3C'
                      }
                    ]} 
                  />
                  <Text style={[
                    styles.barLabel,
                    { color: day.hours === maxHours ? '#007AFF' : '#8E8E93' }
                  ]}>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Today's Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressTime}>{studiedToday}/{dailyGoal} min</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: progressPercentage >= 100 ? '#4CAF50' : '#007AFF'
                  }
                ]} 
              />
            </View>
            <Text style={[
              styles.progressPercentage,
              { color: progressPercentage >= 100 ? '#4CAF50' : '#FFFFFF' }
            ]}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          
          {progressPercentage >= 100 && (
            <View style={styles.goalAchieved}>
              <Icon name="emoji-events" size={20} color="#FFD700" />
              <Text style={styles.goalAchievedText}>Daily goal achieved!</Text>
            </View>
          )}
        </View>

        {/* Action Items */}
        <View style={styles.actionsSection}>
          <View style={styles.actionsGrid}>
            {actionItems.map((action, index) => (
              <ActionCard key={index} {...action} />
            ))}
          </View>
        </View>

        {/* Today's Sessions */}
        <View style={styles.sessionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Sessions</Text>
            <TouchableOpacity onPress={() => Alert.alert('View All', 'All sessions view coming soon!')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sessionsList}>
            {todaySessions.map((session, index) => (
              <SessionCard 
                key={index} 
                {...session} 
                onPress={() => handleSessionPress(session.subject, session.status as 'completed' | 'upcoming')}
              />
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <ScheduleModal visible={showScheduleModal} onClose={() => setShowScheduleModal(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  streakNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  levelCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  levelProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelProgressBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
    minWidth: 35,
  },
  timerSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  timerCard: {
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  timerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  timerTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  timerPulse: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    top: 20,
    right: 20,
    opacity: 0.8,
  },
  weeklySection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 5,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barHours: {
    fontSize: 10,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '500',
  },
  bar: {
    width: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressTime: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
    minWidth: 35,
  },
  goalAchieved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  goalAchievedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 8,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sessionsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  sessionsList: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionBar: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 16,
  },
  sessionContent: {
    flex: 1,
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  sessionDuration: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  sessionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    width: width * 0.85,
    maxWidth: 350,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
export default HomeLayout;