import React from 'react';

export default function AccountDeletion() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="h-40 bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 p-8 flex flex-col justify-end">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Account Deletion Request</h1>
          <p className="text-white/80 mt-2 text-lg font-medium">Steps to securely remove your data</p>
        </div>

        <div className="p-8 md:p-12 prose dark:prose-invert prose-slate max-w-none">
          <p className="text-lg leading-relaxed mb-8">
            To ensure the security of your account, all deletion requests must be verified via email. Please follow the steps below to request the complete removal of your account and personal data from our servers.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm font-bold">1</span>
              Compose an Email
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="mb-4 text-slate-700 dark:text-slate-300">
                Send a formal request from your <strong>registered email address</strong> (the one you used to sign up).
              </p>
              <ul className="space-y-4 text-slate-700 dark:text-slate-300 list-none p-0">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="leading-snug">
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-1">Recipient:</span>
                    Address the email to <a href="mailto:admin@findteacher.co.za" className="text-indigo-600 dark:text-indigo-400 hover:underline">admin@findteacher.co.za</a>
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="leading-snug">
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-1">Subject Line:</span>
                    Use the exact subject: <span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm font-mono text-rose-600 dark:text-rose-400 font-bold">Account Deletion Request - [Your Full Name]</span>
                  </p>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm font-bold">2</span>
              Include Details
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p className="mb-4 text-slate-700 dark:text-slate-300">In the body of the email, please confirm your following information so we can verify your identity:</p>
              <ul className="space-y-3 list-none p-0 text-slate-700 dark:text-slate-300">
                <li className="flex items-center"><span className="mr-3 w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0"></span><span className="font-medium text-slate-900 dark:text-slate-200">Full Name</span></li>
                <li className="flex items-center"><span className="mr-3 w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0"></span><span className="font-medium text-slate-900 dark:text-slate-200">Registered Phone Number</span></li>
                <li className="flex items-center"><span className="mr-3 w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0"></span><span className="font-medium text-slate-900 dark:text-slate-200">Reason for leaving (Optional)</span></li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm font-bold">3</span>
              Processing Period & Confirmation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border-l-4 border-amber-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl shadow-sm hover:shadow transition-shadow">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  30-Day Policy
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Once your request is received, our administration team will verify your identity and process the deletion within 30 days.</p>
              </div>
              <div className="p-5 border-l-4 border-emerald-500 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl shadow-sm hover:shadow transition-shadow">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Confirmation
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">You will receive a final confirmation email once your account and data have been successfully removed from our servers.</p>
              </div>
            </div>
          </section>
          
        </div>
      </div>

      <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Find Teacher. All rights reserved.
      </div>
    </div>
  );
}
