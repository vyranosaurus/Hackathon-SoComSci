# weAId - Smart Healthcare Waiting System

Ever waited hours at a hospital just because you arrived later than someone with a minor issue? We built weAId to solve this frustrating problem that affects millions of patients daily.

weAId is a medical triage and queue management platform that rethinks the traditional "first come, first served" approach. Using AI to evaluate symptom severity, we ensure patients with urgent needs get seen faster, while giving everyone realistic wait time estimates.


https://github.com/user-attachments/assets/77b66a0f-2943-4a89-86dd-b7381ee50995


## The Problem We're Solving

Traditional hospital waiting systems are inefficient and sometimes dangerous:
- Patients with urgent conditions might wait too long
- People have no idea how long they'll be waiting
- Medical staff lack tools to prioritize effectively
- Communication between patients and providers is limited

## Key Features

- **Smart Triage**: Our AI analyzes symptoms to assign priority levels - no more waiting based solely on arrival time!
- **Real-time Updates**: See your place in line and how long until you're seen
- **Hospital Dashboard**: Gives medical staff the big picture with AI insights to manage resources
- **Patient Portal**: Easy way to message your doctor or the hospital
- **Emergency Button**: One-tap access to emergency services when seconds count

## Tech Stack

We built weAId using:
- React.js with React Router for a smooth single-page experience
- CSS Modules for component-specific styling
- Custom color theming with CSS variables
- React Icons (Font Awesome) for consistent visuals
- Context API with hooks for state management
- Mobile-first responsive design (it works great on phones!)

## Application Views

### Landing Page
Your first stop in the app - choose whether you're a patient or hospital staff. We added a sliding background of real hospitals to create a sense of place and trust.

![Landing Page](./images/landing-page.png)

### Hospital Partner Login
Secure authentication for medical professionals. Select your hospital, enter credentials, and access the powerful hospital dashboard.

![Hospital Login](./images/hospital-login.png)

### Hospital Dashboard
The command center for medical staff with:
- AI insights that help allocate staff where needed
- Patient queue that updates in real-time
- Detailed info cards with symptom severity scores
- Smart notifications about critical patients
- Add patients with our AI analyzing their symptoms automatically

![Hospital Dashboard](./images/hospital-dashboard.png)

### Patient Dashboard
Personalized patient view showing:
- Your current place in line with expected wait time
- Personal profile details
- Message history with your healthcare team
- Emergency call button for urgent situations

![Patient Dashboard](./images/patient-dashboard.png)

### Patient Portal
The communication hub between patients and providers:
- Send messages to either the hospital or your specific doctor
- Check your current queue status
- Access emergency services when needed

![Patient Portal](./images/patient-portal.png)

## Our Journey

We built weAId during an intense hackathon focused on applying social computing to healthcare problems. Our team identified the waiting room experience as a critical pain point that technology could solve.

The application shows how AI doesn't need to replace healthcare workers - it can make them more effective and improve patient experiences dramatically.

## Where We're Headed

We're just getting started! Future plans include:
- Integrating with hospital electronic medical record systems
- Improving our triage algorithm with more training data
- Adding support for multiple languages
- Making the app fully accessible to all users
- Building dedicated mobile apps

## License

This project is licensed under the MIT License - see the LICENSE file for details.


