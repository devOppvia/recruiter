import React, { useState } from 'react';
import OnboardingLayout from './OnboardingLayout';
import Step1Account from './Step1Account';
import Step2Verification from './Step2Verification';
import Step2Company from './Step2Company';
import Step3Location from './Step3Location';
import Step4Socials from './Step4Socials';
import StatusPending from './StatusPending';

const RegistrationWizard = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        contactName: '',
        designation: '',
        phone: '',
        email: '',
        password: '',
        companyName: '',
        industry: '',
        companySize: '',
        website: '',
        description: '',
        address: '',
        city: '',
        state: '',
        country: '',
        linkedin: '',
        instagram: '',
        youtube: '',
    });

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    if (step > 5) {
        return <StatusPending />;
    }

    const stepsDetails = {
        1: {
            title: "Executive Account",
            subtitle: "Set up your recruiter profile and secure your access.",
            component: Step1Account
        },
        2: {
            title: "Identity Verification",
            subtitle: "Please verify your email and phone number to continue.",
            component: Step2Verification
        },
        3: {
            title: "Company Profile",
            subtitle: "Help potential interns understand your organization's mission.",
            component: Step2Company
        },
        4: {
            title: "Global Presence",
            subtitle: "Where do you operate? Set your primary and branch locations.",
            component: Step3Location
        },
        5: {
            title: "Digital Ecosystem",
            subtitle: "Connect your professional circles and brand profile.",
            component: Step4Socials
        }
    };

    const CurrentStepComponent = stepsDetails[step].component;

    return (
        <OnboardingLayout
            currentStep={step}
            totalSteps={5}
            title={stepsDetails[step].title}
            subtitle={stepsDetails[step].subtitle}
        >
            <CurrentStepComponent
                onNext={nextStep}
                onBack={prevStep}
                data={formData}
                updateData={updateFormData}
            />
        </OnboardingLayout>
    );
};

export default RegistrationWizard;
