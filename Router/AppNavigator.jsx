// navigation/AppNavigator.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Logo from '../src/screens/SplashScreen';
import LoginOrSignUp from '../src/screens/LoginOrSignUp';
import LoginPage from '../src/screens/LoginPage';
import SignUp from '../src/screens/SignUp';
import OtpScreen from '../src/screens/OtpScreen';
import RegistrationForm from '../src/screens/RegistrationForm';
import MoreDetails from '../src/screens/MoreDetails';
import FirstPasswordCreation from '../src/screens/FirstPasswordCreation';
import ForgetPassword from '../src/screens/ForgetPassword';
import ForgetOtpScreen from '../src/screens/ForgetOtpScreen';
import CreateNewPassword from '../src/screens/CreateNewPassword';
import Dashboard from '../src/screens/DashBoard';
import ShareReport from '../src/screens/ShareReport';
import Preview from '../src/screens/Preview';
import ReportViewer from '../src/screens/ReportViewer';
import PreviewPDF from '../src/screens/PreviewPDF';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [patientDetails, setPatientDetails] = useState({});
    // const [initialRoute, setInitialRoute] = useState('Home');

    // useEffect(() => {
    //   const determineInitialRoute = async () => {
    //     const currentScreen = await getCurrentScreen();
    //     setInitialRoute(currentScreen);
    //   };
    //   determineInitialRoute();
    // }, []);

  return (

      <Stack.Navigator initialRouteName="Home">
         <Stack.Screen name="Home" component={Logo}  options={{ headerShown: false }}/>
         <Stack.Screen name="LoginOrSignUp" component={LoginOrSignUp} />
         <Stack.Screen name="LoginPage" component={LoginPage} />
         <Stack.Screen name="SignUp">
         {props => <SignUp {...props} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />}
         </Stack.Screen>
         <Stack.Screen name="OtpScreen">
          {props => <OtpScreen {...props} phoneNumber={phoneNumber} />}
        </Stack.Screen>
        <Stack.Screen name="RegistrationForm">
          {props => (
            <RegistrationForm
              {...props}
              phoneNumber={phoneNumber}
              patientDetails={patientDetails}
              setPatientDetails={setPatientDetails}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="MoreDetails">
         {props => <MoreDetails {...props} phoneNumber={phoneNumber} patientDetails={patientDetails} />}
         </Stack.Screen>
         <Stack.Screen name="FirstPasswordCreation" component={FirstPasswordCreation} />
         <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
         <Stack.Screen name="ForgetOtpScreen" component={ForgetOtpScreen} />
         <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
         <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
         <Stack.Screen name="ShareReport" component={ShareReport} />
         <Stack.Screen name="ReportViewer" component={ReportViewer} />
         <Stack.Screen name="Preview" component={Preview} />
         <Stack.Screen name="PreviewPDF" component={PreviewPDF} />
      </Stack.Navigator>
    
  );
};

export default AppNavigator;