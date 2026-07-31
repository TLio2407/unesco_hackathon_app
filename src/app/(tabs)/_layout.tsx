import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useLanguageDialect } from '@/i18n/regional';
import { ThemedText } from '@/components/themed-text';
import { t } from '@/i18n';

function HeaderLanguageToggle() {
  const theme = useTheme();
  const [dialect, setDialect] = useLanguageDialect();
  const isEn = dialect === 'en';

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.surfaceElevated,
        borderColor: theme.primaryAction,
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 12,
        gap: 6,
      }}
      onPress={() => setDialect(isEn ? 'vi-north' : 'en')}
      accessibilityRole="button"
      accessibilityLabel={`Switch language. Current: ${isEn ? 'English' : 'Tiếng Việt'}`}>
      <Ionicons name="globe-outline" size={16} color={theme.primaryAction} />
      <ThemedText style={{ fontSize: 13, fontWeight: '700', color: theme.primaryAction }}>
        {isEn ? 'EN' : 'VN'}
      </ThemedText>
    </Pressable>
  );
}

export default function TabLayout() {
  const theme = useTheme();
  const [dialect] = useLanguageDialect(); // re-render layout when language toggles

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.primaryAction,
      tabBarInactiveTintColor: theme.textSecondary,
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 2 },
      tabBarItemStyle: { paddingHorizontal: 0 },
      tabBarStyle: {
        height: 62,
        paddingBottom: 6,
        paddingTop: 6,
        backgroundColor: theme.surfaceCard,
        borderTopColor: theme.cardBorder,
      },
      headerStyle: {
        backgroundColor: theme.surfaceCard,
        borderBottomColor: theme.cardBorder,
        borderBottomWidth: 1,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        color: theme.text,
        fontSize: 17,
        fontWeight: '700',
      },
      headerTintColor: theme.text,
      headerRight: () => <HeaderLanguageToggle />,
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: t('companion.title'), 
          tabBarLabel: t('tab.companion'),
          tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={22} color={color} /> 
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t('alert.title'),
          tabBarLabel: t('tab.alerts'),
          tabBarIcon: ({ color }) => <Ionicons name="warning" size={22} color={color} />
        }}
      />
      <Tabs.Screen 
        name="learning" 
        options={{ 
          title: t('learning.title'), 
          tabBarLabel: t('tab.learning'),
          tabBarIcon: ({ color }) => <Ionicons name="book" size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="trusted_circle" 
        options={{ 
          title: t('circle.title'), 
          tabBarLabel: t('tab.circle'),
          tabBarIcon: ({ color }) => <Ionicons name="people" size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="community" 
        options={{ 
          title: t('community.title'), 
          tabBarLabel: t('tab.community'),
          tabBarIcon: ({ color }) => <Ionicons name="megaphone" size={22} color={color} /> 
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: t('profile.title'), 
          tabBarLabel: t('tab.profile'),
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={22} color={color} /> 
        }} 
      />
    </Tabs>
  );
}
