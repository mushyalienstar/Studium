import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

interface SubjectCardProps {
  name: string;
  sessions: number;
  totalTime: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

interface ProgressCardProps {
  icon: string;
  title: string;
  value: string;
  color: string;
}

interface RecentSessionProps {
  subject: string;
  duration: string;
  timeAgo: string;
  percentage: number;
}

const StudyLayout = () => {
  const [currentSubject, setCurrentSubject] = useState('Mathematics');
  const [studyTime, setStudyTime] = useState(22 * 60); // 22 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setStudyTime(studyTime + 1);
      }, 1000);
    } else if (!isRunning && studyTime !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, studyTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const subjects = [
    { name: 'Mathematics', sessions: 12, totalTime: '8h 45m', color: '#007AFF', isSelected: true },
    { name: 'Physics', sessions: 8, totalTime: '6h 20m', color: '#4CAF50', isSelected: false },
    { name: 'Chemistry', sessions: 6, totalTime: '4h 15m', color: '#9C27B0', isSelected: false },
    { name: 'Biology', sessions: 4, totalTime: '3h 30m', color: '#FF9800', isSelected: false },
  ];

  const progressData = [
    { icon: 'access-time', title: 'Time\nStudied', value: '2h 18m', color: '#007AFF' },
    { icon: 'track-changes', title: 'Goal\nProgress', value: '76%', color: '#4CAF50' },
    { icon: 'menu-book', title: 'Sessions', value: '3', color: '#9C27B0' },
  ];

  const recentSessions = [
    { subject: 'Mathematics', duration: '45m', timeAgo: 'Today', percentage: 85 },
    { subject: 'Physics', duration: '30m', timeAgo: 'Yesterday', percentage: 92 },
    { subject: 'Chemistry', duration: '60m', timeAgo: '2 days ago', percentage: 78 },
  ];

  const SubjectCard: React.FC<SubjectCardProps> = ({ name, sessions, totalTime, color, isSelected, onPress }) => (
    <TouchableOpacity 
      style={[styles.subjectCard, isSelected && styles.selectedSubjectCard]} 
      onPress={onPress}
    >
      <View style={styles.subjectCardContent}>
        <View style={[styles.subjectDot, { backgroundColor: color }]} />
        <Text style={styles.subjectName}>{name}</Text>
      </View>
      <View style={styles.subjectStats}>
        <Text style={styles.subjectSessions}>{sessions} sessions</Text>
        <Text style={styles.subjectTime}>{totalTime}</Text>
      </View>
    </TouchableOpacity>
  );

  const ProgressCard: React.FC<ProgressCardProps> = ({ icon, title, value, color }) => (
    <View style={styles.progressCard}>
      <Icon name={icon} size={24} color={color} style={styles.progressIcon} />
      <Text style={styles.progressTitle}>{title}</Text>
      <Text style={styles.progressValue}>{value}</Text>
    </View>
  );

  const RecentSessionCard: React.FC<RecentSessionProps> = ({ subject, duration, timeAgo, percentage }) => (
    <View style={styles.recentSessionCard}>
      <View style={styles.recentSessionInfo}>
        <Text style={styles.recentSessionSubject}>{subject}</Text>
        <View style={styles.recentSessionMeta}>
          <Text style={styles.recentSessionDuration}>{duration}</Text>
          <Text style={styles.recentSessionTime}>{timeAgo}</Text>
        </View>
      </View>
      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>{percentage}%</Text>
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
          <Text style={styles.headerTitle}>Study Session</Text>
          <Text style={styles.headerSubtitle}>Focus and track your learning</Text>
        </View>

        {/* Timer Section */}
        <View style={styles.timerSection}>
          <View style={styles.timerCard}>
            <Text style={styles.currentSubjectLabel}>Current Subject</Text>
            <View style={styles.currentSubjectChip}>
              <Text style={styles.currentSubjectText}>{currentSubject}</Text>
            </View>
            
            <Text style={styles.timerDisplay}>{formatTime(studyTime)}</Text>
            <Text style={styles.timerLabel}>Study Time</Text>
            
            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={[styles.controlButton, styles.startButton]} 
                onPress={() => setIsRunning(!isRunning)}
              >
                <Icon name={isRunning ? 'pause' : 'play-arrow'} size={20} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.stopButton]}
                onPress={() => {
                  setIsRunning(false);
                  setStudyTime(0);
                }}
              >
                <Icon name="stop" size={20} color="#FFFFFF" />
                <Text style={styles.controlButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Subjects Section */}
        <View style={styles.subjectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Subject</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.subjectsGrid}>
            {subjects.map((subject, index) => (
              <SubjectCard 
                key={index} 
                {...subject} 
                onPress={() => setCurrentSubject(subject.name)}
              />
            ))}
          </View>
        </View>

        {/* Today's Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressGrid}>
            {progressData.map((progress, index) => (
              <ProgressCard key={index} {...progress} />
            ))}
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.recentSessionsSection}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <View style={styles.recentSessionsList}>
            {recentSessions.map((session, index) => (
              <RecentSessionCard key={index} {...session} />
            ))}
          </View>
        </View>

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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  timerSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  timerCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  currentSubjectLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 12,
  },
  currentSubjectChip: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
  },
  currentSubjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timerDisplay: {
    fontSize: 64,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 32,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#2C2C2E',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subjectsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSubjectCard: {
    borderColor: '#FFFFFF',
  },
  subjectCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  subjectStats: {
    gap: 2,
  },
  subjectSessions: {
    fontSize: 14,
    color: '#8E8E93',
  },
  subjectTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  progressGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  progressCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    alignItems: 'center',
  },
  progressIcon: {
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recentSessionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  recentSessionsList: {
    gap: 12,
    marginTop: 20,
  },
  recentSessionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentSessionInfo: {
    flex: 1,
  },
  recentSessionSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recentSessionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  recentSessionDuration: {
    fontSize: 14,
    color: '#8E8E93',
  },
  recentSessionTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  percentageContainer: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default StudyLayout;