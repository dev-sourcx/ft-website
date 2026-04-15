import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 flex flex-col justify-end">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-white/80 mt-2 text-lg font-medium">Find Teacher Mobile Application</p>
        </div>

        <div className="p-8 md:p-12 prose dark:prose-invert prose-slate max-w-none">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">Last Updated: 14.04.26</p>

          <p className="text-lg leading-relaxed mb-8">
            Find Teacher we is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application, Find Teacher App".
          </p>

          <p className="text-lg leading-relaxed mb-12">
            Please read this Privacy Policy carefully. By using the App, you consent to the data practices described in this policy.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">1</span>
              Information We Collect
            </h2>
            <p className="mb-4 text-slate-600 dark:text-slate-300">We collect information that you provide directly to us when you create an account, complete your profile, or communicate with us.</p>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-4">A. Student Information</h3>
                <ul className="space-y-3 list-none p-0 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start"><span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span><span className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Personal Details:</span> First name, last name, email address, phone number, gender, and date of birth.</span></li>
                  <li className="flex items-start"><span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span><span className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Academic Details:</span> School/college name and current grade.</span></li>
                  <li className="flex items-start"><span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span><span className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Profile Media:</span> Profile photograph and address details.</span></li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-4">B. Teacher Information</h3>
                <ul className="space-y-3 list-none p-0 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start"><span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span><span className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Personal & Professional Details:</span> Title, full name, professional title, short biography, teaching experience, and home address.</span></li>
                  <li className="flex items-start"><span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span><span className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Academic Details:</span> Subjects offered, teaching grades, and educational qualifications.</span></li>
                  <li className="flex items-start"><span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span><span className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Verification Documents:</span> To maintain the safety of our platform, we collect sensitive verification data, including:
                    <ul className="mt-3 ml-1 space-y-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 marker:text-purple-400">
                      <li>South African ID Proof (Image/Document).</li>
                      <li>Proof of Home Address.</li>
                      <li>Academic Qualification Certificates/Transcripts.</li>
                    </ul>
                  </span></li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-lg font-bold text-pink-600 dark:text-pink-400 mb-4">C. Automatically Collected Information</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-snug">
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Device Information:</span> We may collect information about your mobile device, including device ID, model, operating system, and App usage statistics via services like Expo.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">2</span>
              How We Use Your Information
            </h2>
            <p className="mb-4 text-slate-600 dark:text-slate-300">We use the information we collect to:</p>
            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Facilitate Connections:</span> Match students with appropriate teachers based on subjects and grades.</p></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Verification (For Teachers):</span> Verify the identity and credentials of teachers to ensure a safe learning environment.</p></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Enable Communication:</span> Facilitate video and voice calls between students and teachers.</p></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Account Management:</span> Create and maintain your user profile and manage authentication.</p></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Improvements:</span> Analyze App usage to improve features and user experience.</p></li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">3</span>
              Permissions & Access
            </h2>
            <p className="mb-4 text-slate-600 dark:text-slate-300">To provide full functionality, the App requests the following permissions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Camera</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Used for capturing profile photos and conducting video calls.</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Microphone</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Used for voice communication during lessons and video calls.</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Photo Library / Storage</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Used to upload verification documents, qualification proofs, and profile images.</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Notifications</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Used to send alerts regarding class requests, messages, and account updates.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">4</span>
              Data Sharing and Disclosure
            </h2>
            <p className="mb-4 text-slate-600 dark:text-slate-300">We do not sell your personal data. We may share information in the following circumstances:</p>
            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Between Users:</span> Students can see teacher profiles (Bio, Subjects, Qualifications). Teachers can see student names and grades to prepare for lessons.</p></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Service Providers:</span> We share data with third-party vendors who provide services like cloud hosting (e.g., Firebase), authentication, and analytics.</p></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Legal Requirements:</span> We may disclose information if required by law or in response to valid requests by public authorities.</p></li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">5</span>
              Data Security & Storage
            </h2>
            <p className="mb-6 text-slate-600 dark:text-slate-300">We implement industry-standard security measures to protect your data, especially sensitive documents like SA ID proofs.</p>
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-800/50 dark:to-indigo-900/10 p-6 rounded-2xl border border-slate-100/50 dark:border-slate-700/30">
              <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Encryption:</span> Data is transmitted securely and stored using encrypted cloud services.</p></li>
                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div><p className="leading-snug"><span className="font-semibold text-slate-900 dark:text-slate-200">Retention:</span> We retain your personal information for as long as your account is active. Teacher verification documents are stored securely and accessed only by authorized personnel for audit and safety purposes.</p></li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">6</span>
              Your Rights <span className="font-normal text-slate-400 text-lg ml-1">(POPIA / GDPR Compliance)</span>
            </h2>
            <p className="mb-6 text-slate-600 dark:text-slate-300">Depending on your location (specifically South Africa), you have the following rights:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border-l-4 border-emerald-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl shadow-sm hover:shadow transition-shadow">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Access
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Request a copy of the personal data we hold about you.</p>
              </div>
              <div className="p-5 border-l-4 border-blue-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl shadow-sm hover:shadow transition-shadow">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Correction
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Ask us to update or correct inaccurate information.</p>
              </div>
              <div className="p-5 border-l-4 border-red-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl shadow-sm hover:shadow transition-shadow">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Deletion
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Request the deletion of your account and associated personal data.</p>
              </div>
              <div className="p-5 border-l-4 border-amber-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl shadow-sm hover:shadow transition-shadow">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>
                  Withdrawal of Consent
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">You may withdraw your consent for data processing at any time by closing your account.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">7</span>
              Children's Privacy
            </h2>
            <div className="relative p-7 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/40">
              <svg className="absolute top-4 right-4 w-12 h-12 text-indigo-200 dark:text-indigo-800/50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9zM9 5a1 1 0 012 0v2H9V5z" clipRule="evenodd" /></svg>
              <p className="text-slate-800 dark:text-slate-200 relative z-10 font-medium leading-relaxed">
                The App is intended for students and teachers. If a student is under the age of 18, we encourage parental supervision. We do not knowingly collect personal information from children under 13 without verifiable parental consent.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">8</span>
              Changes to This Policy
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy in the App and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8 p-8 md:p-10 bg-slate-900 dark:bg-slate-800 rounded-3xl text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 dark:opacity-30 mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 dark:opacity-30 mix-blend-screen pointer-events-none"></div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 flex items-center gap-3">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-lg shadow-inner border border-indigo-400/20">9</span>
              Contact Us
            </h2>
            <p className="text-slate-300 mb-8 relative z-10 text-lg">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>

            <div className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 relative z-10 shadow-xl">
              <h3 className="font-bold text-2xl mb-4 text-white">Find Teacher</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-300">
                <div className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="font-medium">Email:</span>
                </div>
                <a href="mailto:admin@findteacher.co.za" className="text-white hover:text-indigo-400 transition-colors text-lg font-medium bg-slate-700/50 hover:bg-slate-700 py-2 px-5 rounded-full">admin@findteacher.co.za</a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-12 text-center text-slate-500 dark:text-slate-400 text-sm pb-8">
        &copy; {new Date().getFullYear()} Find Teacher. All rights reserved.
      </div>
    </div>
  );
}
