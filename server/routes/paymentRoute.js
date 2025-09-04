// server/routes/paymentRoute.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * POST /initialize
 * Body: { email: string, amount: number, metadata?: object }
 * - amount: in NAIRA (we convert to kobo inside)
 */
router.post("/initialize", async (req, res) => {
  try {
    const { email, amount, metadata = {} } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email and amount (in Naira).",
      });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "PAYSTACK_SECRET_KEY not configured on server.",
      });
    }

    // Convert Naira -> kobo
    const amountKobo = Math.round(Number(amount) * 100);

    const payload = {
      email,
      amount: amountKobo,
      metadata,
      // optional: callback_url: process.env.CLIENT_URL + '/payment/success'
    };

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Return Paystack response (authorization_url, access_code, reference, etc.)
    if (response.ok && data.status) {
      return res.status(200).json({
        success: true,
        message: "Payment initialized",
        data: data.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.message || "Failed to initialize transaction",
        data,
      });
    }
  } catch (error) {
    console.error("Initialize payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * GET /verify/:reference
 * Verifies a transaction reference with Paystack
 */
router.get("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ success: false, message: "Reference required" });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "PAYSTACK_SECRET_KEY not configured on server.",
      });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok && data.status) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: data.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data,
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
