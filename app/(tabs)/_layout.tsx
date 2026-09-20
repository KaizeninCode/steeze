import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: {backgroundColor: '#000', borderColor: 'none'},tabBarVariant: 'uikit', tabBarActiveTintColor: '#fde047' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
