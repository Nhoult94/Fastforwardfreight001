"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const defaultFormData = {
  containerType: "lcl",
  pickupName: "",
  originStreet: "",
  originCity: "",
  destinationStreet: "",
  destinationCity: "",
  destinationPostcode: "",
  destinationState: "",
  destinationCountry: "New Zealand",
  country: "New Zealand",
  volume: "1",
  weight: "500",
  date: new Date().toISOString().split("T")[0],
  selfDropToWarehouse: false,
  commodity: "",
  containerSize: "",
  declaredValue: ""
};

export default function MultiStepFreightForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);
  const [quote, setQuote] = useState<{ price: number; eta: number; carrier: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      const input = document.getElementById("autocomplete") as HTMLInputElement;
      if (input && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["geocode"],
          componentRestrictions: { country: ["nz", "au"] }
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const getComponent = (type: string) =>
            place.address_components?.find((c) => c.types.includes(type))?.long_name || "";

          setFormData((prev) => ({
            ...prev,
            destinationStreet: place.formatted_address || "",
            destinationCity: getComponent("locality"),
            destinationPostcode: getComponent("postal_code"),
            destinationState: getComponent("administrative_area_level_1"),
            destinationCountry: getComponent("country")
          }));
        });
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const calculateTotalCost = (freight: number): number => {
    const pickupCost = formData.selfDropToWarehouse ? 0 : 90;
    const handlingCost = 50;
    let deliveryCost = 0;

    const majorCities = ["Auckland", "Wellington", "Christchurch", "Sydney", "Melbourne", "Brisbane"];
    if (formData.destinationCountry === "New Zealand" || formData.destinationCountry === "Australia") {
      deliveryCost = majorCities.includes(formData.destinationCity) ? 130 : 180;
    }

    return freight + pickupCost + handlingCost + deliveryCost;
  };

  const getQuote = async () => {
    const response = await fetch("/api/get-freight-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    const total = calculateTotalCost(data.price);
    setQuote({ ...data, price: total });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 bg-[#65cbf4] rounded-xl shadow-xl">
      <Card className="shadow-lg bg-[#65cbf4]">
        <CardContent className="p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Step 1: What are you shipping?</h2>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  className={`flex-1 py-4 text-lg bg-[#65cbf4] text-white border transition hover:border-white ${formData.containerType === "lcl" ? 'ring-2 ring-white' : 'border-white'}`}
                  onClick={() => { setFormData({ ...formData, containerType: "lcl" }); setStep(2); }}
                >
                  Less than Container (LCL)
                </Button>
                <Button
                  variant="ghost"
                  className={`flex-1 py-4 text-lg bg-[#65cbf4] text-white border transition hover:border-white ${formData.containerType === "fcl" ? 'ring-2 ring-white' : 'border-white'}`}
                  onClick={() => { setFormData({ ...formData, containerType: "fcl" }); setStep(2); }}
                >
                  Full Container (FCL)
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Step 2: Pickup Location (China)</h2>
              <Input name="pickupName" placeholder="Pickup Company / Warehouse Name" value={formData.pickupName} onChange={handleChange} />
              <Input name="originStreet" placeholder="Street Address" value={formData.originStreet} onChange={handleChange} />
              <Input name="originCity" placeholder="City" value={formData.originCity} onChange={handleChange} />
              <Input value="China" disabled className="bg-gray-100 text-gray-600" />
              <div className="flex items-center gap-2">
                <input type="checkbox" name="selfDropToWarehouse" checked={formData.selfDropToWarehouse} onChange={handleChange} />
                <label htmlFor="selfDropToWarehouse" className="text-sm text-black">We will drop the goods to your warehouse</label>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" className="text-white border-white hover:border-white" onClick={() => setStep(1)}>Back</Button>
                <Button className="bg-[#65cbf4] text-white border border-white hover:border-white" onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Step 3: Delivery Location</h2>
              <input
                name="destinationStreet"
                placeholder="Start typing your delivery address..."
                value={formData.destinationStreet}
                onChange={handleChange}
                className="w-full p-2 border rounded text-sm"
                id="autocomplete"
                autoComplete="off"
              />
              <Input name="destinationCity" placeholder="City" value={formData.destinationCity} onChange={handleChange} />
              <Input name="destinationPostcode" placeholder="Postcode" value={formData.destinationPostcode} onChange={handleChange} />
              <Input name="destinationState" placeholder="State/Region" value={formData.destinationState} onChange={handleChange} />
              <Input name="destinationCountry" placeholder="Country" value={formData.destinationCountry} onChange={handleChange} />
              <div className="flex justify-between">
                <Button variant="outline" className="text-white border-white hover:border-white" onClick={() => setStep(2)}>Back</Button>
                <Button className="bg-[#65cbf4] text-white border border-white hover:border-white" onClick={() => setStep(4)}>Next</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-black">Step 4: Shipment Details</h2>
              {formData.containerType === "lcl" && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Volume (CBM)</label>
                  <Input name="volume" placeholder="e.g. 5" value={formData.volume} onChange={handleChange} />
                  <p className="text-sm text-white mt-1">Enter total volume of your shipment in cubic metres (CBM).</p>
                </div>
              )}
              {formData.containerType === "fcl" && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Container Size</label>
                  <select name="containerSize" value={formData.containerSize} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="">Select Container Size</option>
                    <option value="20GP">20ft General Purpose</option>
                    <option value="40GP">40ft General Purpose</option>
                    <option value="40HC">40ft High Cube</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Preferred Shipping Date</label>
                <Input name="date" type="date" value={formData.date} onChange={handleChange} />
                <p className="text-sm text-white mt-1">Preferred shipping date — when you&apos;d like your goods to leave China.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Commodity Description</label>
                <Input name="commodity" placeholder="e.g. Flat-pack furniture" value={formData.commodity} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Declared Value (USD)</label>
                <Input name="declaredValue" placeholder="e.g. 15000" value={formData.declaredValue} onChange={handleChange} />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" className="text-white border-white hover:border-white" onClick={() => setStep(3)}>Back</Button>
                <Button className="bg-[#65cbf4] text-white border border-white hover:border-white" onClick={getQuote}>Get Instant Quote</Button>
              </div>
            </div>
          )}

          {quote && (
            <div className="mt-8 p-6 border rounded bg-white text-left space-y-2">
              <h3 className="text-lg font-bold mb-2">Quote Summary</h3>
              <p><strong>Base Freight (port to port):</strong> ${quote.price - (formData.selfDropToWarehouse ? 0 : 90) - 50 - (["Auckland", "Wellington", "Christchurch", "Sydney", "Melbourne", "Brisbane"].includes(formData.destinationCity) ? 130 : 180)}</p>
              {!formData.selfDropToWarehouse && <p><strong>Pickup (China):</strong> $90</p>}
              <p><strong>Warehouse Handling:</strong> $50</p>
              {formData.destinationCity && (
                <p><strong>Final Delivery:</strong> {["Auckland", "Wellington", "Christchurch", "Sydney", "Melbourne", "Brisbane"].includes(formData.destinationCity) ? "$130" : "$180"}</p>
              )}
              <p className="mt-2 text-lg"><strong>Total Estimated Price:</strong> ${quote.price}</p>
              <p><strong>ETA:</strong> {quote.eta} days</p>
              <p><strong>Carrier:</strong> {quote.carrier}</p>
              <Button className="mt-4 bg-black text-white hover:bg-gray-900">Book This Shipment</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
