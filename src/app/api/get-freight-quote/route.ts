import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const res = await fetch("https://sandbox.freightos.com/api/freightEstimates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": process.env.FREIGHTOS_API_KEY || ""
      },
      body: JSON.stringify({
        shipmentType: body.containerType === "fcl" ? "FCL" : "LCL",
        originLocation: {
          countryCode: "CN",
          cityName: body.originCity
        },
        destinationLocation: {
          countryCode: body.destinationCountry === "Australia" ? "AU" : "NZ",
          cityName: body.destinationCity
        },
        cargoReadyDate: body.date,
        containerType: body.containerSize || undefined,
        volume: body.containerType === "lcl" ? parseFloat(body.volume) : undefined,
        declaredValue: parseFloat(body.declaredValue),
        commodity: body.commodity
      })
    });

    const data = await res.json();

    // Log response for debugging:
    console.log("Freightos response:", data);

    return NextResponse.json({
      price: data.totalPrice || 1200,
      eta: data.estimatedTransitTime || 18,
      carrier: data.carrier || "Freight Estimator"
    });
  } catch (error) {
    console.error("Freightos error:", error);
    return NextResponse.json({ error: "Could not fetch quote." }, { status: 500 });
  }
}
