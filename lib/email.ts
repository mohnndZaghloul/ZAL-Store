import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: `"${process.env.GMAIL_FROM_NAME || "ZAL Store"}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);

    return {
      success: false,
    };
  }
}

export async function sendOrderConfirmationEmail({
    email,
    customerName,
    orderId,
    subtotal,
    shippingFee,
    discountAmount,
    address,
    city,
    phone,
    paymentMethod,
    amount,
  }: {
    email: string;
    customerName: string;
    orderId: string;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    address: string;
    city: string;
    phone: string;
    paymentMethod: string;
    amount: number;
  }) {
    return sendEmail({
      to: email,
      subject: "Your Order Has Been Confirmed! - ZAL Store",
      html: `
        <div style="
          margin: 0;
          padding: 40px 15px;
          background-color: #f5f5f5;
          font-family: Arial, Helvetica, sans-serif;
          color: #222;
        ">
  
          <div style="
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e5e5e5;
          ">
  
            <!-- Header -->
            <div style="
              padding: 28px 30px;
              background-color: #111111;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                letter-spacing: 1px;
              ">
                ZAL Store
              </h1>
            </div>
  
            <!-- Main Content -->
            <div style="padding: 35px 30px;">
  
              <h2 style="
                margin: 0 0 18px;
                font-size: 24px;
                color: #111111;
              ">
                Your order has been confirmed! 🎉
              </h2>
  
              <p style="
                margin: 0 0 18px;
                font-size: 16px;
                line-height: 1.7;
              ">
                Hi ${customerName},
              </p>
  
              <p style="
                margin: 0 0 25px;
                font-size: 15px;
                line-height: 1.7;
                color: #555555;
              ">
                Great choice! We're excited to get your order ready.
                Your order has been successfully placed and is now being processed.
              </p>
  
              <!-- Order Information -->
              <div style="
                background-color: #f7f7f7;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 25px;
              ">
  
                <p style="
                  margin: 0 0 10px;
                  font-size: 13px;
                  color: #777777;
                  letter-spacing: 0.5px;
                ">
                  ORDER NUMBER
                </p>
  
                <p style="
                  margin: 0 0 18px;
                  font-size: 18px;
                  font-weight: bold;
                  color: #111111;
                ">
                  #${orderId.slice(0, 8)}
                </p>
  
                <div style="
                  height: 1px;
                  background-color: #dddddd;
                  margin-bottom: 18px;
                "></div>
  
                <p style="
                  margin: 0 0 7px;
                  font-size: 13px;
                  color: #777777;
                ">
                  ORDER TOTAL
                </p>
  
                <p style="
                  margin: 0;
                  font-size: 22px;
                  font-weight: bold;
                  color: #111111;
                ">
                  EGP ${amount.toFixed(2)}
                </p>
  
              </div>
  
              <!-- Payment Summary -->
              <div style="
                margin-bottom: 28px;
              ">
  
                <h3 style="
                  margin: 0 0 15px;
                  font-size: 16px;
                  color: #111111;
                ">
                  Order Summary
                </h3>
  
                <table style="
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 14px;
                ">
                  <tr>
                    <td style="
                      padding: 7px 0;
                      color: #666666;
                    ">
                      Subtotal
                    </td>
  
                    <td style="
                      padding: 7px 0;
                      text-align: right;
                      color: #222222;
                    ">
                      EGP ${subtotal.toFixed(2)}
                    </td>
                  </tr>
  
                  <tr>
                    <td style="
                      padding: 7px 0;
                      color: #666666;
                    ">
                      Shipping
                    </td>
  
                    <td style="
                      padding: 7px 0;
                      text-align: right;
                      color: #222222;
                    ">
                      EGP ${shippingFee.toFixed(2)}
                    </td>
                  </tr>
  
                  ${
                    discountAmount > 0
                      ? `
                        <tr>
                          <td style="
                            padding: 7px 0;
                            color: #666666;
                          ">
                            Discount
                          </td>
  
                          <td style="
                            padding: 7px 0;
                            text-align: right;
                            color: #222222;
                          ">
                            -EGP ${discountAmount.toFixed(2)}
                          </td>
                        </tr>
                      `
                      : ""
                  }
  
                  <tr>
                    <td colspan="2" style="
                      padding-top: 12px;
                      border-top: 1px solid #dddddd;
                    "></td>
                  </tr>
  
                  <tr>
                    <td style="
                      padding: 5px 0;
                      font-weight: bold;
                      color: #111111;
                    ">
                      Total
                    </td>
  
                    <td style="
                      padding: 5px 0;
                      text-align: right;
                      font-size: 16px;
                      font-weight: bold;
                      color: #111111;
                    ">
                      EGP ${amount.toFixed(2)}
                    </td>
                  </tr>
                </table>
  
              </div>
  
              <!-- Delivery Information -->
              <div style="
                background-color: #fafafa;
                border: 1px solid #eeeeee;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 28px;
              ">
  
                <h3 style="
                  margin: 0 0 15px;
                  font-size: 16px;
                  color: #111111;
                ">
                  Delivery Information
                </h3>
  
                <p style="
                  margin: 0 0 8px;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #555555;
                ">
                  <strong style="color: #111111;">Name:</strong>
                  ${customerName}
                </p>
  
                <p style="
                  margin: 0 0 8px;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #555555;
                ">
                  <strong style="color: #111111;">Phone:</strong>
                  ${phone}
                </p>
  
                <p style="
                  margin: 0 0 8px;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #555555;
                ">
                  <strong style="color: #111111;">Address:</strong>
                  ${address}
                </p>
  
                <p style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #555555;
                ">
                  <strong style="color: #111111;">Governorate:</strong>
                  ${city}
                </p>
  
              </div>
  
              <!-- Payment Method -->
              <div style="
                margin-bottom: 28px;
              ">
  
                <p style="
                  margin: 0 0 6px;
                  font-size: 13px;
                  color: #777777;
                  letter-spacing: 0.4px;
                ">
                  PAYMENT METHOD
                </p>
  
                <p style="
                  margin: 0;
                  font-size: 15px;
                  font-weight: bold;
                  color: #111111;
                ">
                  ${paymentMethod === "CASH" ? "Cash on Delivery" : "InstaPay"}
                </p>
  
              </div>
  
              <!-- Status -->
              <div style="
                border-left: 4px solid #111111;
                padding: 5px 0 5px 15px;
                margin-bottom: 28px;
              ">
  
                <p style="
                  margin: 0 0 5px;
                  font-size: 15px;
                  font-weight: bold;
                  color: #111111;
                ">
                  What's next?
                </p>
  
                <p style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #666666;
                ">
                  We'll send you another email as soon as your order is shipped
                  and on its way to you.
                </p>
  
              </div>
  
              <!-- Button -->
              <div style="
                text-align: center;
                margin: 30px 0;
              ">
                <a
                  href="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/orders/${orderId}"
                  style="
                    display: inline-block;
                    padding: 14px 28px;
                    background-color: #111111;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                  "
                >
                  View Order Details
                </a>
              </div>
  
              <p style="
                margin: 0;
                font-size: 14px;
                line-height: 1.7;
                color: #777777;
              ">
                Thank you for shopping with ZAL Store 
              </p>
  
            </div>
  
            <!-- Footer -->
            <div style="
              padding: 22px 30px;
              background-color: #fafafa;
              border-top: 1px solid #eeeeee;
              text-align: center;
            ">
  
              <p style="
                margin: 0;
                font-size: 12px;
                color: #999999;
                line-height: 1.6;
              ">
                This is an automated email. Please do not reply to this message.
              </p>
  
              <p style="
                margin: 8px 0 0;
                font-size: 12px;
                color: #999999;
              ">
                © ZAL Store
              </p>
  
            </div>
  
          </div>
  
        </div>
      `,
    });
  }

export async function sendOrderShippedEmail({
  email,
  customerName,
  orderId,
}: {
  email: string;
  customerName: string;
  orderId: string;
}) {
  return sendEmail({
    to: email,
    subject: "Your Order Is On Its Way! 🚚 - ZAL Store",
    html: `
      <div style="
        margin: 0;
        padding: 40px 15px;
        background-color: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
        color: #222;
      ">

        <div style="
          max-width: 620px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e5e5;
        ">

          <!-- Header -->
          <div style="
            padding: 28px 30px;
            background-color: #111111;
            text-align: center;
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 28px;
              letter-spacing: 1px;
            ">
              ZAL Store
            </h1>
          </div>

          <!-- Main Content -->
          <div style="padding: 35px 30px;">

            <h2 style="
              margin: 0 0 18px;
              font-size: 24px;
              color: #111111;
            ">
              Your order is on its way! 🚚
            </h2>

            <p style="
              margin: 0 0 18px;
              font-size: 16px;
              line-height: 1.7;
            ">
              Hi ${customerName},
            </p>

            <p style="
              margin: 0 0 25px;
              font-size: 15px;
              line-height: 1.7;
              color: #555555;
            ">
              Great news! Your order has been shipped and is now
              on its way to you.
            </p>

            <!-- Order -->
            <div style="
              background-color: #f7f7f7;
              border-radius: 10px;
              padding: 20px;
              margin-bottom: 25px;
            ">

              <p style="
                margin: 0 0 10px;
                font-size: 14px;
                color: #777777;
              ">
                ORDER NUMBER
              </p>

              <p style="
                margin: 0;
                font-size: 18px;
                font-weight: bold;
                color: #111111;
              ">
                #${orderId.slice(0, 8)}
              </p>

            </div>

            <!-- Delivery Message -->
            <div style="
              border-left: 4px solid #111111;
              padding: 5px 0 5px 15px;
              margin-bottom: 28px;
            ">
              <p style="
                margin: 0 0 5px;
                font-size: 15px;
                font-weight: bold;
                color: #111111;
              ">
                Your order is currently on the way.
              </p>

              <p style="
                margin: 0;
                font-size: 14px;
                line-height: 1.6;
                color: #666666;
              ">
                Please keep your phone available so our delivery
                team can contact you when your order arrives.
              </p>
            </div>

            <!-- Button -->
            <div style="
              text-align: center;
              margin: 30px 0;
            ">
              <a
                href="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/orders/${orderId}"
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  background-color: #111111;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                  font-size: 14px;
                  font-weight: bold;
                "
              >
                Track Your Order
              </a>
            </div>

            <p style="
              margin: 0;
              font-size: 14px;
              line-height: 1.7;
              color: #777777;
            ">
              Thank you for shopping with ZAL Store 
            </p>

          </div>

          <!-- Footer -->
          <div style="
            padding: 22px 30px;
            background-color: #fafafa;
            border-top: 1px solid #eeeeee;
            text-align: center;
          ">
            <p style="
              margin: 0;
              font-size: 12px;
              color: #999999;
              line-height: 1.6;
            ">
              This is an automated email. Please do not reply to this message.
            </p>

            <p style="
              margin: 8px 0 0;
              font-size: 12px;
              color: #999999;
            ">
              © ZAL Store
            </p>
          </div>

        </div>

      </div>
    `,
  });
}

