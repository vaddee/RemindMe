# RemindMe - Your Personal Reminder App

**RemindMe** is a mobile application built with **React Native**, **Expo**, and **Firebase**. It helps users remember important dates, such as birthdays and holidays like Independence day. The app allows users to create a list of people, save their personal preferences, and receive reminders before important dates.

---

## **About the Application**

RemindMe is designed for users who want to stay organized and never miss an important occasion.  
Key features include:

- Adding names, birthdays, and personal interests.
- Setting reminders for special dates, such as birthdays or holidays.
- Personalized gift suggestions based on interests, powered by OpenAI API.
- Notifications delivered before important dates using expo-notifications.
- Easy-to-use and visually appealing interface.

Whether it's a loved one's birthday or a public holiday like Independence day, **RemindMe** ensures you are always prepared!

--- 

## **Table of Contents**

1. [Technologies Used](#technologies-used)
2. [Installation](#installation)
3. [Firebase Setup](#firebase-setup)
4. [Features](#features)
5. [Issues](#issues)
6. [Authors](#authors)


---

## **Technologies Used**

- **Frontend:** React Native, Expo
- **Backend:** Firebase (Authentication & Firestore)
- **APIs:** 
  - OpenAI API (for gift suggestions)
  - Calendarific API (for public holiday data)
- **Notifications:** Expo Notifications API

---

## **Installation**

Follow these steps to set up and run the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaddee/RemindMe.git
2. **Navigate to the project directory**
   ```bash
   cd RemindMe
3. **Install dependencies**
   ```bash

   npm install
4. **Set up Firebase**
   - If you don't have a Firebase project, create one at Firebase console [`Firebase console`](https://console.firebase.google.com/)

## **Firebase Setup**

1. **Enable firestore Database**
   - Navigate to the Firestore section in your Firebase project.
   - Set up the database in "Test Mode" for development purposes.
2. **Enable Authentication**
   - Go to the Authentication section in your Firebase project.
   - Enable email/password authentication.
3. **Add the Firebase config file**
   Create a .env file in the root directory and add the following:
   
   ```bash

   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id

   CALENDARIFIC_API_KEY=your_calendarific_api_key
   OPENAI_API_KEY=your_openai_api_key

Replace the placeholders with your Firebase configuration details.

## **Running the App**

1. Start the Expo development server:
    ```bash
    npx expo start
    ```

2. Open the app in your preferred emulator or on a physical device:
   - Scan the QR code generated by Expo to open the app in the Expo Go app (available on Android and iOS).

3. **Important Note:**  
   If you want to test the application with realistic notifications (instead of receiving notifications 10 seconds after setting them, which is currently used for testing purposes), follow these steps:

   - **Edit the notification scheduling functions** in the files `SavedNamesScreen.js` and `HolidayRemindersScreen.js`:
     - Locate the **test notification scheduling code** in these files:
       ```javascript
       const testTrigger = new Date(Date.now() + 10000); // 10 seconds from now (for testing purposes)
       ```
     - Comment out or remove the test code.
     - Uncomment the correct notification scheduling logic, as shown in the code comments within these files:
       ```javascript
       const holidayDate = new Date(reminder.holidayDate);
       const reminderDate = new Date(holidayDate);
       reminderDate.setDate(reminderDate.getDate() - reminder.daysBefore); // Schedule X days before the event
       reminderDate.setHours(9, 0, 0); // Set the notification time to 9:00 AM
       ```
   - Save the files and restart the development server.

By making these changes, the app will schedule notifications at realistic times relative to the event dates, ensuring accurate reminders.

2. Open the app in your preferred emulator or on a physical device
   - Scan the QR code generated by Expo to open the app in the Expo Go app (available on Android and iOS).
## **Features**
- Add Names and Birthdays
  Save names, birthdays, and personal interests for each person.
- Set Custom Reminders
  Choose how many days in advance you want to be reminded of an event.
- Gift Suggestions
  Generate personalized gift ideas based on saved interests using OpenAI API.
- Holiday Reminders
  Fetch and save reminders for public holidays, such as Christmas
- Notifications
  Timely alerts before significant dates via Expo Notifications API.
  
  ## **Issues**
  You can report or view issues related to the app here:
  [**RemindMe - Issues page**](https://github.com/vaddee/RemindMe/issues)

  ## **Authors**

  This project was developed by:
 - **Valtteri Laakso**  
  [GitHub Profile](https://github.com/vaddee)




     
