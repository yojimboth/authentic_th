export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  OrderDetail: { orderId: string };
  EditItem: { itemId: string };
  EditProfile: undefined;
  NotificationPreferences: undefined;
  PrinterConfiguration: undefined;
  HelpSupport: undefined;
};

export type MainTabParamList = {
  Orders: undefined;
  Menu: undefined;
  Analytics: undefined;
  Profile: undefined;
};