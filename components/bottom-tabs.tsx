import { withLayoutContext } from 'expo-router';
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from '@bottom-tabs/react-navigation';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

// Define the tab bar icon type
type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

type TabBarIcon = (props: TabBarIconProps) => React.ReactNode;

type ExtendedTabNavigationOptions = Omit<NativeBottomTabNavigationOptions, 'tabBarIcon'> & {
  tabBarIcon?: TabBarIcon;
};

export const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

export const Tabs = withLayoutContext<
  ExtendedTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);
