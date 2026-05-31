export const EMAIL_PRESETS = [
  {
    name: 'Welcome Email',
    type: 'auth',
    subject: 'Welcome to IndianRenters — Start Renting Today 🎉',
    variables: ['{{userName}}', '{{email}}'],
    body: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>Welcome to IndianRenters — Start Renting Today</title>
  <style type="text/css">
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    u + #body a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .benefit-cell { display: block !important; width: 100% !important; padding: 12px 24px !important; }
      .step-number { font-size: 20px !important; }
      .hero-heading { font-size: 22px !important; }
      .full-width-btn { width: 100% !important; display: block !important; text-align: center !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
  <!--[if mso]><style type="text/css">body, table, td, .email-container { font-family: 'Segoe UI', sans-serif !important; }</style><![endif]-->
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

<div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;">Your IndianRenters account is ready — browse 10,000+ products available to rent across 8 cities. Start renting today!</div>
<div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;">&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f6f6f6;">
  <tr><td align="center" style="padding: 24px 12px;">
    <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%;">

      <!-- HEADER -->
      <tr>
        <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 24px 32px; border-bottom: 3px solid #ffcf46;" align="center">
          <a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;">
            <img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="180" height="auto" style="display: block; width: 180px; max-width: 180px; height: auto; border: 0;" />
          </a>
        </td>
      </tr>

      <!-- HERO -->
      <tr>
        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 48px 40px 36px 40px;" class="mobile-padding">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr><td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td bgcolor="#fffbea" style="background-color: #fffbea; border: 1px solid #ffe68a; border-radius: 100px; padding: 6px 16px;">
                    <span style="font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; font-weight: 600; color: #a07800;">Account Activated ✓</span>
                  </td>
                </tr>
              </table>
              <h1 class="hero-heading" style="margin: 20px 0 12px 0; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 28px; font-weight: 700; color: #141414; letter-spacing: -0.8px; line-height: 1.25; text-align: center;">Welcome to IndianRenters, {{userName}}!</h1>
              <p style="margin: 0 auto 28px auto; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 15px; color: #545454; line-height: 24px; text-align: center; max-width: 420px;">Your account is ready. Start renting premium tech &amp; furniture — delivered to your door, without the full ownership cost.</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 32px auto;">
                <tr>
                  <td bgcolor="#f6f6f6" style="background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 12px; padding: 16px 24px; text-align: center;">
                    <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.8px; text-transform: uppercase;">For example — MacBook Pro M3</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                      <tr>
                        <td style="padding-right: 16px; text-align: center; vertical-align: middle;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; text-decoration: line-through;">Buy: ₹1,49,000</span></td>
                        <td style="padding: 0 8px; vertical-align: middle;"><span style="font-size: 18px; color: #e2e2e2;">→</span></td>
                        <td style="padding-left: 16px; text-align: center; vertical-align: middle;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 700; color: #00b505;">Rent: ₹3,499/mo</span></td>
                      </tr>
                    </table>
                    <p style="margin: 6px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #757575;">Save ₹1,45,501 upfront. Upgrade anytime.</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;" align="center">
                    <a href="https://indianrenters.com/products" style="display: inline-block; padding: 14px 36px; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #000000; text-decoration: none; letter-spacing: -0.4px; border-radius: 8px;">Browse Products &nbsp;→</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; text-align: center;">or <a href="https://indianrenters.com/how-it-works" style="color: #0075ff; text-decoration: none; font-weight: 500;">See how renting works →</a></p>
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- DIVIDER -->
      <tr><td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0 40px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td bgcolor="#e2e2e2" style="background-color: #e2e2e2; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table></td></tr>

      <!-- BENEFITS -->
      <tr>
        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 24px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td class="benefit-cell" align="center" valign="top" width="33%" style="padding: 8px 12px;">
                <p style="margin: 10px 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #141414; text-align: center;">💰 Zero Cost Ownership</p>
                <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-align: center; line-height: 18px;">Rent instead of buy.<br/>Pay monthly, not lakhs.</p>
              </td>
              <td class="benefit-cell" align="center" valign="top" width="33%" style="padding: 8px 12px;">
                <p style="margin: 10px 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #141414; text-align: center;">📦 90,000+ Orders</p>
                <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-align: center; line-height: 18px;">Trusted by 30,000+<br/>customers across India.</p>
              </td>
              <td class="benefit-cell" align="center" valign="top" width="33%" style="padding: 8px 12px;">
                <p style="margin: 10px 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #141414; text-align: center;">⭐ 4.9 Rating</p>
                <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-align: center; line-height: 18px;">Top-rated service.<br/>Real reviews, real people.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- STEPS -->
      <tr>
        <td bgcolor="#f6f6f6" style="background-color: #f6f6f6; padding: 8px 24px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px; padding: 32px 32px 28px 32px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr><td style="padding-bottom: 24px;" align="center">
                    <h2 style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 20px; font-weight: 700; color: #141414; letter-spacing: -0.6px; text-align: center;">Your First Rental in 3 Steps</h2>
                    <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; text-align: center;">From browsing to doorstep — it's that simple.</p>
                  </td></tr>
                  <tr><td valign="top">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td valign="top" width="52" style="padding-top: 2px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 50%; width: 36px; height: 36px; text-align: center; vertical-align: middle;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #000; line-height: 36px; display: block;">1</span></td></tr></table></td>
                        <td valign="top" style="padding-bottom: 20px;"><p style="margin: 0 0 3px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #141414;">Browse &amp; Pick Your Product</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px;">Choose from laptops, phones, furniture, appliances &amp; more.</p></td>
                      </tr>
                      <tr>
                        <td valign="top" width="52" style="padding-top: 2px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 50%; width: 36px; height: 36px; text-align: center; vertical-align: middle;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #000; line-height: 36px; display: block;">2</span></td></tr></table></td>
                        <td valign="top" style="padding-bottom: 20px;"><p style="margin: 0 0 3px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #141414;">Choose Your Tenure &amp; Checkout</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px;">Rent from 1 month to 24 months. No hidden charges.</p></td>
                      </tr>
                      <tr>
                        <td valign="top" width="52" style="padding-top: 2px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#00b505" style="background-color: #00b505; border-radius: 50%; width: 36px; height: 36px; text-align: center; vertical-align: middle;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #fff; line-height: 36px; display: block;">3</span></td></tr></table></td>
                        <td valign="top"><p style="margin: 0 0 3px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #141414;">We Deliver — You Enjoy</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px;">White-glove delivery across Delhi, Noida, Bangalore, Mumbai, Hyderabad, Pune, Chennai &amp; Kolkata.</p></td>
                      </tr>
                    </table>
                  </td></tr>
                  <tr><td align="center" style="padding-top: 28px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#141414" style="background-color: #141414; border-radius: 8px;"><a href="https://indianrenters.com/products" style="display: inline-block; padding: 12px 28px; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">Start My First Rental →</a></td></tr></table></td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- TRUST BAR -->
      <tr>
        <td bgcolor="#f6f6f6" style="background-color: #f6f6f6; padding: 20px 32px 24px 32px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr><td bgcolor="#ffffff" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px; padding: 18px 24px;" align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="padding: 0 16px; text-align: center; border-right: 1px solid #e2e2e2;"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 18px; font-weight: 700; color: #141414; line-height: 1.2;">90K+</p><p style="margin: 2px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #757575;">Orders</p></td>
                  <td style="padding: 0 16px; text-align: center; border-right: 1px solid #e2e2e2;"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 18px; font-weight: 700; color: #141414; line-height: 1.2;">30K+</p><p style="margin: 2px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #757575;">Customers</p></td>
                  <td style="padding: 0 16px; text-align: center; border-right: 1px solid #e2e2e2;"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 18px; font-weight: 700; color: #141414; line-height: 1.2;">4.9★</p><p style="margin: 2px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #757575;">Rating</p></td>
                  <td style="padding: 0 16px; text-align: center;"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 18px; font-weight: 700; color: #141414; line-height: 1.2;">8</p><p style="margin: 2px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #757575;">Cities</p></td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td bgcolor="#141414" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 32px 32px 28px 32px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr><td align="center" style="padding-bottom: 20px;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; height: auto; border: 0;" /></a></td></tr>
            <tr><td style="padding-bottom: 20px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table></td></tr>
            <tr><td align="center" style="padding-bottom: 16px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="padding: 0 12px;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td>
                  <td style="padding: 0 12px; border-left: 1px solid #2a2a2a;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">+91 98705 33392</a></td>
                  <td style="padding: 0 12px; border-left: 1px solid #2a2a2a;"><a href="https://indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">indianrenters.com</a></td>
                </tr>
              </table>
            </td></tr>
            <tr><td align="center" style="padding-bottom: 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="padding: 0 8px;"><a href="https://instagram.com/indianrenters" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-decoration: none;">Instagram</a></td>
                  <td style="padding: 0 8px; color: #2a2a2a;">·</td>
                  <td style="padding: 0 8px;"><a href="https://facebook.com/indianrenters" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-decoration: none;">Facebook</a></td>
                  <td style="padding: 0 8px; color: #2a2a2a;">·</td>
                  <td style="padding: 0 8px;"><a href="https://twitter.com/indianrenters" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-decoration: none;">Twitter</a></td>
                  <td style="padding: 0 8px; color: #2a2a2a;">·</td>
                  <td style="padding: 0 8px;"><a href="https://linkedin.com/company/indianrenters" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-decoration: none;">LinkedIn</a></td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding-bottom: 16px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table></td></tr>
            <tr><td align="center">
              <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-align: center; line-height: 18px;">AAA Rental LLP · IndianRenters.com<br/>Registered in India · GSTIN available on request</p>
              <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-align: center;">You received this because you created an account on IndianRenters.com.&nbsp;<a href="https://indianrenters.com/unsubscribe?email={{email}}" style="color: #757575; text-decoration: underline;">Unsubscribe</a>&nbsp;·&nbsp;<a href="https://indianrenters.com/privacy" style="color: #757575; text-decoration: underline;">Privacy Policy</a></p>
            </td></tr>
          </table>
        </td>
      </tr>

      <tr><td style="height: 24px; font-size: 0; line-height: 0;">&nbsp;</td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`,
  },
  {
    name: 'OTP Verification',
    type: 'auth',
    subject: 'Your IndianRenters Verification Code — {{OTP_CODE}}',
    variables: ['{{USER_NAME}}', '{{OTP_CODE}}', '{{EXPIRY_MINUTES}}', '{{purpose}}'],
    body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <meta name="x-apple-disable-message-reformatting">
  <title>Your IndianRenters Verification Code</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style type="text/css">
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; border: 0; line-height: 100%; outline: none; text-decoration: none; }
    a { text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f6f6f6" style="background-color: #f6f6f6; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; width: 100%;">

          <!-- HEADER -->
          <tr>
            <td bgcolor="#ffffff" align="center" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 24px 40px; border-bottom: 3px solid #ffcf46;">
              <a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;">
                <img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com — You Name It, We Rent It" width="180" height="auto" style="display: block; width: 180px; max-width: 180px; height: auto; border: 0;" />
              </a>
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td bgcolor="#ffcf46" height="3" style="background-color: #ffcf46; font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 40px 40px 32px 40px;">

                    <!-- Shield icon -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 20px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td bgcolor="#fffaeb" align="center" valign="middle" width="56" height="56" style="background-color: #fffaeb; border-radius: 14px; width: 56px; height: 56px; border: 1.5px solid #ffcf46;">
                                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTQgMi4zMzJMMy41IDcuMzMyVjE0YzAgNi40MTcgNC40NjcgMTIuNDE3IDEwLjUgMTMuNjY3QzE5LjUzMyAyNi40MTcgMjQuNSAyMC40MTcgMjQuNSAxNFY3LjMzMkwxNCAyLjMzMlpNMTQuOTMzIDIwLjMzM0wxMS42NjcgMTcuMDY3bDEuMzMzLTEuMzMzIDEuOTMzIDEuOTMzIDQuMjY3LTUuMjY3IDEuNDY3IDEuMTY3LTUuNzM0IDYuNzY2WiIgZmlsbD0iI2ZmY2Y0NiIvPjwvc3ZnPg==" alt="Secure" width="28" height="28" style="display: block;">
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Greeting -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr><td align="center" style="padding-bottom: 6px;">
                        <p style="margin: 0; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; font-weight: 400; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; line-height: 1;">Hello, {{USER_NAME}}</p>
                      </td></tr>
                    </table>

                    <!-- Heading -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr><td align="center" style="padding-bottom: 12px;">
                        <h1 style="margin: 0; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 24px; font-weight: 700; color: #141414; letter-spacing: -0.8px; line-height: 1.2;">Your Verification Code</h1>
                      </td></tr>
                    </table>

                    <!-- Subtext -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr><td align="center" style="padding-bottom: 32px;">
                        <p style="margin: 0; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; font-weight: 400; color: #545454; line-height: 22px; max-width: 400px;">Enter this code to <strong style="color: #333333; font-weight: 600;">{{purpose}}</strong>. It expires in {{EXPIRY_MINUTES}} minutes — do not share it with anyone.</p>
                      </td></tr>
                    </table>

                    <!-- OTP Box -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr><td align="center" style="padding-bottom: 32px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td bgcolor="#fffaeb" align="center" style="background-color: #fffaeb; border: 2px solid #ffcf46; border-radius: 12px; padding: 28px 48px;">
                              <p style="margin: 0 0 8px 0; font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', monospace; font-size: 36px; font-weight: 700; color: #141414; letter-spacing: 10px; line-height: 1; text-align: center; mso-line-height-rule: exactly;">{{OTP_CODE}}</p>
                              <p style="margin: 0; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; text-align: center;">Valid for {{EXPIRY_MINUTES}} minutes</p>
                            </td>
                          </tr>
                        </table>
                      </td></tr>
                    </table>

                    <!-- Do not share tip -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr><td align="center" style="padding-bottom: 8px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td valign="top" style="padding-right: 8px; padding-top: 1px;">
                              <span style="font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></span>
                            </td>
                            <td valign="top">
                              <p style="margin: 0; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #757575; line-height: 20px;">IndianRenters will <strong style="color: #333333; font-weight: 600;">never</strong> call or message you asking for this code.</p>
                            </td>
                          </tr>
                        </table>
                      </td></tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td bgcolor="#e2e2e2" height="1" style="background-color: #e2e2e2; font-size: 0; line-height: 0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- SECURITY NOTICE -->
          <tr>
            <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 24px 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td bgcolor="#e9f4ff" style="background-color: #e9f4ff; border-radius: 10px; border: 1px solid #b5d9ff; padding: 16px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td valign="top" width="28" style="padding-right: 12px; padding-top: 1px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td bgcolor="#0075ff" align="center" valign="middle" width="22" height="22" style="background-color: #0075ff; border-radius: 50%; width: 22px; height: 22px; text-align: center; vertical-align: middle; line-height: 22px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-bottom: 1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.75 12c0 6.627 5.373 12 11.25 12S23.25 18.627 23.25 12c0-3.182-1.253-6.068-3.285-8.198" /></svg></td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top">
                          <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff; line-height: 18px;">Didn't request this code?</p>
                          <p style="margin: 0; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #333333; line-height: 20px;">You can safely ignore this email. If you believe someone is attempting to access your account, contact us immediately:</p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 12px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding-right: 20px;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff; text-decoration: none;">support@indianrenters.com</a></td>
                              <td style="padding-right: 20px;"><span style="font-size: 13px; color: #757575;">·</span></td>
                              <td><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff; text-decoration: none;">9870533392</a></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td bgcolor="#141414" align="center" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td align="center" style="padding-bottom: 12px;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
                <tr><td align="center" style="padding-bottom: 16px;"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; letter-spacing: 0.08em; text-transform: uppercase;">"You Name It, We Rent It"</p></td></tr>
                <tr><td style="padding-bottom: 16px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td bgcolor="#333333" height="1" style="background-color: #333333; font-size: 0; line-height: 0;">&nbsp;</td></tr></table></td></tr>
                <tr><td align="center" style="padding-bottom: 12px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right: 16px;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td>
                      <td style="padding-right: 16px;"><span style="font-size: 12px; color: #333333;">·</span></td>
                      <td><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">9870533392</a></td>
                    </tr>
                  </table>
                </td></tr>
                <tr><td align="center">
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #333333; line-height: 18px;">© 2025 AAA Rental LLP · IndianRenters.com</p>
                  <p style="margin: 4px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #333333; line-height: 18px;">Mon–Sat, 10 AM – 7:30 PM · Delhi, Noida, Bangalore &amp; more</p>
                </td></tr>
              </table>
            </td>
          </tr>

          <tr><td height="24" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  },
  {
    name: 'Order Confirmed',
    type: 'order',
    subject: 'Order #{{ORDER_ID}} Confirmed — Your Rental is Being Prepared!',
    variables: ['{{ORDER_ID}}', '{{CUSTOMER_NAME}}', '{{PRODUCT_NAME}}', '{{RENTAL_DURATION}}', '{{MONTHLY_RENT}}', '{{SECURITY_DEPOSIT}}', '{{FIRST_MONTH}}', '{{DELIVERY_CHARGE}}', '{{TOTAL_AMOUNT}}', '{{DELIVERY_DATE}}', '{{TIME_SLOT}}', '{{CUSTOMER_ADDRESS}}'],
    body: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Order Confirmed — IndianRenters.com</title>
  <style type="text/css">
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; color: #f6f6f6; line-height: 1px; max-width: 0px; opacity: 0;">Your order #{{ORDER_ID}} is confirmed! {{PRODUCT_NAME}} is being prepared for delivery. Track your rental now.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f6f6f6">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; border-bottom: 3px solid #ffcf46; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 22px 32px 20px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="vertical-align: middle;">
                        <a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;">
                          <img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" />
                        </a>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="display: inline-block; background-color: #00b505; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px;">✓ Order Confirmed</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 40px 32px 36px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                        <span style="display: inline-block; padding: 18px; background-color: #fffaeb; border-radius: 50%; text-align: center; line-height: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a07800" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span>
                      </td>
                    </tr>
                  </table>
                  <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 24px; font-weight: 700; color: #141414; letter-spacing: -0.8px; line-height: 1.2; text-align: center;">Order Placed Successfully!</h1>
                  <p style="margin: 0 0 18px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px; text-align: center; max-width: 420px;">Thank you, <strong style="color: #333333;">{{CUSTOMER_NAME}}</strong>! Your rental order <strong style="color: #333333;">#{{ORDER_ID}}</strong> has been received and is being processed.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" bgcolor="#f0fff0" style="background-color: #f0fff0; border: 1px solid #00b505; border-radius: 8px; padding: 10px 20px;">
                        <span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #00b505;">🚚 Estimated Delivery: <strong>{{DELIVERY_DATE}}</strong></span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; height: 3px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- ORDER SUMMARY -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 0 32px;">
                  <p style="margin: 0 0 16px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.1em; text-transform: uppercase;">Order Details</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 12px; overflow: hidden;">
                    <!-- Product row -->
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 18px 20px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: top; width: 72px; padding-right: 16px;">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td bgcolor="#f6f6f6" style="background-color: #f6f6f6; width: 60px; height: 60px; border-radius: 8px; border: 1px solid #e2e2e2; text-align: center; vertical-align: middle; font-size: 24px; line-height: 60px; color: #757575;">💻</td>
                                </tr>
                              </table>
                            </td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">{{PRODUCT_NAME}}</p>
                              <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Rental Duration: <strong style="color: #545454;">{{RENTAL_DURATION}}</strong></p>
                              <span style="display: inline-block; background-color: #fffaeb; border: 1px solid #ffcf46; border-radius: 4px; padding: 2px 8px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #141414;">Rental</span>
                            </td>
                            <td align="right" style="vertical-align: top; white-space: nowrap;">
                              <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 18px; font-weight: 700; color: #141414; line-height: 24px;">₹{{MONTHLY_RENT}}<span style="font-size: 12px; font-weight: 400; color: #757575;">/mo</span></p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr><td bgcolor="#e2e2e2" style="background-color: #e2e2e2; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr>
                    <!-- Pricing breakdown -->
                    <tr>
                      <td bgcolor="#fafafa" style="background-color: #fafafa; padding: 18px 20px 20px 20px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr><td style="padding-bottom: 10px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454;">Security Deposit <span style="color: #757575; font-size: 11px;">(refundable)</span></td><td align="right" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">₹{{SECURITY_DEPOSIT}}</td></tr></table></td></tr>
                          <tr><td style="padding-bottom: 10px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454;">First Month Rent</td><td align="right" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">₹{{FIRST_MONTH}}</td></tr></table></td></tr>
                          <tr><td style="padding-bottom: 14px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454;">Delivery Charge</td><td align="right" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #00b505;">{{DELIVERY_CHARGE}}</td></tr></table></td></tr>
                          <tr><td bgcolor="#e2e2e2" style="background-color: #e2e2e2; height: 1px; font-size: 0; line-height: 0; padding-bottom: 14px;">&nbsp;</td></tr>
                          <tr>
                            <td style="padding-top: 14px;">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #141414;">Total Due Today</td>
                                  <td align="right"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 20px; font-weight: 700; color: #141414;">₹{{TOTAL_AMOUNT}}</span></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr><td style="height: 28px; font-size: 0; line-height: 0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- DELIVERY DETAILS -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px;">
                  <p style="margin: 0 0 16px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.1em; text-transform: uppercase;">Delivery Details</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td bgcolor="#f6f6f6" style="background-color: #f6f6f6; padding: 20px 24px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding-bottom: 16px; border-bottom: 1px solid #e2e2e2;">
                              <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.08em; text-transform: uppercase;">Delivery Address</p>
                              <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #333333; line-height: 22px;">{{CUSTOMER_ADDRESS}}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-top: 16px;">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td style="width: 50%; vertical-align: top; padding-right: 12px;">
                                    <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.08em; text-transform: uppercase;">Expected Delivery</p>
                                    <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #00b505;">{{DELIVERY_DATE}}</p>
                                  </td>
                                  <td style="width: 50%; vertical-align: top; padding-left: 12px; border-left: 1px solid #e2e2e2;">
                                    <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.08em; text-transform: uppercase;">Time Slot</p>
                                    <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333;">{{TIME_SLOT}}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- WHAT HAPPENS NEXT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 32px 32px;">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 600; color: #141414; letter-spacing: -0.3px;">What Happens Next</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;"><tr><td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#fffaeb" style="background-color: #fffaeb; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #141414; line-height: 36px; border: 1px solid #ffcf46;">1</td></tr></table></td><td style="vertical-align: top; padding-top: 2px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Order Verified</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px;">Our team will verify your order within 2 hours and send a confirmation call.</p></td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;"><tr><td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#fffaeb" style="background-color: #fffaeb; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #141414; line-height: 36px; border: 1px solid #ffcf46;">2</td></tr></table></td><td style="vertical-align: top; padding-top: 2px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Item Inspected &amp; Prepared</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px;">Your product is quality-checked, cleaned, and carefully packed for delivery.</p></td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#00b505" style="background-color: #00b505; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 0; line-height: 36px;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></td></tr></table></td><td style="vertical-align: top; padding-top: 2px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Delivered to Your Door</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px;">Our delivery executive will arrive at your time slot. Please keep the signed KYC ready.</p></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 32px 32px 36px 32px;">
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 700; color: #141414; letter-spacing: -0.3px; text-align: center;">Stay Updated on Your Order</p>
                  <p style="margin: 0 0 24px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px; text-align: center;">Get real-time delivery updates and manage your rental from your dashboard.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                    <tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;" align="center"><a href="https://indianrenters.com/orders/{{ORDER_ID}}" style="display: inline-block; padding: 12px 32px; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 8px;">🚚 Track Your Order</a></td></tr>
                  </table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr><td bgcolor="#141414" style="background-color: #141414; border-radius: 8px;" align="center"><a href="https://indianrenters.com/orders" style="display: inline-block; padding: 11px 28px; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">View All Orders</a></td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- HELP + FOOTER -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 28px 32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr><td align="center" style="padding-bottom: 20px;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
                  </table>
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-align: center;">Need Help?</p>
                  <p style="margin: 0 0 18px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px; text-align: center;">Our team is here Mon–Sat, 9 AM – 7 PM. We're just a call or message away.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 0 12px; text-align: center; border-right: 1px solid #2a2a2a;"><a href="tel:9870533392" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Call Us</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffcf46;">9870533392</span></a></td>
                      <td style="padding: 0 12px; text-align: center;"><a href="mailto:support@indianrenters.com" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Email Us</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffcf46;">support@indianrenters.com</span></a></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER LEGAL -->
        <tr>
          <td bgcolor="#1a1a1a" style="background-color: #1a1a1a; border-top: 1px solid #2a2a2a; border-radius: 0 0 12px 12px; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 24px 32px 28px 32px;">
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; text-align: center;">Serving &nbsp; Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td align="center" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">90,000+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Orders</p></td>
                      <td align="center" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">30,000+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Customers</p></td>
                      <td align="center" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">4.9 ★</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Rating</p></td>
                    </tr>
                  </table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <p style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-align: center; line-height: 20px;"><a href="https://indianrenters.com/privacy-policy" style="color: #757575; text-decoration: underline;">Privacy Policy</a> &nbsp;·&nbsp; <a href="https://indianrenters.com/terms" style="color: #757575; text-decoration: underline;">Terms of Service</a> &nbsp;·&nbsp; <a href="https://indianrenters.com/unsubscribe" style="color: #757575; text-decoration: underline;">Unsubscribe</a></p>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #3a3a3a; text-align: center; line-height: 18px;">© 2025 IndianRenters.com — AAA Rental LLP<br/>You're receiving this because you placed an order on IndianRenters.com.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'Payment Successful',
    type: 'payment',
    subject: 'Payment Confirmed ✓ — ₹{{AMOUNT_PAID}} received for Booking #{{BOOKING_ID}}',
    variables: ['{{CUSTOMER_NAME}}', '{{AMOUNT_PAID}}', '{{TRANSACTION_ID}}', '{{PAYMENT_DATE}}', '{{BOOKING_ID}}', '{{PRODUCT_NAME}}', '{{MONTHLY_RENT}}', '{{SECURITY_DEPOSIT}}', '{{START_DATE}}', '{{END_DATE}}', '{{NEXT_DUE_DATE}}', '{{PAYMENT_METHOD}}', '{{DELIVERY_ADDRESS}}', '{{DELIVERY_DATE}}', '{{SAVINGS_AMOUNT}}', '{{SAVINGS_PERCENT}}'],
    body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Payment Successful — IndianRenters.com</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .mobile-pad { padding: 20px 16px !important; }
      .amount-display { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f6f6f6; mso-hide: all;">Your booking is confirmed! ₹{{AMOUNT_PAID}} received. {{PRODUCT_NAME}} delivery scheduled for {{DELIVERY_DATE}}.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
  <tr>
    <td align="center" style="padding: 24px 16px 32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-wrapper" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; border-bottom: 3px solid #ffcf46; padding: 20px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" valign="middle">
                  <span style="display: inline-block; background-color: #00b505; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; border-radius: 20px;">✓ Payment Successful</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO SUCCESS -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 0 32px;" class="mobile-pad">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Hi <strong style="color: #333333; font-weight: 600;">{{CUSTOMER_NAME}}</strong>, great news!</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e8ffe4; border: 1.5px solid #00b505; border-radius: 12px;">
                    <tr>
                      <td align="center" style="padding: 32px 24px 28px 24px; text-align: center;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                          <tr>
                            <td align="center" bgcolor="#00b505" style="background-color: #00b505; border-radius: 50%; width: 56px; height: 56px; text-align: center; vertical-align: middle; font-size: 0; line-height: 56px;" width="56" height="56"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></td>
                          </tr>
                        </table>
                        <h1 style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 24px; font-weight: 700; color: #00b505; letter-spacing: -0.8px; line-height: 1.2;">Payment Successful!</h1>
                        <p style="margin: 0 0 16px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Your rental booking has been confirmed.</p>
                        <div class="amount-display" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 28px; font-weight: 700; color: #00b505; letter-spacing: -0.8px; margin-bottom: 12px; line-height: 1;">₹{{AMOUNT_PAID}}</div>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                          <tr><td align="center" style="padding: 0 0 4px 0;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Transaction ID:&nbsp;</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #333333; font-weight: 600;">{{TRANSACTION_ID}}</span></td></tr>
                          <tr><td align="center"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Paid on:&nbsp;</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #333333; font-weight: 600;">{{PAYMENT_DATE}}</span></td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BOOKING SUMMARY -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr>
                <td bgcolor="#141414" style="background-color: #141414; border-radius: 11px 11px 0 0; padding: 12px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #ffcf46;">Booking Confirmed</span></td>
                      <td align="right" valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575;">#{{BOOKING_ID}}</span></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 14px; border-bottom: 1px solid #e2e2e2;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: top; padding-right: 12px; width: 44px;" width="44">
                              <div style="width: 44px; height: 44px; background-color: #f6f6f6; border-radius: 8px; border: 1px solid #e2e2e2; text-align: center; line-height: 44px; font-size: 20px;">💻</div>
                            </td>
                            <td style="vertical-align: top;">
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #333333; margin-bottom: 2px;">{{PRODUCT_NAME}}</div>
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Tech Product · IndianRenters.com</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 16px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding-bottom: 12px; width: 50%; vertical-align: top;" width="50%">
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Rental Period</div>
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">{{START_DATE}} – {{END_DATE}}</div>
                            </td>
                            <td style="padding-bottom: 12px; width: 50%; vertical-align: top; text-align: right;" width="50%">
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Monthly EMI</div>
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #333333;">₹{{MONTHLY_RENT}}<span style="font-size: 12px; font-weight: 400; color: #757575;">/month</span></div>
                            </td>
                          </tr>
                          <tr>
                            <td style="width: 50%; vertical-align: top;" width="50%">
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Security Deposit</div>
                              <div><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">₹{{SECURITY_DEPOSIT}}&nbsp;</span><span style="display: inline-block; background-color: #e8ffe4; color: #00b505; font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px; border: 1px solid #00b505;">Refundable</span></div>
                            </td>
                            <td style="width: 50%; vertical-align: top; text-align: right;" width="50%">
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Next Payment Due</div>
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff;">{{NEXT_DUE_DATE}}</div>
                              <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">₹{{MONTHLY_RENT}}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- PAYMENT RECEIPT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr><td style="padding: 16px 20px 12px 20px; border-bottom: 1px solid #e2e2e2;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">Payment Receipt</span></td></tr>
              <tr>
                <td style="padding: 16px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td style="padding-bottom: 10px; width: 50%;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575;">Payment Method</span></td><td style="padding-bottom: 10px; width: 50%; text-align: right;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">{{PAYMENT_METHOD}}</span></td></tr>
                    <tr><td style="padding-bottom: 10px;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575;">Status</span></td><td style="padding-bottom: 10px; text-align: right;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #00b505; background-color: #e8ffe4; padding: 3px 10px; border-radius: 20px;">✓ Paid</span></td></tr>
                    <tr><td colspan="2" style="padding-bottom: 10px; border-top: 1px solid #e2e2e2;">&nbsp;</td></tr>
                    <tr><td style="padding-bottom: 10px;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333;">Total Paid</span></td><td style="padding-bottom: 10px; text-align: right;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 700; color: #00b505;">₹{{AMOUNT_PAID}}</span></td></tr>
                  </table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td style="padding-top: 12px; border-top: 1px dashed #e2e2e2; text-align: center;"><a href="https://indianrenters.com/receipts/{{TRANSACTION_ID}}" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff; text-decoration: underline;">⬇ Download Receipt (PDF)</a></td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DELIVERY -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #edfaff; border: 1px solid #83dcff; border-radius: 12px;">
              <tr>
                <td style="padding: 20px;">
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; margin-bottom: 10px;">📦 Delivery Details</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px;">Delivery Address</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #333333; line-height: 20px; margin-bottom: 10px;">{{DELIVERY_ADDRESS}}</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px;">Estimated Delivery</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #00b505; margin-bottom: 10px;">{{DELIVERY_DATE}}</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #0075ff; line-height: 18px;">ℹ You'll receive a call before delivery to confirm the time slot.</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- TIMELINE -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr><td style="padding: 16px 20px 14px 20px; border-bottom: 1px solid #e2e2e2;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333;">What Happens Next</span></td></tr>
              <tr>
                <td style="padding: 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="width: 32px; vertical-align: top; padding-right: 12px;" width="32"><div style="width: 28px; height: 28px; background-color: #00b505; border-radius: 50%; text-align: center; line-height: 28px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div></td>
                      <td style="vertical-align: top; padding-bottom: 20px; border-left: 2px solid #e2e2e2; padding-left: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #00b505; margin-bottom: 2px;">Payment Received</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">₹{{AMOUNT_PAID}} debited successfully on {{PAYMENT_DATE}}</div></td>
                    </tr>
                    <tr>
                      <td style="width: 32px; vertical-align: top; padding-right: 12px;" width="32"><div style="width: 28px; height: 28px; background-color: #ffcf46; border-radius: 50%; text-align: center; line-height: 28px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg></div></td>
                      <td style="vertical-align: top; padding-bottom: 20px; border-left: 2px solid #e2e2e2; padding-left: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Order Being Prepared <span style="font-size: 11px; font-weight: 400; color: #ffb91b; background-color: #fffaeb; padding: 2px 7px; border-radius: 10px; border: 1px solid #ffe485;">Today</span></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Our team is quality-checking and packing your {{PRODUCT_NAME}}</div></td>
                    </tr>
                    <tr>
                      <td style="width: 32px; vertical-align: top; padding-right: 12px;" width="32"><div style="width: 28px; height: 28px; background-color: #f6f6f6; border: 2px solid #cbcbcb; border-radius: 50%; text-align: center; line-height: 24px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#545454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></div></td>
                      <td style="vertical-align: top; padding-bottom: 20px; border-left: 2px solid #e2e2e2; padding-left: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Delivery Scheduled</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Dispatched for delivery on <strong style="color: #333333;">{{DELIVERY_DATE}}</strong></div></td>
                    </tr>
                    <tr>
                      <td style="width: 32px; vertical-align: top; padding-right: 12px;" width="32"><div style="width: 28px; height: 28px; background-color: #f6f6f6; border: 2px solid #cbcbcb; border-radius: 50%; text-align: center; line-height: 24px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#545454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg></div></td>
                      <td style="vertical-align: top; padding-left: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Product Delivered to You</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Enjoy your rental! Our team is just a call away for any support.</div></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- SAVINGS -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffaeb; border: 1.5px solid #ffe485; border-radius: 12px;">
              <tr>
                <td style="padding: 22px 24px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="vertical-align: top; padding-right: 14px; width: 36px;" width="36"><div style="width: 36px; height: 36px; background-color: #ffcf46; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">🎉</div></td>
                      <td style="vertical-align: top;">
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #333333; margin-bottom: 6px;">Smart Move, {{CUSTOMER_NAME}}!</div>
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px; margin-bottom: 8px;">You saved <strong style="color: #00b505; font-weight: 700; font-size: 15px;">₹{{SAVINGS_AMOUNT}}</strong> vs buying a new {{PRODUCT_NAME}}.</div>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="background-color: #fff1c5; border-radius: 8px; padding: 10px 14px; width: 100%;">
                          <tr>
                            <td>
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td style="width: 50%; padding-right: 8px;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px;">Buy Price (New)</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #afafaf; text-decoration: line-through;">₹{{SAVINGS_AMOUNT}}<span style="font-size: 11px; font-weight: 400;">+ taxes</span></div></td>
                                  <td style="width: 50%; padding-left: 8px; border-left: 1px solid #ffe485;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px;">Your Rental Cost</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #00b505;">₹{{MONTHLY_RENT}}/mo</div></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; margin-top: 8px; line-height: 18px;">That's <strong style="color: #f08c00;">{{SAVINGS_PERCENT}}% off retail price</strong> — and you keep zero depreciation risk.</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 24px 32px 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="text-align: center;">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Manage your booking, download invoices, and track delivery — all in one place.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto;"><tr><td align="center" bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;"><a href="https://indianrenters.com/bookings/{{BOOKING_ID}}" style="display: inline-block; padding: 12px 32px; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #000000; text-decoration: none; border-radius: 8px;">View Your Booking →</a></td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td align="center" bgcolor="#141414" style="background-color: #141414; border-radius: 8px;"><a href="https://indianrenters.com/track/{{BOOKING_ID}}" style="display: inline-block; padding: 10px 28px; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">Track Delivery</a></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- SOCIAL PROOF -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0 32px 24px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border-radius: 10px;">
              <tr>
                <td style="padding: 14px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="text-align: center; width: 33%; padding: 0 4px;" width="33%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 700; color: #333333;">90K+</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; font-weight: 500; color: #757575; text-transform: uppercase; letter-spacing: 0.06em;">Orders</div></td>
                      <td style="width: 1px; background-color: #e2e2e2;" width="1">&nbsp;</td>
                      <td align="center" style="text-align: center; width: 33%; padding: 0 4px;" width="33%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 700; color: #141414;">4.9 ★</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; font-weight: 500; color: #757575; text-transform: uppercase; letter-spacing: 0.06em;">Rated</div></td>
                      <td style="width: 1px; background-color: #e2e2e2;" width="1">&nbsp;</td>
                      <td align="center" style="text-align: center; width: 33%; padding: 0 4px;" width="33%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 700; color: #333333;">8 Cities</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; font-weight: 500; color: #757575; text-transform: uppercase; letter-spacing: 0.06em;">Delivered</div></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center" style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #1f1f1f;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; padding-bottom: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="padding: 0 12px; border-right: 1px solid #333333;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td><td style="padding: 0 12px;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">+91 98705 33392</a></td></tr></table><div style="margin-top: 6px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Mon – Sat, 10:00 AM – 7:30 PM</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-bottom: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px;">Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; border-top: 1px solid #1f1f1f;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; margin-bottom: 8px;">This email was sent to you because you made a payment on IndianRenters.com.</div><div><a href="https://indianrenters.com/privacy" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Privacy Policy</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/terms" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Terms of Service</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/unsubscribe" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Unsubscribe</a></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; color: #333333; margin-top: 10px;">© 2024 AAA Rental LLP. All rights reserved. · Noida Sector 62, Uttar Pradesh, India</div></td></tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding: 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'Payment Failed',
    type: 'payment',
    subject: 'Action Required: Payment Failed for Order #{{ORDER_ID}}',
    variables: ['{{CUSTOMER_NAME}}', '{{AMOUNT}}', '{{PRODUCT_NAME}}', '{{ORDER_ID}}', '{{RETRY_LINK}}'],
    body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Payment Failed — IndianRenters.com</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .mobile-pad { padding: 20px 16px !important; }
      .cta-button { padding: 12px 20px !important; font-size: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f6f6f6; mso-hide: all;">Action needed: Your payment of ₹{{AMOUNT}} for {{PRODUCT_NAME}} could not be processed. Retry now to keep your order.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
  <tr>
    <td align="center" style="padding: 24px 16px 32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-wrapper" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" valign="middle"><span style="display: inline-block; background-color: #ff2c20; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; border-radius: 20px;">✕ Payment Failed</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO ERROR -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 0 32px;" class="mobile-pad">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Hi <strong style="color: #333333; font-weight: 600;">{{CUSTOMER_NAME}}</strong>, we need your attention.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff0ee; border: 1.5px solid #ff2c20; border-radius: 12px;">
                    <tr>
                      <td align="center" style="padding: 32px 24px 28px 24px; text-align: center;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                          <tr>
                            <td align="center" bgcolor="#ff2c20" style="background-color: #ff2c20; border-radius: 50%; width: 56px; height: 56px; text-align: center; vertical-align: middle; font-size: 0; line-height: 56px;" width="56" height="56"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></td>
                          </tr>
                        </table>
                        <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 24px; font-weight: 700; color: #ff2c20; letter-spacing: -0.8px; line-height: 1.2;">Payment Failed</h1>
                        <p style="margin: 0 0 8px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; color: #333333; line-height: 24px;">We couldn't process your payment of <strong style="color: #ff2c20;">₹{{AMOUNT}}</strong> for <strong>{{PRODUCT_NAME}}</strong></p>
                        <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px;">Order <strong style="color: #333333;">#{{ORDER_ID}}</strong> is currently on hold</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- REASONS -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr><td style="padding: 16px 20px 14px 20px; border-bottom: 1px solid #e2e2e2;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">Possible Reasons for Failure</span></td></tr>
              <tr>
                <td style="padding: 18px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td style="padding-bottom: 14px; vertical-align: top;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="width: 28px; vertical-align: top; padding-right: 12px; padding-top: 2px;" width="28"><div style="width: 24px; height: 24px; background-color: #fff0ee; border-radius: 50%; text-align: center; line-height: 24px; font-size: 11px; color: #ff2c20; font-weight: 700; font-family: 'Mona Sans Variable', sans-serif; border: 1px solid #ffcbbd;">1</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Card Declined by Bank</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Your bank may have blocked the transaction. Try contacting your bank or use a different card.</div></td></tr></table></td></tr>
                    <tr><td style="padding-bottom: 14px; vertical-align: top;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="width: 28px; vertical-align: top; padding-right: 12px; padding-top: 2px;" width="28"><div style="width: 24px; height: 24px; background-color: #fff0ee; border-radius: 50%; text-align: center; line-height: 24px; font-size: 11px; color: #ff2c20; font-weight: 700; font-family: 'Mona Sans Variable', sans-serif; border: 1px solid #ffcbbd;">2</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Insufficient Funds</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Your account may not have enough balance. Please check your balance and retry.</div></td></tr></table></td></tr>
                    <tr><td style="padding-bottom: 14px; vertical-align: top;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="width: 28px; vertical-align: top; padding-right: 12px; padding-top: 2px;" width="28"><div style="width: 24px; height: 24px; background-color: #fff0ee; border-radius: 50%; text-align: center; line-height: 24px; font-size: 11px; color: #ff2c20; font-weight: 700; font-family: 'Mona Sans Variable', sans-serif; border: 1px solid #ffcbbd;">3</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">UPI / Net Banking Timeout</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">The UPI or net banking session timed out before completion. Please initiate the payment again.</div></td></tr></table></td></tr>
                    <tr><td style="vertical-align: top;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="width: 28px; vertical-align: top; padding-right: 12px; padding-top: 2px;" width="28"><div style="width: 24px; height: 24px; background-color: #fff0ee; border-radius: 50%; text-align: center; line-height: 24px; font-size: 11px; color: #ff2c20; font-weight: 700; font-family: 'Mona Sans Variable', sans-serif; border: 1px solid #ffcbbd;">4</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Temporary Bank / Gateway Issue</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Occasional technical issues on the bank or payment gateway side. Usually resolved within minutes — retry shortly.</div></td></tr></table></td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RETRY CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 24px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="text-align: center;">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Ready to try again? Complete your payment to confirm your rental.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px auto;"><tr><td align="center" bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;"><a href="{{RETRY_LINK}}" class="cta-button" style="display: inline-block; padding: 13px 36px; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 8px;">↺ Retry Payment</a></td></tr></table>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px;">Or <a href="https://indianrenters.com/orders/{{ORDER_ID}}/payment" style="color: #0075ff; font-weight: 600; text-decoration: underline;">try a different payment method</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ORDER RESERVED -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e9f4ff; border: 1px solid #83c8ff; border-radius: 12px;">
              <tr>
                <td style="padding: 18px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="width: 34px; vertical-align: top; padding-right: 12px; padding-top: 1px;" width="34"><div style="width: 32px; height: 32px; background-color: #0075ff; border-radius: 8px; text-align: center; line-height: 32px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg></div></td>
                      <td style="vertical-align: top;">
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #0075ff; margin-bottom: 4px;">Your rental order is reserved for 24 hours</div>
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #333333; line-height: 20px;">We've held <strong>{{PRODUCT_NAME}}</strong> for you until your payment is completed. After 24 hours, the reservation will be released and the item may become unavailable.</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HELP -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border-radius: 12px;">
              <tr>
                <td align="center" style="padding: 22px 24px; text-align: center;">
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; margin-bottom: 6px;">Need help completing your payment?</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px; margin-bottom: 16px;">Our support team is available Mon–Sat, 10 AM–7:30 PM to assist you.</div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td style="padding: 0 10px; text-align: center; border-right: 1px solid #cbcbcb;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff; text-decoration: none;">✉ support@indianrenters.com</a></td>
                      <td style="padding: 0 10px; text-align: center;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff; text-decoration: none;">📞 +91 98705 33392</a></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center" style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #1f1f1f;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; padding-bottom: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="padding: 0 12px; border-right: 1px solid #333333;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td><td style="padding: 0 12px;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">+91 98705 33392</a></td></tr></table><div style="margin-top: 6px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Mon – Sat, 10:00 AM – 7:30 PM</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-bottom: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px;">Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; border-top: 1px solid #1f1f1f;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; margin-bottom: 8px;">This email was sent because a payment attempt was made on IndianRenters.com.</div><div><a href="https://indianrenters.com/privacy" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Privacy Policy</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/terms" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Terms of Service</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/unsubscribe" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Unsubscribe</a></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; color: #333333; margin-top: 10px;">© 2024 AAA Rental LLP. All rights reserved. · Noida Sector 62, Uttar Pradesh, India</div></td></tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding: 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'Order Approved',
    type: 'order',
    subject: 'Your Order #{{ORDER_ID}} is Approved — Delivery on {{DELIVERY_DATE}}!',
    variables: ['{{CUSTOMER_NAME}}', '{{ORDER_ID}}', '{{PRODUCT_NAME}}', '{{DELIVERY_DATE}}', '{{RENTAL_DURATION}}', '{{MONTHLY_RENT}}'],
    body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Order Approved — IndianRenters.com</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .mobile-pad { padding: 20px 16px !important; }
      .cta-button { padding: 12px 20px !important; font-size: 14px !important; }
      .timeline-dot-cell { width: 28px !important; }
      .summary-cell { display: block !important; width: 100% !important; padding: 4px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f6f6f6; mso-hide: all;">Your order for {{PRODUCT_NAME}} is approved! Delivery scheduled for {{DELIVERY_DATE}}.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
  <tr>
    <td align="center" style="padding: 24px 16px 32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-wrapper" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" valign="middle"><span style="display: inline-block; background-color: #00b505; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; border-radius: 20px;">✓ Order Approved</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 0 32px;" class="mobile-pad">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Hi <strong style="color: #333333; font-weight: 600;">{{CUSTOMER_NAME}}</strong>, great news!</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e8ffe4; border: 1.5px solid #00b505; border-radius: 12px;">
                    <tr>
                      <td align="center" style="padding: 32px 24px 28px 24px; text-align: center;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                          <tr>
                            <td align="center" bgcolor="#00b505" style="background-color: #00b505; border-radius: 50%; width: 56px; height: 56px; text-align: center; vertical-align: middle; font-size: 0; line-height: 56px;" width="56" height="56"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></td>
                          </tr>
                        </table>
                        <h1 style="margin: 0 0 8px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 24px; font-weight: 700; color: #00b505; letter-spacing: -0.8px; line-height: 1.2;">Your Order is Approved!</h1>
                        <p style="margin: 0 0 16px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Your rental order has been reviewed and approved by our team.</p>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                          <tr><td align="center" style="padding: 0 0 6px 0;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Order ID:&nbsp;</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #333333; font-weight: 600;">#{{ORDER_ID}}</span></td></tr>
                          <tr><td align="center"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Product:&nbsp;</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #333333; font-weight: 600;">{{PRODUCT_NAME}}</span></td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- TIMELINE -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr><td style="padding: 16px 20px 14px 20px; border-bottom: 1px solid #e2e2e2;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333;">What Happens Next</span></td></tr>
              <tr>
                <td style="padding: 20px 20px 4px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td class="timeline-dot-cell" style="width: 32px; vertical-align: top; padding-right: 14px;" width="32"><div style="width: 28px; height: 28px; background-color: #00b505; border-radius: 50%; text-align: center; line-height: 28px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div></td>
                      <td style="vertical-align: top; padding-bottom: 24px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #00b505; margin-bottom: 3px; display: inline;">Order Approved&nbsp;</div><span style="display: inline-block; font-size: 11px; font-weight: 600; color: #00b505; background-color: #e8ffe4; padding: 2px 8px; border-radius: 10px; border: 1px solid #8ce88c; vertical-align: middle;">Done — Today</span><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px; margin-top: 4px;">Your order has been reviewed and approved by our team.</div></td>
                    </tr>
                    <tr>
                      <td class="timeline-dot-cell" style="width: 32px; vertical-align: top; padding-right: 14px;" width="32"><div style="width: 28px; height: 28px; background-color: #ffcf46; border-radius: 50%; text-align: center; line-height: 28px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg></div></td>
                      <td style="vertical-align: top; padding-bottom: 24px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 3px; display: inline;">Item Being Prepared&nbsp;</div><span style="display: inline-block; font-size: 11px; font-weight: 600; color: #f08c00; background-color: #fffaeb; padding: 2px 8px; border-radius: 10px; border: 1px solid #ffe485; vertical-align: middle;">Next 1–2 hours</span><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px; margin-top: 4px;">Our team is quality-checking and carefully packing your {{PRODUCT_NAME}}.</div></td>
                    </tr>
                    <tr>
                      <td class="timeline-dot-cell" style="width: 32px; vertical-align: top; padding-right: 14px;" width="32"><div style="width: 28px; height: 28px; background-color: #f6f6f6; border: 2px solid #cbcbcb; border-radius: 50%; text-align: center; line-height: 24px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#545454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></div></td>
                      <td style="vertical-align: top; padding-bottom: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 3px;">Delivery Scheduled</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px; margin-top: 4px;">Your product will be dispatched and delivered on <strong style="color: #333333;">{{DELIVERY_DATE}}</strong>. You'll receive a call to confirm your time slot.</div></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ORDER SUMMARY -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr>
                <td bgcolor="#141414" style="background-color: #141414; border-radius: 11px 11px 0 0; padding: 12px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #ffcf46;">Order Summary</span></td>
                      <td align="right" valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575;">#{{ORDER_ID}}</span></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 16px; border-bottom: 1px solid #e2e2e2;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: top; padding-right: 12px; width: 44px;" width="44"><div style="width: 44px; height: 44px; background-color: #f6f6f6; border-radius: 8px; border: 1px solid #e2e2e2; text-align: center; line-height: 44px; font-size: 20px;">💻</div></td>
                            <td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #333333; margin-bottom: 2px;">{{PRODUCT_NAME}}</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Rental Product · IndianRenters.com</div></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 16px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td class="summary-cell" style="padding-bottom: 14px; width: 50%; vertical-align: top;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Rental Duration</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">{{RENTAL_DURATION}}</div></td>
                            <td class="summary-cell" style="padding-bottom: 14px; width: 50%; vertical-align: top; text-align: right;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Monthly Rent</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 17px; font-weight: 700; color: #333333;">₹{{MONTHLY_RENT}}<span style="font-size: 12px; font-weight: 400; color: #757575;">/month</span></div></td>
                          </tr>
                          <tr>
                            <td class="summary-cell" style="width: 50%; vertical-align: top;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Delivery Date</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #00b505;">{{DELIVERY_DATE}}</div></td>
                            <td class="summary-cell" style="width: 50%; vertical-align: top; text-align: right;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Status</div><span style="display: inline-block; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #00b505; background-color: #e8ffe4; padding: 4px 10px; border-radius: 20px; border: 1px solid #8ce88c;">✓ Approved</span></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 24px 32px 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="text-align: center;">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Track your order status, view delivery updates, and manage your rental — all from your account.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto;"><tr><td align="center" bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;"><a href="https://indianrenters.com/orders/{{ORDER_ID}}" class="cta-button" style="display: inline-block; padding: 12px 32px; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #000000; text-decoration: none; border-radius: 8px;">📦 Track Your Order →</a></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center" style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #1f1f1f;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; padding-bottom: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="padding: 0 12px; border-right: 1px solid #333333;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td><td style="padding: 0 12px;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">+91 98705 33392</a></td></tr></table><div style="margin-top: 6px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Mon – Sat, 10:00 AM – 7:30 PM</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-bottom: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px;">Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; border-top: 1px solid #1f1f1f;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; margin-bottom: 8px;">This email was sent to you because your order was approved on IndianRenters.com.</div><div><a href="https://indianrenters.com/privacy" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Privacy Policy</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/terms" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Terms of Service</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/unsubscribe" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Unsubscribe</a></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; color: #333333; margin-top: 10px;">© 2024 AAA Rental LLP. All rights reserved. · Noida Sector 62, Uttar Pradesh, India</div></td></tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding: 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'Order Shipped',
    type: 'order',
    subject: '🚚 Your {{PRODUCT_NAME}} is Out for Delivery — Arriving {{DELIVERY_DATE}}!',
    variables: ['{{CUSTOMER_NAME}}', '{{PRODUCT_NAME}}', '{{DELIVERY_DATE}}', '{{TRACKING_ID}}', '{{CARRIER_NAME}}', '{{TRACKING_URL}}', '{{DELIVERY_ADDRESS}}', '{{ORDER_ID}}'],
    body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Order Shipped — IndianRenters.com</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .mobile-pad { padding: 20px 16px !important; }
      .cta-button { padding: 12px 20px !important; font-size: 14px !important; }
      .tracking-row td { display: block !important; width: 100% !important; padding: 4px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f6f6f6; mso-hide: all;">Your {{PRODUCT_NAME}} is on its way! Arriving {{DELIVERY_DATE}}. Track live with ID: {{TRACKING_ID}}.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
  <tr>
    <td align="center" style="padding: 24px 16px 32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-wrapper" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" valign="middle"><span style="display: inline-block; background-color: #0075ff; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; border-radius: 20px;">🚚 Out for Delivery</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 0 32px;" class="mobile-pad">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Hi <strong style="color: #333333; font-weight: 600;">{{CUSTOMER_NAME}}</strong>, exciting news!</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e9f4ff; border: 1.5px solid #0075ff; border-radius: 12px;">
                    <tr>
                      <td align="center" style="padding: 32px 24px 28px 24px; text-align: center;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                          <tr>
                            <td align="center" bgcolor="#0075ff" style="background-color: #0075ff; border-radius: 50%; width: 60px; height: 60px; text-align: center; vertical-align: middle; font-size: 0; line-height: 60px;" width="60" height="60"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg></td>
                          </tr>
                        </table>
                        <h1 style="margin: 0 0 8px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 24px; font-weight: 700; color: #0075ff; letter-spacing: -0.8px; line-height: 1.2;">Your Order is On the Way!</h1>
                        <p style="margin: 0 0 16px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;"><strong style="color: #333333;">{{PRODUCT_NAME}}</strong> has been dispatched and is out for delivery.</p>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 10px; border: 1px solid #b3d4ff;">
                          <tr><td style="padding: 10px 20px; text-align: center;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 3px;">Estimated Arrival</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 18px; font-weight: 700; color: #0075ff; letter-spacing: -0.5px;">{{DELIVERY_DATE}}</div></td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- TRACKING INFO -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e9f4ff; border: 1px solid #83c8ff; border-radius: 12px;">
              <tr>
                <td style="padding: 14px 20px 12px 20px; border-bottom: 1px solid #b3d4ff;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff;">📡 Live Tracking Information</span></td>
                      <td align="right" valign="middle"><span style="display: inline-block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #0075ff; background-color: #ffffff; padding: 3px 10px; border-radius: 20px; border: 1px solid #83c8ff;">Out for Delivery</span></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 18px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr class="tracking-row"><td style="padding-bottom: 12px; width: 45%;" width="45%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454;">Tracking ID</span></td><td style="padding-bottom: 12px; width: 55%; text-align: right;" width="55%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #0075ff;">{{TRACKING_ID}}</span></td></tr>
                    <tr class="tracking-row"><td style="padding-bottom: 12px;" width="45%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454;">Carrier</span></td><td style="padding-bottom: 12px; text-align: right;" width="55%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">{{CARRIER_NAME}}</span></td></tr>
                    <tr class="tracking-row"><td style="padding-bottom: 12px;" width="45%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454;">Current Status</span></td><td style="padding-bottom: 12px; text-align: right;" width="55%"><span style="display: inline-block; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #0075ff; background-color: #ffffff; padding: 3px 10px; border-radius: 20px; border: 1px solid #83c8ff;">🚚 Out for delivery</span></td></tr>
                    <tr class="tracking-row"><td style="padding-bottom: 16px;" width="45%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454;">Estimated Arrival</span></td><td style="padding-bottom: 16px; text-align: right;" width="55%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #333333;">{{DELIVERY_DATE}}</span></td></tr>
                  </table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td align="center" style="text-align: center; padding-top: 4px; border-top: 1px solid #b3d4ff;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 12px auto 0 auto;"><tr><td align="center" bgcolor="#0075ff" style="background-color: #0075ff; border-radius: 8px;"><a href="{{TRACKING_URL}}" class="cta-button" style="display: inline-block; padding: 10px 28px; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">📍 Track Live →</a></td></tr></table></td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DELIVERY ADDRESS -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr>
                <td style="padding: 18px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="width: 34px; vertical-align: top; padding-right: 12px; padding-top: 2px;" width="34"><div style="width: 32px; height: 32px; background-color: #f6f6f6; border-radius: 8px; border: 1px solid #e2e2e2; text-align: center; line-height: 32px; font-size: 16px;">📍</div></td>
                      <td style="vertical-align: top;">
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;">Delivering To</div>
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; margin-bottom: 4px;">{{CUSTOMER_NAME}}</div>
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px;">{{DELIVERY_ADDRESS}}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- WHAT TO EXPECT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffaeb; border: 1.5px solid #ffe485; border-radius: 12px;">
              <tr>
                <td style="padding: 20px 20px 16px 24px;">
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #333333; margin-bottom: 16px;">📋 What to Expect on Delivery</div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td style="width: 28px; vertical-align: top; padding-right: 10px; padding-top: 1px;" width="28"><div style="width: 24px; height: 24px; background-color: #ffcf46; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; color: #000000; font-family: 'Mona Sans Variable', sans-serif;">1</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Be home for delivery</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; line-height: 18px;">Our delivery partner will call you 30 minutes before arriving. Ensure someone is available to receive the product.</div></td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td style="width: 28px; vertical-align: top; padding-right: 10px; padding-top: 1px;" width="28"><div style="width: 24px; height: 24px; background-color: #ffcf46; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; color: #000000; font-family: 'Mona Sans Variable', sans-serif;">2</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Check the product before signing</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; line-height: 18px;">Inspect your {{PRODUCT_NAME}} for any visible damage upon receipt. Do not accept a visibly damaged product — contact us immediately.</div></td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="width: 28px; vertical-align: top; padding-right: 10px; padding-top: 1px;" width="28"><div style="width: 24px; height: 24px; background-color: #ffcf46; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; color: #000000; font-family: 'Mona Sans Variable', sans-serif;">3</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Get your delivery receipt</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; line-height: 18px;">Collect and keep the signed delivery receipt. You'll also receive a digital confirmation via email and SMS once delivery is complete.</div></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ORDER REFERENCE -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr>
                <td style="padding: 16px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td style="padding-bottom: 8px; width: 50%;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Order ID</span></td><td style="padding-bottom: 8px; width: 50%; text-align: right;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #333333;">#{{ORDER_ID}}</span></td></tr>
                    <tr><td width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Product</span></td><td style="text-align: right;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #333333;">{{PRODUCT_NAME}}</span></td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HELP -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="text-align: center;">
                  <p style="margin: 0 0 8px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px;">Questions about your delivery? We're here to help.</p>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px;"><a href="mailto:support@indianrenters.com" style="color: #0075ff; font-weight: 600; text-decoration: none;">support@indianrenters.com</a><span style="color: #cbcbcb; padding: 0 8px;">|</span><a href="tel:9870533392" style="color: #0075ff; font-weight: 600; text-decoration: none;">+91 98705 33392</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center" style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #1f1f1f;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; padding-bottom: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="padding: 0 12px; border-right: 1px solid #333333;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td><td style="padding: 0 12px;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">+91 98705 33392</a></td></tr></table><div style="margin-top: 6px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Mon – Sat, 10:00 AM – 7:30 PM</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-bottom: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px;">Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; border-top: 1px solid #1f1f1f;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; margin-bottom: 8px;">This email was sent to you because your order is out for delivery with IndianRenters.com.</div><div><a href="https://indianrenters.com/privacy" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Privacy Policy</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/terms" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Terms of Service</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/unsubscribe" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Unsubscribe</a></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; color: #333333; margin-top: 10px;">© 2024 AAA Rental LLP. All rights reserved. · Noida Sector 62, Uttar Pradesh, India</div></td></tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding: 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'Order Delivered — Rental Active',
    type: 'rental',
    subject: '🏠 {{PRODUCT_NAME}} Delivered! Your Rental is Now Active',
    variables: ['{{CUSTOMER_NAME}}', '{{PRODUCT_NAME}}', '{{ORDER_ID}}', '{{START_DATE}}', '{{END_DATE}}', '{{MONTHLY_RENT}}', '{{DUE_DAY}}', '{{NEXT_PAYMENT_DATE}}', '{{NEXT_PAYMENT_AMOUNT}}'],
    body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Your Rental is Now Active — IndianRenters.com</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .mobile-pad { padding: 20px 16px !important; }
      .cta-button { padding: 12px 20px !important; font-size: 14px !important; }
      .star-link { padding: 0 6px !important; font-size: 26px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f6f6f6; mso-hide: all;">{{PRODUCT_NAME}} delivered! Your rental period is now active. EMI of ₹{{MONTHLY_RENT}} due on {{DUE_DAY}} each month.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
  <tr>
    <td align="center" style="padding: 24px 16px 32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-wrapper" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" valign="middle"><span style="display: inline-block; background-color: #00b505; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; border-radius: 20px;">✓ Delivered!</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#e8ffe4" style="background-color: #e8ffe4; padding: 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="text-align: center;">
                  <div style="font-size: 48px; line-height: 1; margin-bottom: 16px;">🏠</div>
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Hi <strong style="color: #333333; font-weight: 600;">{{CUSTOMER_NAME}}</strong>,</p>
                  <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 26px; font-weight: 700; color: #00b505; letter-spacing: -0.8px; line-height: 1.2;">Your Rental is Now Active!</h1>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; color: #333333; line-height: 24px;"><strong style="font-weight: 600;">{{PRODUCT_NAME}}</strong> has been delivered to you.<br>Your rental period starts today.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RENTAL SUMMARY -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 24px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr>
                <td bgcolor="#141414" style="background-color: #141414; border-radius: 11px 11px 0 0; padding: 12px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #ffcf46;">Rental Summary</span></td>
                      <td align="right" valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575;">Order #{{ORDER_ID}}</span></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 16px; width: 50%; vertical-align: top;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Rental Start</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #00b505;">{{START_DATE}}</div></td>
                      <td style="padding-bottom: 16px; width: 50%; vertical-align: top; text-align: right;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Rental End</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #333333;">{{END_DATE}}</div></td>
                    </tr>
                    <tr><td colspan="2" style="padding-bottom: 16px; border-top: 1px solid #e2e2e2;">&nbsp;</td></tr>
                    <tr>
                      <td style="width: 50%; vertical-align: top;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Monthly EMI</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 20px; font-weight: 700; color: #333333; line-height: 1;">₹{{MONTHLY_RENT}}<span style="font-size: 12px; font-weight: 400; color: #757575;">/month</span></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; margin-top: 3px;">Due on <strong style="color: #333333;">{{DUE_DAY}}</strong> of each month</div></td>
                      <td style="width: 50%; vertical-align: top; text-align: right;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Next Payment</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #0075ff;">{{NEXT_PAYMENT_DATE}}</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 700; color: #333333; margin-top: 3px;">₹{{NEXT_PAYMENT_AMOUNT}}</div></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RATE DELIVERY -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr>
                <td align="center" style="padding: 24px 20px; text-align: center;">
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #333333; margin-bottom: 6px;">How was your delivery experience?</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; margin-bottom: 18px;">Tap a star to rate — it takes 5 seconds and helps us a lot.</div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=1" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=2" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=3" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=4" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=5" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- IMPORTANT REMINDERS -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffaeb; border: 1.5px solid #ffe485; border-radius: 12px;">
              <tr>
                <td style="padding: 20px 24px;">
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; margin-bottom: 14px;">⚠️ Important Reminders</div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;"><tr><td style="width: 20px; vertical-align: top; padding-right: 10px; padding-top: 1px;" width="20"><div style="width: 20px; height: 20px; background-color: #ffcf46; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 700; color: #000; font-family: 'Mona Sans Variable', sans-serif;">1</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Keep the product in good condition</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Normal wear is fine. Damage beyond fair use may be charged at return.</div></td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;"><tr><td style="width: 20px; vertical-align: top; padding-right: 10px; padding-top: 1px;" width="20"><div style="width: 20px; height: 20px; background-color: #ffcf46; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 700; color: #000; font-family: 'Mona Sans Variable', sans-serif;">2</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Return by <strong style="color: #ff2c20;">{{END_DATE}}</strong> to avoid extra charges</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Late returns attract daily charges. We'll remind you 2 days before.</div></td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="width: 20px; vertical-align: top; padding-right: 10px; padding-top: 1px;" width="20"><div style="width: 20px; height: 20px; background-color: #ffcf46; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 700; color: #000; font-family: 'Mona Sans Variable', sans-serif;">3</div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 2px;">Contact us if you face any issues</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Call <a href="tel:9870533392" style="color: #0075ff; text-decoration: none; font-weight: 600;">+91 98705 33392</a> or email <a href="mailto:support@indianrenters.com" style="color: #0075ff; text-decoration: none; font-weight: 600;">support@indianrenters.com</a></div></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 24px 32px 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="text-align: center;">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Track your rental, manage payments, and raise support requests — all in one place.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td align="center" bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;"><a href="https://indianrenters.com/rentals/{{ORDER_ID}}" class="cta-button" style="display: inline-block; padding: 13px 36px; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 8px;">View My Rental →</a></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center" style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #1f1f1f;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; padding-bottom: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="padding: 0 12px; border-right: 1px solid #333333;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td><td style="padding: 0 12px;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">+91 98705 33392</a></td></tr></table><div style="margin-top: 6px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Mon – Sat, 10:00 AM – 7:30 PM</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-bottom: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px;">Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; border-top: 1px solid #1f1f1f;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; margin-bottom: 8px;">This email was sent because your order was delivered on IndianRenters.com.</div><div><a href="https://indianrenters.com/privacy" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Privacy Policy</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/terms" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Terms of Service</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/unsubscribe" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Unsubscribe</a></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; color: #333333; margin-top: 10px;">© 2024 AAA Rental LLP. All rights reserved. · Noida Sector 62, Uttar Pradesh, India</div></td></tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding: 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'Return Reminder',
    type: 'rental',
    subject: '⏰ Reminder: Return {{PRODUCT_NAME}} by {{END_DATE}} — 2 Days Left',
    variables: ['{{CUSTOMER_NAME}}', '{{PRODUCT_NAME}}', '{{END_DATE}}', '{{ORDER_ID}}', '{{MONTHLY_RENT}}', '{{SCHEDULE_URL}}', '{{EXTEND_URL}}'],
    body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Return Reminder — IndianRenters.com</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .mobile-pad { padding: 20px 16px !important; }
      .cta-button { padding: 12px 20px !important; font-size: 14px !important; }
      .option-col { width: 100% !important; display: block !important; padding: 0 0 16px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f6f6f6; mso-hide: all;">Action required: {{PRODUCT_NAME}} rental ends on {{END_DATE}}. Schedule a pickup or extend your rental now.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
  <tr>
    <td align="center" style="padding: 24px 16px 32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-wrapper" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" valign="middle"><span style="display: inline-block; background-color: #f08c00; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; border-radius: 20px;">⏰ Return Reminder</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#fffaeb" style="background-color: #fffaeb; padding: 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="text-align: center;">
                  <div style="font-size: 0; line-height: 1; margin-bottom: 16px;"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f08c00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Hi <strong style="color: #333333; font-weight: 600;">{{CUSTOMER_NAME}}</strong>,</p>
                  <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 26px; font-weight: 700; color: #f08c00; letter-spacing: -0.8px; line-height: 1.2;">Your Rental Ends in 2 Days</h1>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; color: #333333; line-height: 24px;">Please arrange the return of <strong style="font-weight: 600;">{{PRODUCT_NAME}}</strong><br>by <strong style="font-weight: 700; color: #ff2c20;">{{END_DATE}}</strong>.</p>
                  <div style="margin-top: 12px; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Order <strong style="color: #333333;">#{{ORDER_ID}}</strong></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RETURN OPTIONS -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 24px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr><td bgcolor="#141414" style="background-color: #141414; border-radius: 11px 11px 0 0; padding: 12px 20px;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #ffcf46;">Return Options</span></td></tr>
              <tr>
                <td style="padding: 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td class="option-col" style="width: 50%; vertical-align: top; padding-right: 10px;" width="50%">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 10px;">
                          <tr><td style="padding: 18px 16px; text-align: center;">
                            <div style="font-size: 28px; line-height: 1; margin-bottom: 10px;">📦</div>
                            <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #333333; margin-bottom: 4px;">Free Pickup</div>
                            <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px; margin-bottom: 16px;">We come to you. Schedule a time slot that works.</div>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td align="center" bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 7px;"><a href="{{SCHEDULE_URL}}" style="display: inline-block; padding: 9px 18px; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 7px; white-space: nowrap;">Schedule Pickup →</a></td></tr></table>
                          </td></tr>
                        </table>
                      </td>
                      <td class="option-col" style="width: 50%; vertical-align: top; padding-left: 10px;" width="50%">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 10px;">
                          <tr><td style="padding: 18px 16px; text-align: center;">
                            <div style="font-size: 28px; line-height: 1; margin-bottom: 10px;">🏢</div>
                            <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #333333; margin-bottom: 4px;">Drop-Off Center</div>
                            <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px; margin-bottom: 16px;">Bring it to your nearest IndianRenters center.</div>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td align="center" bgcolor="#141414" style="background-color: #141414; border-radius: 7px;"><a href="https://indianrenters.com/centers" style="display: inline-block; padding: 9px 18px; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 7px; white-space: nowrap;">Find Center →</a></td></tr></table>
                          </td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- EXTEND RENTAL -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #edf4ff; border: 1.5px solid #83b8ff; border-radius: 12px;">
              <tr>
                <td style="padding: 24px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-right: 16px; vertical-align: top; width: 36px;" width="36"><div style="width: 36px; height: 36px; background-color: #0075ff; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px; color: #ffffff;">📅</div></td>
                      <td style="vertical-align: top;">
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #333333; margin-bottom: 4px;">Not ready to return yet?</div>
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px; margin-bottom: 14px;">Extend your rental in one click. Same product, same convenience — just more time.</div>
                        <div style="display: inline-block; background-color: #ffffff; border: 1px solid #83b8ff; border-radius: 8px; padding: 8px 14px; margin-bottom: 16px;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Extension rate:&nbsp;</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #0075ff;">+₹{{MONTHLY_RENT}}<span style="font-size: 12px; font-weight: 400; color: #757575;">/month</span></span></div>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#0075ff" style="background-color: #0075ff; border-radius: 8px;"><a href="{{EXTEND_URL}}" style="display: inline-block; padding: 11px 28px; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px;">Extend Rental →</a></td></tr></table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RETURN CHECKLIST -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr><td style="padding: 16px 20px 14px 20px; border-bottom: 1px solid #e2e2e2;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333;">✅ Return Checklist</span></td></tr>
              <tr>
                <td style="padding: 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td style="padding-bottom: 12px; vertical-align: top; width: 24px; padding-right: 10px;" width="24"><div style="width: 20px; height: 20px; border: 2px solid #00b505; border-radius: 4px; text-align: center; line-height: 18px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-bottom: 1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div></td><td style="padding-bottom: 12px; vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">Original packaging &amp; box</div></td></tr>
                    <tr><td style="padding-bottom: 12px; vertical-align: top; width: 24px; padding-right: 10px;" width="24"><div style="width: 20px; height: 20px; border: 2px solid #00b505; border-radius: 4px; text-align: center; line-height: 18px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-bottom: 1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div></td><td style="padding-bottom: 12px; vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">All included accessories</div></td></tr>
                    <tr><td style="padding-bottom: 12px; vertical-align: top; width: 24px; padding-right: 10px;" width="24"><div style="width: 20px; height: 20px; border: 2px solid #00b505; border-radius: 4px; text-align: center; line-height: 18px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-bottom: 1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div></td><td style="padding-bottom: 12px; vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">Charger / power cable</div></td></tr>
                    <tr><td style="padding-bottom: 12px; vertical-align: top; width: 24px; padding-right: 10px;" width="24"><div style="width: 20px; height: 20px; border: 2px solid #00b505; border-radius: 4px; text-align: center; line-height: 18px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-bottom: 1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div></td><td style="padding-bottom: 12px; vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">Manuals &amp; documentation (if received)</div></td></tr>
                    <tr><td style="vertical-align: top; width: 24px; padding-right: 10px;" width="24"><div style="width: 20px; height: 20px; border: 2px solid #00b505; border-radius: 4px; text-align: center; line-height: 18px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-bottom: 1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div></td><td style="vertical-align: top;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">Product cleaned &amp; in working condition</div></td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- LATE RETURN WARNING -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff0ee; border: 1.5px solid #ff2c20; border-radius: 12px;">
              <tr>
                <td style="padding: 18px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-right: 12px; vertical-align: top; width: 28px;" width="28"><div style="font-size: 20px; line-height: 1.3;">🚨</div></td>
                      <td style="vertical-align: top;">
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ff2c20; margin-bottom: 4px;">Late Return Charges Apply After {{END_DATE}}</div>
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; line-height: 18px;">Returns after the end date attract pro-rated daily charges on top of your normal EMI. Avoid extra costs — schedule your return or extend your rental before the deadline.</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center" style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #1f1f1f;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; padding-bottom: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="padding: 0 12px; border-right: 1px solid #333333;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td><td style="padding: 0 12px;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">+91 98705 33392</a></td></tr></table><div style="margin-top: 6px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Mon – Sat, 10:00 AM – 7:30 PM</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-bottom: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px;">Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; border-top: 1px solid #1f1f1f;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; margin-bottom: 8px;">This reminder was sent because your rental is approaching its end date on IndianRenters.com.</div><div><a href="https://indianrenters.com/privacy" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Privacy Policy</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/terms" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Terms of Service</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/unsubscribe" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Unsubscribe</a></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; color: #333333; margin-top: 10px;">© 2024 AAA Rental LLP. All rights reserved. · Noida Sector 62, Uttar Pradesh, India</div></td></tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding: 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'Return Confirmed — Refund Initiated',
    type: 'rental',
    subject: '✓ Return Received — ₹{{REFUND_AMOUNT}} Refund Initiated',
    variables: ['{{CUSTOMER_NAME}}', '{{PRODUCT_NAME}}', '{{ORDER_ID}}', '{{REFUND_AMOUNT}}', '{{PAYMENT_METHOD}}', '{{RENTAL_DURATION}}'],
    body: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <title>Return Confirmed — Refund Initiated — IndianRenters.com</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    * { box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; }
      .mobile-pad { padding: 20px 16px !important; }
      .cta-button { padding: 12px 20px !important; font-size: 14px !important; }
      .star-link { padding: 0 6px !important; font-size: 26px !important; }
      .summary-col { width: 100% !important; display: block !important; padding: 0 0 12px 0 !important; text-align: left !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f6f6f6; mso-hide: all;">Return confirmed! ₹{{REFUND_AMOUNT}} refund initiated — expect it in 5-7 business days. Thank you for renting with IndianRenters!</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6;">
  <tr>
    <td align="center" style="padding: 24px 16px 32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-wrapper" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" valign="middle"><span style="display: inline-block; background-color: #00b505; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 10px; border-radius: 20px;">✓ Return Confirmed</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#e8ffe4" style="background-color: #e8ffe4; padding: 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="text-align: center;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                    <tr><td align="center" bgcolor="#00b505" style="background-color: #00b505; border-radius: 50%; width: 60px; height: 60px; text-align: center; vertical-align: middle; font-size: 0; line-height: 60px;" width="60" height="60"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></td></tr>
                  </table>
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px;">Hi <strong style="color: #333333; font-weight: 600;">{{CUSTOMER_NAME}}</strong>,</p>
                  <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 26px; font-weight: 700; color: #00b505; letter-spacing: -0.8px; line-height: 1.2;">Return Received!</h1>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; color: #333333; line-height: 24px;">We've received your <strong style="font-weight: 600;">{{PRODUCT_NAME}}</strong>.<br>Thank you for renting with IndianRenters!</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- REFUND CARD -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 24px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr>
                <td bgcolor="#141414" style="background-color: #141414; border-radius: 11px 11px 0 0; padding: 12px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #ffcf46;">Security Deposit Refund</span></td>
                      <td align="right" valign="middle"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575;">Order #{{ORDER_ID}}</span></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 20px;" align="center">
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 40px; font-weight: 700; color: #00b505; letter-spacing: -1.5px; line-height: 1; margin-bottom: 8px;">₹{{REFUND_AMOUNT}}</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; margin-bottom: 4px;">Refund Initiated</div>
                  <div style="display: inline-block; background-color: #e8ffe4; border: 1px solid #00b505; border-radius: 20px; padding: 5px 14px; margin-bottom: 16px;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #00b505;">⏳ 5–7 business days</span></div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px; max-width: 380px; margin: 0 auto 14px auto;">Refund will be processed to your original payment method within 5–7 business days.</div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 8px;"><tr><td style="padding: 8px 16px;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Refund to:&nbsp;</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #333333;">{{PAYMENT_METHOD}}</span></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RENTAL SUMMARY -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr><td style="padding: 16px 20px 12px 20px; border-bottom: 1px solid #e2e2e2;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">Rental Summary</span></td></tr>
              <tr>
                <td style="padding: 16px 20px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td style="padding-bottom: 10px; width: 50%;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575;">Product</span></td><td style="padding-bottom: 10px; width: 50%; text-align: right;" width="50%"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">{{PRODUCT_NAME}}</span></td></tr>
                    <tr><td><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575;">Duration Rented</span></td><td style="text-align: right;"><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">{{RENTAL_DURATION}}</span></td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RENT AGAIN CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 0 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffaeb; border: 1.5px solid #ffe485; border-radius: 12px;">
              <tr>
                <td style="padding: 24px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-right: 14px; vertical-align: top; width: 36px;" width="36"><div style="width: 36px; height: 36px; background-color: #ffcf46; border-radius: 8px; text-align: center; line-height: 36px; font-size: 18px;">🎉</div></td>
                      <td style="vertical-align: top;">
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #333333; margin-bottom: 6px;">Need something? Don't buy it — rent it.</div>
                        <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #545454; line-height: 20px; margin-bottom: 16px;">Why spend ₹50,000–₹1,50,000 buying a product you may only need for a few months? Rent it for a fraction of the cost — zero depreciation, full flexibility.</div>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff1c5; border-radius: 8px; margin-bottom: 18px;">
                          <tr>
                            <td style="padding: 10px 14px;">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td style="width: 50%; padding-right: 8px; vertical-align: top;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; font-weight: 600; color: #757575; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px;">Buy New</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #afafaf; text-decoration: line-through;">₹50,000+</div></td>
                                  <td style="width: 50%; padding-left: 8px; vertical-align: top; border-left: 1px solid #ffe485;" width="50%"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; font-weight: 600; color: #757575; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px;">Rent from IndianRenters</div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #00b505;">From ₹1,499/mo</div></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;"><a href="https://indianrenters.com/products" class="cta-button" style="display: inline-block; padding: 12px 28px; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 8px;">Browse Products →</a></td></tr></table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- REVIEW REQUEST -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 20px 32px 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f6f6f6; border: 1px solid #e2e2e2; border-radius: 12px;">
              <tr>
                <td align="center" style="padding: 24px 20px; text-align: center;">
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #333333; margin-bottom: 6px;">How was your overall experience?</div>
                  <div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; margin-bottom: 18px;">Your feedback helps thousands of Indian renters make better decisions. Takes 30 seconds.</div>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=1" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=2" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=3" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=4" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                      <td><a href="https://indianrenters.com/review/{{ORDER_ID}}?rating=5" class="star-link" style="display: inline-block; padding: 0 8px; font-size: 30px; text-decoration: none; color: #ffcf46; line-height: 1;">★</a></td>
                    </tr>
                  </table>
                  <div style="margin-top: 14px; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575;">Join <strong style="color: #333333;">1,050+ customers</strong> who've rated us <strong style="color: #ffcf46;">4.9★</strong></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; border-radius: 0 0 12px 12px; padding: 28px 32px;" class="mobile-pad">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center" style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #1f1f1f;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; padding-bottom: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td style="padding: 0 12px; border-right: 1px solid #333333;"><a href="mailto:support@indianrenters.com" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">support@indianrenters.com</a></td><td style="padding: 0 12px;"><a href="tel:9870533392" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-decoration: none;">+91 98705 33392</a></td></tr></table><div style="margin-top: 6px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Mon – Sat, 10:00 AM – 7:30 PM</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-bottom: 16px;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px;">Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</div></td></tr>
              <tr><td align="center" style="text-align: center; padding-top: 16px; border-top: 1px solid #1f1f1f;"><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; margin-bottom: 8px;">This email was sent to confirm your rental return on IndianRenters.com.</div><div><a href="https://indianrenters.com/privacy" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Privacy Policy</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/terms" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Terms of Service</a><span style="color: #333333; padding: 0 6px;">·</span><a href="https://indianrenters.com/unsubscribe" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; text-decoration: underline;">Unsubscribe</a></div><div style="font-family: 'Mona Sans Variable', sans-serif; font-size: 10px; color: #333333; margin-top: 10px;">© 2024 AAA Rental LLP. All rights reserved. · Noida Sector 62, Uttar Pradesh, India</div></td></tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding: 16px 0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'Order Cancelled',
    type: 'order',
    subject: 'Order #{{ORDER_ID}} Cancelled — Refund of ₹{{REFUND_AMOUNT}} Initiated',
    variables: ['{{ORDER_ID}}', '{{PRODUCT_NAME}}', '{{CANCELLATION_REASON}}', '{{REFUND_AMOUNT}}', '{{PAYMENT_METHOD}}'],
    body: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Order Cancelled — IndianRenters.com</title>
  <style type="text/css">
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; color: #f6f6f6; line-height: 1px; max-width: 0px; opacity: 0;">Your order #{{ORDER_ID}} for {{PRODUCT_NAME}} has been cancelled. If you paid online, your refund is on the way.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f6f6f6">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" style="vertical-align: middle;"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" style="vertical-align: middle;"><span style="display: inline-block; background-color: #f0f0f0; color: #555555; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; border: 1px solid #e0e0e0;">Order Cancelled</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#f6f6f6" style="background-color: #f6f6f6; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 40px 32px 36px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr><td align="center" style="padding-bottom: 20px;"><span style="display: inline-block; padding: 18px; background-color: #e0e0e0; border-radius: 50%; font-size: 0; line-height: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555555" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></span></td></tr>
                  </table>
                  <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 24px; font-weight: 700; color: #141414; letter-spacing: -0.8px; line-height: 1.2; text-align: center;">Your Order Has Been Cancelled</h1>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px; text-align: center; max-width: 420px;">Order <strong style="color: #333333;">#{{ORDER_ID}}</strong> for <strong style="color: #333333;">{{PRODUCT_NAME}}</strong> has been cancelled. We're sorry to see this order go.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#e0e0e0" style="background-color: #e0e0e0; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- CANCELLATION REASON -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 0 32px;">
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.1em; text-transform: uppercase;">Cancellation Details</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td bgcolor="#f6f6f6" style="background-color: #f6f6f6; padding: 20px 24px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: top; width: 40px; padding-right: 14px;"><span style="display: inline-block; padding: 7px; background-color: #e0e0e0; border-radius: 50%; font-size: 0; line-height: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg></span></td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 700; color: #757575; letter-spacing: 0.06em; text-transform: uppercase;">Reason for Cancellation</p>
                              <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #333333; line-height: 22px;">{{CANCELLATION_REASON}}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr><td style="height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- REFUND INFO -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 8px 32px 0 32px;">
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.1em; text-transform: uppercase;">Refund Information</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #b6e8b6; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td bgcolor="#e8ffe4" style="background-color: #e8ffe4; padding: 20px 24px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;">
                          <tr><td style="vertical-align: middle;"><span style="display: inline-block; padding: 7px; background-color: #00b505; border-radius: 50%; font-size: 0; line-height: 0; vertical-align: middle; margin-right: 10px;"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #141414; vertical-align: middle;">Refund of ₹{{REFUND_AMOUNT}} will be processed</span></td></tr>
                        </table>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr><td style="padding-bottom: 10px; border-bottom: 1px solid #c6e8c6;"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #333333; line-height: 20px;">The refund will be credited to your <strong>{{PAYMENT_METHOD}}</strong> within <strong>5–7 business days</strong>.</p></td></tr>
                          <tr><td style="padding-top: 12px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 500; color: #545454;">Refund Amount</td><td align="right" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #00b505;">₹{{REFUND_AMOUNT}}</td></tr></table></td></tr>
                          <tr><td style="padding-top: 8px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 500; color: #545454;">Refund to</td><td align="right" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333;">{{PAYMENT_METHOD}}</td></tr></table></td></tr>
                          <tr><td style="padding-top: 8px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 500; color: #545454;">Refund Status</td><td align="right"><span style="display: inline-block; background-color: #fffaeb; border: 1px solid #ffcf46; border-radius: 20px; padding: 3px 12px; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #141414;">↻ Processing</span></td></tr></table></td></tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr><td style="height: 28px; font-size: 0; line-height: 0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- RE-ENGAGEMENT CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 36px 32px 12px 32px;">
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 18px; font-weight: 700; color: #141414; letter-spacing: -0.5px; text-align: center;">Looking for Something Else?</p>
                  <p style="margin: 0 0 24px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px; text-align: center;">We have 401+ products across laptops, ACs, furniture, appliances and more. Find what you need.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;"><tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;" align="center"><a href="https://indianrenters.com/products" style="display: inline-block; padding: 13px 36px; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 8px;">Browse Other Products</a></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FEEDBACK -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 4px 32px 36px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px dashed #e0e0e0; border-radius: 10px;">
                    <tr>
                      <td align="center" style="padding: 18px 24px;">
                        <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; text-align: center;">Help us improve</p>
                        <p style="margin: 0 0 12px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; text-align: center; line-height: 18px;">Tell us why you cancelled — it takes 30 seconds and helps us serve you better.</p>
                        <a href="https://indianrenters.com/feedback/cancel?order={{ORDER_ID}}" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #0075ff; text-decoration: underline;">Why did you cancel? Tell us here →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- HELP -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 28px 32px;">
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-align: center;">Have Questions About Your Refund?</p>
                  <p style="margin: 0 0 18px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px; text-align: center;">Our team is available Mon–Sat, 10 AM – 7:30 PM to help you.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 0 12px; text-align: center; border-right: 1px solid #2a2a2a;"><a href="tel:9870533392" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Call Us</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffcf46;">9870533392</span></a></td>
                      <td style="padding: 0 12px; text-align: center;"><a href="mailto:support@indianrenters.com" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Email Us</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffcf46;">support@indianrenters.com</span></a></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#1a1a1a" style="background-color: #1a1a1a; border-top: 1px solid #2a2a2a; border-radius: 0 0 12px 12px; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 24px 32px 28px 32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="padding-bottom: 20px;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr></table>
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; text-align: center;">Serving&nbsp;&nbsp;Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">90,000+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Orders</p></td>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">401+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Products</p></td>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">4.9 ★</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Rating</p></td>
                    </tr>
                  </table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <p style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-align: center; line-height: 20px;"><a href="https://indianrenters.com/privacy-policy" style="color: #757575; text-decoration: underline;">Privacy Policy</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://indianrenters.com/terms" style="color: #757575; text-decoration: underline;">Terms of Service</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://indianrenters.com/unsubscribe" style="color: #757575; text-decoration: underline;">Unsubscribe</a></p>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #3a3a3a; text-align: center; line-height: 18px;">© 2025 IndianRenters.com — AAA Rental LLP<br/>You're receiving this because you placed an order on IndianRenters.com.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'KYC Submitted — Under Review',
    type: 'kyc',
    subject: 'KYC Documents Received — Verification In Progress',
    variables: ['{{CUSTOMER_NAME}}', '{{SUBMITTED_DOCS}}'],
    body: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>KYC Documents Received — IndianRenters.com</title>
  <style type="text/css">
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; color: #f6f6f6; line-height: 1px; max-width: 0px; opacity: 0;">We've received your KYC documents, {{CUSTOMER_NAME}}. Our team will verify them within 24–48 hours and notify you.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f6f6f6">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" style="vertical-align: middle;"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" style="vertical-align: middle;"><span style="display: inline-block; background-color: #e9f4ff; color: #0075ff; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; border: 1px solid #b3d6ff;">KYC Under Review</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#e9f4ff" style="background-color: #e9f4ff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 40px 32px 36px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom: 20px;"><span style="display: inline-block; padding: 18px; background-color: #0075ff; border-radius: 50%; font-size: 0; line-height: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></span></td></tr></table>
                  <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 24px; font-weight: 700; color: #141414; letter-spacing: -0.8px; line-height: 1.2; text-align: center;">KYC Documents Received!</h1>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #333333; line-height: 22px; text-align: center; max-width: 420px;">Hi <strong>{{CUSTOMER_NAME}}</strong>, we've received your verification documents and our team is now reviewing them.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#b3d6ff" style="background-color: #b3d6ff; height: 2px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- SUBMITTED DOCUMENTS -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 0 32px;">
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.1em; text-transform: uppercase;">Documents Submitted</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 16px 20px; border-bottom: 1px solid #f0f0f0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: middle;"><span style="display: inline-block; padding: 6px; background-color: #e8ffe4; border-radius: 50%; font-size: 0; line-height: 0; margin-right: 12px; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 500; color: #333333; vertical-align: middle;">Aadhaar Card</span></td>
                            <td align="right" style="vertical-align: middle;"><span style="display: inline-block; background-color: #e8ffe4; color: #00b505; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;">Submitted</span></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 16px 20px; border-bottom: 1px solid #f0f0f0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: middle;"><span style="display: inline-block; padding: 6px; background-color: #e8ffe4; border-radius: 50%; font-size: 0; line-height: 0; margin-right: 12px; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 500; color: #333333; vertical-align: middle;">PAN Card</span></td>
                            <td align="right" style="vertical-align: middle;"><span style="display: inline-block; background-color: #e8ffe4; color: #00b505; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;">Submitted</span></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr><td bgcolor="#fafafa" style="background-color: #fafafa; padding: 14px 20px;"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">{{SUBMITTED_DOCS}}</p></td></tr>
                  </table>
                </td>
              </tr>
              <tr><td style="height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- WHAT HAPPENS NEXT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 32px 32px;">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 600; color: #141414; letter-spacing: -0.3px;">What Happens Next</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#00b505" style="background-color: #00b505; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 0; line-height: 36px;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></td></tr></table></td>
                      <td style="vertical-align: top; padding-top: 4px; padding-bottom: 8px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Documents Submitted</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #00b505; line-height: 18px;">Done — your documents are safely received</p></td>
                    </tr>
                    <tr>
                      <td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#0075ff" style="background-color: #0075ff; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 0; line-height: 36px;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg></td></tr></table></td>
                      <td style="vertical-align: top; padding-top: 4px; padding-bottom: 8px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Under Review <span style="display: inline-block; background-color: #e9f4ff; color: #0075ff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; margin-left: 6px;">In Progress</span></p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Our KYC team verifies your documents — usually within 24–48 hours</p></td>
                    </tr>
                    <tr>
                      <td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#f0f0f0" style="background-color: #f0f0f0; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 0; line-height: 36px; border: 2px dashed #c0c0c0;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></td></tr></table></td>
                      <td style="vertical-align: top; padding-top: 4px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #999999; line-height: 20px;">Verification Complete</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #aaaaaa; line-height: 18px;">You'll receive an email notification once approved</p></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- WHILE YOU WAIT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 32px 32px;">
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 600; color: #141414; letter-spacing: -0.3px; text-align: center;">While You Wait</p>
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px; text-align: center;">Explore our 401+ products and add them to your wishlist — ready to order the moment you're verified.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="width: 50%; padding-right: 8px; vertical-align: top;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 10px;"><tr><td bgcolor="#fffaeb" style="background-color: #fffaeb; padding: 16px 18px; border-radius: 10px;"><p style="margin: 0 0 6px 0; font-size: 20px;">💻</p><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; line-height: 18px;">Browse Products</p><p style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Laptops, ACs, furniture &amp; more</p><a href="https://indianrenters.com/products" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #0075ff; text-decoration: none;">Explore →</a></td></tr></table>
                      </td>
                      <td style="width: 50%; padding-left: 8px; vertical-align: top;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 10px;"><tr><td bgcolor="#fffaeb" style="background-color: #fffaeb; padding: 16px 18px; border-radius: 10px;"><p style="margin: 0 0 6px 0; font-size: 20px;">⚙</p><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; line-height: 18px;">Set Preferences</p><p style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">City, delivery time &amp; more</p><a href="https://indianrenters.com/account/preferences" style="font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #0075ff; text-decoration: none;">Set Up →</a></td></tr></table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- KYC SUPPORT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 24px 32px 28px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #b3d6ff; border-radius: 10px; background-color: #e9f4ff;">
                    <tr>
                      <td style="padding: 18px 22px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: middle; width: 36px; padding-right: 12px;"><span style="display: inline-block; font-size: 20px;">📞</span></td>
                            <td style="vertical-align: middle;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #141414; line-height: 18px;">Questions about your KYC submission?</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #555555; line-height: 18px;">Email <a href="mailto:kyc@indianrenters.com" style="color: #0075ff; text-decoration: underline;">kyc@indianrenters.com</a> or call <a href="tel:9870533392" style="color: #0075ff; text-decoration: none; font-weight: 600;">9870533392</a> — Mon–Sat 10 AM–7:30 PM</p></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HELP BAR -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 28px 32px;">
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-align: center;">Need Help?</p>
                  <p style="margin: 0 0 18px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px; text-align: center;">Our team is available Mon–Sat, 10 AM – 7:30 PM.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 0 12px; text-align: center; border-right: 1px solid #2a2a2a;"><a href="tel:9870533392" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Call Us</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffcf46;">9870533392</span></a></td>
                      <td style="padding: 0 12px; text-align: center;"><a href="mailto:support@indianrenters.com" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Email Us</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffcf46;">support@indianrenters.com</span></a></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#1a1a1a" style="background-color: #1a1a1a; border-top: 1px solid #2a2a2a; border-radius: 0 0 12px 12px; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 24px 32px 28px 32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="padding-bottom: 20px;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr></table>
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; text-align: center;">Serving&nbsp;&nbsp;Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">90,000+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Orders</p></td>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">30,000+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Customers</p></td>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">4.9 ★</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Rating</p></td>
                    </tr>
                  </table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <p style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-align: center; line-height: 20px;"><a href="https://indianrenters.com/privacy-policy" style="color: #757575; text-decoration: underline;">Privacy Policy</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://indianrenters.com/terms" style="color: #757575; text-decoration: underline;">Terms of Service</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://indianrenters.com/unsubscribe" style="color: #757575; text-decoration: underline;">Unsubscribe</a></p>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #3a3a3a; text-align: center; line-height: 18px;">© 2025 IndianRenters.com — AAA Rental LLP<br/>You're receiving this because you submitted KYC documents on IndianRenters.com.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'KYC Approved',
    type: 'kyc',
    subject: '🎉 KYC Verified — You Can Now Rent on IndianRenters!',
    variables: ['{{CUSTOMER_NAME}}', '{{RENTAL_LIMIT}}'],
    body: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>KYC Approved — IndianRenters.com</title>
  <style type="text/css">
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; color: #f6f6f6; line-height: 1px; max-width: 0px; opacity: 0;">Congratulations {{CUSTOMER_NAME}}! Your KYC is verified. You can now place rental orders across 401+ products.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f6f6f6">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" style="vertical-align: middle;"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" style="vertical-align: middle;"><span style="display: inline-block; background-color: #e8ffe4; color: #00b505; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; border: 1px solid #b6e8b6;">KYC Verified ✓</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#e8ffe4" style="background-color: #e8ffe4; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 44px 32px 40px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom: 20px;"><span style="display: inline-block; width: 72px; height: 72px; background-color: #00b505; border-radius: 50%; text-align: center; line-height: 72px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span></td></tr></table>
                  <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 26px; font-weight: 700; color: #141414; letter-spacing: -0.8px; line-height: 1.2; text-align: center;">KYC Verified!</h1>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; color: #333333; line-height: 24px; text-align: center; max-width: 420px;">Congratulations, <strong>{{CUSTOMER_NAME}}</strong>! Your identity has been verified. You can now place rental orders on IndianRenters.com.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#00b505" style="background-color: #00b505; height: 3px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- YOU'RE ALL SET -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 32px 32px 0 32px;">
                  <p style="margin: 0 0 16px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 600; color: #141414; letter-spacing: -0.3px;">You're All Set — Here's What You Can Do</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 16px 20px; border-bottom: 1px solid #f0f0f0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: middle; width: 40px; padding-right: 14px;"><span style="display: inline-block; width: 32px; height: 32px; background-color: #ffcf46; border-radius: 6px; text-align: center; line-height: 32px; font-size: 16px; vertical-align: middle;">🛒</span></td>
                            <td style="vertical-align: middle;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Place Rental Orders</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Checkout is now fully unlocked for your account</p></td>
                            <td align="right" style="vertical-align: middle;"><span style="display: inline-block; width: 20px; height: 20px; background-color: #e8ffe4; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 16px 20px; border-bottom: 1px solid #f0f0f0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: middle; width: 40px; padding-right: 14px;"><span style="display: inline-block; width: 32px; height: 32px; background-color: #ffcf46; border-radius: 6px; text-align: center; line-height: 32px; font-size: 16px; vertical-align: middle;">💻</span></td>
                            <td style="vertical-align: middle;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Access All 401+ Products</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Laptops, ACs, furniture, appliances, TVs &amp; more</p></td>
                            <td align="right" style="vertical-align: middle;"><span style="display: inline-block; width: 20px; height: 20px; background-color: #e8ffe4; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 16px 20px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: middle; width: 40px; padding-right: 14px;"><span style="display: inline-block; width: 32px; height: 32px; background-color: #ffcf46; border-radius: 6px; text-align: center; line-height: 32px; font-size: 16px; vertical-align: middle;">🏙</span></td>
                            <td style="vertical-align: middle;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Delivery Across 8 Cities</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Delhi, Noida, Bangalore, Hyderabad, Mumbai, Pune, Chennai, Kolkata</p></td>
                            <td align="right" style="vertical-align: middle;"><span style="display: inline-block; width: 20px; height: 20px; background-color: #e8ffe4; border-radius: 50%; text-align: center; line-height: 20px; font-size: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00b505" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr><td style="height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- RENTAL LIMIT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 2px solid #00b505; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td bgcolor="#e8ffe4" style="background-color: #e8ffe4; padding: 22px 24px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: middle;"><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 700; color: #00b505; letter-spacing: 0.08em; text-transform: uppercase;">Your Approved Rental Limit</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 28px; font-weight: 700; color: #141414; letter-spacing: -1px; line-height: 36px;">₹{{RENTAL_LIMIT}}<span style="font-size: 15px; font-weight: 400; color: #545454; letter-spacing: 0;">/month</span></p></td>
                            <td align="right" style="vertical-align: middle;"><span style="display: inline-block; background-color: #00b505; color: #ffffff; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; white-space: nowrap;">Active ✓</span></td>
                          </tr>
                        </table>
                        <p style="margin: 12px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; line-height: 18px;">You can rent products up to this value per month. Your limit may be reviewed after your first successful rental cycle.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- BIG CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 36px 32px;">
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 18px; font-weight: 700; color: #141414; letter-spacing: -0.5px; text-align: center;">Ready to Rent?</p>
                  <p style="margin: 0 0 24px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; line-height: 20px; text-align: center;">Browse 401+ products — laptops, ACs, refrigerators, washing machines, furniture &amp; more. Delivered to your door.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;" align="center"><a href="https://indianrenters.com/products" style="display: inline-block; padding: 14px 40px; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 8px;">Start Browsing Products →</a></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- TRUST SIGNALS + HELP -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 28px 32px 32px 32px;">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 600; color: #757575; letter-spacing: 0.1em; text-transform: uppercase; text-align: center;">Trusted by Thousands Across India</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 22px; font-weight: 700; color: #ffcf46;">90K+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 16px;">Orders<br/>Delivered</p></td>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 22px; font-weight: 700; color: #ffcf46;">4.9 ★</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 16px;">Customer<br/>Rating</p></td>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 22px; font-weight: 700; color: #ffcf46;">8</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 16px;">Cities<br/>Served</p></td>
                    </tr>
                  </table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffffff; text-align: center;">Need Help?</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 0 12px; text-align: center; border-right: 1px solid #2a2a2a;"><a href="tel:9870533392" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Call Us</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffcf46;">9870533392</span></a></td>
                      <td style="padding: 0 12px; text-align: center;"><a href="mailto:support@indianrenters.com" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Email Us</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffcf46;">support@indianrenters.com</span></a></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#1a1a1a" style="background-color: #1a1a1a; border-top: 1px solid #2a2a2a; border-radius: 0 0 12px 12px; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 24px 32px 28px 32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="padding-bottom: 20px;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr></table>
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; text-align: center;">Serving&nbsp;&nbsp;Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <p style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-align: center; line-height: 20px;"><a href="https://indianrenters.com/privacy-policy" style="color: #757575; text-decoration: underline;">Privacy Policy</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://indianrenters.com/terms" style="color: #757575; text-decoration: underline;">Terms of Service</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://indianrenters.com/unsubscribe" style="color: #757575; text-decoration: underline;">Unsubscribe</a></p>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #3a3a3a; text-align: center; line-height: 18px;">© 2025 IndianRenters.com — AAA Rental LLP<br/>You're receiving this because you completed KYC verification on IndianRenters.com.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
  {
    name: 'KYC Rejected — Action Required',
    type: 'kyc',
    subject: 'Action Required: Resubmit Your KYC Documents',
    variables: ['{{CUSTOMER_NAME}}', '{{REJECTION_REASON}}'],
    body: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>KYC Action Required — IndianRenters.com</title>
  <style type="text/css">
    @import url('https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5/index.css');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #f6f6f6; font-family: 'Mona Sans Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased;">

<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all; font-size: 1px; color: #f6f6f6; line-height: 1px; max-width: 0px; opacity: 0;">Action needed: We couldn't verify your KYC documents. Please resubmit with the corrections noted inside.</div>

<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f6f6f6">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">

        <!-- HEADER -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; border-radius: 12px 12px 0 0; padding: 20px 32px; border-bottom: 3px solid #ffcf46;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left" style="vertical-align: middle;"><a href="https://indianrenters.com" style="text-decoration: none; display: inline-block;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249866/logo_indianrenters_tmfo74.png" alt="IndianRenters.com" width="160" height="auto" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0;" /></a></td>
                <td align="right" style="vertical-align: middle;"><span style="display: inline-block; background-color: #fff0ee; color: #ff2c20; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; border: 1px solid #ffb3ad;">⚠ Action Required</span></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#fffaeb" style="background-color: #fffaeb; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 40px 32px 36px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom: 20px;"><span style="display: inline-block; padding: 22px; background-color: #ffcf46; border-radius: 50%; font-size: 0; line-height: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></span></td></tr></table>
                  <h1 style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 24px; font-weight: 700; color: #141414; letter-spacing: -0.8px; line-height: 1.2; text-align: center;">We Need More Information</h1>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; color: #545454; line-height: 22px; text-align: center; max-width: 420px;">Hi <strong style="color: #333333;">{{CUSTOMER_NAME}}</strong>, we couldn't verify your documents. Please resubmit with the corrections noted below — it only takes a few minutes.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; height: 3px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- REJECTION REASON -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 0 32px;">
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 700; color: #757575; letter-spacing: 0.1em; text-transform: uppercase;">Reason for Rejection</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 2px solid #ffb3ad; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td bgcolor="#ff2c20" style="background-color: #ff2c20; width: 5px; font-size: 0; line-height: 0;">&nbsp;</td>
                      <td bgcolor="#fff0ee" style="background-color: #fff0ee; padding: 20px 22px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: top; width: 36px; padding-right: 12px;"><span style="display: inline-block; padding: 6px; background-color: #ff2c20; border-radius: 50%; font-size: 0; line-height: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></span></td>
                            <td style="vertical-align: top;">
                              <p style="margin: 0 0 6px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; font-weight: 700; color: #ff2c20; letter-spacing: 0.06em; text-transform: uppercase;">What went wrong</p>
                              <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 500; color: #333333; line-height: 22px;">{{REJECTION_REASON}}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr><td style="height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- WHAT TO DO NEXT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 32px 32px;">
                  <p style="margin: 0 0 20px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 16px; font-weight: 600; color: #141414; letter-spacing: -0.3px;">What To Do Next</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#fffaeb" style="background-color: #fffaeb; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #141414; line-height: 36px; border: 2px solid #ffcf46;">1</td></tr></table></td>
                      <td style="vertical-align: top; padding-top: 4px; padding-bottom: 8px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Fix the Issue Mentioned Above</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Read the rejection reason carefully and address the specific problem noted by our team.</p></td>
                    </tr>
                    <tr>
                      <td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#fffaeb" style="background-color: #fffaeb; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #141414; line-height: 36px; border: 2px solid #ffcf46;">2</td></tr></table></td>
                      <td style="vertical-align: top; padding-top: 4px; padding-bottom: 8px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Take a Clear Photo or Scan</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Ensure good lighting, all four corners visible, and no blurring. File must be under 5 MB (JPG, PNG, or PDF).</p></td>
                    </tr>
                    <tr>
                      <td style="vertical-align: top; width: 44px; padding-right: 16px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; width: 36px; height: 36px; border-radius: 50%; text-align: center; vertical-align: middle; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 700; color: #000000; line-height: 36px;">3</td></tr></table></td>
                      <td style="vertical-align: top; padding-top: 4px;"><p style="margin: 0 0 2px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #333333; line-height: 20px;">Resubmit Your Documents</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;">Click the button below to upload your corrected documents. Our team will re-review within 24–48 hours.</p></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RESUBMIT CTA -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 4px 32px 36px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td bgcolor="#ffcf46" style="background-color: #ffcf46; border-radius: 8px;" align="center"><a href="https://indianrenters.com/kyc/resubmit" style="display: inline-block; padding: 14px 40px; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 8px;">↻ Resubmit KYC Documents</a></td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- COMMON ISSUES -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 28px 32px 32px 32px;">
                  <p style="margin: 0 0 16px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 600; color: #141414; letter-spacing: -0.3px;">Common Issues &amp; How to Fix Them</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 12px; overflow: hidden;">
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 16px 20px; border-bottom: 1px solid #f0f0f0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: top; width: 36px; padding-right: 12px;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #fff0ee; border-radius: 6px; text-align: center; line-height: 24px; font-size: 13px;">📷</span></td>
                            <td style="vertical-align: top;"><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; line-height: 18px;">Blurry or out-of-focus image</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;"><strong style="color: #333333;">Fix:</strong> Hold the camera steady, use good lighting, and tap on the document to focus before capturing.</p></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#fafafa" style="background-color: #fafafa; padding: 16px 20px; border-bottom: 1px solid #f0f0f0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: top; width: 36px; padding-right: 12px;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #fff0ee; border-radius: 6px; text-align: center; line-height: 24px; font-size: 13px;">📆</span></td>
                            <td style="vertical-align: top;"><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; line-height: 18px;">Expired document</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;"><strong style="color: #333333;">Fix:</strong> Submit only valid, unexpired documents. Check the expiry date printed on your document before uploading.</p></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 16px 20px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="vertical-align: top; width: 36px; padding-right: 12px;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #fff0ee; border-radius: 6px; text-align: center; line-height: 24px; font-size: 13px;">👤</span></td>
                            <td style="vertical-align: top;"><p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 600; color: #333333; line-height: 18px;">Name mismatch between documents</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #757575; line-height: 18px;"><strong style="color: #333333;">Fix:</strong> Make sure the name on all submitted documents exactly matches the name on your account. Contact us if you have a legal name change.</p></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td bgcolor="#f6f6f6" style="background-color: #f6f6f6; height: 8px; font-size: 0; line-height: 0;">&nbsp;</td></tr>

        <!-- KYC SUPPORT -->
        <tr>
          <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 24px 32px 28px 32px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e2e2; border-radius: 12px; background-color: #f6f6f6;">
                    <tr>
                      <td align="center" style="padding: 22px 28px;">
                        <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #141414; text-align: center;">Still unsure what went wrong?</p>
                        <p style="margin: 0 0 16px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; text-align: center; line-height: 20px;">Our KYC support team is happy to guide you through the process.</p>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 0 14px; text-align: center; border-right: 1px solid #e0e0e0;"><a href="tel:9870533392" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Call KYC Support</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 15px; font-weight: 700; color: #141414;">9870533392</span></a></td>
                            <td style="padding: 0 14px; text-align: center;"><a href="mailto:kyc@indianrenters.com" style="text-decoration: none;"><span style="display: block; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; font-weight: 600; color: #757575; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">Email KYC Team</span><span style="font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #0075ff;">kyc@indianrenters.com</span></a></td>
                          </tr>
                        </table>
                        <p style="margin: 12px 0 0 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #aaaaaa; text-align: center;">Mon–Sat, 10 AM – 7:30 PM IST</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DARK HELP BAR -->
        <tr>
          <td bgcolor="#141414" style="background-color: #141414; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 24px 32px;">
                  <p style="margin: 0 0 4px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 14px; font-weight: 600; color: #ffffff; text-align: center;">Don't let this slow you down.</p>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; color: #757575; text-align: center; line-height: 20px;">Most rejections are fixed in minutes. Resubmit now and get approved within 24–48 hours.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#1a1a1a" style="background-color: #1a1a1a; border-top: 1px solid #2a2a2a; border-radius: 0 0 12px 12px; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 24px 32px 28px 32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="padding-bottom: 20px;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1780249784/white_indianrenters_nnqhiu.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; max-width: 140px; height: auto; border: 0;" /></a></td></tr></table>
                  <p style="margin: 0 0 14px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454; line-height: 18px; text-align: center;">Serving&nbsp;&nbsp;Delhi · Noida · Bangalore · Hyderabad · Mumbai · Pune · Chennai · Kolkata</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">90,000+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Orders</p></td>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">30,000+</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Customers</p></td>
                      <td align="center" style="text-align: center;" width="33%"><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 13px; font-weight: 700; color: #ffcf46;">4.9 ★</p><p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #545454;">Rating</p></td>
                    </tr>
                  </table>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;"><tr><td bgcolor="#2a2a2a" style="background-color: #2a2a2a; height: 1px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  <p style="margin: 0 0 10px 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 12px; color: #545454; text-align: center; line-height: 20px;"><a href="https://indianrenters.com/privacy-policy" style="color: #757575; text-decoration: underline;">Privacy Policy</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://indianrenters.com/terms" style="color: #757575; text-decoration: underline;">Terms of Service</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://indianrenters.com/unsubscribe" style="color: #757575; text-decoration: underline;">Unsubscribe</a></p>
                  <p style="margin: 0; font-family: 'Mona Sans Variable', sans-serif; font-size: 11px; color: #3a3a3a; text-align: center; line-height: 18px;">© 2025 IndianRenters.com — AAA Rental LLP<br/>You're receiving this because you submitted KYC documents on IndianRenters.com.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`,
  },
];
