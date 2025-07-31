import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="my-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <h2>Introduction</h2>
            <p>
              Muscle Buddy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <ul>
              <li>Account information (email address, name)</li>
              <li>Health and fitness data you provide</li>
              <li>Photos and videos for posture and movement analysis</li>
              <li>Exercise preferences and goals</li>
            </ul>

            <h3>Usage Information</h3>
            <ul>
              <li>App usage statistics and analytics</li>
              <li>Device information and operating system</li>
              <li>IP address and general location data</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide AI-powered health and fitness analysis</li>
              <li>Generate personalized exercise plans</li>
              <li>Improve our services and user experience</li>
              <li>Communicate with you about your account and services</li>
              <li>Ensure the security and integrity of our platform</li>
            </ul>

            <h2>Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption and security measures. We use Supabase as our backend service provider, which complies with SOC 2 Type II standards and provides enterprise-grade security.
            </p>

            <h2>Data Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties except:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With trusted service providers who assist in app functionality</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of certain data processing activities</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your personal information only as long as necessary to provide our services and fulfill the purposes outlined in this policy. You may request deletion of your account and data at any time.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p>
              Email: privacy@musclebuddy.com<br />
              Address: [Your Business Address]
            </p>

            <h2>Health Information Disclaimer</h2>
            <p>
              Muscle Buddy provides fitness and wellness information for educational purposes only. Our AI analysis and exercise recommendations are not intended to replace professional medical advice, diagnosis, or treatment. Always consult with healthcare professionals before starting any exercise program.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}