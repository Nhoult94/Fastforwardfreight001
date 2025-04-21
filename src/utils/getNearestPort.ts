// utils/getNearestPort.ts

export function getNearestChinaPort(address: string): string {
    const portMap = [
      { city: "shanghai", port: "Shanghai" },
      { city: "shenzhen", port: "Shenzhen" },
      { city: "ningbo", port: "Ningbo" },
      { city: "qingdao", port: "Qingdao" },
      { city: "guangzhou", port: "Guangzhou" },
      { city: "tianjin", port: "Tianjin" }
    ];
  
    const lowerAddress = address.toLowerCase();
    const match = portMap.find(p => lowerAddress.includes(p.city));
    return match ? match.port : "Shenzhen"; // fallback
  }
  
  export function getNearestNZPort(address: string, containerType: 'fcl' | 'lcl'): string {
    const lclPorts = ["Auckland", "Wellington", "Christchurch"];
    const fclPorts = ["Auckland", "Wellington", "Christchurch", "Napier", "Tauranga", "Sydney", "Melbourne", "Brisbane"];
  
    const ports = containerType === 'lcl' ? lclPorts : fclPorts;
    const lowerAddress = address.toLowerCase();
    const match = ports.find(p => lowerAddress.includes(p.toLowerCase()));
    return match || ports[0]; // fallback
  }
  