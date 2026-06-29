import {
    UserPlus,
    ClipboardList,
    Palette,
    CreditCard,
    Truck,
  } from "lucide-react";
  
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description:
        "Register with JobQuant.",
    },
    {
      icon: ClipboardList,
      title: "View Orders",
      description:
        "Access orders assigned to your account.",
    },
    {
      icon: Palette,
      title: "Review Designs",
      description:
        "Review uploaded design versions and approve the final artwork.",
    },
    {
      icon: CreditCard,
      title: "Upload Payment",
      description:
        "Submit your payment confirmation securely through the portal.",
    },
    {
      icon: Truck,
      title: "Track to Delivery",
      description:
        "Monitor your order until it is completed and delivered.",
    },
  ];
  
  export default function HowItWorksSection() {
    return (
      <section
        id="how-it-works"
        className="bg-[#FAF8F4] py-24"
      >
        <div className="mx-auto max-w-7xl px-8">
  
          {/* Heading */}
  
          <div className="mx-auto max-w-3xl text-center">
  
            <span className="rounded-full bg-[#FFF2E8] px-4 py-2 text-sm font-semibold text-[#FF6B00]">
              HOW IT WORKS
            </span>
  
            <h2 className="mt-6 text-5xl font-bold text-[#0F172A]">
              Your Printing Journey
            </h2>
  
            <p className="mt-6 text-lg leading-8 text-[#64748B]">
              Follow every stage of your printing order through one
              simple and convenient portal.
            </p>
  
          </div>
  
          {/* Timeline */}
  
          <div className="relative mt-24">
  
            {/* Connecting Line */}
  
            <div className="absolute left-0 right-0 top-10 hidden h-1 bg-[#FFE4D1] xl:block" />
  
            <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-5">
  
              {steps.map((step) => {
                const Icon = step.icon;
  
                return (
                  <div
                    key={step.title}
                    className="relative text-center"
                  >
  
                    {/* Icon */}
  
                    <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#FAF8F4] bg-[#FFF2E8]">
  
                      <Icon
                        size={34}
                        className="text-[#FF6B00]"
                      />
  
                    </div>
  
                    {/* Title */}
  
                    <h3 className="mt-8 text-xl font-semibold text-[#0F172A]">
                      {step.title}
                    </h3>
  
                    {/* Description */}
  
                    <p className="mt-3 text-sm leading-7 text-[#64748B]">
                      {step.description}
                    </p>
  
                  </div>
                );
              })}
  
            </div>
  
          </div>
  
        </div>
      </section>
    );
  }