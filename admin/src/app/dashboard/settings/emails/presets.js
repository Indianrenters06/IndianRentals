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
            <img src="https://indianrenters.com/email-assets/logo.png" alt="IndianRenters.com" width="180" height="auto" style="display: block; width: 180px; max-width: 180px; height: auto; border: 0;" />
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
            <tr><td align="center" style="padding-bottom: 20px;"><a href="https://indianrenters.com" style="text-decoration: none;"><img src="https://indianrenters.com/email-assets/logo-white.png" alt="IndianRenters.com" width="140" height="auto" style="display: block; width: 140px; height: auto; border: 0;" /></a></td></tr>
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
];
